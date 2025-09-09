const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    dateOfEmploy: {
        type: Date,
    },
    salary: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    otherInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OtherInformation'
    },
    role: {
        type: String,
        enum: ['academic', 'non-academic']
    },
    enrol: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['rejected', 'fired', 'suspended', 'permanent', 'probation', 'pending'],
        default: 'pending'
    }
}, {
    timestamps: true,
});

const Staff = mongoose.model('Staff', staffSchema);
module.exports = Staff;