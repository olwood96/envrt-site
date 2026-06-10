"use client";

import { useEffect, useState } from "react";
import {
  PageHero,
  FaqSnippet,
  ButtonV3,
  Card,
} from "@/components/v3";
import {
  Eyebrow,
  SectionCorners,
} from "@/components/sections/v3/_shared";
import { FadeUp } from "@/components/ui/Motion";
import { FinalCtaV3 } from "@/components/sections/v3/FinalCtaV3";

// /preview/v3/dpp-timeline — regulatory timeline for DPPs in fashion.
// Hero shows live countdown to the textile DPP enforcement target.
// Vertical timeline below tracks the major milestones across the EU,
// UK and France. FAQ snippet at the bottom.

const ESPR_TARGET_ISO = "2027-01-01T00:00:00Z";

type Status = "passed" | "current" | "upcoming";

type Milestone = {
  date: string;
  iso: string;
  jurisdiction: "EU" | "UK" | "FR";
  title: string;
  body: string;
  status: Status;
};

const MILESTONES: Milestone[] = [
  {
    date: "Mar 2020",
    iso: "2020-03-11T00:00:00Z",
    jurisdiction: "EU",
    title: "Circular Economy Action Plan adopted",
    body: "Foundation document that flagged Digital Product Passports as a future requirement across multiple product categories.",
    status: "passed",
  },
  {
    date: "Jan 2022",
    iso: "2022-01-01T00:00:00Z",
    jurisdiction: "FR",
    title: "AGEC: French Anti-Waste law in force",
    body: "France's Coût Environnemental framework becomes the operational baseline for textile environmental labelling.",
    status: "passed",
  },
  {
    date: "Jul 2024",
    iso: "2024-07-18T00:00:00Z",
    jurisdiction: "EU",
    title: "ESPR Framework Regulation enters into force",
    body: "Ecodesign for Sustainable Products Regulation passes. Empowers the Commission to publish category-specific delegated acts, with textiles in the first wave.",
    status: "passed",
  },
  {
    date: "Sep 2024",
    iso: "2024-09-01T00:00:00Z",
    jurisdiction: "UK",
    title: "DMCCA: Digital Markets, Competition and Consumers Act",
    body: "UK greenwashing enforcement framework. Tightens scrutiny of environmental claims and creates penalties for unsubstantiated marketing language.",
    status: "passed",
  },
  {
    date: "Mid 2026",
    iso: "2026-07-01T00:00:00Z",
    jurisdiction: "EU",
    title: "Textile delegated act expected",
    body: "Defines what a textile DPP must contain, the data structures, verification standards and the publication mechanism. Final shape decided here.",
    status: "current",
  },
  {
    date: "Jan 2027",
    iso: "2027-01-01T00:00:00Z",
    jurisdiction: "EU",
    title: "Mandatory DPPs phase in",
    body: "Visual anchor for the textile DPP enforcement date. Earliest textile categories required to carry compliant Digital Product Passports.",
    status: "upcoming",
  },
];

const JURISDICTION_TONE: Record<
  Milestone["jurisdiction"],
  { dot: string; label: string }
> = {
  EU: { dot: "bg-envrt-brand-ultramarine", label: "text-envrt-brand-ultramarine" },
  UK: { dot: "bg-envrt-brand-vibrant", label: "text-envrt-brand-vibrant" },
  FR: { dot: "bg-envrt-brand-crimson", label: "text-envrt-brand-crimson" },
};

const faqs = [
  {
    question: "When does the textile DPP actually become mandatory?",
    answer:
      "The textile delegated act under ESPR is expected mid-2026, with mandatory passports phasing in from early 2027. The exact date depends on the act's final wording, which is still being drafted at the Commission level.",
  },
  {
    question: "What if I sell into both the EU and the UK?",
    answer:
      "You face two overlapping regimes. ESPR (EU) sets the DPP requirement. DMCCA (UK) tightens scrutiny on environmental claims. Both demand defensible underlying data, which is the same baseline ENVRT calculates per garment.",
  },
  {
    question: "Does France's AGEC count as a DPP?",
    answer:
      "Not in the strict ESPR sense, but it's the closest live precedent. The French Coût Environnemental framework is operational today and ENVRT supports it natively. Brands already running AGEC work have a head start on the product-level data ESPR will require, though the two regimes are not equivalent.",
  },
  {
    question: "How long does it take to be DPP-ready?",
    answer:
      "Data infrastructure, supplier onboarding and process change typically take more than a year. Brands starting now will be comfortable by enforcement. Brands starting in 2026 will be scrambling.",
  },
];

function daysUntil(targetIso: string): number {
  const now = new Date();
  const target = new Date(targetIso);
  return Math.max(
    0,
    Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
  );
}

export default function DppTimelineV3Page() {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(daysUntil(ESPR_TARGET_ISO));
  }, []);

  return (
    <main>
      <PageHero
        tone="sunny"
        eyebrow="Regulatory timeline"
        heading={
          <>
            Textile DPPs.{" "}
            <span className="text-envrt-brand-black/40">
              When, where and what.
            </span>
          </>
        }
        body="The EU ESPR textile delegated act lands mid-2026. Mandatory DPPs phase in from 2027. The UK DMCCA and France's AGEC apply now. Brands that wait will scramble."
        actions={
          <>
            <ButtonV3 href="/preview/v3/free-dpp" variant="primary">
              Get DPP-ready<span>→</span>
            </ButtonV3>
            <ButtonV3 href="/preview/v3/platform" variant="ghost">
              See the platform<span>→</span>
            </ButtonV3>
          </>
        }
        cornerLeft="ENVRT/01"
        cornerRight="Timeline"
      >
        <Countdown days={days} />
      </PageHero>

      <Timeline />

      <FaqSnippet
        eyebrow="Common questions"
        heading="About the DPP timeline"
        items={faqs}
        ctaHref="/preview/v3/faq"
        ctaLabel="See all FAQs"
      />

      <FinalCtaV3 />
    </main>
  );
}

function Countdown({ days }: { days: number | null }) {
  return (
    <Card variant="cta" className="overflow-hidden">
      <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-[1fr_auto] sm:gap-8">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-crimson sm:text-[11px]">
            ESPR · Textile DPP target
          </p>
          <h3 className="mt-3 font-display text-xl font-medium leading-tight tracking-[-0.01em] text-envrt-brand-black sm:text-2xl">
            Mandatory passports phase in from 2027.
          </h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-envrt-brand-black/70 sm:text-base">
            The Commission is finalising the textile delegated act. Once it
            lands, the enforcement clock starts running.
          </p>
        </div>
        <div className="flex flex-col items-start sm:items-end">
          <p
            aria-live="polite"
            className="font-display text-5xl font-semibold leading-none tracking-[-0.03em] tabular-nums text-envrt-brand-crimson sm:text-6xl lg:text-7xl"
          >
            {days === null ? "n/a" : days.toLocaleString()}
          </p>
          <p className="mt-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55 sm:text-[11px]">
            Days until 2027-01-01
          </p>
        </div>
      </div>
    </Card>
  );
}

function Timeline() {
  return (
    <section className="relative bg-envrt-brand-vista py-20 sm:py-24 lg:py-32">
      <SectionCorners left="ENVRT/02" right="Milestones" />
      <div className="mx-auto max-w-[900px] px-5 sm:px-8 lg:px-16">
        <div className="text-center">
          <FadeUp>
            <Eyebrow>Milestones</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="mt-4 font-display text-3xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-4xl">
              The regulatory path so far, and what is next.
            </h2>
          </FadeUp>
        </div>

        <div className="relative mt-12 sm:mt-16">
          {/* Vertical rail */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-[7px] top-3 bottom-3 w-px bg-envrt-brand-black/15 sm:left-[11px]"
          />

          <ul className="space-y-8 sm:space-y-10">
            {MILESTONES.map((m, i) => (
              <FadeUp key={m.iso} delay={0.04 + i * 0.04}>
                <TimelineItem milestone={m} />
              </FadeUp>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ milestone }: { milestone: Milestone }) {
  const tone = JURISDICTION_TONE[milestone.jurisdiction];
  const dim = milestone.status === "passed";

  return (
    <li className="relative pl-9 sm:pl-12">
      {/* Node */}
      <span
        aria-hidden
        className={`absolute left-0 top-1 inline-flex h-4 w-4 items-center justify-center rounded-full border-2 ${
          milestone.status === "current"
            ? "border-envrt-brand-crimson bg-white"
            : milestone.status === "upcoming"
              ? "border-envrt-brand-black/35 bg-white"
              : `border-transparent ${tone.dot}`
        } sm:h-6 sm:w-6`}
      >
        {milestone.status === "current" && (
          <span className="absolute inset-[-4px] animate-ping rounded-full bg-envrt-brand-crimson/30" />
        )}
        {milestone.status === "current" && (
          <span className="relative h-1.5 w-1.5 rounded-full bg-envrt-brand-crimson" />
        )}
      </span>

      <div
        className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${
          dim ? "opacity-70" : ""
        }`}
      >
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55">
          {milestone.date}
        </span>
        <span className={`font-mono text-[10px] font-semibold uppercase tracking-[0.18em] ${tone.label}`}>
          {milestone.jurisdiction}
        </span>
        {milestone.status === "current" && (
          <span className="rounded-full bg-envrt-brand-crimson/10 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-envrt-brand-crimson">
            In progress
          </span>
        )}
      </div>
      <h3
        className={`mt-2 font-display text-lg font-semibold leading-tight tracking-[-0.01em] sm:text-xl ${
          dim ? "text-envrt-brand-black/70" : "text-envrt-brand-black"
        }`}
      >
        {milestone.title}
      </h3>
      <p
        className={`mt-2 max-w-2xl text-sm leading-relaxed sm:text-base ${
          dim ? "text-envrt-brand-black/55" : "text-envrt-brand-black/70"
        }`}
      >
        {milestone.body}
      </p>
    </li>
  );
}
