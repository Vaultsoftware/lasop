// REPLACE FILE: src/components/ScrollToTop/ScrollToTop.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const GAP = 12;   // space between chat bubble and scroll button
const SIZE = 48;  // scroll button size

type Pos = { bottom: number; left: number; visible: boolean };

export default function ScrollToTop(): React.ReactElement {
  const [pos, setPos] = useState<Pos>({ bottom: 96, left: 96, visible: false });
  const moRef = useRef<MutationObserver | null>(null);

  const prefersReducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const findTawkLauncher = useCallback((): DOMRect | null => {
    if (typeof document === "undefined") return null;
    // Tawk injects multiple iframes; the launcher is the smallest visible one.
    const frames = Array.from(document.querySelectorAll<HTMLIFrameElement>('iframe[src*="tawk.to"]'));
    const visible = frames.filter(f => {
      const r = f.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    if (visible.length === 0) return null;
    visible.sort((a, b) => {
      const ra = a.getBoundingClientRect(); const rb = b.getBoundingClientRect();
      return ra.width * ra.height - rb.width * rb.height;
    });
    return visible[0].getBoundingClientRect();
  }, []);

  const placeButton = useCallback(() => {
    const r = findTawkLauncher();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // If no launcher yet, keep a safe default (not overlapping typical bottom-right bubble)
    if (!r) {
      const right = 96;
      const bottom = 96;
      setPos({ bottom, left: vw - right - SIZE, visible: window.scrollY > 300 });
      return;
    }

    // Compute center-aligned left so button is centered over bubble
    const left = Math.min(
      Math.max(r.left + (r.width - SIZE) / 2, 8),          // keep inside left edge
      vw - SIZE - 8                                       // keep inside right edge
    );

    // Prefer placing directly ABOVE the bubble
    const distBottom = vh - r.bottom;                     // px from bubble to bottom edge
    const spaceAbove = r.top;                             // space to top edge
    const need = SIZE + GAP;

    let bottom: number;
    if (spaceAbove >= need + 8) {
      // place above: bubble bottom distance + bubble height + gap
      bottom = distBottom + r.height + GAP;
    } else {
      // fallback: place directly BELOW bubble (if bubble near top)
      // below = distance to bottom minus (button size + gap)
      bottom = Math.max(distBottom - (SIZE + GAP), 8);
    }

    // Clamp inside viewport
    bottom = Math.min(Math.max(bottom, 8), vh - SIZE - 8);

    setPos({ bottom, left, visible: window.scrollY > 300 });
  }, [findTawkLauncher]);

  const onScroll = useCallback(() => {
    requestAnimationFrame(() => setPos(p => ({ ...p, visible: window.scrollY > 300 })));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initial placement
    placeButton();
    onScroll();

    // Resize + scroll handlers
    window.addEventListener("resize", placeButton);
    window.addEventListener("scroll", onScroll, { passive: true });

    // Observe DOM mutations (Tawk injects late or repositions)
    moRef.current = new MutationObserver(placeButton);
    moRef.current.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("resize", placeButton);
      window.removeEventListener("scroll", onScroll);
      moRef.current?.disconnect();
    };
  }, [placeButton, onScroll]);

  const handleClick = useCallback(() => {
    try {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    } catch {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [prefersReducedMotion]);

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      title="Back to top"
      onClick={handleClick}
      style={{
        position: "fixed",
        bottom: `${pos.bottom}px`,
        left: `${pos.left}px`,
        width: `${SIZE}px`,
        height: `${SIZE}px`,
        borderRadius: "9999px",
        border: "none",
        display: pos.visible ? "grid" : "none",
        placeItems: "center",
        cursor: "pointer",
        boxShadow: "0 10px 15px rgba(0,0,0,.15)",
        background: "white",
        color: "black",
        zIndex: 50, // below Tawk overlay but above content
      }}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
        <path d="M6.7 14.7a1 1 0 0 1-1.4-1.4l6-6a1 1 0 0 1 1.4 0l6 6a1 1 0 1 1-1.4 1.4L12 9.41l-5.3 5.3z" />
      </svg>
      <style jsx>{`
        button:focus-visible {
          outline: 2px solid black; /* why: visible focus without globals */
          outline-offset: 2px;
        }
      `}</style>
    </button>
  );
}
