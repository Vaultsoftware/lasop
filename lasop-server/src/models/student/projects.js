const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    overview: {
        type: String,
        required: true
    },
    objectives: [
        {
            type: String,
            required: true
        }
    ],
    deliverables: [
        {
            type: String,
            required: true
        }
    ],
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
                default: 'not submitted',
                enum: ['graded', 'ungraded', 'current']
            }
        }
    ],
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

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;