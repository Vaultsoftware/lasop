const GroupChat = require("../../../models/cross/groupChat");
const User = require("../../../models/cross/user");
const Staff = require("../../../models/staff/staff");
const Student = require("../../../models/student/student");
const { getSocket } = require("../../../config/connection");

const MODEL_MAP = {
    User,
    Staff,
    Student,
};

const postGroupMessage = async (req, res) => {
    const { groupId, messageType, message, fileUrl } = req.body;
    const { userId: sender, role: senderModel } = req.user;

    if (!groupId || !messageType) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const SenderModel = MODEL_MAP[senderModel];

        if (!SenderModel) {
            return res.status(400).json({ message: "Invalid sender model" });
        }

        const senderExists = await SenderModel.findById(sender);

        if (!senderExists) {
            return res.status(404).json({ message: "Account not found" });
        }

        const newMessage = await GroupChat.create({
            groupId,
            sender,
            senderModel,
            messageType,
            message,
            fileUrl,
            seenBy: [sender],
        });

        const io = getSocket();
        if(io) {
            io.to(groupId.toString()).emit('new_group_msg', newMessage)
        }

        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = postGroupMessage;
