// File: C:\Users\USER\Desktop\lasop\lasop-client\src\components\guest\GuestManagerModal.tsx
'use client';

import React, { useEffect, useMemo, useState, useCallback, memo, useRef } from 'react';

type Guest = {
  _id: string;
  sr?: number;
  name: string;
  phone?: string;
  email?: string;
  location?: string;
  reason?: string;
  createdAt?: string;
};

type EmailItem = {
  _id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  type: 'sent' | 'reply';
  createdAt: string;
  parentId?: string;         // threading (reply -> sent)
};

function formatSr(n?: number) {
  if (!n || n < 1) return '';
  return n < 10 ? `0${n}` : String(n);
}
function normalizeSrQuery(q: string) {
  const digits = q.replace(/\D/g, '');
  if (!digits) return '';
  const n = parseInt(digits, 10);
  if (Number.isNaN(n)) return '';
  return formatSr(n);
}
function matchesQuery(g: Guest, q: string, idxBasedSr: number) {
  if (!q) return true;
  const qLower = q.trim().toLowerCase();
  const nameMatch = g.name?.toLowerCase().startsWith(qLower);
  const srStr = formatSr(g.sr ?? idxBasedSr);
  const srMatch = srStr === normalizeSrQuery(q);
  return nameMatch || (!!q && srMatch);
}

/* ====================== Row (one guest) ====================== */
type RowProps = {
  g: Guest;
  index: number;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  setSelected: (g: Guest) => void;
  FROM: string;
  onSendEmail: (
    guestId: string,
    toEmail: string,
    subject: string,
    body: string
  ) => Promise<void>;
  onSyncReplies: (guestId: string) => Promise<void>;
  history: EmailItem[];
  historyLoading: boolean;
  setErr: (s: string) => void;
};

const Row = memo(function Row({
  g, index, expandedId, setExpandedId, setSelected, FROM, onSendEmail, onSyncReplies, history, historyLoading, setErr,
}: RowProps) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [sendError, setSendError] = useState<string>('');
  const [syncing, setSyncing] = useState(false);

  const open = expandedId === g._id;
  const srStr = formatSr(g.sr ?? index + 1);

  const send = async () => {
    const sub = subject.trim();
    const msg = body.trim();
    setSendError('');
    if (!g._id) return;
    if (!g.email) { setErr('Selected guest has no email'); return; }
    if (!sub || !msg) { setErr('Subject and message required'); return; }
    setEmailSending(true);
    try {
      await onSendEmail(g._id, g.email, sub, msg);
      setSubject('');
      setBody('');
      setErr('');
    } catch (e: any) {
      const msgText = e?.message || 'Failed to send email';
      setSendError(msgText);
      setErr(msgText);
    } finally {
      setEmailSending(false);
    }
  };

  const syncReplies = async () => {
    if (!g._id) return;
    setSyncing(true);
    try {
      await onSyncReplies(g._id);
      setErr('');
    } catch (e: any) {
      setErr(e?.message || 'Failed to sync replies');
    } finally {
      setSyncing(false);
    }
  };

  // ---- Threading view: group replies under their parent sent item ----
  const threaded = useMemo(() => {
    // parents = "sent"; children = "reply" with matching parentId
    const parents = history
      .filter(h => h.type === 'sent')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const repliesByParent = new Map<string, EmailItem[]>();
    for (const r of history) {
      if (r.type === 'reply' && r.parentId) {
        if (!repliesByParent.has(r.parentId)) repliesByParent.set(r.parentId, []);
        repliesByParent.get(r.parentId)!.push(r);
      }
    }
    // sort each reply list ascending by time (older reply first)
    for (const list of repliesByParent.values()) {
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    // orphan replies (no parentId) — show as stand-alone at bottom (newest first)
    const orphans = history
      .filter(h => h.type === 'reply' && !h.parentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return { parents, repliesByParent, orphans };
  }, [history]);

  return (
    <div className="border rounded-md p-3 bg-secondary">
      <button
        className="w-full flex items-center justify-between"
        onClick={() => { setExpandedId(open ? null : g._id); setSelected(g); }}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3 text-left">
          <span className="text-xs font-semibold px-2 py-1 rounded bg-white border">{srStr || '--'}</span>
          <div>
            <p className="font-semibold">{g.name}</p>
            <p className="text-xs opacity-70">{g.email || 'No email'} • {g.phone || 'No phone'}</p>
          </div>
        </div>
        <span className="text-xs">{g.createdAt ? new Date(g.createdAt).toLocaleString() : ''}</span>
      </button>

      {open && (
        <div className="mt-3 grid md:grid-cols-2 gap-3">
          <div className="p-3 border rounded bg-white">
            <h4 className="font-semibold mb-2">Profile</h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <span className="opacity-60">Name</span><span className="col-span-2">{g.name}</span>
              <span className="opacity-60">Phone</span><span className="col-span-2">{g.phone || '-'}</span>
              <span className="opacity-60">Email</span><span className="col-span-2">{g.email || '-'}</span>
              <span className="opacity-60">Location</span><span className="col-span-2">{g.location || '-'}</span>
              <span className="opacity-60">Reason</span><span className="col-span-2">{g.reason || '-'}</span>
            </div>
          </div>

          <div className="p-3 border rounded bg-white">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold mb-2">Email guest</h4>
              <span className="text-[11px] text-gray-500">
                Auto-sync: <b>On</b>
              </span>
            </div>
            <div className="space-y-2">
              <div className="text-xs opacity-70">From: {FROM}</div>
              <div className="text-xs opacity-70">To: {g.email || '—'}</div>
              <input
                className="w-full border rounded px-2 py-2 text-sm"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <textarea
                className="w-full border rounded px-2 py-2 text-sm min-h-[110px]"
                placeholder="Write your message..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-2 rounded bg-black text-white text-sm disabled:opacity-50"
                  onClick={send}
                  disabled={emailSending || !g.email}
                  title={!g.email ? 'No recipient email' : undefined}
                >
                  {emailSending ? 'Sending…' : 'Send'}
                </button>
                <button
                  className="px-3 py-2 rounded border text-sm disabled:opacity-50"
                  onClick={syncReplies}
                  disabled={syncing}
                  title="Fetch latest replies from inbox"
                >
                  {syncing ? 'Syncing…' : 'Sync replies'}
                </button>
              </div>
              {sendError && <p className="text-xs text-red-600">{sendError}</p>}
            </div>
          </div>

          <div className="md:col-span-2 p-3 border rounded bg-white">
            <h4 className="font-semibold mb-2">Email history</h4>
            {historyLoading ? (
              <p className="text-sm">Loading…</p>
            ) : (threaded.parents.length === 0 && threaded.orphans.length === 0) ? (
              <p className="text-sm opacity-70">No messages yet.</p>
            ) : (
              <ul className="space-y-2 max-h-64 overflow-auto">
                {threaded.parents.map(p => (
                  <li key={p._id} className="border rounded p-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold">Sent</span>
                      <span className="opacity-60">{new Date(p.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="text-[11px] opacity-70 mt-1">{p.subject}</div>
                    <p className="text-sm mt-1 whitespace-pre-wrap">{p.body}</p>

                    {(threaded.repliesByParent.get(p._id) || []).map(r => (
                      <div key={r._id} className="mt-2 ml-4 border rounded p-2 border-l-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold">↳ Reply</span>
                          <span className="opacity-60">{new Date(r.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="text-[11px] opacity-70 mt-1">in reply to: {p.subject}</div>
                        <p className="text-sm mt-1 whitespace-pre-wrap">{r.body}</p>
                      </div>
                    ))}
                  </li>
                ))}

                {/* Orphan replies without a found parent */}
                {threaded.orphans.length > 0 && (
                  <li className="pt-2">
                    <div className="text-[11px] font-semibold opacity-60 mb-1">Other replies</div>
                    {threaded.orphans.map(r => (
                      <div key={r._id} className="border rounded p-2 border-l-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold">↳ Reply</span>
                          <span className="opacity-60">{new Date(r.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="text-[11px] opacity-70 mt-1">{r.subject}</div>
                        <p className="text-sm mt-1 whitespace-pre-wrap">{r.body}</p>
                      </div>
                    ))}
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

/* ====================== Modal (list + details) ====================== */

export default function GuestManagerModal({
  apiBase,
  onClose,
}: {
  apiBase: string;
  onClose: () => void;
}) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Guest | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // IMPORTANT: match backend .env FROM_EMAIL
  const FROM = 'no-reply@lasop.net';
  const [history, setHistory] = useState<EmailItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // auto sync loop refs
  const autoSyncTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSyncOk = useRef<boolean>(true);

  const [form, setForm] = useState<Guest>({
    _id: '',
    name: '',
    phone: '',
    email: '',
    location: '',
    reason: '',
  });

  useEffect(() => {
    setLoading(true);
    fetch(`${apiBase}/admin/guests`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        const raw: Guest[] = Array.isArray(d.data) ? d.data : [];
        const sorted = raw.slice().sort((a, b) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        setGuests(sorted);
      })
      .catch(() => setErr('Failed to load guests'))
      .finally(() => setLoading(false));
  }, [apiBase]);

  const loadHistory = useCallback(async (guestId: string) => {
    setHistoryLoading(true);
    try {
      const r = await fetch(`${apiBase}/admin/guests/${guestId}/emails`, { credentials: 'include' });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d?.error || d?.message || 'Failed to fetch emails');
      setHistory(Array.isArray(d.data) ? d.data : []);
    } catch (e: any) {
      setErr(String(e?.message || e));
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, [apiBase]);

  useEffect(() => {
    if (!selected?._id) return;
    loadHistory(selected._id);
  }, [loadHistory, selected?._id]);

  const filtered = useMemo(() => {
    return guests.filter((g, i) => matchesQuery(g, query, i + 1));
  }, [guests, query]);

  const createGuest = useCallback(async () => {
    const name = (form.name || '').trim();
    if (!name) { setErr('Name is required'); return; }
    setErr('');
    try {
      const res = await fetch(`${apiBase}/admin/guests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          phone: form.phone,
          email: form.email,
          location: form.location,
          reason: form.reason,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Failed to create');
      const created: Guest = data.data;
      setGuests(prev => [created, ...prev]);
      setForm({ _id: '', name: '', phone: '', email: '', location: '', reason: '' });
    } catch (e: any) {
      setErr(e.message || 'Failed to create');
    }
  }, [apiBase, form]);

  const onSendEmail = useCallback(async (guestId: string, toEmail: string, subject: string, body: string) => {
    const res = await fetch(`${apiBase}/admin/guests/${guestId}/emails`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ from: 'no-reply@lasop.net', to: toEmail, subject, body }),
    });
    const text = await res.text().catch(() => '');
    let data: any = {};
    try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }
    if (!res.ok) {
      const msg = data?.message || data?.error || `HTTP ${res.status}`;
      throw new Error(msg);
    }
    // Optimistically prepend the sent item
    const sent: EmailItem = data.data;
    if (selected?._id === guestId) setHistory(h => [sent, ...h]);
  }, [apiBase, selected?._id]);

  const onSyncReplies = useCallback(async (guestId: string) => {
    const res = await fetch(`${apiBase}/admin/guests/${guestId}/replies/sync`, {
      method: 'POST',
      credentials: 'include',
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(d?.message || d?.error || `HTTP ${res.status}`);
    lastSyncOk.current = true;
    // After syncing, reload the history to include replies
    await loadHistory(guestId);
  }, [apiBase, loadHistory]);

  // -------- Auto-sync replies while a guest is selected & tab visible --------
  useEffect(() => {
    const ACTIVE_INTERVAL_MS = 60_000;      // every 60s
    const BACKOFF_INTERVAL_MS = 120_000;    // if last sync failed

    function shouldSync() {
      return !!selected?._id && document.visibilityState === 'visible';
    }

    async function tick() {
      if (!shouldSync()) return;
      try {
        await onSyncReplies(selected!._id);
      } catch {
        lastSyncOk.current = false;
      }
    }

    function startTimer() {
      const ms = lastSyncOk.current ? ACTIVE_INTERVAL_MS : BACKOFF_INTERVAL_MS;
      if (autoSyncTimer.current) clearInterval(autoSyncTimer.current);
      autoSyncTimer.current = setInterval(tick, ms);
    }

    // kick once on open/selection change
    if (selected?._id) {
      tick().finally(() => startTimer());
    }

    const onVis = () => {
      if (document.visibilityState === 'visible' && selected?._id) {
        tick().finally(() => startTimer());
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      document.removeEventListener('visibilitychange', onVis);
      if (autoSyncTimer.current) {
        clearInterval(autoSyncTimer.current);
        autoSyncTimer.current = null;
      }
    };
  }, [selected?._id, onSyncReplies]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div className="min-h-[100dvh] flex items-start md:items-center justify-center p-3 md:p-6">
        <div
          className="w-full max-w-6xl bg-white rounded-lg shadow-xl overflow-hidden"
          style={{ contain: 'content' }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-semibold">Manage Guests</h3>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 rounded-full border hover:bg-gray-50"
            >✕</button>
          </div>

          <div
            className="p-4 max-h-[85dvh] overflow-y-auto"
            style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
          >
            <div className="grid md:grid-cols-2 gap-4 h-full">
              {/* RIGHT LIST FIRST ON MOBILE */}
              <div className="order-1 md:order-2 flex flex-col min-h-0">
                <div className="p-3 border rounded flex-1 overflow-auto min-h-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Existing guests</h4>
                    {selected?._id ? (
                      <span className="text-[11px] opacity-70">
                        Auto-sync: <b>On</b>
                      </span>
                    ) : null}
                  </div>

                  {loading ? (
                    <p>Loading…</p>
                  ) : filtered.length === 0 ? (
                    <p className="opacity-70">No guests found.</p>
                  ) : (
                    <div className="space-y-2">
                      {filtered.map((g, i) => (
                        <Row
                          key={g._id}
                          g={g}
                          index={i}
                          expandedId={expandedId}
                          setExpandedId={setExpandedId}
                          setSelected={setSelected}
                          FROM={FROM}
                          onSendEmail={onSendEmail}
                          onSyncReplies={onSyncReplies}
                          history={selected?._id === g._id ? history : []}
                          historyLoading={selected?._id === g._id ? historyLoading : false}
                          setErr={setErr}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* LEFT FORM SECOND ON MOBILE */}
              <div className="order-2 md:order-1 flex flex-col min-h-0">
                <div className="p-3 border rounded overflow-auto min-h-0">
                  <h4 className="font-semibold mb-2">Create guest</h4>
                  <div className="space-y-2">
                    <input
                      className="w-full border rounded px-2 py-2"
                      placeholder="Name"
                      value={form.name}
                      onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        className="w-full border rounded px-2 py-2"
                        placeholder="Phone number"
                        value={form.phone}
                        onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                      />
                      <input
                        className="w-full border rounded px-2 py-2"
                        placeholder="Email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                      />
                    </div>
                    <input
                      className="w-full border rounded px-2 py-2"
                      placeholder="Location"
                      value={form.location}
                      onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))}
                    />
                    <textarea
                      className="w-full border rounded px-2 py-2 min-h-[100px]"
                      placeholder="Reason for contact"
                      value={form.reason}
                      onChange={(e) => setForm(f => ({ ...f, reason: e.target.value }))}
                    />
                    <div className="flex items-center gap-2">
                      <button
                        className="px-3 py-2 rounded border"
                        onClick={() => setForm({ _id: '', name: '', phone: '', email: '', location: '', reason: '' })}
                      >
                        + Add another
                      </button>
                      <button className="px-3 py-2 rounded bg-black text-white" onClick={createGuest}>
                        Save
                      </button>
                    </div>
                  </div>

                  {err && <p className="text-sm text-red-600 mt-3">{err}</p>}
                </div>

                <div className="p-3 border rounded overflow-auto min-h-0 mt-3">
                  <h4 className="font-semibold mb-2">Search guest</h4>
                  <input
                    className="w-full border rounded px-2 py-2"
                    placeholder="Type name initials or SR# (e.g., 01)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <p className="text-xs mt-1 opacity-70">
                    Live search by name prefix (e.g., “a”) or serial number (e.g., “01”).
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* /Scrollable body */}
        </div>
      </div>
    </div>
  );
}
