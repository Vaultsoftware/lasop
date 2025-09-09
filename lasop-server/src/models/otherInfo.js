const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    fName: {
        type: String,
        required: true,
    },
    lName: {
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
    }
});

// Main schema
const otherInfoSchema = new mongoose.Schema({
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true,
    },
    kin: {
        type: personSchema,
        required: true,
    },
    guarantor1: {
        type: personSchema,
        required: true,
    },
    guarantor2: {
        type: personSchema,
        required: true,
    }
});

const OtherInfo = mongoose.model('OtherInfo', otherInfoSchema);

module.exports = OtherInfo;