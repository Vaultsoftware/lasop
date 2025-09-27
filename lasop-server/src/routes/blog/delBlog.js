// File: lasop-server/src/routes/blog/delBlog.js
const Blog = require('../../models/blog');

const delBlog = async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    return res.json({ message: 'Blog deleted' });
  } catch (e) {
    return res.status(400).json({ message: 'Failed to delete', error: e.message });
  }
};

module.exports = delBlog;