"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { GlitchLink } from "./GlitchLink";
import { navLinks, siteConfig } from "@/lib/config";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  /* ── Track scroll position ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Close mobile menu on any scroll / swipe on the page ── */
  const closeMobile = useCallback(() => {
    if (mobileOpen) setMobileOpen(false);
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;

    // Small delay so the open animation isn't interrupted by residual events
    const timer = setTimeout(() => {
      window.addEventListener("scroll", closeMobile, { passive: true });
      window.addEventListener("touchmove", closeMobile, { passive: true });
    }, 150);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", closeMobile);
      window.removeEventListener("touchmove", closeMobile);
    };
  }, [mobileOpen, closeMobile]);

  /* ── Header glass logic ──
     Desktop: glass-nav when scrolled, transparent at top of page.
     Mobile:  same — transparent at top, glass-nav when scrolled.
              When menu is OPEN → opaque (glass-nav-solid) so text is readable. */
  const headerClass = mobileOpen
    ? "glass-nav-solid py-2 sm:py-3"
    : scrolled
      ? "glass-nav py-2 sm:py-3"
      : "bg-transparent py-3 sm:py-5";

  /* ── Suck-back exit: compute offset toward the hamburger button ── */
  const getToggleOffset = () => {
    if (typeof window === "undefined" || !toggleRef.current) return 0;
    const rect = toggleRef.current.getBoundingClientRect();
    return rect.left + rect.width / 2 - window.innerWidth / 2;
  };

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${headerClass}`}
      >
        <Container>
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold tracking-tight text-envrt-charcoal"
            >
              <div className="relative flex h-6 sm:h-8 items-center">
                <picture>
                  <img
                    src="/brand/envrt-logo.png"
                    alt={siteConfig.name}
                    className="h-6 sm:h-8 w-auto"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      const parent = (e.target as HTMLImageElement).parentElement?.parentElement;
                      if (parent) {
                        const fallback = parent.querySelector(".logo-fallback");
                        if (fallback) (fallback as HTMLElement).style.display = "flex";
                      }
                    }}
                  />
                </picture>
                <span className="logo-fallback hidden items-center gap-1.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-envrt-green text-xs font-bold text-white">
                    E
                  </span>
                  <span>{siteConfig.name}</span>
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden items-center gap-7 md:flex">
              {navLinks.map((link) => (
                <GlitchLink key={link.href} href={link.href} label={link.label} />
              ))}
              <div className="flex items-center gap-2.5 ml-1">
                <Button href="https://dashboard.envrt.com" variant="secondary" size="sm">
                  Login
                </Button>
                <Button href="/contact" size="sm">
                  Book a demo
                </Button>
              </div>
            </div>

            {/* Mobile toggle */}
            <button
              ref={toggleRef}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="block h-0.5 w-6 bg-envrt-charcoal"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block h-0.5 w-6 bg-envrt-charcoal"
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="block h-0.5 w-6 bg-envrt-charcoal"
              />
            </button>
          </nav>
        </Container>
      </header>

      {/* ── Mobile dropdown menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            /* Open: slide down smoothly */
            initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scaleY: 1,
              transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
            }}
            /* Exit: suck back toward the hamburger button */
            exit={{
              opacity: 0,
              scale: 0.15,
              x: getToggleOffset(),
              y: -30,
              transition: {
                duration: 0.45,
                ease: [0.6, 0, 0.1, 1],
              },
            }}
            style={{ transformOrigin: "top right" }}
            className="glass-nav-menu fixed inset-x-0 top-[48px] sm:top-[60px] z-40 md:hidden overflow-hidden"
          >
            <Container>
              <div className="flex flex-col gap-1 py-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    /* Staggered entrance from right */
                    initial={{ opacity: 0, x: 24 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: { delay: 0.04 * i, duration: 0.28, ease: [0.4, 0, 0.2, 1] },
                    }}
                    /* Staggered exit: items collapse back in reverse order */
                    exit={{
                      opacity: 0,
                      x: 40,
                      scale: 0.7,
                      transition: {
                        delay: 0.025 * (navLinks.length - i),
                        duration: 0.22,
                        ease: [0.6, 0, 0.1, 1],
                      },
                    }}
                  >
                    <GlitchLink
                      href={link.href}
                      label={link.label}
                      className="block py-3 text-base"
                      onClick={() => setMobileOpen(false)}
                    />
                  </motion.div>
                ))}

                {/* CTA buttons */}
                <motion.div
                  className="flex flex-col gap-2 pt-3"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: { delay: 0.04 * navLinks.length, duration: 0.28 },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.7,
                    transition: { duration: 0.15 },
                  }}
                >
                  <Button href="https://dashboard.envrt.com" variant="secondary" size="sm" className="w-full">
                    Dashboard
                  </Button>
                  <Button href="/contact" size="sm" className="w-full">
                    Book a demo
                  </Button>
                </motion.div>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
