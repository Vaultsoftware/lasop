// ==========================================================
// File: lasop-server/src/routes/facebook.js — Facebook API Route
// ==========================================================
const express = require("express");
const fetch = require("node-fetch");
const crypto = require("crypto");

const router = express.Router();

const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const PIXEL_ID = process.env.META_PIXEL_ID;

// ✅ Conversion Event Route
router.post("/conversion", async (req, res) => {
  try {
    const { event_name, value, currency, email, event_source_url } = req.body;

    if (!ACCESS_TOKEN || !PIXEL_ID) {
      console.error("❌ Missing Meta access token or pixel ID");
      return res.status(500).json({ success: false, error: "Missing Meta credentials" });
    }

    if (!event_name) {
      return res.status(400).json({ success: false, error: "event_name is required" });
    }

    // Hash email for Meta privacy requirements
    const hashedEmail = email
      ? crypto.createHash("sha256").update(email.trim().toLowerCase()).digest("hex")
      : null;

    // Build payload
    const payload = {
      data: [
        {
          event_name, // e.g. "Purchase", "Lead"
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

    // Send to Meta
    const fbRes = await fetch(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const json = await fbRes.json();
    console.log("✅ Meta API response:", json);

    res.status(200).json({ success: true, meta: json });
  } catch (err) {
    console.error("❌ Facebook Conversion Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
