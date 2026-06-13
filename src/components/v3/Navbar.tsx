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
  // `scrolled` state removed in the navbar-jitter investigation —
  // see the static boxShadow comment on the motion.div below for the
  // reasoning. The Y-threshold-driven shadow toggle was repainting on
  // every scrollY change near 24px and was the last main-thread cost
  // the navbar was paying during scroll.
  const [mobileOpen, setMobileOpen] = useState(false);
  // Mobile-only compact state. When true, the wordmark morphs from
  // ENVRT down to NV and the pill tightens up so it obstructs less
  // of the screen. Triggered by scrolling DOWN; released by
  // scrolling UP or returning near the top of the page.
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    // Compact-pill behaviour is mobile-only by design. On desktop the
    // bar carries nav items and a CTA — it must NOT scale. Bailing
    // out here means:
    //   - no scroll listener attached on desktop at all
    //   - compact stays at its initial false value
    //   - the motion.div's scale animate prop reads (false ? 0.82 : 1)
    //     so it stays at 1 — pill never shrinks on desktop
    // Also resets compact back to false if the viewport crosses from
    // mobile to desktop mid-session.
    const mobileQuery = window.matchMedia("(max-width: 1023px)");

    let lastY = window.scrollY;
    let lastUpdateAt = 0;
    let timeoutId: number | null = null;
    const THRESHOLD = 10; // px of movement before flipping direction
    const TOP_GUARD = 100; // always expanded near top of page
    // Throttle to 10Hz. The compact toggle doesn't need to react at
    // 60Hz — visually you cannot perceive a delay shorter than ~80ms,
    // and dropping the scroll listener from per-frame to per-100ms
    // means the listener no longer competes with the scroll-pinned
    // sections (Polaroid, ScrollTour) for the same frame budget.
    // The "mini up-and-down jitter" reported on those sections came
    // from the listener firing on every frame in lockstep with the
    // sections' own useScroll/useTransform chains.
    const THROTTLE_MS = 100;

    const update = () => {
      timeoutId = null;
      lastUpdateAt = performance.now();
      const y = window.scrollY;

      if (y < TOP_GUARD) {
        setCompact(false);
      } else if (y > lastY + THRESHOLD) {
        setCompact(true);
      } else if (y < lastY - THRESHOLD) {
        setCompact(false);
      }
      lastY = y;
    };

    const onScroll = () => {
      if (timeoutId !== null) return;
      const now = performance.now();
      const elapsed = now - lastUpdateAt;
      const wait = Math.max(0, THROTTLE_MS - elapsed);
      timeoutId = window.setTimeout(update, wait);
    };

    const attach = () => {
      if (!mobileQuery.matches) {
        setCompact(false);
        return;
      }
      lastY = window.scrollY;
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
    };

    const detach = () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
      window.removeEventListener("scroll", onScroll);
    };

    attach();

    // Resize handler: if user rotates / resizes across the breakpoint,
    // attach or detach the listener accordingly.
    const onBreakpointChange = () => {
      detach();
      attach();
    };
    mobileQuery.addEventListener("change", onBreakpointChange);

    return () => {
      detach();
      mobileQuery.removeEventListener("change", onBreakpointChange);
    };
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
            // Compact pill shrinks via transform scale only. Pure GPU
            // composite, zero layout reflow.
            scale: compact ? 0.82 : 1,
          }}
          transition={{
            scale: { type: "spring", stiffness: 280, damping: 18, mass: 0.7 },
          }}
          className="relative flex items-stretch rounded-full bg-white/55 backdrop-blur-[28px] backdrop-saturate-[180%] transition-colors duration-300 lg:border lg:bg-white/95 lg:backdrop-blur lg:backdrop-saturate-100 lg:border-envrt-brand-black/15"
          style={{
            // Force the pill onto its own GPU compositor layer.
            transformOrigin: "center center",
            willChange: "transform",
            // Static iOS "ring of light" inset highlights — moved out
            // of the framer-motion animate prop so they don't repaint
            // every frame when `scrolled` toggles around the 24px
            // threshold. Box-shadow changes (especially compound ones
            // with 5 stacked shadows) are expensive repaints and were
            // the last main-thread cost the navbar was paying during
            // scroll. Visual difference between the two old states was
            // marginal anyway.
            boxShadow:
              "0 14px 32px -18px rgba(14,14,14,0.14), inset 0 1px 0 0 rgba(255,255,255,0.8), inset 0 -1px 0 0 rgba(255,255,255,0.13), inset 1px 0 0 0 rgba(255,255,255,0.32), inset -1px 0 0 0 rgba(255,255,255,0.32)",
          }}
        >
          {/* Refraction overlay — mobile only. A diagonal linear
              gradient that brightens the top-left and softens toward
              the bottom-right, mimicking the way light bends through a
              curved glass surface. Sits below all content (first
              child, rendered behind) with pointer-events none so it
              doesn't catch clicks. Combined with the ring-of-light
              inset highlights, this gives the iOS Liquid Glass feel
              without the heavy SVG displacement that distorts
              content. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full lg:hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.02) 60%, rgba(255,255,255,0.10) 100%)",
            }}
          />

          {/* Wordmark — desktop uses the official PNG; mobile uses the
              NV-morph version. When the mobile pill is in compact
              state, tapping it opens the menu instead of navigating
              home: the user already shrunk the bar by scrolling, so
              they're presumably looking for navigation, not the
              homepage. Click intercept via onClick preserves Link
              semantics for the not-compact and desktop cases. */}
          <Link
            href="/"
            onClick={(e) => {
              if (compact) {
                e.preventDefault();
                setMobileOpen(true);
              }
            }}
            className="flex items-center pl-5 pr-4 sm:pl-6 sm:pr-5"
            aria-label={compact ? "Open menu" : "ENVRT"}
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
          {/* Hamburger no longer animates its own width/height. The
              whole pill scales via transform on compact, which scales
              the hamburger with it — pure GPU, zero reflow. */}
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
      // Liquid glass: heavier than the pill's recipe because the
      // dropdown is smaller — at the same blur radius (28px) it
      // *felt* more transparent than the mobile drawer due to the
      // smaller surface area. Bumped to blur-[36px] + bg-white/62
      // so it reads as the same material as the drawer despite
      // size difference.
      className={`relative rounded-2xl bg-white/62 p-2 backdrop-blur-[36px] backdrop-saturate-[180%] ${
        columns === 2 ? "w-[580px]" : "w-[320px]"
      }`}
      style={{
        boxShadow:
          "0 24px 50px -22px rgba(14,14,14,0.22), inset 0 1px 0 0 rgba(255,255,255,0.85), inset 0 -1px 0 0 rgba(255,255,255,0.15), inset 1px 0 0 0 rgba(255,255,255,0.35), inset -1px 0 0 0 rgba(255,255,255,0.35)",
      }}
    >
      {/* Refraction overlay — diagonal gradient that mimics light
          bending through curved glass. Same recipe as the navbar
          pill, just sized for the dropdown's rounded-2xl corners. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.02) 60%, rgba(255,255,255,0.10) 100%)",
        }}
      />

      <ul
        className={`relative ${
          columns === 2 ? "grid grid-cols-2 gap-x-1 gap-y-0.5" : "space-y-0.5"
        }`}
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
          // Liquid glass: same recipe as the navbar pill and desktop
          // dropdown so the whole nav system feels coherent. Heavy
          // backdrop blur + saturation vibrancy, low-opacity white
          // fill, no visible border, four-sided ring-of-light inset
          // shadow.
          className="fixed inset-x-4 top-[78px] z-40 max-h-[calc(100vh-96px)] overflow-y-auto rounded-3xl bg-white/55 p-4 backdrop-blur-[28px] backdrop-saturate-[180%] sm:inset-x-6 sm:p-5 lg:hidden"
          style={{
            boxShadow:
              "0 24px 60px -30px rgba(14,14,14,0.25), inset 0 1px 0 0 rgba(255,255,255,0.85), inset 0 -1px 0 0 rgba(255,255,255,0.15), inset 1px 0 0 0 rgba(255,255,255,0.35), inset -1px 0 0 0 rgba(255,255,255,0.35)",
          }}
        >
          {/* Refraction overlay — same diagonal gradient as the pill
              and the desktop dropdown. Sized for the drawer's
              rounded-3xl corners. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.02) 60%, rgba(255,255,255,0.10) 100%)",
            }}
          />

          <div className="relative space-y-4">
            {NAV.map((item) =>
              item.kind === "group" ? (
                <div key={item.label}>
                  <p className="px-1 pb-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine">
                    {item.label}
                  </p>
                  <ul className="grid grid-cols-2 gap-1">
                    {item.items.map((leaf) => (
                      <li key={leaf.href}>
                        <Link
                          href={leaf.href}
                          onClick={onClose}
                          className={`flex items-center gap-2 rounded-lg px-2 py-2 transition-colors duration-150 ${
                            pathname === leaf.href
                              ? "bg-envrt-brand-ultramarine/10"
                              : "hover:bg-envrt-brand-black/4"
                          }`}
                        >
                          <span
                            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md ${
                              pathname === leaf.href
                                ? "bg-envrt-brand-ultramarine/15 text-envrt-brand-ultramarine"
                                : "bg-envrt-brand-ultramarine/8 text-envrt-brand-ultramarine"
                            }`}
                          >
                            <AssetIcon type={leaf.icon} size={14} />
                          </span>
                          <span
                            className={`min-w-0 truncate font-display text-[13px] font-semibold leading-tight ${
                              pathname === leaf.href
                                ? "text-envrt-brand-ultramarine"
                                : "text-envrt-brand-black"
                            }`}
                          >
                            {leaf.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null,
            )}

            {/* Inline standalone links (Pricing, Contact) — pulled out
                of the per-group loop and rendered as a compact pill
                row. Saves two full-width rows of vertical space. */}
            <div className="flex gap-2 border-t border-envrt-brand-black/8 pt-3">
              {NAV.filter((i) => i.kind === "link").map((item) => {
                if (item.kind !== "link") return null;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex flex-1 items-center justify-center rounded-lg px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200 ${
                      active
                        ? "bg-envrt-brand-ultramarine/10 text-envrt-brand-ultramarine"
                        : "bg-envrt-brand-black/4 text-envrt-brand-black/75 hover:bg-envrt-brand-ultramarine/8 hover:text-envrt-brand-ultramarine"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <ButtonV3
              href="/free-dpp"
              variant="primary"
              className="w-full !rounded-xl !py-2.5 !text-sm"
            >
              Try ENVRT<span>→</span>
            </ButtonV3>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
