// File: lasop-server/src/routes/blog/postBlog.js
const Blog = require('../../models/blog');

const postBlog = async (req, res) => {
  try {
    const { title, content, img, date, time } = req.body || {};
    if (!title || !content || !img || !date || !time) {
      return res.status(400).json({ message: 'title, content, img, date, time are required' });
    }
    const blog = await Blog.create({ title, content, img, date, time });
    return res.status(201).json({ message: 'Blog created', data: blog });
  } catch (e) {
    return res.status(400).json({ message: 'Failed to create blog', error: e.message });
  }
};

module.exports = postBlog;