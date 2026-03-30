"use client";

import { useState } from "react";
import Image from "next/image";
import { Container } from "../ui/Container";
import { FadeUp, StaggerChildren, StaggerItem } from "../ui/Motion";
import { Button } from "../ui/Button";
import { CheckIcon, UserIcon, UsersIcon, ZapIcon } from "../icons";

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

/* ── Mobile accordion ──────────────────────────────────────────────────── */

function MobileComparisonCards() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="md:hidden rounded-2xl border border-envrt-charcoal/5 bg-white overflow-hidden divide-y divide-envrt-charcoal/5">
      {comparisonRows.map((row, i) => {
        const isOpen = activeIndex === i;
        return (
          <div key={row.label}>
            <button
              type="button"
              className="flex w-full items-center justify-between px-4 py-3"
              onClick={() => setActiveIndex(isOpen ? -1 : i)}
            >
              <span className={`text-sm font-medium ${isOpen ? "text-envrt-charcoal" : "text-envrt-charcoal/60"}`}>
                {row.shortLabel}
              </span>
              <svg
                className={`h-4 w-4 text-envrt-muted/40 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
            <div
              className="overflow-hidden transition-[max-height] duration-300 ease-out"
              style={{ maxHeight: isOpen ? "300px" : "0px" }}
            >
              <div className="space-y-2.5 px-4 pb-3.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-envrt-muted">Consultant</span>
                  <span className="text-xs text-envrt-muted">{row.consultant}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-envrt-muted">In-house</span>
                  <span className="text-xs text-envrt-muted">{row.inHouse}</span>
                </div>
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
        );
      })}
    </div>
  );
}

/* ── Desktop table layout ──────────────────────────────────────────────── */

function DesktopComparisonTable() {
  return (
    <div className="hidden md:block mx-auto max-w-4xl rounded-2xl border border-envrt-charcoal/5 bg-white overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-envrt-charcoal/5 bg-envrt-charcoal/[0.02]">
            <th scope="col" className="px-6 py-5 text-left text-xs font-medium uppercase tracking-widest text-envrt-muted/60">
              Approach
            </th>
            <th scope="col" className="px-4 py-5">
              <ColumnHeader icon={UserIcon} title="Consultant" subtitle="External hire" />
            </th>
            <th scope="col" className="px-4 py-5">
              <ColumnHeader icon={UsersIcon} title="In-house" subtitle="Full-time team" />
            </th>
            <th scope="col" className="relative px-4 py-5">
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
                <p className="mt-0.5 text-xs text-envrt-muted font-normal">Platform</p>
              </div>
            </th>
          </tr>
        </thead>
        <StaggerChildren as="tbody" className="divide-y divide-envrt-charcoal/[0.04]">
          {comparisonRows.map((row) => (
            <StaggerItem as="tr" key={row.label}>
              <td className="px-6 py-4 text-sm font-medium text-envrt-charcoal/70">{row.label}</td>
              <td className="px-4 py-4 text-center text-sm text-envrt-muted">{row.consultant}</td>
              <td className="px-4 py-4 text-center text-sm text-envrt-muted">{row.inHouse}</td>
              <td className="relative px-4 py-4 text-center">
                <div className="pointer-events-none absolute inset-x-2 inset-y-0 bg-envrt-teal/[0.03]" />
                <span className="relative text-sm font-medium text-envrt-teal">{row.envrt}</span>
              </td>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </table>
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
        <FadeUp>
          <SectionHeader />
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="mt-14">
            <DesktopComparisonTable />
            <MobileComparisonCards />
          </div>
        </FadeUp>

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
