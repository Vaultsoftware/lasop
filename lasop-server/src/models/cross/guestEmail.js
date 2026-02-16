// File: lasop-server/src/models/guestEmail.js
const mongoose = require('mongoose');

const GuestEmailSchema = new mongoose.Schema(
  {
    guestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest', required: true, index: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    type: { type: String, enum: ['sent', 'reply'], default: 'sent', index: true },

    // threading + dedupe
    messageId: { type: String, index: true, sparse: true },
    inReplyTo: { type: String },
    references: [{ type: String }],
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'GuestEmail', index: true },

    rawDate: { type: Date }, // original email date (for replies)
  },
  { timestamps: true }
);

module.exports = mongoose.model('GuestEmail', GuestEmailSchema);
