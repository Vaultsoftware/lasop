const mongoose = require('mongoose');

const cohortExamSchema = new mongoose.Schema({
    cohortId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cohort',
        required: true
    },
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    activatedAt: {
        type: Date,
        required: true
    }
}, { timestamps: true })

const CohortExam = mongoose.model('CohortExam', cohortExamSchema);
module.exports = CohortExam;