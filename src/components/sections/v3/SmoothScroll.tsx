"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

// Lenis-driven smooth scrolling. Drives the scroll position with a lerp loop
// so wheel and trackpad input feels buttery. Framer Motion's useScroll hooks
// pick up the smoothed position natively — no extra wiring needed.
//
// On touch devices (iOS / Android) we leave native scrolling alone: it's
// already high-frame-rate and trying to override it usually makes things
// worse, not better.

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Respect reduced-motion preference — skip Lenis entirely.
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      // Total time (sec) for the scroll lerp to settle. 1.2s = relaxed.
      duration: 1.2,
      // Apple-style ease-out — fast at start, soft at end.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Wheel + trackpad get the smoothing. Touch keeps native.
      smoothWheel: true,
      // How aggressive the wheel input feels. 1 = native pace, lower = lazier.
      wheelMultiplier: 1,
      // Lerp factor for touch — but only if smoothTouch is on, which it isn't.
      touchMultiplier: 1.5,
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
