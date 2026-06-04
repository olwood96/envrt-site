"use client";

import { FadeUp } from "@/components/ui/Motion";

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
    body: "CSV, line sheet, or the ENVRT collection form. Garment names, materials, weights, suppliers, country of origin. Whatever you have.",
    caption: "≈ 30 minutes for a typical SS collection",
  },
  {
    index: "02",
    title: "ENVRT fills the gaps.",
    body: "Our calculator pulls verified factors for fibres, processing, transport. Missing entries are flagged with a confidence score so you can review.",
    caption: "EU PEF · ISO 14040 · AWARE",
  },
  {
    index: "03",
    title: "Ship the QR.",
    body: "Each garment gets a hosted passport at a permanent URL. Attach the QR to the care label, hangtag, or packaging. Customers scan, regulators audit.",
    caption: "Hosted on envrt.com or your own domain",
  },
];

export function HowItWorksV3() {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1320px] px-6 sm:px-10 lg:px-16">
        <FadeUp>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-envrt-charcoal/55">
            How it works
          </p>
          <h2 className="mt-5 max-w-3xl font-fraunces text-3xl font-normal italic leading-[1.15] tracking-tight text-envrt-ink sm:text-4xl lg:text-[2.6rem]">
            Three steps. Half a day. One passport per garment.
          </h2>
        </FadeUp>

        <div className="mt-14 space-y-0 border-t border-envrt-ink/8">
          {steps.map((step, i) => (
            <FadeUp key={step.index} delay={0.08 + i * 0.08}>
              <div className="grid grid-cols-1 gap-6 border-b border-envrt-ink/8 py-10 sm:grid-cols-[120px_1fr_240px] sm:items-baseline sm:gap-12 sm:py-14">
                <p className="font-fraunces text-5xl font-normal italic leading-none text-envrt-ink/15 sm:text-6xl">
                  {step.index}
                </p>
                <div>
                  <h3 className="font-fraunces text-2xl font-normal italic leading-snug text-envrt-ink sm:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-envrt-charcoal/70">
                    {step.body}
                  </p>
                </div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-envrt-teal sm:text-right">
                  {step.caption}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
