// File: src/routes/guest/createGuest.js
const { getSocket } = require('../../../config/connection');
const Counter = require('../../../models/cross/counter');
const Guest = require('../../../models/cross/guest');

module.exports = async function createGuest(req, res) {
  try {
    const { name, phone, email, location, reason } = req.body || {};
    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: 'name is required' });
    }

    const nextSr = await Counter.next('guest_sr');
    const doc = await Guest.create({
      sr: nextSr,
      name: String(name).trim(),
      phone: phone ? String(phone).trim() : undefined,
      email: email ? String(email).trim().toLowerCase() : undefined,
      location: location ? String(location).trim() : undefined,
      reason: reason ? String(reason).trim() : undefined,
    });

    const io = getSocket();
    if (io) {
      io.to('lasop_global_room').emit('newGuest', doc);
    }

    res.status(201).json({ message: 'Created', data: doc });
  } catch (e) {
    res.status(400).json({ message: 'Failed to create guest', error: e?.message || 'error' });
  }
};
