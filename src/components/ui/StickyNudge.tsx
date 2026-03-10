"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/**
 * Sticky bottom-right CTA that appears after scrolling past the hero.
 * Shows assessment CTA by default, switches to ROI CTA when the
 * pricing-preview section enters view.
 */

interface NudgeConfig {
  label: string;
  href: string;
}

const ASSESSMENT_NUDGE: NudgeConfig = {
  label: "Test your DPP readiness",
  href: "/assessment",
};

const ROI_NUDGE: NudgeConfig = {
  label: "What could you save with ENVRT?",
  href: "/roi",
};

export function StickyNudge() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [nudge, setNudge] = useState<NudgeConfig>(ASSESSMENT_NUDGE);
  const heroRef = useRef<Element | null>(null);
  const pricingRef = useRef<Element | null>(null);

  useEffect(() => {
    // Find sentinel elements after mount
    heroRef.current = document.querySelector("section:first-of-type");
    pricingRef.current = document.getElementById("pricing-preview");

    const handleScroll = () => {
      if (dismissed) return;

      // Show after scrolling past hero (roughly 600px)
      const scrollY = window.scrollY;
      const heroBottom = heroRef.current
        ? heroRef.current.getBoundingClientRect().bottom + scrollY
        : 600;

      setVisible(scrollY > heroBottom);

      // Switch to ROI nudge when pricing section is approaching
      if (pricingRef.current) {
        const pricingTop = pricingRef.current.getBoundingClientRect().top;
        setNudge(pricingTop < window.innerHeight * 1.5 ? ROI_NUDGE : ASSESSMENT_NUDGE);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed]);

  if (dismissed || !visible) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-envrt-teal/20 bg-white px-5 py-3 shadow-lg shadow-envrt-charcoal/10 transition-all duration-300 animate-in slide-in-from-bottom-4"
      style={{
        animation: "nudge-enter 0.4s ease-out",
      }}
    >
      <Link
        href={nudge.href}
        className="text-sm font-medium text-envrt-charcoal transition-colors hover:text-envrt-teal"
      >
        {nudge.label}
        <span className="ml-1.5 text-envrt-teal">→</span>
      </Link>
      <button
        onClick={() => setDismissed(true)}
        className="ml-1 flex h-5 w-5 items-center justify-center rounded-full text-envrt-muted/50 transition-colors hover:bg-envrt-charcoal/5 hover:text-envrt-muted"
        aria-label="Dismiss"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M1 1l8 8M9 1l-8 8" />
        </svg>
      </button>

      <style jsx>{`
        @keyframes nudge-enter {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
