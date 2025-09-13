// config/gridfs.js
const mongoose = require('mongoose');

let bucket;
function getBucket() {
  if (bucket) return bucket;
  const conn = mongoose.connection;
  if (conn.readyState !== 1) {
    throw new Error('MongoDB is not connected yet');
  }
  bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'uploads' });
  return bucket;
}

module.exports = { getBucket };
