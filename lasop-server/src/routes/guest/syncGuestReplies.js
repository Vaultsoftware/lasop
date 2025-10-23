// File: lasop-server/src/routes/guest/syncGuestReplies.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');
const Guest = require('../../models/guest');
const GuestEmail = require('../../models/guestEmail');

const router = express.Router();

const IMAP_LOG = String(process.env.IMAP_LOG || '').trim() === '1';

const bool = (v, d = false) => {
  const s = String(v ?? '').trim().toLowerCase();
  if (s === '1' || s === 'true') return true;
  if (s === '0' || s === 'false') return false;
  return d;
};
const pick = (v, def) => {
  const s = String(v ?? '').trim();
  return s ? s : def;
};

const dlog = (...a) => { if (IMAP_LOG) console.log('[IMAP]', ...a); };
const dwarn = (...a) => console.warn('[IMAP]', ...a);
const derr = (...a) => console.error('[IMAP]', ...a);

/**
 * Try to open a mailbox using getMailboxLock (works on older/newer imapflow).
 * Returns { name, lock, exists } or throws.
 */
async function lockMailbox(client, name) {
  let lock;
  try {
    lock = await client.getMailboxLock(name); // opens/selects mailbox
    // imapflow exposes mailbox state via client.mailbox
    const exists = client.mailbox && typeof client.mailbox.exists === 'number'
      ? client.mailbox.exists
      : 0;
    dlog('LOCK ok', { name, exists });
    return { name, lock, exists };
  } catch (e) {
    if (lock) try { lock.release(); } catch {}
    throw e;
  }
}

/**
 * POST /admin/guests/:id/replies/sync
 * - Connects to IMAP
 * - Tries INBOX then Inbox
 * - Fetches last N messages and filters by from+since
 * - Parses and stores as "reply" with threading to the "sent" via inReplyTo/messageId
 */
router.post('/admin/guests/:id/replies/sync', async (req, res) => {
  const started = Date.now();
  let stage = 'init';
  let client;
  let lock = null;

  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid guest id' });
    }

    const guest = await Guest.findById(id).lean();
    if (!guest?.email) {
      return res.status(404).json({ message: 'Guest not found or has no email' });
    }
    const guestAddr = guest.email.toLowerCase();

    const imapHost = pick(process.env.IMAP_HOST);
    const imapPort = Number(process.env.IMAP_PORT || 993);
    const imapSecure = bool(process.env.IMAP_SECURE, true);
    const imapUser = pick(process.env.IMAP_USER);
    const imapPass = pick(process.env.IMAP_PASS);
    const imapMailbox = pick(process.env.IMAP_MAILBOX, 'INBOX');
    const imapSNI = pick(process.env.IMAP_TLS_SERVERNAME, imapHost);

    if (!imapHost || !imapUser || !imapPass) {
      return res.status(500).json({ message: 'IMAP not configured (IMAP_HOST/USER/PASS required)' });
    }

    const lookbackMin = Math.max(5, parseInt(process.env.IMAP_LOOKBACK_MINUTES || '1440', 10));
    const sinceDate = new Date(Date.now() - lookbackMin * 60 * 1000);
    const wantSinceMs = sinceDate.getTime();
    const windowSize = Math.max(50, parseInt(process.env.IMAP_FALLBACK_WINDOW || '300', 10));
    const fetchChunk = Math.max(25, Math.min(100, parseInt(process.env.IMAP_FETCH_CHUNK || '50', 10)));

    dlog('Config', {
      imapHost, imapPort, imapSecure, imapMailbox,
      lookbackMin, windowSize, fetchChunk, sni: imapSNI,
    });

    stage = 'connect';
    client = new ImapFlow({
      host: imapHost,
      port: imapPort,
      secure: imapSecure,
      auth: { user: imapUser, pass: imapPass },
      logger: IMAP_LOG ? {
        debug: (...a) => console.debug('[IMAP:debug]', ...a),
        info:  (...a) => console.info('[IMAP:info ]', ...a),
        warn:  (...a) => console.warn('[IMAP:warn ]', ...a),
        error: (...a) => console.error('[IMAP:error]', ...a),
      } : false,
      disableCompression: true,
      tls: { servername: imapSNI, minVersion: 'TLSv1.2', rejectUnauthorized: true },
      clientInfo: { name: 'lasop-server', version: '1.0.0' },
    });

    await client.connect();
    dlog('Connected');

    // NOOP is optional; some servers dislike it. Skip.

    stage = 'select';
    let exists = 0;
    try {
      ({ name: _n1, lock, exists } = await lockMailbox(client, imapMailbox)); // preferred
    } catch (e1) {
      dwarn('LOCK failed', imapMailbox, '-', e1?.message || e1);
      try {
        ({ name: _n2, lock, exists } = await lockMailbox(client, 'INBOX')); // common
      } catch (e2) {
        dwarn('LOCK failed INBOX -', e2?.message || e2);
        try {
          ({ name: _n3, lock, exists } = await lockMailbox(client, 'Inbox')); // cPanel oddity
        } catch (e3) {
          if (lock) try { lock.release(); } catch {}
          throw new Error('Could not open any INBOX-like mailbox');
        }
      }
    }

    if (!exists) {
      // Empty mailbox
      if (lock) { try { lock.release(); } catch {} lock = null; }
      return res.status(200).json({
        message: 'No messages in mailbox',
        data: { saved: 0, durationMs: Date.now() - started },
      });
    }

    stage = 'fetch-window';
    // Compute sequence range for last N messages: we rely on client.mailbox.exists
    const total = client.mailbox.exists || exists;
    const startSeq = Math.max(1, total - windowSize + 1);
    const endSeq = total;
    dlog('Fetching window', { startSeq, endSeq, total });

    const seqRanges = [];
    for (let s = startSeq; s <= endSeq; s += fetchChunk) {
      const e = Math.min(endSeq, s + fetchChunk - 1);
      seqRanges.push(`${s}:${e}`);
    }

    let savedCount = 0;

    stage = 'fetch-loop';
    for (const range of seqRanges) {
      dlog('FETCH', range);
      // Older imapflow supports range strings and these fields
      for await (const msg of client.fetch(range, { source: true, envelope: true, internalDate: true })) {
        try {
          const ts = msg.internalDate ? msg.internalDate.getTime() : 0;
          if (ts < wantSinceMs) continue;

          const fromAddrs = (msg.envelope?.from || [])
            .map(a => (a.address || '').toLowerCase())
            .filter(Boolean);
          if (!fromAddrs.includes(guestAddr)) continue;

          const parsed = await simpleParser(msg.source);

          const subject = (parsed.subject || '').trim();
          const bodyText = (parsed.text || '').trim();
          let body = bodyText || '';
          if (!body) {
            body = (parsed.html || '')
              .replace(/<style[\s\S]*?<\/style>/gi, '')
              .replace(/<[^>]+>/g, '')
              .replace(/\s+\n/g, '\n')
              .trim();
          }

          const messageId = parsed.messageId || undefined;
          const inReplyTo = (parsed.inReplyTo && String(parsed.inReplyTo).trim()) || undefined;
          const referencesArr = Array.isArray(parsed.references)
            ? parsed.references.map(r => String(r).trim()).filter(Boolean)
            : (parsed.references ? [String(parsed.references).trim()] : []);

          // de-dup
          if (messageId) {
            const exists = await GuestEmail.exists({ guestId: id, messageId, type: 'reply' });
            if (exists) continue;
          }

          // resolve parent
          let parentId = null;
          if (inReplyTo) {
            const parent = await GuestEmail.findOne({
              guestId: id,
              messageId: inReplyTo,
              type: 'sent',
            }).select('_id').lean();
            if (parent?._id) parentId = parent._id;
          }

          await GuestEmail.create({
            guestId: id,
            from: (parsed.from?.text || guest.email).trim(),
            to: (parsed.to?.text ||
                process.env.REPLY_TO_EMAIL ||
                process.env.FROM_EMAIL ||
                process.env.SMTP_USER ||
                '').trim(),
            subject: subject || '(no subject)',
            body: body || '(no body)',
            type: 'reply',
            messageId,
            inReplyTo,
            references: referencesArr,
            parentId,
            rawDate: parsed.date || msg.internalDate || new Date(),
          });

          savedCount += 1;
        } catch (eachErr) {
          dwarn('parse/save error (continuing):', eachErr?.message || eachErr);
        }
      }
    }

    return res.status(200).json({
      message: 'Replies synced',
      data: { saved: savedCount, durationMs: Date.now() - started },
    });
  } catch (e) {
    derr('fatal:', e?.message || e, '| stage =', stage);
    return res.status(500).json({
      message: 'Failed to sync replies',
      stage,
      detail: e?.message || String(e),
    });
  } finally {
    // Release lock first, then logout, and ignore errors
    try { if (lock) lock.release(); } catch {}
    try { if (client) await client.logout(); } catch {}
  }
});

module.exports = router;
