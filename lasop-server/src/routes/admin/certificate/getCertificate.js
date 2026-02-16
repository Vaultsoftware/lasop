const Certificate = require('../../../models/admin/certificate');

const getCertificate = async (req, res) => {
  try {
    const certificateData = await Certificate.find().populate('studentId');
    res.status(200).json(certificateData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = getCertificate;
