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
    headline: "Suppliers won't send the data.",
    body: "Tier 2 and tier 3 evidence stalls every project around month two. The contact you have can't authorise what you need.",
    citation: "When suppliers refuse",
    citationHref: "/insights/dpp-supplier-data-collection-when-suppliers-refuse",
  },
  {
    index: "02",
    headline: "Five regulations, same data, five workflows.",
    body: "ESPR, UK DMCCA, French AGEC, California SB 253 and the NY Fashion Act overlap by 80%. You shouldn't be paying for five answers.",
    citation: "One compliance stack",
    citationHref: "/insights/us-fashion-brands-eu-dpp-california-ny-compliance",
  },
  {
    index: "03",
    headline: "Green claims now sit with the brand.",
    body: "DMCCA enforcement is live. Green Claims Directive next. Marketing copy without evidence is brand exposure, not agency exposure.",
    citation: "Substantiating green claims in 2026",
    citationHref: "/insights/green-claims-sustainability-marketing-fashion",
  },
  {
    index: "04",
    headline: "The platform isn't the bottleneck. The data is.",
    body: "Vendors quote weeks of setup. The supplier evidence and methodology work take months. The brands that ship a first DPP fast already had structured data.",
    citation: "An honest DPP timeline",
    citationHref: "/insights/dpp-implementation-timeline-honest",
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
            <h2 className="mt-4 font-display text-3xl font-medium leading-[1.1] tracking-[-0.02em] text-envrt-brand-black sm:text-4xl lg:text-[2.75rem]">
              Mandatory DPPs phase in from 2027.{" "}
              <span className="text-envrt-brand-black/40">
                The data work to get there is already the problem.
              </span>
            </h2>
          </FadeUp>
        </div>

        {/* Subtle timeline hint — small pill linking to the full
            timeline page. Replaces the bigger countdown card; the main
            section heading already anchors the 2027 message. */}
        <FadeUp delay={0.16}>
          <div className="mt-6 flex justify-center sm:mt-8">
            <Link
              href="/dpp-timeline"
              aria-live="polite"
              className="group inline-flex items-center gap-3 rounded-full border border-envrt-brand-black/12 bg-white px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/65 transition-colors duration-200 hover:border-envrt-brand-crimson/40 hover:text-envrt-brand-crimson sm:gap-4 sm:text-[11px]"
            >
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full bg-envrt-brand-crimson"
                />
                EU ESPR
              </span>
              <span className="text-envrt-brand-black/25">·</span>
              <span>
                <span className="font-semibold text-envrt-brand-crimson tabular-nums">
                  {days === null ? "—" : days.toLocaleString()}
                </span>{" "}
                days to 2027
              </span>
              <span className="text-envrt-brand-black/25">·</span>
              <span className="flex items-center gap-1">
                See timeline
                <span
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </span>
            </Link>
          </div>
        </FadeUp>

        {/* Four pain rows */}
        <ul className="mt-10 divide-y divide-envrt-brand-black/10 border-t border-envrt-brand-black/10 sm:mt-12">
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
