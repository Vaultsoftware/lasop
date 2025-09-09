const mongoose  = require('mongoose');

const centerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});

const Center = mongoose.model('Center', centerSchema);
module.exports = Center;