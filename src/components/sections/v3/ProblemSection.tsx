"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FadeUp } from "@/components/ui/Motion";
import { Eyebrow, SectionCorners } from "./_shared";

// Combined "The problem" section. Replaces the old ManifestoSection +
// EsprCountdownSection one-two punch with a single block that names
// the four concrete brand pains ENVRT solves, anchored by the live
// 2027 ESPR countdown so the regulatory pressure is right there in
// the same panel.
//
// Pains sourced from ENVRT's own published insights (LinkedIn posts +
// /insights articles). Every claim has a citeable backing.

const ESPR_TARGET_ISO = "2027-01-01T00:00:00Z";

function daysUntil(targetIso: string): number {
  const now = new Date();
  const target = new Date(targetIso);
  return Math.max(
    0,
    Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
  );
}

type Pain = {
  index: string;
  headline: string;
  body: string;
  citation: string;
  citationHref: string;
};

const PAINS: Pain[] = [
  {
    index: "01",
    headline: "Suppliers stall the data, every time.",
    body: "Average DPP project hits the wall in month two or three, chasing tier 2 and tier 3 evidence that production contacts can't authorise to share.",
    citation: "When suppliers refuse, what to do",
    citationHref: "/preview/v3/insights/dpp-supplier-data-collection-when-suppliers-refuse",
  },
  {
    index: "02",
    headline: "Five regulations. ~80% the same data.",
    body: "ESPR, UK DMCCA, French AGEC, California SB 253 and the New York Fashion Act ask for overlapping data. Most brands still solve them as five separate workflows.",
    citation: "One compliance stack",
    citationHref: "/preview/v3/insights/us-fashion-brands-eu-dpp-california-ny-compliance",
  },
  {
    index: "03",
    headline: "Marketing claims now carry legal penalties.",
    body: "DMCCA enforcement is live in the UK. The EU Green Claims Directive is queued. Unsubstantiated environmental claims now expose the brand, not just the brief.",
    citation: "Greenwashing is an evidence problem",
    citationHref: "/preview/v3/insights/greenwashing-in-fashion",
  },
  {
    index: "04",
    headline: "Vendor timelines say weeks. Reality is 6–12 months.",
    body: "Data work is the bottleneck, not the platform. Brands that ship a credible first DPP in three or four months almost always already had the data layer in place.",
    citation: "An honest DPP timeline",
    citationHref: "/preview/v3/insights/dpp-implementation-timeline-honest",
  },
];

export function ProblemSection() {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    setDays(daysUntil(ESPR_TARGET_ISO));
  }, []);

  return (
    <section className="relative overflow-hidden bg-envrt-brand-vista py-20 sm:py-24 lg:py-28">
      <SectionCorners left="ENVRT/02" right="The problem" />

      <div className="relative mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <FadeUp>
            <Eyebrow>The problem</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="mt-4 font-display text-2xl font-medium leading-[1.1] tracking-[-0.02em] text-envrt-brand-black sm:text-3xl lg:text-[2.5rem]">
              Mandatory DPPs phase in from 2027.{" "}
              <span className="text-envrt-brand-black/40">
                The data work to get there is already the problem.
              </span>
            </h2>
          </FadeUp>
        </div>

        {/* Countdown panel */}
        <FadeUp delay={0.16}>
          <div className="relative mt-10 overflow-hidden rounded-3xl border border-envrt-brand-black/8 border-l-[3px] border-l-envrt-brand-crimson bg-white p-6 sm:mt-12 sm:p-8 lg:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 top-1/2 h-[280px] w-[280px] -translate-y-1/2 rounded-full bg-envrt-brand-crimson/[0.08] blur-3xl"
            />
            <div className="relative grid grid-cols-1 items-center gap-6 sm:grid-cols-[1fr_auto] sm:gap-8">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-crimson sm:text-[11px]">
                  EU ESPR · Textile DPP target
                </p>
                <h3 className="mt-3 font-display text-xl font-medium leading-tight tracking-[-0.01em] text-envrt-brand-black sm:text-2xl lg:text-[1.6rem]">
                  Mandatory passports phase in from 2027.
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-envrt-brand-black/70 sm:text-base">
                  Textile delegated act expected mid-2026. Data
                  infrastructure, supplier onboarding and methodology choices
                  take longer than the platform itself.
                </p>
                <Link
                  href="/preview/v3/dpp-timeline"
                  className="group mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-crimson sm:text-[11px]"
                >
                  See the full timeline
                  <span
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>
              </div>
              <div className="flex flex-col items-start sm:items-end">
                <p
                  aria-live="polite"
                  className="font-display text-5xl font-semibold leading-none tracking-[-0.03em] text-envrt-brand-crimson tabular-nums sm:text-6xl lg:text-7xl"
                >
                  {days === null ? "n/a" : days.toLocaleString()}
                </p>
                <p className="mt-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55 sm:text-[11px]">
                  Days until 2027-01-01
                </p>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Four pain rows */}
        <ul className="mt-10 divide-y divide-envrt-brand-black/10 border-t border-envrt-brand-black/10 sm:mt-14">
          {PAINS.map((pain, i) => (
            <FadeUp key={pain.index} delay={0.2 + i * 0.06}>
              <PainRow pain={pain} />
            </FadeUp>
          ))}
        </ul>

        {/* Bridge line into ScatterToOrder */}
        <FadeUp delay={0.5}>
          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-envrt-brand-black/65 sm:mt-12 sm:text-base">
            Most brands tackle this with inboxes and PDFs.{" "}
            <span className="font-semibold text-envrt-brand-black">
              Here&apos;s the alternative.
            </span>{" "}
            <span aria-hidden className="ml-1 text-envrt-brand-ultramarine">
              ↓
            </span>
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

function PainRow({ pain }: { pain: Pain }) {
  return (
    <li className="grid grid-cols-[40px_1fr] items-start gap-4 py-6 sm:grid-cols-[64px_1fr_auto] sm:gap-6 sm:py-7">
      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine sm:text-[12px]">
        {pain.index}
      </span>
      <div className="min-w-0">
        <h3 className="font-display text-lg font-medium leading-tight tracking-[-0.01em] text-envrt-brand-black sm:text-xl lg:text-[1.4rem]">
          {pain.headline}
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-envrt-brand-black/65 sm:text-base">
          {pain.body}
        </p>
      </div>
      <Link
        href={pain.citationHref}
        className="group col-span-2 -mt-2 inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine sm:col-span-1 sm:mt-1 sm:text-[11px]"
      >
        {pain.citation}
        <span
          aria-hidden
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        >
          →
        </span>
      </Link>
    </li>
  );
}
