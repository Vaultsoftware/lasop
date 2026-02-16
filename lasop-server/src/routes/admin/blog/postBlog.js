// File: lasop-server/src/routes/blog/postBlog.js
const { getSocket } = require('../../../config/connection');
const User = require('../../../models/cross/user');
const Blog = require('../../../models/admin/blog');

const postBlog = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({
      message: 'User id is required'
    })
  }

  try {
    // Check if userExist
    const userExist = await User.findById(userId);
    if (!userExist) {
      return res.status(404).json({ message: "Admin not found" });
    }
    
    const { title, content, img, date, time } = req.body || {};
    if (!title || !content || !img || !date || !time) {
      return res.status(400).json({ message: 'title, content, img, date, time are required' });
    }
    const blog = await Blog.create({ title, content, img, date, time });

    const io = getSocket();
    if (io) {
      io.to('lasop_global_room').emit('newBlog', blog);
      io.to(userId.toString()).emit('newBlog', blog);
    }

    return res.status(201).json({ message: 'Blog created', data: blog });
  } catch (e) {
    return res.status(400).json({ message: 'Failed to create blog', error: e.message });
  }
};

module.exports = postBlog;