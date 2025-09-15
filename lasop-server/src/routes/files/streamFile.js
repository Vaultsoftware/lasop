// lasop-server/routes/files/streamFile.js
const { ObjectId } = require('mongodb');
const { getBucket } = require('../../config/gridfs');

function escapeFilename(name = 'file') {
  // Minimal cleanup for header safety
  return String(name).replace(/[^\w.\- ]+/g, '_').trim() || 'file';
}

module.exports = async function streamFile(req, res) {
  try {
    const id = String(req.params.id || '').trim();
    if (!id || !/^[a-f0-9]{24}$/i.test(id)) {
      return res.status(400).json({ message: 'Invalid file id' });
    }

    const _id = new ObjectId(id);
    const bucket = getBucket();

    // Find file metadata
    const files = await bucket.find({ _id }).toArray();
    if (!files || !files[0]) {
      return res.status(404).json({ message: 'File not found' });
    }
    const file = files[0];

    // Basic headers
    const filename = escapeFilename(file.filename || `certificate-${id}.pdf`);
    const contentType = file.contentType || 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', file.length);
    // Force download; you can switch to inline if you prefer preview
    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`
    );

    // Let browsers read this header over CORS
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    // Optional caching (adjust to your needs)
    res.setHeader('Cache-Control', 'private, max-age=31536000, immutable');

    const readStream = bucket.openDownloadStream(_id);
    readStream.on('error', (err) => {
      console.error('GridFS stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Stream error', detail: err?.message });
      } else {
        res.end();
      }
    });
    readStream.pipe(res);
  } catch (e) {
    console.error('streamFile error:', e);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Failed to stream file', detail: e?.message });
    } else {
      res.end();
    }
  }
};
