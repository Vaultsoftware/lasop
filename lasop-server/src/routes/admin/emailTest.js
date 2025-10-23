// lasop-server/src/routes/admin/emailTest.js
const express = require('express');
const { sendMail } = require('../../utils/mailer');
const router = express.Router();

router.post('/admin/email-test', async (req, res) => {
  try {
    const to = String(req.body?.to || '').trim();
    if (!to) return res.status(400).json({ message: 'to required' });

    const FROM =
      (process.env.FROM_EMAIL && String(process.env.FROM_EMAIL).trim()) ||
      (process.env.SMTP_USER && String(process.env.SMTP_USER).trim());

    const r = await sendMail({
      from: `"${process.env.FROM_NAME || 'LASOP'}" <${FROM}>`,
      to,
      subject: 'Test from LASOP',
      text: 'Plain text body',
      html: '<p>HTML body</p>',
    });
    res.json({ ok: true, smtp: r });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
});

module.exports = router;
