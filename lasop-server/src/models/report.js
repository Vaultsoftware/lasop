const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    completedTask: [
        {
            type: String,
            required: true
        }
    ],
    notes: [
        {
            type: String,
            required: true
        }
    ]
}, {
    timestamps: true,
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;