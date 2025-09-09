const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

const courseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    exams: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Exam'
        }
    ]
}, {timestamps: true});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;