// File: lib/sendFacebookEvent.js
// ESM, node-fetch v2 compatible. Backward compatible with your current calls.

import fetch from "node-fetch";
import crypto from "crypto";

const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || process.env.FB_ACCESS_TOKEN || "";
const META_PIXEL_ID = process.env.META_PIXEL_ID || process.env.FB_PIXEL_ID || "";
const META_APP_SECRET = process.env.META_APP_SECRET || process.env.FB_APP_SECRET || "";
const META_TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE || process.env.FB_TEST_EVENT_CODE || "";
const META_GRAPH_VERSION = process.env.META_GRAPH_VERSION || process.env.FB_API_VERSION || "v21.0";
const NODE_ENV = String(process.env.NODE_ENV || "").toLowerCase();
const IS_PROD = NODE_ENV === "production";

/* ----------------------- small helpers ----------------------- */
const sha256Normalize = (v) =>
  v ? crypto.createHash("sha256").update(String(v).trim().toLowerCase(), "utf8").digest("hex") : undefined;

const normalizePhoneForHash = (phone, country = "NG") => {
  if (!phone) return undefined;
  let s = String(phone).replace(/[^\d+]/g, "");
  if (s.startsWith("0")) {
    if ((country || "").toUpperCase() === "NG") s = "234" + s.slice(1); // simple NG heuristic
  }
  if (s.startsWith("+")) s = s.slice(1);
  return s || undefined;
};

const safeEventTime = (t) => {
  const now = Math.floor(Date.now() / 1000);
  const n = Number(t);
  if (!Number.isFinite(n)) return now;
  const sevenDays = 7 * 24 * 60 * 60;
  if (n > now + 300) return now;
  if (n < now - sevenDays) return now;
  return Math.floor(n);
};

const hmacAppSecretProof = (token, secret) => {
  if (!token || !secret) return undefined;
  return crypto.createHmac("sha256", secret).update(token).digest("hex");
};

const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString("hex"));

/* ------------------------ public API ------------------------- */
/**
 * Sends a Meta (Facebook) Conversion API event.
 *
 * Backward compatible: you can still call with only { event_name, value, currency, email, event_source_url }.
 * Optional extras improve Event Match Quality (EMQ) but are not required.
 *
 * @param {Object} params
 * Required:
 * @param {string} params.event_name
 *
 * Optional but recommended:
 * @param {number} [params.value]
 * @param {string} [params.currency="NGN"]
 * @param {string} [params.email]
 * @param {string} [params.phone]
 * @param {string} [params.first_name]
 * @param {string} [params.last_name]
 * @param {string} [params.city]
 * @param {string} [params.state]
 * @param {string} [params.zip]
 * @param {string} [params.country="NG"]
 * @param {string} [params.external_id]
 * @param {string} [params.fbp]
 * @param {string} [params.fbc]
 * @param {string} [params.client_ip_address]
 * @param {string} [params.client_user_agent]
 * @param {string} [params.event_source_url="https://lasop.net"]
 * @param {string} [params.event_id]  // pass same ID to pixel for dedupe
 * @param {number} [params.event_time]  // unix seconds; guarded to 7 days window
 * @param {Array<{id:string,quantity?:number,item_price?:number}>} [params.contents]
 * @param {string[]} [params.content_ids]
 * @param {string} [params.order_id]
 * @param {number} [params.num_items]
 * @param {("website"|"app"|"phone_call"|"chat"|"email"|"physical_store"|"system_generated"|"other")} [params.action_source="website"]
 * @param {string} [params.test_event_code] // non-prod only
 * @param {Object} [params.data_processing] // { options: ["LDU"], country: 1.., state: 1.. }
 */
export async function sendFacebookEvent(params = {}) {
  try {
    if (!META_ACCESS_TOKEN || !META_PIXEL_ID) {
      console.error("❌ Missing Meta access token or pixel ID");
      return;
    }

    const {
      event_name,
      value,
      currency = "NGN",
      email,
      phone,
      first_name,
      last_name,
      city,
      state,
      zip,
      country = "NG",
      external_id,
      fbp,
      fbc,
      client_ip_address,
      client_user_agent,
      event_source_url = "https://lasop.net",
      event_id,
      event_time,
      contents,
      content_ids,
      order_id,
      num_items,
      action_source = "website",
      test_event_code,
      data_processing,
    } = params;

    if (!event_name) {
      console.error("❌ event_name is required");
      return;
    }

    // user_data (enhanced matching)
    const user_data = {};
    const em = sha256Normalize(email);
    if (em) user_data.em = [em];

    const ph = normalizePhoneForHash(phone, country);
    const phHash = sha256Normalize(ph);
    if (phHash) user_data.ph = [phHash];

    const fn = sha256Normalize(first_name);
    if (fn) user_data.fn = fn;

    const ln = sha256Normalize(last_name);
    if (ln) user_data.ln = ln;

    const ct = sha256Normalize(city);
    if (ct) user_data.ct = ct;

    const st = sha256Normalize(state);
    if (st) user_data.st = st;

    const zp = sha256Normalize(zip);
    if (zp) user_data.zp = zp;

    const co = sha256Normalize(country || "NG");
    if (co) user_data.country = co;

    const xid = sha256Normalize(external_id);
    if (xid) user_data.external_id = [xid];

    if (fbp) user_data.fbp = fbp;
    if (fbc) user_data.fbc = fbc;
    if (client_ip_address) user_data.client_ip_address = client_ip_address;
    if (client_user_agent) user_data.client_user_agent = client_user_agent;

    // custom_data
    const custom_data = {
      currency: (currency || "NGN").toUpperCase(),
      value: Number(value) || 0,
    };
    if (Array.isArray(content_ids) && content_ids.length) custom_data.content_ids = content_ids.map(String);
    if (Array.isArray(contents) && contents.length) {
      custom_data.contents = contents.map((c) => ({
        id: String(c.id),
        quantity: Number(c.quantity || 1) || 1,
        item_price: Number(c.item_price || 0) || 0,
      }));
      if (!custom_data.content_ids) custom_data.content_ids = contents.map((c) => String(c.id));
      custom_data.content_type = "product";
    }
    if (order_id) custom_data.order_id = String(order_id);
    if (typeof num_items === "number") custom_data.num_items = Number(num_items);

    // event
    const event = {
      event_name: String(event_name),
      event_time: safeEventTime(event_time),
      action_source,
      event_source_url,
      user_data,
      custom_data,
    };
    event.event_id = String(event_id || uuid()); // safe default for dedupe

    // payload
    const data = [event];

    const payload = {
      data,
      partner_agent: "lasop-enhanced-capi/1.0",
    };

    if (!IS_PROD) {
      const testCode = test_event_code || META_TEST_EVENT_CODE;
      if (testCode) payload.test_event_code = String(testCode);
    }

    if (data_processing && Array.isArray(data_processing.options)) {
      payload.data_processing_options = data_processing.options;
      if (Number.isFinite(data_processing.country)) {
        payload.data_processing_options_country = Number(data_processing.country);
      }
      if (Number.isFinite(data_processing.state)) {
        payload.data_processing_options_state = Number(data_processing.state);
      }
    }

    // URL with token + appsecret_proof (keeps your previous shape, just hardened)
    const qs = new URLSearchParams();
    qs.set("access_token", META_ACCESS_TOKEN);
    const proof = hmacAppSecretProof(META_ACCESS_TOKEN, META_APP_SECRET);
    if (proof) qs.set("appsecret_proof", proof);

    const url = `https://graph.facebook.com/${META_GRAPH_VERSION}/${encodeURIComponent(
      META_PIXEL_ID
    )}/events?${qs.toString()}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    const resultText = await res.text();
    let result;
    try { result = JSON.parse(resultText); } catch { result = resultText; }

    if (!res.ok) {
      console.error("❌ Meta API Error:", result);
    } else {
      console.log("✅ Facebook Event Sent:", result);
    }
    return result;
  } catch (err) {
    console.error("⚠️ Error sending Meta event:", err?.message || err);
  }
}
