// =============================================================
// File: lasop-server/src/routes/facebook.js — Enhanced CAPI (add-only)
// CommonJS, node-fetch v2 compatible
// =============================================================
const express = require("express");
const fetch = require("node-fetch");
const crypto = require("crypto");

const router = express.Router();

/* ---------------------- Env & defaults ---------------------- */
const ACCESS_TOKEN =
  process.env.META_ACCESS_TOKEN ||
  process.env.FB_ACCESS_TOKEN ||
  process.env.FACEBOOK_ACCESS_TOKEN ||
  "";

const PIXEL_ID =
  process.env.META_PIXEL_ID ||
  process.env.FB_PIXEL_ID ||
  process.env.FACEBOOK_PIXEL_ID ||
  "";

const APP_SECRET =
  process.env.META_APP_SECRET ||
  process.env.FB_APP_SECRET ||
  process.env.FACEBOOK_APP_SECRET ||
  ""; // optional but recommended

const FB_VERSION = process.env.META_GRAPH_VERSION || process.env.FB_API_VERSION || "v21.0";
const ENV_TEST_CODE =
  process.env.META_TEST_EVENT_CODE || process.env.FB_TEST_EVENT_CODE || "";
const PROD = String(process.env.NODE_ENV || "").toLowerCase() === "production";
const DEBUG = process.env.META_CAPI_DEBUG === "1";

/** Optional GDPR/EEA toggles (no effect if not set) */
const DPO_ENABLED = process.env.META_DPO === "1";
const DPO_COUNTRY = process.env.META_DPO_COUNTRY || "";  // e.g. "US"
const DPO_STATE = process.env.META_DPO_STATE || "";      // e.g. "CA"

/* --------------------------- Utils --------------------------- */
const sha256 = (v) =>
  v ? crypto.createHash("sha256").update(String(v).trim().toLowerCase()).digest("hex") : undefined;

/** Why: secure token usage without changing your body shape. */
function appSecretProof(token, secret) {
  if (!token || !secret) return undefined;
  return crypto.createHmac("sha256", secret).update(token).digest("hex");
}

function parseCookie(header = "") {
  return header.split(";").reduce((acc, part) => {
    const [k, ...v] = part.trim().split("=");
    if (!k) return acc;
    acc[k] = decodeURIComponent(v.join("="));
    return acc;
  }, {});
}

function getClientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (!xff) return req.socket?.remoteAddress || undefined;
  return String(xff).split(",")[0].trim() || undefined;
}

function getFbcFbp(req, explicit = {}) {
  const cookies = parseCookie(req.headers.cookie || "");
  let fbp = explicit.fbp || cookies["_fbp"];
  let fbc = explicit.fbc || cookies["_fbc"];

  // Build _fbc from fbclid if present in event_source_url (or referer)
  try {
    const rawUrl =
      explicit.event_source_url ||
      req.body?.event_source_url ||
      req.headers.referer ||
      req.headers.origin ||
      "https://lasop.net";
    const url = new URL(rawUrl);
    const fbclid = url.searchParams.get("fbclid");
    if (fbclid && !fbc) {
      const ts = Math.floor(Date.now() / 1000);
      fbc = `fb.1.${ts}.${fbclid}`;
    }
  } catch { /* ignore */ }

  return { fbc, fbp };
}

/** Why: better EMQ on phone matching; keeps add-only behavior. */
function normalizePhoneForHash(phone, countryHint = "NG") {
  if (!phone) return undefined;
  let s = String(phone).replace(/[^\d+]/g, "");
  // If starts with 0 and we know country, prepend dial code heuristically (Nigeria example).
  if (s.startsWith("0")) {
    if ((countryHint || "").toUpperCase() === "NG") s = "234" + s.slice(1);
  }
  if (s.startsWith("+")) s = s.slice(1);
  return s || undefined;
}

// Meta expects arrays for: em, ph, external_id
// and single hash strings for: fn, ln, ct, st, zp, country
function buildUserData(req, extras = {}, explicit = {}) {
  const ip = getClientIp(req);
  const ua = req.headers["user-agent"] || undefined;
  const { fbc, fbp } = getFbcFbp(req, explicit);

  const out = {
    client_ip_address: ip,
    client_user_agent: ua,
    ...(fbc ? { fbc } : {}),
    ...(fbp ? { fbp } : {}),
  };

  const addArrayHash = (key, val) => {
    const h = sha256(val);
    if (h) out[key] = [h];
  };
  const addSingleHash = (key, val) => {
    const h = sha256(val);
    if (h) out[key] = h;
  };

  // Arrays
  addArrayHash("em", extras.email);
  addArrayHash("ph", normalizePhoneForHash(extras.phone, extras.country || "NG"));
  addArrayHash("external_id", extras.external_id);

  // Singles
  addSingleHash("fn", extras.first_name || extras.fn);
  addSingleHash("ln", extras.last_name || extras.ln);
  addSingleHash("ct", extras.city || extras.ct);
  addSingleHash("st", extras.state || extras.st);
  addSingleHash("zp", extras.zip || extras.zp);
  addSingleHash("country", extras.country || "NG");

  return out;
}

function mapItemsToContents(items = []) {
  if (!Array.isArray(items) || items.length === 0) return {};
  const contents = [];
  const ids = [];
  for (const it of items) {
    const id = it?.id != null ? String(it.id) : undefined;
    const quantity = Number(it?.quantity ?? 1) || 1;
    const item_price = Number(it?.item_price ?? it?.price ?? 0) || 0;

    contents.push({ id: id || "unknown", quantity, item_price });
    if (id) ids.push(id);
  }
  const out = { contents, content_type: "product" };
  if (ids.length) out.content_ids = ids;
  return out;
}

function sanitizeCurrency(cur) {
  const s = String(cur || "NGN").trim().toUpperCase();
  if (s === "₦" || s === "N") return "NGN";
  return s;
}

function coerceValue(val) {
  const n = Number(val);
  return Number.isFinite(n) ? n : 0;
}

/* ---------------------- Payload builders ---------------------- */
function safeEventTime(event_time) {
  const now = Math.floor(Date.now() / 1000);
  const t = Number(event_time);
  if (!Number.isFinite(t)) return now;
  // Why: Meta allows up to 7 days delay; guard bad clocks.
  const sevenDays = 7 * 24 * 60 * 60;
  if (t > now + 300) return now;          // future by >5min → now
  if (t < now - sevenDays) return now;    // too old → now
  return Math.floor(t);
}

function buildSingleEvent(req, body) {
  const {
    event_name,
    event_id,
    event_time,                 // optional from client
    value = 0,
    currency = "NGN",
    items = [],
    event_source_url,
    customer = {},
    fbp,
    fbc,
  } = body || {};

  if (!event_name) throw new Error("event_name is required");

  const user_data = buildUserData(
    req,
    customer || {},
    { fbp, fbc, event_source_url }
  );

  const custom_data = {
    currency: sanitizeCurrency(currency),
    value: coerceValue(value),
    ...mapItemsToContents(items),
  };

  return {
    event_name: String(event_name),
    event_time: safeEventTime(event_time),
    ...(event_id ? { event_id: String(event_id) } : {}),
    action_source: "website",
    event_source_url:
      event_source_url || req.headers.referer || req.headers.origin || "https://lasop.net",
    user_data,
    custom_data,
  };
}

/**
 * Accepts either:
 *  - a single event object
 *  - { events: [ ... ] } to send multiple at once
 */
function buildBody(req) {
  const src = req.body || {};
  let data = [];

  if (Array.isArray(src.events)) {
    for (const ev of src.events) data.push(buildSingleEvent(req, ev));
  } else {
    data.push(buildSingleEvent(req, src));
  }

  // test_event_code: allowed in non-prod only
  let test_event_code;
  if (!PROD) {
    test_event_code = src.test_event_code || ENV_TEST_CODE || undefined;
  }

  /** Optional DPO block (no-op unless enabled) */
  const dpo = DPO_ENABLED
    ? {
        data_processing_options: ["LDU"],
        ...(DPO_COUNTRY ? { data_processing_options_country: DPO_COUNTRY } : {}),
        ...(DPO_STATE ? { data_processing_options_state: DPO_STATE } : {}),
      }
    : {};

  const payload = {
    data,
    access_token: ACCESS_TOKEN, // allowed in body (kept for compatibility)
    ...(test_event_code ? { test_event_code: String(test_event_code) } : {}),
    partner_agent: "lasop-server-capi/1.1",
    ...dpo
  };

  return payload;
}

/* -------------------------- Routes --------------------------- */

// Health check for config
router.get("/conversion/health", (_req, res) => {
  if (!ACCESS_TOKEN || !PIXEL_ID) {
    return res.status(503).json({
      ok: false,
      reason: "Missing META_ACCESS_TOKEN or META_PIXEL_ID",
    });
  }
  return res.status(200).json({
    ok: true,
    pixel: PIXEL_ID ? "set" : "missing",
    version: FB_VERSION,
    prod: PROD,
    appsecret_proof: APP_SECRET ? "enabled" : "disabled",
  });
});

// Main CAPI endpoint
router.post("/conversion", async (req, res) => {
  try {
    if (!ACCESS_TOKEN || !PIXEL_ID) {
      return res.status(400).json({ error: "Missing ACCESS_TOKEN or PIXEL_ID" });
    }

    const payload = buildBody(req);

    // Add appsecret_proof if APP_SECRET is present (additive hardening)
    const proof = appSecretProof(ACCESS_TOKEN, APP_SECRET);
    const qs = new URLSearchParams();
    if (ACCESS_TOKEN) qs.set("access_token", ACCESS_TOKEN);
    if (proof) qs.set("appsecret_proof", proof);

    const urlBase = `https://graph.facebook.com/${FB_VERSION}/${encodeURIComponent(PIXEL_ID)}/events`;
    const url = qs.toString() ? `${urlBase}?${qs.toString()}` : urlBase;

    const fbRes = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await fbRes.text();
    let json;
    try { json = JSON.parse(text); } catch { json = text; }

    if (!fbRes.ok) {
      if (DEBUG) console.error("❌ Graph error:", json);
      return res.status(502).json({ ok: false, meta: json });
    }

    if (DEBUG) console.log("✅ Graph ok:", json);
    return res.status(200).json({ ok: true, meta: json });
  } catch (err) {
    if (DEBUG) console.error("❌ CAPI route error:", err?.message || err);
    return res.status(500).json({ ok: false, error: err?.message || "unknown" });
  }
});

// Optional: lightweight debug echo
if (DEBUG) {
  router.get("/conversion/__debug", (req, res) => {
    const cookies = parseCookie(req.headers.cookie || "");
    res.json({
      ip: getClientIp(req),
      ua: req.headers["user-agent"] || null,
      origin: req.headers.origin || null,
      referer: req.headers.referer || null,
      cookies,
    });
  });
}

module.exports = router;
