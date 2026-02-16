const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    cohortId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cohort',
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    centerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Center',
        required: true,
    },
    examTaken: [
        {
            section: {
                type: String,
                required: true,
            },
            minutes: {
                type: String,
                required: true,
            },
            questions: {
                type: String,
                required: true,
            },
            correctScore: {
                type: String,
                required: true,
            },
            totalScore: {
                type: String,
                required: true,
            },
            status: {
                type: String,
                required: true,
            }
        }
    ]
}, {
    timestamps: true,
});

const Result = mongoose.model('Result', resultSchema);
module.exports = Result;