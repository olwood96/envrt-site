"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ButtonV3 } from "./Button";
import { EnvrtLogo } from "./EnvrtLogo";
import { EnvrtMorphLogo } from "./EnvrtMorphLogo";
import {
  AssetIcon,
  type AssetIconType,
} from "@/components/sections/v3/AssetIcon";
import { EASE_BRAND } from "@/components/sections/v3/_shared";

// v3 navbar. Floating pill, centred at the top, four top-level items
// (two dropdowns, two direct links) plus a primary CTA. Dropdowns
// open on hover and close on hover-out or escape. Mobile collapses
// to a hamburger drawer with the same content laid out as a stacked
// list with group headers.

type NavLeafItem = {
  href: string;
  label: string;
  description: string;
  icon: AssetIconType;
};

type NavGroup = {
  label: string;
  items: NavLeafItem[];
  columns?: 1 | 2;
};

type NavTopItem =
  | { kind: "group"; label: string; items: NavGroup["items"]; columns?: 1 | 2 }
  | { kind: "link"; href: string; label: string };

const NAV: NavTopItem[] = [
  {
    kind: "group",
    label: "Product",
    columns: 2,
    items: [
      {
        href: "/platform",
        label: "Platform",
        description: "Nine capabilities, one platform",
        icon: "supply-chain",
      },
      {
        href: "/lab",
        label: "Lab",
        description: "Inside the calculation engine",
        icon: "lca",
      },
      {
        href: "/free-dpp",
        label: "Free DPP",
        description: "Try ENVRT on one garment",
        icon: "dpp",
      },
      {
        href: "/collective",
        label: "The Collective",
        description: "Featured DPPs from brands using ENVRT",
        icon: "eco-score",
      },
    ],
  },
  {
    kind: "group",
    label: "Resources",
    columns: 2,
    items: [
      {
        href: "/insights",
        label: "Insights",
        description: "Guides and articles",
        icon: "chat",
      },
      {
        href: "/dpp-timeline",
        label: "DPP timeline",
        description: "Regulatory milestones and countdown",
        icon: "compliance",
      },
      {
        href: "/faq",
        label: "FAQ",
        description: "Common questions answered",
        icon: "claims",
      },
      {
        href: "/assessment",
        label: "Readiness assessment",
        description: "10-minute DPP readiness quiz",
        icon: "audit",
      },
      {
        href: "/glossary",
        label: "Glossary",
        description: "Plain definitions, A to Z",
        icon: "vault",
      },
      {
        href: "/roi",
        label: "ROI calculator",
        description: "Savings vs consultants vs in-house",
        icon: "analytics",
      },
    ],
  },
  {
    kind: "group",
    label: "Company",
    items: [
      {
        href: "/about",
        label: "About",
        description: "What we believe and why",
        icon: "lca",
      },
      {
        href: "/team",
        label: "Team",
        description: "Founders and advisors",
        icon: "supply-chain",
      },
    ],
  },
  { kind: "link", href: "/pricing", label: "Pricing" },
  { kind: "link", href: "/contact", label: "Contact" },
];

const HOVER_OPEN_DELAY = 80;
const HOVER_CLOSE_DELAY = 180;

export function Navbar() {
  const pathname = usePathname() ?? "";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Mobile-only compact state. When true, the wordmark morphs from
  // ENVRT down to NV and the pill tightens up so it obstructs less
  // of the screen. Triggered by scrolling DOWN; released by
  // scrolling UP or returning near the top of the page.
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const THRESHOLD = 4; // px of movement before flipping direction
    const TOP_GUARD = 100; // always expanded near top of page

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);

      if (y < TOP_GUARD) {
        setCompact(false);
      } else if (y > lastY + THRESHOLD) {
        setCompact(true);
      } else if (y < lastY - THRESHOLD) {
        setCompact(false);
      }
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Force expanded whenever the drawer opens so users see the full
  // wordmark while interacting with the menu.
  useEffect(() => {
    if (mobileOpen) setCompact(false);
  }, [mobileOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center pt-4 sm:pt-6">
        <motion.div
          initial={false}
          animate={{
            // iOS/Instagram-style glass on mobile gets a dual shadow:
            // outer lift plus an inset top highlight that mimics light
            // catching the curve. Desktop keeps the simpler shadow
            // because its 95% white background doesn't need the
            // highlight to read as glass.
            boxShadow: scrolled
              ? "0 18px 40px -22px rgba(14,14,14,0.18), inset 0 1px 0 0 rgba(255,255,255,0.7)"
              : "0 10px 28px -16px rgba(14,14,14,0.10), inset 0 1px 0 0 rgba(255,255,255,0.6)",
          }}
          transition={{ duration: 0.3 }}
          // Mobile-only liquid glass: heavy backdrop blur, saturation
          // boost (the "vibrancy" trick that makes the colours behind
          // pop instead of washing out), low-opacity white fill, and a
          // high-contrast white border. Desktop keeps the more solid
          // 95% white pill because the desktop bar carries nav items
          // that need to read against any background underneath.
          className={`relative flex items-stretch rounded-full border bg-white/55 backdrop-blur-[28px] backdrop-saturate-[180%] transition-colors duration-300 lg:bg-white/95 lg:backdrop-blur lg:backdrop-saturate-100 ${
            scrolled
              ? "border-white/55 lg:border-envrt-brand-black/15"
              : "border-white/45 lg:border-envrt-brand-black/10"
          }`}
        >
          {/* Wordmark — desktop uses the official PNG; mobile uses the
              typography-based morph wordmark so it can shrink ENVRT → NV
              when the bar compacts on scroll-down. */}
          <Link
            href="/"
            className="flex items-center pl-5 pr-4 sm:pl-6 sm:pr-5"
            aria-label="ENVRT"
          >
            <span className="hidden lg:flex">
              <EnvrtLogo size="md" />
            </span>
            <span className="flex lg:hidden">
              <EnvrtMorphLogo compact={compact} />
            </span>
          </Link>

          <Divider />

          {/* Desktop: top-level nav items */}
          <div className="hidden items-center gap-1 px-2 lg:flex">
            {NAV.map((item) =>
              item.kind === "group" ? (
                <GroupTrigger key={item.label} group={item} pathname={pathname} />
              ) : (
                <TopLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={pathname === item.href}
                />
              ),
            )}
          </div>

          <span className="hidden lg:flex">
            <Divider />
          </span>

          {/* Primary CTA */}
          <div className="hidden items-center pl-2 pr-2 lg:flex">
            <ButtonV3
              href="/free-dpp"
              variant="primary"
              size="md"
              className="!rounded-full !px-5 !py-2 !text-xs sm:!text-sm"
            >
              Try ENVRT<span>→</span>
            </ButtonV3>
          </div>

          {/* Mobile hamburger. Bars also shrink slightly when compact
              so the visual weight tracks the smaller pill. */}
          <motion.button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            initial={false}
            animate={{
              width: compact ? 36 : 48,
              height: compact ? 36 : 48,
            }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 18,
              mass: 0.7,
            }}
            className="flex flex-col items-center justify-center gap-1.5 pr-2 lg:hidden"
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
          </motion.button>
        </motion.div>
      </header>

      <MobileDrawer
        open={mobileOpen}
        pathname={pathname}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────

function Divider() {
  return (
    <span
      aria-hidden
      className="my-2 w-px bg-envrt-brand-black/10"
      style={{ height: "calc(100% - 1rem)" }}
    />
  );
}

function TopLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className="relative px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/70 transition-colors duration-200 hover:text-envrt-brand-ultramarine sm:text-[11px]"
    >
      {label}
      {active && (
        <span
          aria-hidden
          className="absolute left-1/2 top-[calc(100%-6px)] h-1 w-1 -translate-x-1/2 rounded-full bg-envrt-brand-ultramarine"
        />
      )}
    </Link>
  );
}

function GroupTrigger({
  group,
  pathname,
}: {
  group: { label: string; items: NavLeafItem[]; columns?: 1 | 2 };
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const activeChild = group.items.some((i) => i.href === pathname);

  const requestOpen = useCallback(() => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    openTimer.current = window.setTimeout(() => setOpen(true), HOVER_OPEN_DELAY);
  }, []);

  const requestClose = useCallback(() => {
    if (openTimer.current) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    closeTimer.current = window.setTimeout(
      () => setOpen(false),
      HOVER_CLOSE_DELAY,
    );
  }, []);

  // Close on escape, click outside, or route change
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div
      ref={rootRef}
      onMouseEnter={requestOpen}
      onMouseLeave={requestClose}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1.5 px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/70 transition-colors duration-200 hover:text-envrt-brand-ultramarine sm:text-[11px]"
      >
        {group.label}
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[8px]"
        >
          ▾
        </motion.span>
        {activeChild && (
          <span
            aria-hidden
            className="absolute left-1/2 top-[calc(100%-6px)] h-1 w-1 -translate-x-1/2 rounded-full bg-envrt-brand-ultramarine"
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: EASE_BRAND }}
            className="absolute left-0 top-full z-50 pt-3"
          >
            <DropdownCard
              items={group.items}
              pathname={pathname}
              columns={group.columns ?? 1}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DropdownCard({
  items,
  pathname,
  columns = 1,
}: {
  items: NavLeafItem[];
  pathname: string;
  columns?: 1 | 2;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/60 bg-white/55 p-2 shadow-[0_24px_50px_-22px_rgba(14,14,14,0.22),inset_0_0_0_1px_rgba(255,255,255,0.55)] backdrop-blur-2xl backdrop-saturate-150 ${
        columns === 2 ? "w-[580px]" : "w-[320px]"
      }`}
    >
      <ul
        className={
          columns === 2 ? "grid grid-cols-2 gap-x-1 gap-y-0.5" : "space-y-0.5"
        }
      >
        {items.map((item) => (
          <li key={item.href}>
            <DropdownItem item={item} active={pathname === item.href} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function DropdownItem({
  item,
  active,
}: {
  item: NavLeafItem;
  active: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={`group flex items-start gap-3 rounded-xl px-3 py-3 transition-colors duration-150 ${
        active
          ? "bg-envrt-brand-ultramarine/8"
          : "hover:bg-envrt-brand-black/4"
      }`}
    >
      <span
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-150 ${
          active
            ? "bg-envrt-brand-ultramarine/15 text-envrt-brand-ultramarine"
            : "bg-envrt-brand-ultramarine/8 text-envrt-brand-ultramarine group-hover:bg-envrt-brand-ultramarine/12"
        }`}
      >
        <AssetIcon type={item.icon} size={18} />
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <p
          className={`font-display text-sm font-semibold leading-tight tracking-[-0.01em] ${
            active
              ? "text-envrt-brand-ultramarine"
              : "text-envrt-brand-black group-hover:text-envrt-brand-ultramarine"
          }`}
        >
          {item.label}
        </p>
        <p className="mt-0.5 text-xs leading-snug text-envrt-brand-black/60">
          {item.description}
        </p>
      </div>
    </Link>
  );
}

// ─── Mobile drawer ────────────────────────────────────────────────────────

function MobileDrawer({
  open,
  pathname,
  onClose,
}: {
  open: boolean;
  pathname: string;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.3, ease: EASE_BRAND },
          }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
          className="fixed inset-x-4 top-[78px] z-40 max-h-[calc(100vh-96px)] overflow-y-auto rounded-3xl border border-envrt-brand-black/12 bg-white/97 p-4 shadow-[0_24px_60px_-30px_rgba(14,14,14,0.25)] backdrop-blur sm:inset-x-6 sm:p-5 lg:hidden"
        >
          <div className="space-y-5">
            {NAV.map((item) =>
              item.kind === "group" ? (
                <div key={item.label}>
                  <p className="px-3 pb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine">
                    {item.label}
                  </p>
                  <ul className="space-y-0.5">
                    {item.items.map((leaf) => (
                      <li key={leaf.href}>
                        <Link
                          href={leaf.href}
                          onClick={onClose}
                          className={`flex items-start gap-3 rounded-xl px-3 py-3 ${
                            pathname === leaf.href
                              ? "bg-envrt-brand-ultramarine/8"
                              : "hover:bg-envrt-brand-black/4"
                          }`}
                        >
                          <span
                            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
                              pathname === leaf.href
                                ? "bg-envrt-brand-ultramarine/15 text-envrt-brand-ultramarine"
                                : "bg-envrt-brand-ultramarine/8 text-envrt-brand-ultramarine"
                            }`}
                          >
                            <AssetIcon type={leaf.icon} size={18} />
                          </span>
                          <div className="min-w-0 flex-1 pt-0.5">
                            <p
                              className={`font-display text-sm font-semibold leading-tight ${
                                pathname === leaf.href
                                  ? "text-envrt-brand-ultramarine"
                                  : "text-envrt-brand-black"
                              }`}
                            >
                              {leaf.label}
                            </p>
                            <p className="mt-0.5 text-xs leading-snug text-envrt-brand-black/60">
                              {leaf.description}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] transition-colors duration-200 ${
                    pathname === item.href
                      ? "bg-envrt-brand-ultramarine/8 text-envrt-brand-ultramarine"
                      : "text-envrt-brand-black/75 hover:bg-envrt-brand-black/5 hover:text-envrt-brand-ultramarine"
                  }`}
                >
                  {item.label}
                  <span aria-hidden className="text-envrt-brand-black/30">
                    →
                  </span>
                </Link>
              ),
            )}

            <div className="border-t border-envrt-brand-black/8 pt-4">
              <ButtonV3
                href="/free-dpp"
                variant="primary"
                className="w-full !rounded-2xl"
              >
                Try ENVRT<span>→</span>
              </ButtonV3>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
