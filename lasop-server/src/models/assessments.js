const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    submission: [
        {
            studentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Student',
                required: true
            },
            submitted: {
                type: Boolean,
                default: false
            },
            submissionDate: {
                type: Date
            },
            grade: {
                type: Number,
                min: 0,
                max: 100
            },
            answer: {
                type: String,
                required: true
            },
            feedback: {
                type: String
            },
            status: {
                type: String,
                default: 'ungraded',
                enum: ['graded', 'ungraded', 'current']
            }
        }
    ],
    instruction: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
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
    center: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Center',
        required: true,
    },
    mode: {
        type: String,
        required: true
    },
    tutorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true,
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive']
    }
}, {
    timestamps: true,
});

const Assessment = mongoose.model('Assessment', assessmentSchema);
module.exports = Assessment;