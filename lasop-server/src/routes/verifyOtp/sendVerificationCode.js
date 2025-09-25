// ====================================================================
// 1) lasop-server/src/routes/verifyOtp/sendVerificationCode.js
// ====================================================================
require('dotenv').config();
const path = require('path');
const VerifyOtp = require('../../models/verification');
const nodemailer = require('nodemailer');

const assetPath = (file) => path.join(process.cwd(), 'public', file); // why: stable path

const genCode = () => String(Math.floor(100000 + Math.random() * 900000));
const bool = (v, d = false) => {
  const s = String(v ?? '').trim().toLowerCase();
  if (s === '1' || s === 'true') return true;
  if (s === '0' || s === 'false') return false;
  return d;
};

async function makeSmtpTransporter() {
  const host = (process.env.SMTP_HOST || '').trim();
  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASS || '').trim();
  if (!host || !user || !pass) throw new Error('SMTP not configured');
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = bool(process.env.SMTP_SECURE, port === 465);
  const tls = {};
  const sni = (process.env.SMTP_TLS_SERVERNAME || '').trim();
  if (sni) tls.servername = sni;
  if (process.env.SMTP_REJECT_UNAUTHORIZED != null) tls.rejectUnauthorized = bool(process.env.SMTP_REJECT_UNAUTHORIZED, true);
  const t = nodemailer.createTransport({ host, port, secure, auth: { user, pass }, tls });
  await t.verify();
  return t;
}

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
        <div style="margin-top:24px;height:1px;background:#eef1f6;"></div>
        <div style="padding:14px 0 2px 0;color:#6b7385;font-size:12px;text-align:center;">This is an automated message from LASOP. Please do not reply.</div>
      </td>
    </tr>
  </table>
  <div style="padding:16px 0 0 0;font-family:Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#8a93a5;font-size:11px;">© ${new Date().getFullYear()} LASOP — All rights reserved.</div>
</td></tr></table></body></html>`;
}
function otpHtml({ name, code, ttlMinutes }) {
  const body = `
    <h1 style="margin:0 0 8px 0;font-size:20px;line-height:28px;">Hi ${name || 'there'},</h1>
    ${P('Use the verification code below to continue.')}
    <div style="margin:12px 0 14px 0;padding:18px;border:1px dashed #cfd6e4;border-radius:12px;background:#fafbff;text-align:center;">
      <div style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:28px;letter-spacing:4px;font-weight:700;color:#0b1532;">${code}</div>
      <div style="margin-top:8px;color:#5b6477;font-size:12px;">Expires in ${ttlMinutes} minutes</div>
    </div>
    ${P('If you didn’t request this code, you can safely ignore this email.')}
    ${signatureHtml()}
  `;
  return wrapHtml({ title: 'Your verification code', tagRight: 'Verification', bodyHtml: body });
}

module.exports = async function sendVerificationCode(req, res) {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
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

    const transporter = await makeSmtpTransporter();
    const fromEmail = 'no-reply@lasop.net';
    const fromName = (process.env.FROM_NAME || 'LASOP').trim();

    await transporter.sendMail({
      from: `${fromName} <${fromEmail}>`,
      to: email,
      subject: 'Your LASOP verification code',
      text: `Hi ${name}, your code is ${code} (expires in ${ttlMinutes} minutes).`,
      html: otpHtml({ name, code, ttlMinutes }),
      headers: { 'Auto-Submitted': 'auto-generated', 'X-Auto-Response-Suppress': 'All', Precedence: 'bulk' },
      envelope: { from: fromEmail, to: email },
      attachments: [
        { filename: 'lasop.png', path: assetPath('lasop.png'), cid: 'logo@lasop' },
      ],
    });

    const payload = { message: 'Verification code sent', provider: 'custom-smtp', expiresInMinutes: ttlMinutes, data: { email } };
    if (process.env.EXPOSE_OTP_IN_DEV === '1') Object.assign(payload.data, { code, codeExpiration });
    return res.status(200).json(payload);
  } catch (err) {
    console.error('sendOtp error:', err);
    return res.status(500).json({ message: 'Failed to send OTP', detail: err?.message || String(err) });
  }
};
