
// lasop-server/models/verification.js
const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true
    },
    codeExpiration: {
        type: Date,
        required: true
    }
}, {
    timestamps: true,
});

const VerifyOtp = mongoose.model('Verify', verificationSchema);
module.exports = VerifyOtp;
