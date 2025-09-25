// src/routes/health/emailAuthCheck.js
require('dotenv').config();
const nodemailer = require('nodemailer');

async function tryVerify(opts, auth) {
  const t = nodemailer.createTransport({ ...opts, auth });
  await t.verify();
  return { ok: true, ...opts };
}

module.exports = async function emailAuthCheck(req, res) {
  try {
    const user = (process.env.EMAIL_RECIEVE || '').trim();
    const pass = (process.env.EMAIL_PWD || '').trim();
    if (!user || !pass) return res.status(400).json({ ok: false, detail: 'EMAIL_RECIEVE/EMAIL_PWD missing' });
    if (pass.length !== 16) return res.status(400).json({ ok: false, detail: 'Gmail app password must be 16 chars' });

    const auth = { user, pass };
    const optsList = [
      { host: 'smtp.gmail.com', port: 465, secure: true },
      { host: 'smtp.gmail.com', port: 587, secure: false },
    ];

    const results = { ok: false, attempts: [] };
    for (const opts of optsList) {
      try {
        const r = await tryVerify(opts, auth);
        results.attempts.push(r);
        results.ok = true;
        break;
      } catch (e) {
        results.attempts.push({ ...opts, ok: false, error: e?.message || String(e) });
      }
    }

    return res.status(results.ok ? 200 : 500).json(results);
  } catch (e) {
    return res.status(500).json({ ok: false, detail: e?.message || String(e) });
  }
};
