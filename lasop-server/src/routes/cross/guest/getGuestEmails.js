// File: lasop-server/src/routes/guest/getGuestEmails.js
const GuestEmail = require('../../../models/cross/guestEmail');

module.exports = async function getGuestEmails(req, res) {
  try {
    const { id } = req.params;

    // Fetch all history (sent + replies), newest first
    const items = await GuestEmail
      .find({ guestId: id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ data: items });
  } catch (e) {
    res.status(400).json({ error: e?.message || 'Failed to fetch emails' });
  }
};
