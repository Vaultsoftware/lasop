import fetch from "node-fetch";
import crypto from "crypto";

const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_PIXEL_ID = process.env.META_PIXEL_ID;

/**
 * Sends a Facebook (Meta) Conversion API event.
 * 
 * @param {Object} params
 * @param {string} params.event_name - The event name (e.g., "Purchase", "Lead", "CompleteRegistration")
 * @param {number} params.value - The monetary value (if applicable)
 * @param {string} params.currency - Currency code (e.g., "NGN", "USD")
 * @param {string} params.email - User email (hashed automatically)
 * @param {string} params.event_source_url - The full URL of the page where the event occurred
 */
export async function sendFacebookEvent({ event_name, value, currency, email, event_source_url }) {
  try {
    if (!META_ACCESS_TOKEN || !META_PIXEL_ID) {
      console.error("❌ Missing Meta access token or pixel ID");
      return;
    }

    if (!event_name) {
      console.error("❌ event_name is required");
      return;
    }

    // Hash email for privacy as required by Meta
    const hashedEmail = email
      ? crypto.createHash("sha256").update(email.trim().toLowerCase()).digest("hex")
      : null;

    // Build event payload
    const body = {
      data: [
        {
          event_name, // e.g., "Purchase"
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: event_source_url || "https://lasop.net",
          user_data: hashedEmail ? { em: [hashedEmail] } : {},
          custom_data: {
            currency: currency || "NGN",
            value: Number(value) || 0,
          },
        },
      ],
    };

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${META_PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ Meta API Error:", result);
    } else {
      console.log("✅ Facebook Event Sent Successfully:", result);
    }

    return result;
  } catch (error) {
    console.error("⚠️ Error sending Meta event:", error);
  }
}
