"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { GlitchLink } from "./GlitchLink";
import { navLinks, siteConfig } from "@/lib/config";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Also apply glass effect when mobile menu is open (even at top of page)
  const showGlass = scrolled || mobileOpen;

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          showGlass ? "glass-nav py-2 sm:py-3" : "bg-transparent py-3 sm:py-5"
        }`}
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

      {/* Mobile menu — same glassmorphism */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="glass-nav-menu fixed inset-x-0 top-[48px] sm:top-[60px] z-40 md:hidden"
          >
            <Container>
              <div className="flex flex-col gap-1 py-4">
                {navLinks.map((link) => (
                  <GlitchLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    className="block py-3 text-base"
                    onClick={() => setMobileOpen(false)}
                  />
                ))}
                <div className="flex flex-col gap-2 pt-3">
                  <Button href="https://dashboard.envrt.com" variant="secondary" size="sm" className="w-full">
                    Dashboard
                  </Button>
                  <Button href="/contact" size="sm" className="w-full">
                    Book a demo
                  </Button>
                </div>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
