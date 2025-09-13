// routes/files/streamFile.js
const { ObjectId } = require('mongodb');
const { getBucket } = require('../../config/gridfs');

module.exports = async function streamFile(req, res) {
  try {
    const id = req.params.id;
    const _id = new ObjectId(id);
    const bucket = getBucket();

    const download = bucket.openDownloadStream(_id);

    download.on('file', (f) => {
      res.set({
        'Content-Type': f?.contentType || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${f?.filename || 'file'}"`,
        'Cache-Control': 'private, max-age=0, must-revalidate',
      });
    });

    download.on('error', () => res.status(404).json({ message: 'File not found' }));
    download.pipe(res);
  } catch (e) {
    return res.status(400).json({ message: 'Invalid file id' });
  }
};
