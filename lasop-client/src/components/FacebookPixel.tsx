// =============================================================
// File: src/components/FacebookPixel.tsx (HARDENED + Helpers)
// =============================================================
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

type AdvancedMatch = Partial<{
  em: string; ph: string; fn: string; ln: string; ct: string; st: string; zp: string; country: string;
}>;

interface FacebookPixelProps {
  pixelId: string;
  advancedMatching?: AdvancedMatch;
  disableOnLocalhost?: boolean;
}

declare global {
  interface Window {
    fbq?: any;
    __fbqTrack?: (event: string, params?: Record<string, any>, opts?: Record<string, any>) => void;
    __lastFbEventId?: string;        // why: lets you reuse same event_id for CAPI
  }
}

/* ------------------------ small helpers ------------------------ */
const readCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : undefined;
};

const safeUUID = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  const rnd = (len: number) => Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return `${Date.now().toString(16)}-${rnd(16)}`;
};

/** Build _fbc from fbclid when cookie missing */
const buildFbcFromUrl = (href?: string): string | undefined => {
  try {
    const u = new URL(href || (typeof window !== 'undefined' ? window.location.href : ''));
    const fbclid = u.searchParams.get('fbclid');
    if (!fbclid) return undefined;
    const ts = Math.floor(Date.now() / 1000);
    return `fb.1.${ts}.${fbclid}`;
  } catch {
    return undefined;
  }
};

/** Public: read fbp/fbc for CAPI */
export const getFbpFbc = (): { fbp?: string; fbc?: string } => {
  const fbp = readCookie('_fbp');
  const fbcCookie = readCookie('_fbc');
  const fbc = fbcCookie || buildFbcFromUrl();
  return { fbp, fbc };
};

/** Public: generate an event_id and fire Pixel with eventID for dedupe */
export const trackWithEventId = (
  pixelId: string,
  event: string,
  params: Record<string, any> = {}
): { event_id: string; fbp?: string; fbc?: string } => {
  const event_id = safeUUID();
  window.__lastFbEventId = event_id; // keep last for reuse
  const { fbp, fbc } = getFbpFbc();

  try {
    // Important: pass eventID to fbq so browser+server can dedupe
    window.fbq?.('trackSingle', pixelId, event, params, { eventID: event_id });
  } catch {
    // no-op
  }
  return { event_id, fbp, fbc };
};

/** Convenience: last generated event_id (if any) */
export const getLastEventId = (): string | undefined => window.__lastFbEventId;

/* ------------------------- React component ------------------------- */
export default function FacebookPixel({
  pixelId,
  advancedMatching,
  disableOnLocalhost,
}: FacebookPixelProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const envDisable =
      typeof process !== 'undefined' && process.env.NEXT_PUBLIC_DISABLE_PIXEL_ON_LOCALHOST === '1';

    const isLocal =
      typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);

    if ((disableOnLocalhost || envDisable) && isLocal) {
      return;
    }

    // Load once
    if (!window.fbq) {
      (function (f: any, b: any, e: string, v: string, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];

        const scriptId = 'facebook-pixel-script';
        if (!b.getElementById(scriptId)) {
          t = b.createElement(e);
          t.async = true;
          t.id = scriptId;
          (t as HTMLScriptElement).src = v;
          s = b.getElementsByTagName(e)[0];
          s?.parentNode?.insertBefore(t, s);
        }
        f.fbq = n;
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

      try {
        if (advancedMatching && Object.keys(advancedMatching).length > 0) {
          window.fbq('init', pixelId, advancedMatching);
        } else {
          window.fbq('init', pixelId);
        }
      } catch { /* ignore */ }

      window.__fbqTrack = (event, params = {}, opts = {}) => {
        try { window.fbq?.('trackSingle', pixelId, event, params, opts); } catch { /* ignore */ }
      };

      // First PageView (no eventID here; use helpers when you need dedupe)
      window.fbq('trackSingle', pixelId, 'PageView');
    } else {
      try { window.fbq('init', pixelId); } catch { /* ignore */ }
    }
  }, [pixelId, advancedMatching, disableOnLocalhost]);

  // PageView on client-side nav
  useEffect(() => {
    if (!window.fbq) return;
    window.fbq('trackSingle', pixelId, 'PageView');
  }, [pixelId, pathname, searchParams]);

  return (
    <>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${encodeURIComponent(pixelId)}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

/* ------------------------- Usage example -------------------------
import FacebookPixel, { trackWithEventId, getFbpFbc } from '@/components/FacebookPixel';

// Somewhere on purchase completion:
const { event_id, fbp, fbc } = trackWithEventId(process.env.NEXT_PUBLIC_FB_PIXEL_ID!, 'Purchase', {
  value: 5000,
  currency: 'NGN',
});
// Then POST to your server CAPI:
await fetch('/api/conversion', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    event_name: 'Purchase',
    event_id,             // dedupe
    fbp, fbc,             // cookies
    event_source_url: window.location.href,
    customer: { email: user.email, phone: user.phone, first_name: user.fn, last_name: user.ln, country: 'NG' },
    value: 5000, currency: 'NGN',
    items: cartItems.map(i => ({ id: i.id, quantity: i.qty, item_price: i.price })),
  }),
});
------------------------------------------------------------------- */
