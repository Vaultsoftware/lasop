const mongoose = require('mongoose')

const classroomSchema = new mongoose.Schema({
    title: {
        type: String,
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
    tutorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true,
    },
    mode: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    zoomLink: {
        type: String,
        required: true
    },
    startClass: {
        type: Boolean,
        default: false
    },
    attendance: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
        }
    ],
    duration: {
        type: String,
    },
    status: {
        type: String,
        default: 'next',
        enum: ['next', 'completed', 'missed', 'rescheduled', 'cancelled']
    }
}, {
    timestamps: true,
});

const Classroom = mongoose.model('Classroom', classroomSchema);
module.exports = Classroom;