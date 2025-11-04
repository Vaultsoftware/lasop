// =============================================================
// File: lasop-server/src/routes/facebook.js — CommonJS version
// =============================================================
const express = require("express");
const fetch = require("node-fetch");
const crypto = require("crypto");

const router = express.Router();

const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const PIXEL_ID = process.env.META_PIXEL_ID;

router.post("/conversion", async (req, res) => {
  try {
    const { event_name, value, currency, email, event_source_url } = req.body;

    if (!ACCESS_TOKEN || !PIXEL_ID) {
      return res.status(400).json({ error: "Missing Meta access token or Pixel ID" });
    }

    const hashedEmail = email
      ? crypto.createHash("sha256").update(email.trim().toLowerCase()).digest("hex")
      : null;

    const payload = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: event_source_url || "https://lasop.net",
          user_data: hashedEmail ? { em: [hashedEmail] } : {},
          custom_data: {
            currency: currency || "NGN",
            value: parseFloat(value) || 0,
          },
        },
      ],
    };

    const fbRes = await fetch(
      `https://graph.facebook.com/v20.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const json = await fbRes.json();
    console.log("✅ Meta API Response:", json);
    res.json({ success: true, meta: json });
  } catch (err) {
    console.error("❌ Facebook API Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
