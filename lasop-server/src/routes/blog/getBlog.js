// File: lasop-server/src/routes/blog/getBlog.js
const express = require('express');
const Blog = require('../../models/blog');

const router = express.Router();

// List all, newest first
router.get('/blog', async (_req, res) => {
  try {
    const items = await Blog.find().sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e?.message || 'Failed to fetch blogs' });
  }
});

module.exports = router;
