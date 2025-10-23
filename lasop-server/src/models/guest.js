// File: src/models/guest.js
const mongoose = require('mongoose');

const GuestSchema = new mongoose.Schema(
  {
    sr: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, index: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    location: { type: String, trim: true },
    reason: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Guest', GuestSchema);
