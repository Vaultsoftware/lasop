// routes/certificate/delCert.gridfs.js
const { ObjectId } = require('mongodb');
const { getBucket } = require('../../config/gridfs');
const Certificate = require('../../models/certificate');

module.exports = async function delCert(req, res) {
  try {
    const { id } = req.params;
    const doc = await Certificate.findById(id);
    if (!doc) return res.status(404).json({ message: 'Certificate not found' });

    // parse GridFS id from stored URL ".../files/<id>"
    const m = String(doc.certificate || '').match(/\/files\/([a-f0-9]{24})/i);
    if (m) {
      try {
        await getBucket().delete(new ObjectId(m[1]));
      } catch (e) {
        console.warn('GridFS delete warning:', e?.message || e);
      }
    }

    await Certificate.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Certificate deleted' });
  } catch (e) {
    console.error('delCert error:', e);
    return res.status(500).json({ message: 'Failed to delete certificate', detail: e?.message });
  }
};
