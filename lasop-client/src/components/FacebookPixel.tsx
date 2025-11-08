// =============================================================
// File: src/components/FacebookPixel.tsx (HARDENED)
// =============================================================
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

type AdvancedMatch = Partial<{
  em: string;   // plain email; Pixel will hash for browser-side AM
  ph: string;   // phone in E.164 if possible
  fn: string;
  ln: string;
  ct: string;
  st: string;
  zp: string;
  country: string;
}>;

interface FacebookPixelProps {
  pixelId: string;
  advancedMatching?: AdvancedMatch;
  /**
   * If true (or when NEXT_PUBLIC_DISABLE_PIXEL_ON_LOCALHOST=1 and on localhost),
   * the pixel won’t load.
   */
  disableOnLocalhost?: boolean;
}

declare global {
  interface Window {
    fbq?: any;
    __fbqTrack?: (event: string, params?: Record<string, any>, opts?: Record<string, any>) => void;
  }
}

export default function FacebookPixel({
  pixelId,
  advancedMatching,
  disableOnLocalhost,
}: FacebookPixelProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const envDisable =
      typeof process !== 'undefined' &&
      process.env.NEXT_PUBLIC_DISABLE_PIXEL_ON_LOCALHOST === '1';

    const isLocal =
      typeof window !== 'undefined' &&
      /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);

    if ((disableOnLocalhost || envDisable) && isLocal) {
      // Soft no-op on localhost
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

      // Init with (optional) Advanced Matching
      try {
        if (advancedMatching && Object.keys(advancedMatching).length > 0) {
          window.fbq('init', pixelId, advancedMatching);
        } else {
          window.fbq('init', pixelId);
        }
      } catch {
        // ignore
      }

      // Optional: small global helper for ad-hoc tracking/tests
      window.__fbqTrack = (event, params = {}, opts = {}) => {
        try {
          // Use trackSingle to avoid cross-pixel noise if multiple pixels exist
          window.fbq?.('trackSingle', pixelId, event, params, opts);
        } catch {
          // ignore
        }
      };

      // First PageView
      window.fbq('trackSingle', pixelId, 'PageView');
    } else {
      // If fbq already exists and we navigated client-side, make sure this pixelId is known.
      try {
        window.fbq('init', pixelId);
      } catch {
        // ignore
      }
    }
  }, [pixelId, advancedMatching, disableOnLocalhost]);

  // Fire PageView on client-side route changes
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
          src={`https://www.facebook.com/tr?id=${encodeURIComponent(
            pixelId
          )}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
