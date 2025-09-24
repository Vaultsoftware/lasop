// =============================================================
// File: src/components/Tawk/TawkWidget.tsx
// =============================================================
"use client";

import { useCallback, useEffect, useRef } from "react";

type TawkAPI = {
  onLoad?: () => void;
  setAttributes?: (attrs: Record<string, string>, cb?: (err?: unknown) => void) => void;
  addTags?: (tags: string[], cb?: (err?: unknown) => void) => void;
};

declare global {
  interface Window {
    Tawk_API: TawkAPI;
    Tawk_LoadStart: Date;
  }
}

const PROPERTY_ID = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID!;
const WIDGET_ID = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID!;

/** why: stable per-browser id to retrieve past chats by tag/attribute */
function getOrCreateVisitorId(key = "lasop_visitor_id"): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(key);
  if (!id) {
    id = Array.from(crypto.getRandomValues(new Uint8Array(12)))
      .map((b) => b.toString(36).padStart(2, "0"))
      .join("")
      .slice(0, 16);
    localStorage.setItem(key, id);
  }
  return id;
}

/** OPTIONAL: Secure Mode when you know the user's email */
async function secureIdentify(email: string, name?: string) {
  try {
    const res = await fetch("/api/tawk/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      cache: "no-store",
    });
    if (!res.ok) return;
    const { hash } = (await res.json()) as { hash: string };
    window.Tawk_API.setAttributes?.({ name: name || email, email, hash }, () => {});
  } catch {
    /* ignore */
  }
}

export default function TawkWidget(): React.ReactElement | null {
  const injected = useRef(false);

  const inject = useCallback(() => {
    if (injected.current) return;
    injected.current = true;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const s1 = document.createElement("script");
    s1.async = true;
    s1.src = `https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}`;
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");

    window.Tawk_API.onLoad = () => {
      const vid = getOrCreateVisitorId();
      window.Tawk_API.setAttributes?.({ visitor_id: vid }, () => {});
      window.Tawk_API.addTags?.([`visitor_id:${vid}`], () => {});

      // When you have an authenticated user:
      // secureIdentify(user.email, user.fullName)
    };

    document.body.appendChild(s1);
  }, []);

  useEffect(() => {
    if (!PROPERTY_ID || !WIDGET_ID) return;
    inject();
  }, [inject]);

  return null;
}
