// File: lasop-server/src/routes/blog/updateBlog.js
const express = require('express');
const Blog = require('../../../models/admin/blog');
const { upload } = require('../../../config/multerBlog');
const { getSocket } = require('../../../config/connection');

const router = express.Router();

/**
 * Update a single blog:
 * - Fields (multipart or JSON):
 *   title, content
 * - Files (optional): images[]  (append new images)
 * - Query ?remove=<filename1,filename2> to remove existing ones by filename
 */
router.put('/blog/:id', upload.array('images[]'), async (req, res) => {
  try {
    const { id } = req.params;
    const remove = (req.query.remove ? String(req.query.remove).split(',') : []).filter(Boolean);

    const update = {};
    if (req.body.title) update.title = String(req.body.title).trim();
    if (req.body.content) update.content = String(req.body.content).trim();

    const addImages = (req.files || []).map((f) => ({
      url: `/uploads/blog/${f.filename}`,
      filename: f.filename,
      mimetype: f.mimetype,
      size: f.size,
    }));

    const doc = await Blog.findById(id);
    if (!doc) return res.status(404).json({ message: 'Not found' });

    if (remove.length) {
      doc.images = doc.images.filter((img) => !remove.includes(img.filename));
    }
    if (addImages.length) {
      doc.images.push(...addImages);
    }
    if (update.title != null) doc.title = update.title;
    if (update.content != null) doc.content = update.content;

    await doc.save();

    const io = getSocket();
    if (io) {
      io.to('lasop_global_room').emit('blogUpdated', doc);
    }
    
    res.json({ message: 'Updated', data: doc });
  } catch (e) {
    res.status(400).json({ error: e?.message || 'Failed to update blog' });
  }
});

module.exports = router;
