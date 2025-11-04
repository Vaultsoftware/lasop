import fetch from "node-fetch";
import crypto from "crypto";

const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_PIXEL_ID = process.env.META_PIXEL_ID;

export async function sendFacebookEvent({ event_name, value, currency, email, event_source_url }) {
  try {
    if (!META_ACCESS_TOKEN || !META_PIXEL_ID) {
      console.error("Missing Meta access token or pixel ID");
      return;
    }

    // hash email for privacy as required by Meta
    const hashedEmail = email
      ? crypto.createHash("sha256").update(email.trim().toLowerCase()).digest("hex")
      : null;

    const body = {
      data: [
        {
          event_name, // e.g. "Purchase"
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url,
          user_data: hashedEmail ? { em: [hashedEmail] } : {},
          custom_data: { value, currency },
        },
      ],
    };

    const res = await fetch(
      `https://graph.facebook.com/v18.0/${META_PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const json = await res.json();
    if (!res.ok) {
      console.error("Meta API Error:", json);
    } else {
      console.log("✅ Sent Meta Event:", json);
    }

    return json;
  } catch (err) {
    console.error("Error sending Meta event:", err);
  }
}
