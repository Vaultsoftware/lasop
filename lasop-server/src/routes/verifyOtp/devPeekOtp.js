// routes/verifyOtp/devPeekOtp.js
require('dotenv').config();
const VerifyOtp = require('../../models/verification');

module.exports = async function devPeekOtp(req, res) {
  try {
    if (process.env.EXPOSE_OTP_IN_DEV !== '1') {
      return res.status(404).json({ message: 'Not found' });
    }
    const email = String(req.query.email || '').trim().toLowerCase();
    if (!email) return res.status(400).json({ message: 'email query is required' });

    const rec = await VerifyOtp.findOne({ email });
    if (!rec) return res.status(404).json({ message: 'No OTP found for this email' });

    return res.status(200).json({
      email,
      code: rec.code,
      codeExpiration: rec.codeExpiration,
      now: new Date().toISOString(),
    });
  } catch (e) {
    console.error('devPeekOtp error:', e);
    return res.status(500).json({ message: 'dev peek failed', detail: e?.message });
  }
};
