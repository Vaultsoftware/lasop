// File: lasop-server/src/routes/blog/postBlogBatch.js
const express = require('express');
const Blog = require('../../../models/admin/blog');
const { upload } = require('../../../config/multerBlog');
const { getSocket } = require('../../../config/connection');

const router = express.Router();

/**
 * Multipart spec:
 * - Field: posts  => JSON string of array: [{ title, content }, ...]
 * - Files grouped by index: images[0], images[1], ... (each can be multi)
 */
router.post('/blog/batch', upload.any(), async (req, res) => {
  try {
    const raw = req.body.posts;
    const posts = Array.isArray(raw) ? raw : JSON.parse(raw || '[]');
    if (!Array.isArray(posts) || posts.length === 0) {
      return res.status(400).json({ message: 'No posts payload' });
    }

    // Group files by fieldname images[<i>]
    const filesByIndex = {};
    (req.files || []).forEach((f) => {
      const m = String(f.fieldname).match(/^images\[(\d+)\]$/);
      if (!m) return;
      const idx = Number(m[1]);
      filesByIndex[idx] ||= [];
      filesByIndex[idx].push(f);
    });

    const docs = [];
    for (let i = 0; i < posts.length; i++) {
      const p = posts[i] || {};
      const images = (filesByIndex[i] || []).map((f) => ({
        url: `/uploads/blog/${f.filename}`,
        filename: f.filename,
        mimetype: f.mimetype,
        size: f.size,
      }));
      if (!p.title || !p.content) continue;
      docs.push({ title: String(p.title).trim(), content: String(p.content).trim(), images });
    }

    if (!docs.length) return res.status(400).json({ message: 'Nothing to save' });

    const saved = await Blog.insertMany(docs);

    const io = getSocket();
    if (io) {
      io.to('lasop_global_room').emit('newBlogs', saved);
    }
    
    return res.status(201).json({ message: 'Created', data: saved });
  } catch (err) {
    return res.status(400).json({ error: err?.message || 'Failed to create blogs' });
  }
});

module.exports = router;
