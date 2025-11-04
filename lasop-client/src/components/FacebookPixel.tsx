// =============================================================
// File: src/components/FacebookPixel.tsx (FINAL - TypeScript Fixed)
// =============================================================
'use client';

import { useEffect } from 'react';

interface FacebookPixelProps {
  pixelId: string;
}

/**
 * Loads the Meta (Facebook) Pixel globally on the client.
 * Safe for Next.js App Router and works on all pages.
 */
export default function FacebookPixel({ pixelId }: FacebookPixelProps) {
  useEffect(() => {
    if (typeof window === 'undefined' || (window as any).fbq) return;

    (function (f: Window, d: Document, e: string, src: string) {
      const n: any = function (...args: any[]) {
        n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
      };
      if (!(f as any).fbq) {
        (f as any).fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];

        // ✅ Explicitly create a <script> element
        const t = d.createElement(e) as HTMLScriptElement;
        t.async = true;
        t.src = src;

        const s = d.getElementsByTagName(e)[0];
        s?.parentNode?.insertBefore(t, s);
      }
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    (window as any).fbq('init', pixelId);
    (window as any).fbq('track', 'PageView');
  }, [pixelId]);

  return (
    <>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
