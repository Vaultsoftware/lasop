// File: lasop-server/src/routes/blog/delBlog.js
const { getSocket } = require('../../../config/connection');
const User = require('../../../models/cross/user');
const Blog = require('../../../models/admin/blog');

const delBlog = async (req, res) => {
  const { blogId, userId } = req.param;
  if (!userId || !blogId) {
    return res.status(400).json({
      message: 'BlogId and userId are required'
    })
  }

  try {
    // Check if user exist
    const userExist = await User.findById(userId);
    if (!userExist) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const deleted = await Blog.findByIdAndDelete(blogId);
    if (!deleted) return res.status(404).json({ message: 'Not found' });

    const io = getSocket();
    if (io) {
      io.to('lasop_global_room').emit('blogDeleted', deleted);
      io.to(userId.toString()).emit('blogDeleted', deleted);
    }

    return res.json({ message: 'Blog deleted' });
  } catch (e) {
    return res.status(400).json({ message: 'Failed to delete', error: e.message });
  }
};

module.exports = delBlog;