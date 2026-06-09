"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ButtonV3 } from "./Button";
import { EnvrtLogo } from "./EnvrtLogo";
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
};

type NavTopItem =
  | { kind: "group"; label: string; items: NavGroup["items"] }
  | { kind: "link"; href: string; label: string };

const NAV: NavTopItem[] = [
  {
    kind: "group",
    label: "Product",
    items: [
      {
        href: "/preview/v3/platform",
        label: "Platform",
        description: "Nine capabilities, one platform",
        icon: "supply-chain",
      },
      {
        href: "/preview/v3/lab",
        label: "Lab",
        description: "Inside the calculation engine",
        icon: "lca",
      },
      {
        href: "/preview/v3/free-dpp",
        label: "Free DPP",
        description: "Try ENVRT on one garment",
        icon: "dpp",
      },
    ],
  },
  {
    kind: "group",
    label: "Resources",
    items: [
      {
        href: "/preview/v3/dpp-timeline",
        label: "DPP timeline",
        description: "Regulatory milestones and countdown",
        icon: "compliance",
      },
      {
        href: "/preview/v3/assessment",
        label: "Readiness assessment",
        description: "10-minute DPP readiness quiz",
        icon: "audit",
      },
      {
        href: "/preview/v3/roi",
        label: "ROI calculator",
        description: "Savings vs consultants vs in-house",
        icon: "analytics",
      },
    ],
  },
  { kind: "link", href: "/preview/v3/pricing", label: "Pricing" },
  { kind: "link", href: "/preview/v3/contact", label: "Contact" },
];

const HOVER_OPEN_DELAY = 80;
const HOVER_CLOSE_DELAY = 180;

export function Navbar() {
  const pathname = usePathname() ?? "";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
          {/* Wordmark + cipher */}
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
  group: { label: string; items: NavLeafItem[] };
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
            className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3"
          >
            <DropdownCard items={group.items} pathname={pathname} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DropdownCard({
  items,
  pathname,
}: {
  items: NavLeafItem[];
  pathname: string;
}) {
  return (
    <div className="w-[320px] rounded-2xl border border-envrt-brand-black/12 bg-white p-2 shadow-[0_24px_50px_-22px_rgba(14,14,14,0.18)]">
      <ul className="space-y-0.5">
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
                href="/preview/v3/free-dpp"
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
