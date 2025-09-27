// File: lasop-server/src/models/blog.js
const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },          // e.g. /uploads/blog/filename.jpg
    filename: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { _id: false }
);

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    images: { type: [ImageSchema], default: [] },
  },
  { timestamps: true } // createdAt, updatedAt auto
);

module.exports = mongoose.model('Blog', BlogSchema);
