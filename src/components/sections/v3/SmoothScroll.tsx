"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

// Light-touch scroll smoothing. Iterations:
// - lerp 0.1, mult 1.0  → "laggy" (too much smoothing)
// - native scroll       → "jittery" (frame drops on pinned sections)
// - lerp 0.08, mult 0.9 → "heavy and not smooth" (dampened input,
//                         smoothing amplifying jitter)
//
// Current tuning gets out of the way:
// - lerp 0.12 — short smoothing window (~3 frames to resolve). Less
//   "interpolation jitter" on heavy scroll-pinned sections than
//   the longer 6-frame window did.
// - wheelMultiplier 1.0 — no input dampening. One wheel tick moves
//   the page exactly as much as native would. Feels responsive.
// - syncTouch false — native iOS scroll wins.
// - smoothWheel true — Lenis only smooths wheel + keyboard, leaves
//   touch alone.
//
// The fall-through fix for the underlying "feels jittery" complaint
// is the GPU hint on .scroll-pinned (see globals.css) which lets
// framer-motion's transforms composite on the GPU instead of the
// main thread during the Anatomy / Polaroid / ScrollTour scrubs.

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    // Don't run Lenis on mobile. Mobile browsers already have great
    // native momentum + rubber-band scroll, and Lenis's rAF loop
    // calls window.scrollTo() every frame, which collides with the
    // native scroll mechanism on iOS Safari. The sub-frame collision
    // manifests as the "mini up-and-down jitter" visible on the
    // heaviest scroll-pinned sections (Polaroid, ScrollTour) where
    // any wobble in scroll position gets amplified by their
    // useScroll-driven transforms.
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    if (isMobile) return;

    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 1,
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
