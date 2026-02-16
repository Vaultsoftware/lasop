const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    certTitle: {
        type: String,
        required: true
    },
    certificate: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
})

const Certificate = mongoose.model('Certificate', certificateSchema);
module.exports = Certificate;
