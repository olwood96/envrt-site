"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

// Buttery scroll layer. Tuned for "premium feel" rather than the
// previous default config:
//
// - lerp 0.08: interpolation factor between current and target. 8%
//   per frame means a wheel tick takes ~6 frames (100ms) to fully
//   resolve. Smooth enough to mask sub-60fps jitter without enough
//   lag to feel unresponsive.
// - wheelMultiplier 0.9: slight weight on wheel input. Single ticks
//   travel ~10% less than native — gives the page a heavier, more
//   intentional feel without throttling fast scrolls.
// - syncTouch false: native iOS scroll is excellent. Don't override
//   it. Lenis only runs on wheel + keyboard events.
// - touchMultiplier 1.5: kept for Android Chrome where the touch
//   default can feel sticky.
// - smoothWheel true: the main reason this file exists.
//
// Honours prefers-reduced-motion (no smoothing, fully native).
//
// Cost: ~15KB minified, one rAF loop. Compared to the JS-on-every-
// page baseline, this is a small premium for a noticeable polish
// in feel. If we ever ship a measurable LCP regression we can tune
// down or remove entirely.

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
      syncTouch: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
