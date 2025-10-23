// File: lasop-server/src/utils/mailer.js
require('dotenv').config();
const nodemailer = require('nodemailer');

const mk = (host, port, secure, auth, tls) =>
  nodemailer.createTransport({
    host, port, secure, auth, tls,
    pool: true,
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });

async function pickTransport() {
  if (process.env.EMAIL_DRY_RUN === '1') {
    console.log('[MAILER] DRY-RUN ON (emails are NOT sent)');
    return nodemailer.createTransport({ jsonTransport: true });
  }

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    throw new Error('SMTP not configured (need SMTP_HOST, SMTP_USER, SMTP_PASS)');
  }

  const tls = {};
  if (process.env.SMTP_TLS_SERVERNAME) tls.servername = process.env.SMTP_TLS_SERVERNAME;
  if (process.env.SMTP_REJECT_UNAUTHORIZED != null) {
    tls.rejectUnauthorized = String(process.env.SMTP_REJECT_UNAUTHORIZED) !== 'false';
  }

  const attempts = [
    // 1) env as-is
    {
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
      auth: { user, pass },
      tls,
      label: 'ENV',
    },
    // 2) SSL:465
    { host, port: 465, secure: true, auth: { user, pass }, tls, label: 'SSL:465' },
    // 3) STARTTLS:587
    { host, port: 587, secure: false, auth: { user, pass }, tls, label: 'STARTTLS:587' },
  ];

  let lastErr;
  for (const a of attempts) {
    try {
      const t = mk(a.host, a.port, a.secure, a.auth, a.tls);
      await t.verify();
      console.log('[MAILER] Using', {
        host: a.host, port: a.port, secure: a.secure,
        from: process.env.FROM_EMAIL || user, via: a.label
      });
      return t;
    } catch (e) {
      lastErr = e;
      console.warn('[MAILER] Failed', a.label, '-', e?.message || e);
    }
  }
  throw lastErr || new Error('No SMTP transport reachable');
}

let _transportPromise;
/**
 * @param {{from:string,to:string,subject:string,text?:string,html?:string, headers?:object, replyTo?:string, inReplyTo?:string, references?:string[]}} mail
 */
async function sendMail({ from, to, subject, text, html, headers, replyTo, inReplyTo, references }) {
  _transportPromise ||= pickTransport();
  const transport = await _transportPromise;

  const info = await transport.sendMail({
    from,
    to,
    subject,
    text: text ?? '',
    html,
    headers,
    replyTo,
    inReplyTo,
    references,
  });

  // expose more fields to caller (Message-ID, accepted/rejected)
  return {
    messageId: info.messageId || '',
    accepted: info.accepted || [],
    rejected: info.rejected || [],
    response: info.response || '',
  };
}

module.exports = { sendMail };
