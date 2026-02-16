// File: src/routes/guest/getGuest.js
const Guest = require('../../../models/cross/guest');

module.exports = async function getGuest(req, res) {
  try {
    const doc = await Guest.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (e) {
    res.status(400).json({ error: e?.message || 'Failed to fetch guest' });
  }
};
