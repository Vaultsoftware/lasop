const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    proPic: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile