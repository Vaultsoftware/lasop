const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatRoomSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        refPath: 'senderModel',
        required: true
    },
    chats: {
        type: Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    }
}, { timestamps: true });

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);
module.exports = ChatRoom;