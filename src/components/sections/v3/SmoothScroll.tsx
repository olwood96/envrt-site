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
      // Lerp = linear interpolation factor. Each frame the scroll position
      // moves this fraction closer to the target. Lower = lazier, higher =
      // snappier. 0.1 is what fairlymade.com uses — feels continuous and
      // responsive in a way `duration` never does (duration buffers input
      // for a fixed time before completing).
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
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
