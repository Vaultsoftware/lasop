// =============================================================
// File: lasop-server/src/routes/facebook.js — Enhanced CAPI
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

const FB_VERSION = process.env.META_GRAPH_VERSION || process.env.FB_API_VERSION || "v21.0";
const ENV_TEST_CODE =
  process.env.META_TEST_EVENT_CODE || process.env.FB_TEST_EVENT_CODE || "";
const PROD = String(process.env.NODE_ENV || "").toLowerCase() === "production";
const DEBUG = process.env.META_CAPI_DEBUG === "1";

/* --------------------------- Utils --------------------------- */
const sha256 = (v) =>
  v ? crypto.createHash("sha256").update(String(v).trim().toLowerCase()).digest("hex") : undefined;

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
  // first IP in the list
  return String(xff).split(",")[0].trim() || undefined;
}

function getFbcFbp(req, explicit = {}) {
  // allow explicit override (from body), then cookies, then fbclid
  const cookies = parseCookie(req.headers.cookie || "");
  let fbp = explicit.fbp || cookies["_fbp"];
  let fbc = explicit.fbc || cookies["_fbc"];

  // Build _fbc from fbclid if present in URL (referer or body url)
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
  } catch {
    /* ignore */
  }
  return { fbc, fbp };
}

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

  // Hashed identifiers (arrays as required by Meta)
  const addHash = (key, val) => {
    const h = sha256(val);
    if (h) out[key] = [h];
  };

  addHash("em", extras.email);
  addHash("ph", extras.phone);
  addHash("external_id", extras.external_id);
  addHash("fn", extras.first_name);
  addHash("ln", extras.last_name);
  addHash("ct", extras.city);
  addHash("st", extras.state);
  addHash("zp", extras.zip);
  addHash("country", extras.country);

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
  // If someone passes 3+ letter code or ₦, normalize to NGN
  if (s === "₦" || s === "N") return "NGN";
  return s;
}

function coerceValue(val) {
  const n = Number(val);
  return Number.isFinite(n) ? n : 0;
}

/* ---------------------- Payload builders ---------------------- */
function buildSingleEvent(req, body) {
  const {
    event_name,
    event_id,
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
    event_time: Math.floor(Date.now() / 1000),
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
 *  - a single event object (classic)
 *  - { events: [ ... ] } to send multiple in one request
 */
function buildBody(req) {
  const src = req.body || {};
  let data = [];

  if (Array.isArray(src.events)) {
    for (const ev of src.events) data.push(buildSingleEvent(req, ev));
  } else {
    data.push(buildSingleEvent(req, src));
  }

  // test_event_code precedence:
  //  - if body provides test_event_code AND not in production → use it
  //  - else if env has it AND not in production → use env
  //  - in production: force off (Meta best practice)
  let test_event_code;
  if (!PROD) {
    test_event_code = src.test_event_code || ENV_TEST_CODE || undefined;
  }

  const payload = {
    data,
    access_token: ACCESS_TOKEN, // preferred placement
    ...(test_event_code ? { test_event_code: String(test_event_code) } : {}),
  };

  // Optional hint: who is sending
  payload.partner_agent = "lasop-server-capi/1.0";

  return payload;
}

/* -------------------------- Routes --------------------------- */

// Health check for config (useful during deploys)
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
  });
});

// Main CAPI endpoint
router.post("/conversion", async (req, res) => {
  try {
    if (!ACCESS_TOKEN || !PIXEL_ID) {
      return res.status(400).json({ error: "Missing ACCESS_TOKEN or PIXEL_ID" });
    }

    const payload = buildBody(req);
    const url = `https://graph.facebook.com/${FB_VERSION}/${encodeURIComponent(PIXEL_ID)}/events`;

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

// Optional: lightweight debug echo (headers/cookies), guarded
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
