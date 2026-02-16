const mongoose = require('mongoose');

const cohortChatSchema = new mongoose.Schema({
    cohortId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'Cohort'
    },
    admins: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                refPath: 'admins.model',
            },
            model: {
                type: String,
                enum: ['User', 'Student', 'Staff'],
                required: true,
            },
        },
    ],
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'senderModel'
    },
    senderModel: {
        type: String,
        enum: ['User', 'Student', 'Staff'],
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'senderModel'
    },
    receiverModel: {
        type: String,
        enum: ['User', 'Student', 'Staff'],
        required: true
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'file'],
        required: true
    },
    message: {
        type: String,
        required: function () {
            return this.messageType === 'text' || this.messageType === 'image' || this.messageType === 'file';
        }
    },
    fileUrl: {
        type: String,
    },
    members: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                refPath: 'members.model',
            },
            model: {
                type: String,
                enum: ['User', 'Student', 'Staff'],
                required: true,
            },
            joinedAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    seenBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    members: {}
}, { timestamps: true })

const CohortChat = mongoose.model('CohortChat', cohortChatSchema);
module.exports = CohortChat;