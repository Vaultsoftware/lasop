// src/config/gridfs.js
const mongoose = require('mongoose');

let bucket;

/**
 * Returns a singleton GridFSBucket after Mongo connects.
 * Throws a clear error if MongoDB isn't connected yet.
 */
function getBucket() {
  if (bucket) return bucket;

  const conn = mongoose.connection;
  if (conn.readyState !== 1) {
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    throw new Error('MongoDB is not connected yet');
  }

  bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'uploads' });
  return bucket;
}

module.exports = { getBucket };
