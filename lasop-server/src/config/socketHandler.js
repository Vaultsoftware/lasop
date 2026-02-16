module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("a user connected:", socket.id);

        // -----------------------
        // Helpers
        // -----------------------
        const userRoom = (id) => id.toString();
        const cohortRoom = (id) => `cohort_${id}`;
        const groupRoom = (id) => `group_${id}`;
        const chatRoom = (id) => `chat_${id}`;

        socket.chatRooms = new Set();
        socket.groupRooms = new Set();

        // Join and leave Lasop room
        socket.on("join_lasop_room", (userId) => {
            if (!userId || socket.userId === userId) return;

            socket.userId = userId;

            socket.join(userId.toString());
            socket.join("lasop_global_room");

            socket.to("lasop_global_room").emit("user_joined", userId);

            console.log('User joined room:', userId.toString());
        })

        socket.on("leave_lasop_room", () => {
            if (!socket.userId) return;

            // ---- Leave cohort room
            if (socket.cohortId) {
                const room = cohortRoom(socket.cohortId);
                socket.leave(room);
                socket.to(room).emit("cohort_user_left", socket.userId);
                delete socket.cohortId;
            }
            // ---- Leave group room
            socket.groupRooms?.forEach((room) => {
                socket.leave(room);
                socket.to(room).emit("group_user_left", socket.userId);
            });
            socket.groupRooms?.clear();

            // ---- Leave all chat rooms
            for (const room of socket.chatRooms) {
                socket.leave(room);
                socket.to(room).emit("chat_user_left", socket.userId);
            }
            socket.chatRooms.clear();

            socket.to("lasop_global_room").emit("user_left", socket.userId);

            socket.leave(userRoom(socket.userId));
            socket.leave("lasop_global_room");

            delete socket.userId;
        });


        // -----------------------
        // Cohort Membership
        // -----------------------
        socket.on("join_cohort_room", (cohortId) => {
            if (!cohortId || !socket.userId || socket.cohortId === cohortId) return;

            // Leave all other cohort rooms first
            if (socket.cohortId) {
                const oldRoom = cohortRoom(socket.cohortId);
                socket.leave(oldRoom);
                socket.to(oldRoom).emit("cohort_user_left", socket.userId);
            }

            socket.cohortId = cohortId;

            const room = cohortRoom(cohortId);
            socket.join(room);
            socket.to(room).emit("cohort_user_joined", socket.userId);

            console.log('User joined cohort room:', `cohort_${cohortId.toString()}`);
        })

        socket.on("leave_cohort_room", () => {
            if (!socket.userId || !socket.cohortId) return;

            const room = `cohort_${socket.cohortId}`;

            socket.leave(room);
            socket.to(room).emit("cohort_user_left", socket.userId);

            delete socket.cohortId;
        });

        // -----------------------
        // Group Membership
        // -----------------------
        socket.on("join_group_room", (groupId) => {
            if (!groupId || !socket.userId) return;

            const room = `group_${groupId}`;

            if (socket.groupRooms.has(room)) return;

            socket.join(room);
            socket.groupRooms.add(room);

            socket.to(room).emit("group_user_joined", {
                userId: socket.userId,
                groupId,
            });

            console.log("User joined group room:", room);
        });

        socket.on("leave_group_room", (groupId) => {
            if (!groupId || !socket.userId) return;

            const room = `group_${groupId}`;

            if (!socket.groupRooms.has(room)) return;

            socket.leave(room);
            socket.groupRooms.delete(room);

            socket.to(room).emit("group_user_left", {
                userId: socket.userId,
                groupId,
            });

            console.log("User left group room:", room);
        });

        // -----------------------
        // Chat room
        // -----------------------
        socket.on("join_chat_room", (chatId) => {
            if (!chatId || !socket.userId) return;

            const room = `chat_${chatId.toString()}`;

            // Prevent duplicate joins
            if (socket.rooms.has(room)) return;

            socket.join(room);
            socket.chatRooms.add(room);

            // Notify others only
            socket.to(room).emit("chat_user_joined", {
                userId: socket.userId,
                chatId,
            });

            console.log("User joined chat room:", room);
        });

        socket.on("leave_chat_room", (chatId) => {
            if (!socket.userId || !chatId) return;

            // Ensure chatRooms exists
            socket.chatRooms = socket.chatRooms || new Set();

            const room = `chat_${chatId.toString()}`;

            // Idempotent: do nothing if not joined
            if (!socket.chatRooms.has(room)) return;

            socket.leave(room);
            socket.chatRooms.delete(room);

            // Notify others in the room
            socket.to(room).emit("chat_user_left", {
                userId: socket.userId,
                chatId,
            });

            console.log("User left chat room:", room);
        });

        // -----------------------
        // TYPING EVENTS
        // -----------------------
        socket.on("typing", ({ room }) => {
            if (!room || !socket.userId) return;

            if (!socket.rooms.has(room)) return;

            socket.to(room).emit("user_typing", {
                userId: socket.userId,
            });
        });

        socket.on("not_typing", ({ room }) => {
            if (!room || !socket.userId) return;

            if (!socket.rooms.has(room)) return;

            socket.to(room).emit("user_not_typing", {
                userId: socket.userId,
            });
        });

        // -----------------------
        // DISCONNECT CLEANUP
        // -----------------------
        socket.on("disconnect", () => {
            console.log("Disconnected:", socket.id);

            if (!socket.userId) return;

            // ---- Cohort cleanup
            if (socket.cohortId) {
                const room = cohortRoom(socket.cohortId);
                socket.to(room).emit("cohort_user_left", socket.userId);
            }

            // ---- Group cleanup
            socket.groupRooms?.forEach((room) => {
                socket.leave(room);
                socket.to(room).emit("group_user_left", socket.userId);
            });
            socket.groupRooms?.clear();

            // ---- Chat cleanup
            socket.chatRooms?.forEach((room) => socket.leave(room));
            socket.chatRooms?.clear();

            // ---- LASOP cleanup
            io.to("lasop_global_room").emit(
                "user_disconnected",
                socket.userId
            );
        });
    })
}