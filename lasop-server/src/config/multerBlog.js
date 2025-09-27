// File: lasop-server/src/config/multerBlog.js
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const uploadRoot = path.join(process.cwd(), 'public', 'uploads', 'blog');
fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, uploadRoot);
  },
  filename(_req, file, cb) {
    const ts = Date.now();
    const safe = file.originalname.replace(/\s+/g, '_');
    cb(null, `${ts}-${safe}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (/^image\//i.test(file.mimetype)) return cb(null, true);
  return cb(new Error('Only image uploads are allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

module.exports = { upload };
