// ====================================================================
// 3) lasop-server/src/routes/certificate/postCert.gridfs.js
// ====================================================================
require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const { getBucket } = require('../../config/gridfs');
const Certificate = require('../../models/certificate');
const Student = require('../../models/student');
const nodemailer = require('nodemailer');

const assetPath = (file) => path.join(process.cwd(), 'public', file);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

function bool(val, def = false) {
  const s = String(val ?? '').trim().toLowerCase();
  if (s === '1' || s === 'true') return true;
  if (s === '0' || s === 'false') return false;
  return def;
}

function createSmtpTransporter() {
  const host = (process.env.SMTP_HOST || '').trim();
  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASS || '').trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = bool(process.env.SMTP_SECURE, port === 465);
  if (!host || !user || !pass) throw new Error('SMTP not configured');
  const tls = {};
  const tlsServername = (process.env.SMTP_TLS_SERVERNAME || '').trim();
  if (tlsServername) tls.servername = tlsServername;
  if (process.env.SMTP_REJECT_UNAUTHORIZED != null) tls.rejectUnauthorized = bool(process.env.SMTP_REJECT_UNAUTHORIZED, true);
  return nodemailer.createTransport({ host, port, secure, auth: { user, pass }, tls });
}

const transporter = createSmtpTransporter();

const P = (html) => `<p style="margin:0 0 12px 0;font-size:14px;line-height:22px;color:#3a4152;">${html}</p>`;
function signatureHtml() {
  return `
  <div style="margin-top:18px;padding:14px 16px;border:1px solid #eef1f6;border-radius:12px;background:#fcfdff;">
    <div style="font-weight:600;color:#0b1532;font-size:14px;margin-bottom:2px;">Faith Igboin</div>
    <div style="color:#5b6477;font-size:12px;">Admissions Office</div>
    <div style="color:#5b6477;font-size:12px;">Lagos School of Programming Limited</div>
    <div style="color:#5b6477;font-size:12px;">Ojodu-Berger, Lagos</div>
    <div style="color:#0b1532;font-size:12px;margin-top:6px;">+234 702 571 3326</div>
  </div>`;
}
function wrapHtml({ title, tagRight, bodyHtml }) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title></head>
<body style="margin:0;background:#f6f8fb;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fb;">
<tr><td align="center" style="padding:24px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#fff;border-radius:16px;border:1px solid #eef1f6;overflow:hidden;">
    <tr>
      <td style="background:#0b1532;color:#fff;padding:16px 20px;font-family:Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
        <table role="presentation" width="100%"><tr>
          <td><img src="cid:logo@lasop" alt="LASOP" height="28" style="display:block;"></td>
          <td align="right" style="font-size:12px;opacity:.9;">${tagRight}</td>
        </tr></table>
      </td>
    </tr>
    <tr>
      <td style="padding:24px;font-family:Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0b1532;">
        ${bodyHtml}
        <div style="margin:22px 0 0 0;">
          <a href="https://www.lasop.net/login" style="display:inline-block;background:#0b5fff;color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;font-size:14px;font-weight:600;">View your certificate</a>
        </div>
        <div style="margin:22px 0 0 0;height:1px;background:#eef1f6;"></div>
        ${signatureHtml()}
        <div style="padding-top:8px;color:#8a93a5;font-size:11px;text-align:center;">Automated message — please do not reply.</div>
      </td>
    </tr>
  </table>
  <div style="padding:16px 0 0 0;font-family:Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#8a93a5;font-size:11px;">© ${new Date().getFullYear()} LASOP — All rights reserved.</div>
</td></tr></table></body></html>`;
}

async function postCert(req, res) {
  try {
    const { studentId, certTitle } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No certificate file uploaded.' });
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: 'Invalid studentId.' });
    }

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: 'Student not found.' });

    const bucket = getBucket();
    const safeName = `${studentId}_${Date.now()}_${file.originalname}`.replace(/[^\w.-]/g, '_');

    const uploadStream = bucket.openUploadStream(safeName, {
      contentType: file.mimetype || 'application/octet-stream',
    });

    uploadStream.end(file.buffer);

    uploadStream.on('error', (e) => {
      console.error('GridFS upload error:', e);
      return res.status(500).json({ error: 'Failed to upload file', detail: e.message });
    });

    uploadStream.on('finish', async () => {
      const fileId = uploadStream.id;
      const base = process.env.API_PUBLIC_BASE_URL || '';
      const fileUrl = `${base}/files/${fileId.toString()}`;

      const certificateData = await Certificate.create({
        studentId,
        certTitle,
        certificate: fileUrl,
      });

      const fromEmail = 'no-reply@lasop.net';
      const fromName = (process.env.FROM_NAME || 'LASOP').trim();
      const from = `${fromName} <${fromEmail}>`;

      const html = wrapHtml({
        title: `Your ${certTitle} certificate — LASOP`,
        tagRight: 'Certificate',
        bodyHtml: [
          `<h1 style="margin:0 0 8px 0;font-size:20px;line-height:28px;">Congratulations!</h1>`,
          P(`You have successfully completed the <strong>${certTitle}</strong> course at LASOP. Your certificate is now available in your dashboard.`),
          P(`Log in to view or download your certificate. If you need assistance, visit <a href="https://www.lasop.net/contact" style="color:#0b5fff;text-decoration:none;">lasop.net/contact</a>.`),
        ].join(''),
      });

      const text = `Congratulations!

You have completed the ${certTitle} course at LASOP. Your certificate is now available in your dashboard.

Login: https://www.lasop.net/login
Contact: https://www.lasop.net/contact

— Faith Igboin, Admissions Office`;

      const mailOptions = {
        from,
        to: student.email,
        subject: `Your ${certTitle} certificate is ready — LASOP`,
        text,
        html,
        headers: { 'Auto-Submitted': 'auto-generated', 'X-Auto-Response-Suppress': 'All', Precedence: 'bulk' },
        envelope: { from: fromEmail, to: student.email },
        attachments: [
          { filename: 'lasop.png', path: assetPath('lasop.png'), cid: 'logo@lasop' },
        ],
      };

      transporter
        .sendMail(mailOptions)
        .catch((e) => console.warn('Email send failed (continuing):', e?.message || e));

      return res.status(201).json({
        message: 'Certificate created successfully',
        data: certificateData,
      });
    });
  } catch (err) {
    console.error('postCert fatal error:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}

module.exports = { upload, postCert };
