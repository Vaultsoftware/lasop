// routes/verifyOtp/sendVerificationCode.js
require('dotenv').config();
const VerifyOtp = require('../../models/verification');
const nodemailer = require('nodemailer');

function genCode() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6-digit
}

async function makeGmailTransporter() {
  const user = process.env.EMAIL_RECIEVE;
  const pass = process.env.EMAIL_PWD;
  if (!user || !pass) throw new Error('EMAIL_RECIEVE or EMAIL_PWD missing in env');
  const t = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
  await t.verify(); // throws if wrong creds or blocked
  return t;
}

module.exports = async function sendVerificationCode(req, res) {
  try {
    const rawEmail = req.body?.email ?? '';
    const email = String(rawEmail).trim().toLowerCase();
    const name = req.body?.name || 'there';
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const code = genCode();
    const ttlMinutes = parseInt(process.env.OTP_EXP_MINUTES || '10', 10);
    const codeExpiration = new Date(Date.now() + ttlMinutes * 60 * 1000);

    await VerifyOtp.findOneAndUpdate(
      { email },
      { code, codeExpiration },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const transporter = await makeGmailTransporter();
    const info = await transporter.sendMail({
      from: `LASOP <${process.env.EMAIL_RECIEVE || 'no-reply@example.com'}>`,
      to: email,
      subject: 'Your verification code',
      text: `Hi ${name},

Your verification code is: ${code}

This code expires in ${ttlMinutes} minutes.

If you didn’t request this, you can ignore this email.

— LASOP`,
    });

    const payload = {
      message: 'Verification code sent',
      smtp: info.response || '',
      expiresInMinutes: ttlMinutes,
      // 👇 ALWAYS return at least the email so the client can keep it
      data: { email },
    };

    // In dev, also surface the code for convenience
    if (process.env.EXPOSE_OTP_IN_DEV === '1') {
      payload.data.code = code;
      payload.data.codeExpiration = codeExpiration;
    }

    return res.status(200).json(payload);
  } catch (err) {
    console.error('sendOtp error:', err);
    return res.status(500).json({ message: 'Failed to send OTP', detail: err?.message || String(err) });
  }
};
