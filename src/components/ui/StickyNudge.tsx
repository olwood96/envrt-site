"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

/**
 * Sticky bottom-right CTA that appears after scrolling past the hero.
 * Shows assessment CTA by default, switches to ROI CTA (teal variant)
 * when the pricing-preview section enters view.
 *
 * Features: slide-in from right, pulsing glow, icon + micro-stat,
 * teal bg variant for ROI mode, progress hint.
 * Rendered via createPortal into document.body to escape parent
 * stacking contexts and stay above HowItWorks portals.
 */

interface NudgeConfig {
  label: string;
  href: string;
  stat: string;
  hint: string;
  variant: "light" | "teal";
  icon: "clipboard" | "chart";
}

const ASSESSMENT_NUDGE: NudgeConfig = {
  label: "Test your DPP readiness",
  href: "/assessment",
  stat: "90% of brands aren't ready",
  hint: "2 min quiz",
  variant: "light",
  icon: "clipboard",
};

const ROI_NUDGE: NudgeConfig = {
  label: "What could you save with ENVRT?",
  href: "/roi",
  stat: "Save up to 10x vs consultants",
  hint: "Takes 30 seconds",
  variant: "teal",
  icon: "chart",
};

function NudgeIcon({ type, className }: { type: "clipboard" | "chart"; className?: string }) {
  if (type === "clipboard") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" />
        <path d="M9 14l2 2 4-4" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10" />
      <path d="M12 20V4" />
      <path d="M6 20v-6" />
    </svg>
  );
}

export function StickyNudge() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [nudge, setNudge] = useState<NudgeConfig>(ASSESSMENT_NUDGE);
  const heroRef = useRef<Element | null>(null);
  const pricingRef = useRef<Element | null>(null);

  useEffect(() => {
    heroRef.current = document.querySelector("section:first-of-type");
    pricingRef.current = document.getElementById("pricing-preview");

    const handleScroll = () => {
      if (dismissed) return;

      const scrollY = window.scrollY;
      const heroBottom = heroRef.current
        ? heroRef.current.getBoundingClientRect().bottom + scrollY
        : 600;

      setVisible(scrollY > heroBottom);

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

  const isTeal = nudge.variant === "teal";

  return createPortal(
    <div
      className={`fixed bottom-6 right-6 z-[10001] flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-lg transition-all duration-500 ${
        isTeal
          ? "border-envrt-teal/30 bg-envrt-teal text-white shadow-envrt-teal/20"
          : "border-envrt-teal/20 bg-white text-envrt-charcoal shadow-envrt-charcoal/10"
      }`}
      style={{
        animation: "nudge-slide-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      {/* Pulsing glow */}
      <div
        className={`pointer-events-none absolute inset-0 rounded-2xl ${
          isTeal ? "shadow-envrt-teal/30" : "shadow-envrt-teal/15"
        }`}
        style={{ animation: "nudge-pulse 3s ease-in-out infinite" }}
      />

      {/* Icon */}
      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${
        isTeal ? "bg-white/15" : "bg-envrt-teal/[0.07]"
      }`}>
        <NudgeIcon
          type={nudge.icon}
          className={`h-4 w-4 ${isTeal ? "text-white" : "text-envrt-teal"}`}
        />
      </div>

      {/* Content */}
      <Link href={nudge.href} className="flex flex-col gap-0.5">
        <span className={`text-xs font-semibold ${isTeal ? "text-white/70" : "text-envrt-teal"}`}>
          {nudge.stat}
        </span>
        <span className={`text-sm font-medium ${isTeal ? "text-white" : "text-envrt-charcoal"}`}>
          {nudge.label}
          <span className={`ml-1.5 ${isTeal ? "text-white/80" : "text-envrt-teal"}`}>→</span>
        </span>
        <span className={`text-[11px] ${isTeal ? "text-white/70" : "text-envrt-muted/60"}`}>
          {nudge.hint}
        </span>
      </Link>

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        className={`ml-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
          isTeal
            ? "text-white/40 hover:bg-white/10 hover:text-white/70"
            : "text-envrt-muted/40 hover:bg-envrt-charcoal/5 hover:text-envrt-muted"
        }`}
        aria-label="Dismiss"
      >
        <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M1 1l8 8M9 1l-8 8" />
        </svg>
      </button>

      <style jsx>{`
        @keyframes nudge-slide-in {
          from {
            opacity: 0;
            transform: translateX(120%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes nudge-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(45, 212, 168, 0);
          }
          50% {
            box-shadow: 0 0 20px 4px rgba(45, 212, 168, 0.15);
          }
        }
      `}</style>
    </div>,
    document.body
  );
}
