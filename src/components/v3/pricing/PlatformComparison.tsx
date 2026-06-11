"use client";

import { ButtonV3 } from "@/components/v3";
import {
  Eyebrow,
  SectionCorners,
} from "@/components/sections/v3/_shared";
import { FadeUp } from "@/components/ui/Motion";
import {
  formatFromGBP,
  usePricing,
} from "@/components/v3/pricing/PricingContext";

// "ENVRT vs the alternatives" comparison on the /platform page. Extracted
// out of the page file so we can read the currency context and convert
// the annual cost figures on the first row. Everything else is the same
// content the v1 ComparisonSection shipped.

type ComparisonRow = {
  label: string;
  consultant: string;
  inHouse: string;
  envrt: string;
};

export function PlatformComparison() {
  const { currency } = usePricing();

  // Source-of-truth GBP figures, formatted into the active currency at
  // render time. Consultants and in-house salaries are sticker-shock
  // numbers, kept in round thousands when displayed.
  const consultantGBP = 30000;
  const inhouseGBP = 80000;
  const envrtGBP = 1788; // Starter annual: £149 × 12

  const fmt = (gbp: number) => `From ${formatFromGBP(gbp, currency)}`;

  const ROWS: ComparisonRow[] = [
    {
      label: "Annual cost",
      consultant: fmt(consultantGBP),
      inHouse: fmt(inhouseGBP),
      envrt: fmt(envrtGBP),
    },
    {
      label: "Time to first DPP",
      consultant: "2-4 months",
      inHouse: "3-6 months",
      envrt: "Same day",
    },
    {
      label: "Scalability",
      consultant: "Limited by availability",
      inHouse: "Scales with headcount",
      envrt: "Scales with plan",
    },
    {
      label: "Regulatory updates",
      consultant: "Manual re-engagement",
      inHouse: "Your team researches",
      envrt: "Built into platform",
    },
    {
      label: "Lifecycle metrics",
      consultant: "Varies by consultant",
      inHouse: "Requires specialist hire",
      envrt: "Included from Growth",
    },
    {
      label: "Ongoing platform",
      consultant: "None, reports only",
      inHouse: "Custom-built or none",
      envrt: "Full dashboard included",
    },
  ];

  return (
    <section className="relative bg-white py-20 sm:py-24 lg:py-32">
      <SectionCorners left="ENVRT/Compare" right="vs alternatives" />
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-2xl text-center">
          <FadeUp>
            <Eyebrow>vs the alternatives</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="mt-4 font-display text-3xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-4xl">
              The two real options before this one.
            </h2>
          </FadeUp>
          <FadeUp delay={0.16}>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-envrt-brand-black/65 sm:text-base">
              Most brands considering ENVRT have already priced a consultant
              or weighed up hiring in-house. Here is what each looks like
              against the same six measures.
            </p>
          </FadeUp>
        </div>

        {/* Desktop table */}
        <FadeUp delay={0.2}>
          <div className="mt-14 hidden overflow-hidden rounded-2xl ring-1 ring-envrt-brand-black/10 lg:block">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="border-b border-envrt-brand-black/10 bg-envrt-brand-vista/60">
                  <th className="w-[28%] px-5 py-5 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55">
                    Measure
                  </th>
                  <th className="w-[24%] px-5 py-5 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/65">
                    Consultant
                  </th>
                  <th className="w-[24%] px-5 py-5 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/65">
                    In-house team
                  </th>
                  <th className="w-[24%] px-5 py-5 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine">
                    ENVRT
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, i) => (
                  <tr
                    key={row.label}
                    className={
                      i % 2 === 1 ? "bg-envrt-brand-vista/30" : "bg-white"
                    }
                  >
                    <td className="px-5 py-5 align-top font-display text-sm font-semibold tracking-[-0.01em] text-envrt-brand-black sm:text-base">
                      {row.label}
                    </td>
                    <td className="px-5 py-5 align-top text-sm leading-snug text-envrt-brand-black/65">
                      {row.consultant}
                    </td>
                    <td className="px-5 py-5 align-top text-sm leading-snug text-envrt-brand-black/65">
                      {row.inHouse}
                    </td>
                    <td className="px-5 py-5 align-top text-sm font-semibold leading-snug text-envrt-brand-ultramarine">
                      {row.envrt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeUp>

        {/* Mobile / tablet card stack */}
        <FadeUp delay={0.2}>
          <div className="mt-12 grid gap-3 lg:hidden">
            {ROWS.map((row) => (
              <div
                key={row.label}
                className="rounded-2xl border border-envrt-brand-black/10 bg-white p-5"
              >
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55 sm:text-[11px]">
                  {row.label}
                </p>
                <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                  <div>
                    <dt className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-envrt-brand-black/45">
                      Consultant
                    </dt>
                    <dd className="mt-1 text-sm text-envrt-brand-black/70">
                      {row.consultant}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-envrt-brand-black/45">
                      In-house
                    </dt>
                    <dd className="mt-1 text-sm text-envrt-brand-black/70">
                      {row.inHouse}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-envrt-brand-ultramarine">
                      ENVRT
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-envrt-brand-ultramarine">
                      {row.envrt}
                    </dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={0.3}>
          <p className="mt-10 text-center font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-envrt-brand-black/45 sm:text-[11px]">
            Want the full maths? See the ROI calculator
            <ButtonV3 href="/roi" variant="ghost" className="!ml-2">
              Open ROI<span>→</span>
            </ButtonV3>
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
