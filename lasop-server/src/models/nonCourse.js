const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nonCourseSchema = new Schema({
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
    }
}, {timestamps: true});

const NonCourse = mongoose.model('NonCourse', nonCourseSchema)
module.exports = NonCourse;