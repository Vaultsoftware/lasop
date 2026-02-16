// File: lasop-server/src/services/guestReplyWatcher.js
require('dotenv').config();
const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');
const Guest = require('../models/guest');
const GuestEmail = require('../models/guestEmail');

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

const LOG = String(process.env.IMAP_LOG || '').trim() === '1';
const L = (...a) => { if (LOG) console.log('[IMAP-AUTO]', ...a); };
const W = (...a) => console.warn('[IMAP-AUTO]', ...a);
const E = (...a) => console.error('[IMAP-AUTO]', ...a);

async function withMailboxLock(client, name) {
  const lock = await client.getMailboxLock(name);
  const exists = client.mailbox?.exists || 0;
  return { lock, exists };
}

/** Fetches last N messages and files any replies from known guest emails */
async function syncInboxWindow(client) {
  // Build email->guestId map
  const guests = await Guest.find({ email: { $exists: true, $ne: '' } }).select('_id email').lean();
  const gmap = new Map();
  for (const g of guests) gmap.set(String(g.email).toLowerCase(), String(g._id));

  const lookbackMin = Math.max(5, parseInt(process.env.IMAP_LOOKBACK_MINUTES || '1440', 10));
  const sinceMs = Date.now() - lookbackMin * 60 * 1000;
  const windowSize = Math.max(50, parseInt(process.env.IMAP_FALLBACK_WINDOW || '300', 10));
  const fetchChunk = Math.max(25, Math.min(100, parseInt(process.env.IMAP_FETCH_CHUNK || '50', 10)));

  // Open mailbox (INBOX → Inbox fallback)
  let lock;
  let opened = false;
  for (const name of [pick(process.env.IMAP_MAILBOX, 'INBOX'), 'INBOX', 'Inbox']) {
    try {
      ({ lock } = await withMailboxLock(client, name));
      opened = true;
      L('locked mailbox', name, 'exists=', client.mailbox?.exists || 0);
      break;
    } catch (e) {
      W('lock failed', name, e?.message || e);
    }
  }
  if (!opened) throw new Error('Could not lock any INBOX-like mailbox');

  try {
    const total = client.mailbox?.exists || 0;
    if (!total) return { saved: 0 };

    const startSeq = Math.max(1, total - windowSize + 1);
    const endSeq = total;

    // Chunked sequence ranges
    const ranges = [];
    for (let s = startSeq; s <= endSeq; s += fetchChunk) {
      const e = Math.min(endSeq, s + fetchChunk - 1);
      ranges.push(`${s}:${e}`);
    }

    let saved = 0;

    for (const r of ranges) {
      for await (const msg of client.fetch(r, { source: true, envelope: true, internalDate: true })) {
        try {
          // time filter
          const ts = msg.internalDate ? msg.internalDate.getTime() : 0;
          if (ts < sinceMs) continue;

          // find which guest this is from
          const froms = (msg.envelope?.from || [])
            .map(a => (a.address || '').toLowerCase())
            .filter(Boolean);
          if (froms.length === 0) continue;

          let guestId = null;
          for (const f of froms) {
            if (gmap.has(f)) { guestId = gmap.get(f); break; }
          }
          if (!guestId) continue;

          // parse full body to get subject/body/thread
          const parsed = await simpleParser(msg.source);

          const messageId = parsed.messageId || undefined;
          if (messageId) {
            const dup = await GuestEmail.exists({ messageId }); // dedupe across all types
            if (dup) continue;
          }

          const subject = (parsed.subject || '').trim() || '(no subject)';
          let body = (parsed.text || '').trim();
          if (!body) {
            body = (parsed.html || '')
              .replace(/<style[\s\S]*?<\/style>/gi, '')
              .replace(/<[^>]+>/g, '')
              .replace(/\s+\n/g, '\n')
              .trim() || '(no body)';
          }

          const inReplyTo = (parsed.inReplyTo && String(parsed.inReplyTo).trim()) || undefined;
          const referencesArr = Array.isArray(parsed.references)
            ? parsed.references.map(r => String(r).trim()).filter(Boolean)
            : (parsed.references ? [String(parsed.references).trim()] : []);

          // parent threading (match our "sent" by messageId)
          let parentId = null;
          if (inReplyTo) {
            const parent = await GuestEmail.findOne({ guestId, messageId: inReplyTo, type: 'sent' })
              .select('_id')
              .lean();
            if (parent?._id) parentId = parent._id;
          }

          await GuestEmail.create({
            guestId,
            from: (parsed.from?.text || '').trim(),
            to: (parsed.to?.text ||
              process.env.REPLY_TO_EMAIL ||
              process.env.FROM_EMAIL ||
              process.env.SMTP_USER ||
              '').trim(),
            subject,
            body,
            type: 'reply',
            messageId,
            inReplyTo,
            references: referencesArr,
            parentId,
            rawDate: parsed.date || msg.internalDate || new Date(),
          });

          saved += 1;
        } catch (each) {
          W('parse/save error (continuing):', each?.message || each);
        }
      }
    }

    return { saved };
  } finally {
    try { lock && lock.release(); } catch { }
  }
}

let _running = false;
let _timer = null;

async function tick() {
  if (_running) return;
  _running = true;

  const host = pick(process.env.IMAP_HOST);
  const port = Number(process.env.IMAP_PORT || 993);
  const secure = bool(process.env.IMAP_SECURE, true);
  const user = pick(process.env.IMAP_USER);
  const pass = pick(process.env.IMAP_PASS);
  const sni = pick(process.env.IMAP_TLS_SERVERNAME, host);
  if (!host || !user || !pass) { W('IMAP not configured; skipping'); _running = false; return; }

  const client = new ImapFlow({
    host, port, secure, auth: { user, pass },
    disableCompression: true,
    tls: { servername: sni, minVersion: 'TLSv1.2', rejectUnauthorized: true },
    logger: false,
    clientInfo: { name: 'lasop-server', version: 'auto-sync' },
  });

  try {
    await client.connect();
    const { saved } = await syncInboxWindow(client);
    if (saved) L('auto-synced replies:', saved);
  } catch (e) {
    E('auto-sync error:', e?.message || e);
  } finally {
    try { await client.logout(); } catch { }
    _running = false;
  }
}

function startGuestReplyWatcher() {
  const enable = bool(process.env.IMAP_AUTO_SYNC, false);
  const everySec = Math.max(30, parseInt(process.env.IMAP_AUTO_INTERVAL_SEC || '120', 10));
  if (!enable) {
    L('IMAP_AUTO_SYNC=0 (disabled)');
    return;
  }
  L(`starting auto-sync every ${everySec}s`);
  _timer = setInterval(tick, everySec * 1000);
  // also do one immediate tick on boot
  tick();
}

module.exports = { startGuestReplyWatcher };
