// routes/verifyOtp/verifyUserCode.js
require('dotenv').config();
const VerifyOtp = require('../../models/verification');

module.exports = async function verifyUserCode(req, res) {
  try {
    const email = String(req.body?.email ?? '').trim().toLowerCase();
    const code = String(req.body?.code ?? '').trim().replace(/\s+/g, '');

    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' });
    }

    const rec = await VerifyOtp.findOne({ email });
    if (!rec) {
      return res.status(400).json({ message: 'No OTP found for this email' });
    }

    const nowMs = Date.now();
    const expMs = new Date(rec.codeExpiration).getTime();
    if (!rec.codeExpiration || Number.isNaN(expMs) || nowMs > expMs) {
      await VerifyOtp.deleteOne({ _id: rec._id }); // consume expired
      const dev = process.env.EXPOSE_OTP_IN_DEV === '1'
        ? { reason: 'expired', now: new Date(nowMs), codeExpiration: rec.codeExpiration }
        : undefined;
      return res.status(400).json({ message: 'Code expired. Request a new one.', ...dev });
    }

    const expected = String(rec.code).trim();
    if (code !== expected) {
      const dev = process.env.EXPOSE_OTP_IN_DEV === '1'
        ? { reason: 'mismatch', expected, received: code }
        : undefined;
      return res.status(400).json({ message: 'Invalid code', ...dev });
    }

    await VerifyOtp.deleteOne({ _id: rec._id }); // success: consume

    return res.status(200).json({
      message: 'Email verified',
      verified: true,
      data: { email, code: expected, codeExpiration: rec.codeExpiration },
    });
  } catch (err) {
    console.error('verifyOtp error:', err);
    return res.status(500).json({ message: 'Failed to verify OTP', detail: err?.message });
  }
};
