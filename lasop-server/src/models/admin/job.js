const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    jobTitle: {
        type: String,
        required: true,
    },
    salary: {
        type: String,
        required: true,
    },
    jobType: {
        type: String,
        required: true,
    },
    requirements: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    jobDescription: {
        type: String,
        required: true,
    }
}, { timestamps: true })

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;