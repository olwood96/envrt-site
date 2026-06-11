"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  pathIsConsentExempt,
  useConsent,
} from "@/components/v3/ConsentContext";
import { EASE_BRAND } from "@/components/sections/v3/_shared";

// Cookie consent banner. v3-styled, bottom-anchored card. Renders only
// when the choice hasn't been made yet. Excluded from DPP landing
// surfaces (collective product + widget pages) so visitors who scanned
// a QR aren't met with a banner.

export function CookieBanner() {
  const { consent, accept, decline } = useConsent();
  const pathname = usePathname();

  // Suppress on DPP landing surfaces.
  if (pathIsConsentExempt(pathname)) return null;

  return (
    <AnimatePresence>
      {consent === "unknown" && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.4, ease: EASE_BRAND }}
          className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-[760px] sm:inset-x-6 sm:bottom-6"
          role="region"
          aria-label="Cookie consent"
        >
          <div className="flex flex-col gap-4 rounded-2xl border border-envrt-brand-black/12 bg-white p-4 shadow-[0_24px_60px_-24px_rgba(14,14,14,0.32),inset_0_0_0_1px_rgba(255,255,255,0.6)] backdrop-blur-xl sm:flex-row sm:items-center sm:gap-6 sm:p-5">
            <div className="flex-1">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine sm:text-[11px]">
                Cookies and analytics
              </p>
              <p className="mt-2 text-sm leading-relaxed text-envrt-brand-black/75 sm:text-[15px]">
                We use Google Analytics to understand how visitors use
                envrt.com. You can decline and the site works exactly the
                same.{" "}
                <Link
                  href="//privacy"
                  className="underline underline-offset-2 hover:text-envrt-brand-ultramarine"
                >
                  Privacy details
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={decline}
                className="rounded-full border border-envrt-brand-black/15 bg-white px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/70 transition-colors duration-200 hover:border-envrt-brand-black/30 hover:text-envrt-brand-black sm:text-[11px]"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={accept}
                className="rounded-full bg-envrt-brand-ultramarine px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_8px_18px_-8px_rgba(62,0,255,0.45)] transition-opacity duration-200 hover:opacity-90 sm:text-[11px]"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
