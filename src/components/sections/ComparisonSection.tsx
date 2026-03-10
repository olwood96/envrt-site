"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Container } from "../ui/Container";
import { FadeUp, StaggerChildren, StaggerItem } from "../ui/Motion";
import { Button } from "../ui/Button";

/* ── Data ──────────────────────────────────────────────────────────────── */

interface ComparisonRow {
  label: string;
  shortLabel: string;
  consultant: string;
  inHouse: string;
  envrt: string;
  /** Bar widths (%) for visual comparison on mobile — relative scale */
  bars: { consultant: number; inHouse: number };
}

const comparisonRows: ComparisonRow[] = [
  {
    label: "Annual cost",
    shortLabel: "Cost",
    consultant: "From £30,000",
    inHouse: "From £80,000",
    envrt: "From £1,788",
    bars: { consultant: 38, inHouse: 100 },
  },
  {
    label: "Time to first DPP",
    shortLabel: "Speed",
    consultant: "2-4 months",
    inHouse: "3-6 months",
    envrt: "Same day",
    bars: { consultant: 55, inHouse: 100 },
  },
  {
    label: "Scalability",
    shortLabel: "Scalability",
    consultant: "Limited by availability",
    inHouse: "Scales with headcount",
    envrt: "Scales with plan",
    bars: { consultant: 80, inHouse: 60 },
  },
  {
    label: "Regulatory updates",
    shortLabel: "Regulation",
    consultant: "Manual re-engagement",
    inHouse: "Your team researches",
    envrt: "Built into platform",
    bars: { consultant: 75, inHouse: 85 },
  },
  {
    label: "Lifecycle metrics",
    shortLabel: "Metrics",
    consultant: "Varies by consultant",
    inHouse: "Requires specialist hire",
    envrt: "Included from Growth",
    bars: { consultant: 65, inHouse: 90 },
  },
  {
    label: "Ongoing platform",
    shortLabel: "Platform",
    consultant: "None - reports only",
    inHouse: "Custom-built or none",
    envrt: "Full dashboard included",
    bars: { consultant: 95, inHouse: 70 },
  },
];

/* ── Icons ─────────────────────────────────────────────────────────────── */

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function ZapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

/* ── Check icon for ENVRT wins ─────────────────────────────────────────── */

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
    </svg>
  );
}

/* ── Column header card ────────────────────────────────────────────────── */

function ColumnHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-envrt-charcoal/[0.04]">
        <Icon className="h-5 w-5 text-envrt-muted" />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-envrt-charcoal">
        {title}
      </h3>
      <p className="mt-0.5 text-xs text-envrt-muted">{subtitle}</p>
    </div>
  );
}

/* ── Mobile scroll-triggered accordion ──────────────────────────────────── */

function ComparisonBar({
  label,
  value,
  width,
  animate,
}: {
  label: string;
  value: string;
  width: number;
  animate: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-envrt-muted">{label}</span>
        <span className="text-xs text-envrt-muted">{value}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-envrt-charcoal/[0.04]">
        <div
          className="h-full rounded-full bg-envrt-charcoal/20 transition-all duration-700 ease-out"
          style={{ width: animate ? `${Math.max(width, 4)}%` : "0%" }}
        />
      </div>
    </div>
  );
}

function MobileAccordionItem({ row, isOpen }: {
  row: ComparisonRow;
  isOpen: boolean;
}) {
  return (
    <div className="rounded-xl border border-envrt-charcoal/5 bg-white overflow-hidden transition-shadow duration-300"
      style={{ boxShadow: isOpen ? "0 4px 20px rgba(0,0,0,0.06)" : "none" }}
    >
      {/* Header — just the short label */}
      <div className="flex items-center justify-between px-4 py-3.5">
        <span className={`text-sm font-medium transition-colors duration-300 ${
          isOpen ? "text-envrt-charcoal" : "text-envrt-charcoal/50"
        }`}>
          {row.shortLabel}
        </span>
        {/* Small dot indicator when closed */}
        {!isOpen && (
          <div className="h-1.5 w-1.5 rounded-full bg-envrt-teal/40" />
        )}
      </div>

      {/* Expandable content */}
      <div
        className="grid transition-[grid-template-rows] duration-500 ease-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 px-4 pb-4">
            <ComparisonBar
              label="Consultant"
              value={row.consultant}
              width={row.bars.consultant}
              animate={isOpen}
            />
            <ComparisonBar
              label="In-house"
              value={row.inHouse}
              width={row.bars.inHouse}
              animate={isOpen}
            />
            {/* ENVRT result — highlighted */}
            <div className="flex items-center justify-between rounded-lg bg-envrt-teal/[0.06] px-3 py-2">
              <span className="flex items-center gap-1.5 text-xs font-medium text-envrt-teal">
                <CheckIcon className="h-3.5 w-3.5 flex-shrink-0" />
                ENVRT
              </span>
              <span className="text-sm font-semibold text-envrt-teal">{row.envrt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Scroll-driven mobile accordion.
 *
 * The outer div is tall (items × 100vh), creating scroll space.
 * A `position: sticky` inner container stays pinned in the viewport.
 * As the user scrolls naturally through the tall section, we derive
 * which accordion item should be open from scroll progress.
 *
 * No body scroll lock, no translateY, no scroll restore — pure native scroll.
 */
function MobileComparisonCards() {
  const total = comparisonRows.length;
  const [activeIndex, setActiveIndex] = useState(-1);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(min-width: 768px)").matches) return;

    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const vh = window.innerHeight;

      // scrolled = how far the section top has moved above the viewport top
      const scrolled = -rect.top;
      const scrollableRange = sectionHeight - vh;

      if (scrolled < 0 || scrolled > scrollableRange) {
        setActiveIndex(-1);
        return;
      }

      const progress = scrolled / scrollableRange;
      setActiveIndex(Math.min(total - 1, Math.floor(progress * total)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [total]);

  return (
    <div
      ref={sectionRef}
      className="md:hidden relative"
      style={{ height: `${(total + 1) * 85}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center">
        <div className="w-full px-1">
          <SectionHeader />
          <div className="mt-8 space-y-2">
            {comparisonRows.map((row, i) => (
              <MobileAccordionItem
                key={row.label}
                row={row}
                isOpen={activeIndex === i}
              />
            ))}
          </div>
          {activeIndex >= 0 && (
            <div className="flex justify-center gap-1.5 pt-4">
              {comparisonRows.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "w-4 bg-envrt-teal"
                      : i < activeIndex
                        ? "w-1.5 bg-envrt-teal/30"
                        : "w-1.5 bg-envrt-charcoal/10"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Desktop table layout ──────────────────────────────────────────────── */

function DesktopComparisonTable() {
  return (
    <div className="hidden md:block mx-auto max-w-4xl rounded-2xl border border-envrt-charcoal/5 bg-white">
      {/* Column headers */}
      <div className="relative grid grid-cols-[1fr_1fr_1fr_1.1fr] border-b border-envrt-charcoal/5 bg-envrt-charcoal/[0.02] rounded-t-2xl">
        <div className="flex items-end px-6 py-5">
          <span className="text-xs font-medium uppercase tracking-widest text-envrt-muted/60">
            Approach
          </span>
        </div>
        <div className="flex justify-center px-4 py-5">
          <ColumnHeader icon={UserIcon} title="Consultant" subtitle="External hire" />
        </div>
        <div className="flex justify-center px-4 py-5">
          <ColumnHeader icon={UsersIcon} title="In-house" subtitle="Full-time team" />
        </div>
        <div className="relative flex justify-center px-4 py-5">
          {/* Subtle teal background — inset from edges */}
          <div className="pointer-events-none absolute inset-x-2 inset-y-0 rounded-t-xl bg-envrt-teal/[0.03]" />
          <div className="relative flex flex-col items-center text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-envrt-teal/[0.12]">
              <ZapIcon className="h-5 w-5 text-envrt-teal" />
            </div>
            <Image
              src="/brand/envrt-logo.png"
              alt="ENVRT"
              width={64}
              height={20}
              className="mt-3 h-5 w-auto object-contain"
            />
            <p className="mt-0.5 text-xs text-envrt-muted">Platform</p>
          </div>
        </div>
      </div>

      {/* Rows */}
      <StaggerChildren className="divide-y divide-envrt-charcoal/[0.04]">
        {comparisonRows.map((row) => (
          <StaggerItem key={row.label}>
            <div className="grid grid-cols-[1fr_1fr_1fr_1.1fr]">
              <div className="flex items-center px-6 py-4">
                <span className="text-sm font-medium text-envrt-charcoal/70">{row.label}</span>
              </div>
              <div className="flex items-center justify-center px-4 py-4 text-center">
                <span className="text-sm text-envrt-muted">{row.consultant}</span>
              </div>
              <div className="flex items-center justify-center px-4 py-4 text-center">
                <span className="text-sm text-envrt-muted">{row.inHouse}</span>
              </div>
              <div className="relative flex items-center justify-center px-4 py-4 text-center">
                {/* Subtle teal background — inset */}
                <div className="pointer-events-none absolute inset-x-2 inset-y-0 bg-envrt-teal/[0.03]" />
                <span className="relative text-sm font-medium text-envrt-teal">
                  {row.envrt}
                </span>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerChildren>

      {/* Bottom cap for ENVRT column */}
      <div className="grid grid-cols-[1fr_1fr_1fr_1.1fr] border-t border-envrt-charcoal/[0.04]">
        <div className="col-span-3" />
        <div className="relative h-3">
          <div className="pointer-events-none absolute inset-x-2 inset-y-0 bg-envrt-teal/[0.03] rounded-b-xl" />
        </div>
      </div>
    </div>
  );
}

/* ── Section ───────────────────────────────────────────────────────────── */

function SectionHeader() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-medium uppercase tracking-widest text-envrt-teal">
        Why ENVRT
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-envrt-charcoal sm:text-4xl">
        How does ENVRT compare?
      </h2>
      <p className="mt-4 text-base text-envrt-muted">
        Most brands think they need a consultant or a dedicated hire.
        Here&apos;s how the options actually stack up.
      </p>
    </div>
  );
}

export function ComparisonSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24" id="compare" aria-label="How ENVRT compares to consultants and in-house teams">
      <Container>
        {/* Desktop: normal layout with header above table */}
        <div className="hidden md:block">
          <FadeUp>
            <SectionHeader />
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="mt-14">
              <DesktopComparisonTable />
            </div>
          </FadeUp>
        </div>

        {/* Mobile: header is inside the translated container */}
        <MobileComparisonCards />

        <FadeUp delay={0.2}>
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <Button href="/roi" variant="primary">
              See how the numbers stack up
            </Button>
            <p className="text-xs text-envrt-muted">
              Free ROI calculator. No signup required.
            </p>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}
