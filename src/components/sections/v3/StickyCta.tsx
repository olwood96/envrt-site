"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const DISMISS_KEY = "envrt-v3-sticky-cta-dismissed";

export function StickyCta() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Respect session dismissal
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(DISMISS_KEY) === "1") {
      setDismissed(true);
      return;
    }

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const scrolled = window.scrollY + window.innerHeight;
        const total = doc.scrollHeight;
        const pct = scrolled / total;
        setVisible(pct > 0.55 && pct < 0.97);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (dismissed) return null;

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-50 transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <div className="mx-auto max-w-[1320px] px-3 pb-3 sm:px-6 sm:pb-5 lg:px-12">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-envrt-brand-black/10 bg-envrt-brand-black p-3 shadow-[0_18px_40px_-12px_rgba(14,14,14,0.45)] sm:gap-4 sm:p-4">
          {/* Message */}
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <span
              aria-hidden
              className="hidden h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-envrt-brand-golden/20 text-envrt-brand-golden sm:inline-flex"
            >
              ⚡
            </span>
            <p className="min-w-0 truncate text-xs leading-tight text-white sm:text-sm">
              <span className="font-semibold">Get a free DPP</span>
              <span className="ml-2 hidden text-white/70 sm:inline">
                · One garment, regulation-ready, within a day.
              </span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
            {/* Golden button per brand pairing "Golden + Black" */}
            <Link
              href="/free-dpp"
              className="inline-flex items-center gap-1.5 rounded-xl bg-envrt-brand-golden px-3 py-2 text-xs font-semibold text-envrt-brand-black transition-colors duration-200 hover:bg-envrt-brand-golden/85 sm:px-4 sm:py-2.5 sm:text-sm"
              data-cta="sticky-v3-free-dpp"
            >
              Start
              <span aria-hidden>→</span>
            </Link>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => {
                sessionStorage.setItem(DISMISS_KEY, "1");
                setDismissed(true);
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white/55 transition-colors duration-200 hover:bg-white/10 hover:text-white"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3L13 13M13 3L3 13" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
