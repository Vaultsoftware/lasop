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
        enum: ['User', 'Student', 'Staff']
    },
    receiver: {
        type: Schema.Types.ObjectId,
        refPath: 'receiverModel',
        required: true
    },
    receiverModel: {
        type: String,
        required: true,
        enum: ['User', 'Student', 'Staff']
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'file'],
        required: true
    },
    message: {
        type: String,
        required: function () {
            return this.messageType === 'text';
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    seen: {
        type: Boolean,
        default: false
    },
    seenAt: {
        type: Date
    }
}, { timestamps: true });

const Message = mongoose.model('Chat', chatSchema);
module.exports = Message;