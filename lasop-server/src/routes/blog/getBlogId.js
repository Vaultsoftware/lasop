// File: lasop-server/src/routes/blog/getBlogId.js
const express = require('express');
const Blog = require('../../models/blog');

const router = express.Router();

router.get('/blog/:id', async (req, res) => {
  try {
    const item = await Blog.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (e) {
    res.status(400).json({ error: e?.message || 'Failed to fetch blog' });
  }
});

module.exports = router;
