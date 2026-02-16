const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    examUrl: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: false
    },
    duration: {
        type: String,
        required: true
    },
    countDown: {
        type: String,
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    }
}, { timestamps: true });

const Exam = mongoose.model('Exam', examSchema);
module.exports = Exam