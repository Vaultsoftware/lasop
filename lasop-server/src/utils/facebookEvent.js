// =============================================================
// File: lasop-server/src/utils/facebookEvent.js (FIXED for CommonJS)
// =============================================================
const fetch = require("node-fetch");

const META_PIXEL_ID = process.env.META_PIXEL_ID;
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

/**
 * Sends a server-side Meta Conversion API event.
 * Call this after confirmed payments or completed applications.
 */
async function sendFacebookEvent({ event_name, value, currency, email, event_source_url }) {
  if (!META_PIXEL_ID || !META_ACCESS_TOKEN) {
    console.warn("⚠️ META_PIXEL_ID or META_ACCESS_TOKEN missing.");
    return;
  }

  const payload = {
    data: [
      {
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url,
        user_data: { em: email },
        custom_data: { value, currency },
      },
    ],
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/v20.0/${META_PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const json = await res.json();
    console.log("✅ FB Conversion Sent:", json);
  } catch (err) {
    console.error("❌ FB Conversion API failed:", err);
  }
}

module.exports = { sendFacebookEvent };
