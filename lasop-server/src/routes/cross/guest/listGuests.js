// File: src/routes/guest/listGuests.js
const Guest = require('../../../models/cross/guest');

/**
 * GET /admin/guests?q=&page=&limit=
 * q: numeric -> SR exact; otherwise name prefix (case-insensitive)
 */
module.exports = async function listGuests(req, res) {
  try {
    const q = String(req.query.q || '').trim();
    const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || '50'), 10)));
    const skip = (page - 1) * limit;

    const filter = {};
    if (q) {
      const digits = q.replace(/\D/g, '');
      if (digits && /^\d+$/.test(digits)) {
        filter.sr = Number(digits);
      } else {
        filter.name = { $regex: '^' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
      }
    }

    const [items, total] = await Promise.all([
      Guest.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Guest.countDocuments(filter),
    ]);

    res.json({ page, limit, total, data: items });
  } catch (e) {
    res.status(500).json({ error: e?.message || 'Failed to fetch guests' });
  }
};
