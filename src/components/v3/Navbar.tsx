"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ButtonV3 } from "./Button";
import { EnvrtLogo } from "./EnvrtLogo";

// v3 navbar. Floating pill centred at the top with three regions:
// wordmark, mono-caps nav links and the primary CTA. Sliding ultramarine
// pill follows the hovered link. Active page is marked with a small
// ultramarine dot below the link label. A quiet ENVRT/NAV construction
// mark sits in the top-left page corner outside the pill, mirroring the
// section-corner pattern used across the rest of v3.

type NavLink = {
  href: string;
  label: string;
};

const LINKS: NavLink[] = [
  { href: "/preview/v3/platform", label: "Platform" },
  { href: "/preview/v3/pricing", label: "Pricing" },
  { href: "/preview/v3/free-dpp", label: "Free DPP" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sliding pill state, desktop only
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [pillRect, setPillRect] = useState({ left: 0, width: 0 });
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const linkRowRef = useRef<HTMLDivElement>(null);

  const updatePill = useCallback((index: number) => {
    const el = linkRefs.current[index];
    const row = linkRowRef.current;
    if (!el || !row) return;
    const rowRect = row.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setPillRect({
      left: elRect.left - rowRect.left,
      width: elRect.width,
    });
  }, []);

  useEffect(() => {
    if (hoveredIndex !== null) updatePill(hoveredIndex);
  }, [hoveredIndex, updatePill]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Corner construction mark, page-level fingerprint */}
      <span
        aria-hidden
        className="pointer-events-none fixed left-4 top-4 z-40 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/25 sm:left-6 sm:top-6"
      >
        ENVRT/NAV
      </span>

      <header className="fixed inset-x-0 top-0 z-50 flex justify-center pt-4 sm:pt-6">
        <motion.div
          initial={false}
          animate={{
            boxShadow: scrolled
              ? "0 18px 40px -22px rgba(14,14,14,0.18)"
              : "0 8px 24px -18px rgba(14,14,14,0.06)",
          }}
          transition={{ duration: 0.3 }}
          className={`relative flex items-stretch rounded-full border bg-white/95 backdrop-blur transition-colors duration-300 ${
            scrolled
              ? "border-envrt-brand-black/15"
              : "border-envrt-brand-black/10"
          }`}
        >
          {/* Region 1: wordmark + cipher */}
          <Link
            href="/preview/v3"
            className="flex items-center gap-2.5 pl-5 pr-4 sm:pl-6 sm:pr-5"
            aria-label="ENVRT v3"
          >
            <span
              aria-hidden
              className="font-mono text-sm text-envrt-brand-ultramarine"
            >
              ▽
            </span>
            <EnvrtLogo size="sm" />
          </Link>

          {/* Region divider */}
          <Divider />

          {/* Region 2: nav links (desktop) */}
          <div
            ref={linkRowRef}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative hidden items-center px-2 lg:flex"
          >
            <motion.span
              aria-hidden
              className="pointer-events-none absolute top-1/2 h-9 -translate-y-1/2 rounded-full bg-envrt-brand-ultramarine/8"
              initial={false}
              animate={{
                left: pillRect.left,
                width: pillRect.width,
                opacity: hoveredIndex !== null ? 1 : 0,
              }}
              transition={{
                left: { type: "spring", stiffness: 400, damping: 35 },
                width: { type: "spring", stiffness: 400, damping: 35 },
                opacity: { duration: 0.18 },
              }}
            />
            {LINKS.map((link, i) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  ref={(el) => {
                    linkRefs.current[i] = el;
                  }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  className="relative px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/70 transition-colors duration-200 hover:text-envrt-brand-ultramarine sm:text-[11px]"
                >
                  {link.label}
                  {isActive && (
                    <span
                      aria-hidden
                      className="absolute left-1/2 top-[calc(100%-6px)] h-1 w-1 -translate-x-1/2 rounded-full bg-envrt-brand-ultramarine"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Region divider (desktop only) */}
          <span className="hidden lg:flex">
            <Divider />
          </span>

          {/* Region 3: primary CTA (desktop) */}
          <div className="hidden items-center pl-2 pr-2 lg:flex">
            <ButtonV3
              href="/preview/v3/free-dpp"
              variant="primary"
              size="md"
              className="!rounded-full !px-5 !py-2 !text-xs sm:!text-sm"
            >
              Try ENVRT<span>→</span>
            </ButtonV3>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-12 w-12 flex-col items-center justify-center gap-1.5 pr-2 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="block h-0.5 w-5 bg-envrt-brand-black"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="block h-0.5 w-5 bg-envrt-brand-black"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="block h-0.5 w-5 bg-envrt-brand-black"
            />
          </button>
        </motion.div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
            }}
            exit={{
              opacity: 0,
              y: -8,
              transition: { duration: 0.2 },
            }}
            className="fixed inset-x-4 top-[78px] z-40 rounded-3xl border border-envrt-brand-black/12 bg-white/97 p-5 shadow-[0_24px_60px_-30px_rgba(14,14,14,0.25)] backdrop-blur sm:inset-x-6 sm:p-6 lg:hidden"
          >
            <ul className="space-y-1">
              {LINKS.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: { delay: 0.04 * i, duration: 0.24 },
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] transition-colors duration-200 ${
                        isActive
                          ? "bg-envrt-brand-ultramarine/8 text-envrt-brand-ultramarine"
                          : "text-envrt-brand-black/75 hover:bg-envrt-brand-black/5 hover:text-envrt-brand-ultramarine"
                      }`}
                    >
                      {link.label}
                      <span aria-hidden className="text-envrt-brand-black/30">
                        →
                      </span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
            <div className="mt-4 border-t border-envrt-brand-black/8 pt-4">
              <ButtonV3
                href="/preview/v3/free-dpp"
                variant="primary"
                className="w-full !rounded-2xl"
              >
                Try ENVRT<span>→</span>
              </ButtonV3>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Thin hairline between pill regions
function Divider() {
  return (
    <span
      aria-hidden
      className="my-2 w-px bg-envrt-brand-black/10"
      style={{ height: "calc(100% - 1rem)" }}
    />
  );
}
