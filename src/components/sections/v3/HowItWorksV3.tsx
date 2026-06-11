"use client";

import { FadeUp } from "@/components/ui/Motion";
import { Eyebrow, SectionCorners } from "./_shared";

type Step = {
  index: string;
  title: string;
  body: string;
  caption: string;
};

const steps: Step[] = [
  {
    index: "01",
    title: "Upload your collection.",
    body: "CSV, line sheet or our collection form. Names, materials, weights, suppliers. Whatever you have.",
    caption: "≈ 30 min for a typical SS collection",
  },
  {
    index: "02",
    title: "ENVRT fills the gaps.",
    body: "We pull verified factors for fibres, processing and transport. Missing entries get a confidence score so you can review.",
    caption: "EU PEF · ISO 14040 · AWARE",
  },
  {
    index: "03",
    title: "Ship the QR.",
    body: "Each garment gets a hosted passport at a permanent URL. Attach the QR to care label, hangtag or packaging.",
    caption: "Hosted on envrt.com, brand-customisable",
  },
];

// "How it works" — three steps card row. Brand-aligned typography
// (font-display headlines, mono caps captions, ultramarine accent) and
// SectionCorners construction marks to match the rest of the v3
// vocabulary. Drops the previous stock thumbnails — they weren't
// earning their space and the typographic numeral does the visual work.

export function HowItWorksV3() {
  return (
    <section className="relative bg-envrt-brand-vista py-20 sm:py-24 lg:py-28">
      <SectionCorners left="ENVRT/HIW" right="How it works" />

      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <FadeUp>
            <Eyebrow>How it works</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="mt-4 font-display text-2xl font-medium leading-[1.05] tracking-[-0.02em] text-envrt-brand-black sm:text-3xl lg:text-[2.5rem]">
              Three steps. Half a day.{" "}
              <span className="text-envrt-brand-black/40">
                One passport per garment.
              </span>
            </h2>
          </FadeUp>
        </div>

        {/* Steps. lg+ renders as a 3-column row with thin connector
            hairlines between cards. Anything narrower stacks. */}
        <div className="relative mt-12 sm:mt-16">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
            {steps.map((step, i) => (
              <FadeUp key={step.index} delay={0.12 + i * 0.08}>
                <StepCard step={step} />
              </FadeUp>
            ))}
          </div>

          {/* Connector hairlines + arrows between cards (lg+ only). The
              top row of each card sits on the same y-line, so a centred
              horizontal hairline reads as "next step". */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-[58px] hidden lg:block"
          >
            <div className="mx-auto grid max-w-[1320px] grid-cols-3 px-16">
              {[0, 1, 2].map((i) => (
                <div key={i} className="relative">
                  {i < 2 && (
                    <span className="absolute right-[-12px] top-0 inline-flex items-center font-mono text-[14px] font-semibold text-envrt-brand-black/25">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({ step }: { step: Step }) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-envrt-brand-black/10 bg-white p-6 transition-colors duration-300 hover:border-envrt-brand-ultramarine/30 sm:p-7 lg:p-8">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-[2.75rem] font-semibold leading-none tracking-[-0.04em] text-envrt-brand-ultramarine sm:text-5xl">
          {step.index}
        </span>
        <span className="h-px flex-1 bg-envrt-brand-black/10" />
      </div>
      <h3 className="mt-5 font-display text-xl font-medium leading-tight tracking-[-0.01em] text-envrt-brand-black sm:text-2xl lg:text-[1.65rem]">
        {step.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-envrt-brand-black/65 sm:text-base">
        {step.body}
      </p>
      <p className="mt-6 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine sm:text-[11px]">
        {step.caption}
      </p>
    </div>
  );
}
