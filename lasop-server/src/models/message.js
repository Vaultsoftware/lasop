const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        refPath: 'senderModel',
        required: true
    },
    senderModel: {
        type: String,
        required: true,
        enum: ['Student', 'Staff']
    },
    reciever: {
        type: Schema.Types.ObjectId,
        refPath: 'recieverModel',
        required: true
    },
    recieverModel: {
        type: String,
        required: true,
        enum: ['Student', 'Staff']
    },
    message: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Message = mongoose.model('Chat', chatSchema);
module.exports = Message;