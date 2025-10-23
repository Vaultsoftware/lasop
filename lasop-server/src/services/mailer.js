// File: src/services/mailer.js
const nodemailer = require('nodemailer');

function buildTransport() {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
    SMTP_TLS_SERVERNAME,
    SMTP_REJECT_UNAUTHORIZED,
  } = process.env;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: String(SMTP_SECURE || 'false') === 'true',
    auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    tls: {
      servername: SMTP_TLS_SERVERNAME || SMTP_HOST,
      rejectUnauthorized: String(SMTP_REJECT_UNAUTHORIZED || 'true') === 'true',
    },
  });
}

const transport = buildTransport();

async function sendMail({ to, subject, text, html }) {
  const fromEmail = process.env.FROM_EMAIL || 'no-reply@lasop.net';
  const fromName = process.env.FROM_NAME || 'LASOP';
  const from = `"${fromName}" <${fromEmail}>`;
  return transport.sendMail({ from, to, subject, text, html });
}

module.exports = { sendMail };
