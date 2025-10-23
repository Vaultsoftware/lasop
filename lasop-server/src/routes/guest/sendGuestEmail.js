// File: lasop-server/src/routes/guest/sendGuestEmail.js
const express = require('express');
const mongoose = require('mongoose');
const { sendMail } = require('../../utils/mailer');
const Guest = require('../../models/guest');
const GuestEmail = require('../../models/guestEmail');

const router = express.Router();

/**
 * POST /admin/guests/:id/emails
 * Body: { subject, body }
 * Sends a *human* email (not automated) and stores history.
 */
router.post('/admin/guests/:id/emails', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid guest id' });
    }

    const guest = await Guest.findById(id).lean();
    if (!guest) return res.status(404).json({ message: 'Guest not found' });

    const subject = String(req.body?.subject || '').trim();
    const body = String(req.body?.body || '').trim();
    if (!subject || !body) return res.status(400).json({ message: 'subject and body are required' });

    const FROM =
      (process.env.FROM_EMAIL && String(process.env.FROM_EMAIL).trim()) ||
      (process.env.SMTP_USER && String(process.env.SMTP_USER).trim()) ||
      'no-reply@lasop.net';

    const REPLY_TO =
      (process.env.REPLY_TO_EMAIL && String(process.env.REPLY_TO_EMAIL).trim()) ||
      FROM;

    const toEmail = String(guest.email || '').trim();
    if (!toEmail) return res.status(400).json({ message: 'Guest has no email' });

    const html = `<p style="font-family:Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:22px;margin:0 0 12px 0;color:#111;">${body.replace(/\n/g, '<br>')}</p>`;

    let resInfo;
    try {
      resInfo = await sendMail({
        from: `${process.env.FROM_NAME || 'LASOP'} <${FROM}>`,
        to: toEmail,
        subject,
        text: body,
        html,
        headers: { 'X-Lasop-Source': 'guest-email' },
        replyTo: REPLY_TO,
      });

      // Treat server-side recipient refusal as an error
      if (Array.isArray(resInfo.rejected) && resInfo.rejected.length > 0) {
        return res.status(502).json({ message: `SMTP rejected: ${resInfo.rejected.join(', ')}` });
      }
      console.log('[GUEST EMAIL SMTP ACCEPTED]', resInfo.accepted || []);
    } catch (err) {
      console.error('[GUEST EMAIL SMTP ERROR]', err?.message || err);
      return res.status(502).json({ message: err?.message || 'SMTP send failed' });
    }

    // Save full history with Message-ID for threading
    let saved = null;
    try {
      saved = await GuestEmail.create({
        guestId: id,
        from: FROM,
        to: toEmail,
        subject,
        body,
        type: 'sent',
        messageId: resInfo.messageId || undefined,
      });
    } catch (err) {
      console.warn('[GUEST EMAIL HISTORY SAVE WARNING]', err?.message || err);
    }

    return res.status(201).json({ message: 'Email sent', data: saved || {
      _id: 'virtual',
      guestId: id, from: FROM, to: toEmail, subject, body, type: 'sent',
      createdAt: new Date().toISOString(),
    } });
  } catch (e) {
    console.error('[GUEST EMAIL 500]', e?.message || e);
    return res.status(500).json({ message: e?.message || 'Failed to send email' });
  }
});

module.exports = router;
