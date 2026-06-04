"use client";

import { FadeUp } from "@/components/ui/Motion";

type Stat = {
  number: string;
  unit?: string;
  label: string;
  body: string;
};

const stats: Stat[] = [
  {
    number: "30",
    unit: "min",
    label: "to first DPP",
    body: "From signup to a live, scannable passport on a real garment.",
  },
  {
    number: "2,400",
    unit: "+",
    label: "garments live",
    body: "Across cycling, casualwear, technical and luxury brands selling into the EU.",
  },
  {
    number: "1",
    unit: "%",
    label: "of competitor entry pricing",
    body: "ENVRT Starter at £149/mo vs typical DPP tooling at £15–45k/year.",
  },
];

export function NumbersSection() {
  return (
    <section className="bg-envrt-offwhite py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1320px] px-6 sm:px-10 lg:px-16">
        <FadeUp>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-envrt-charcoal/55">
            By the numbers
          </p>
          <h2 className="mt-5 max-w-3xl font-fraunces text-3xl font-normal italic leading-[1.15] tracking-tight text-envrt-ink sm:text-4xl lg:text-[2.6rem]">
            Built for fashion, priced for fashion.
          </h2>
        </FadeUp>

        <div className="mt-14 grid grid-cols-1 gap-y-12 border-t border-envrt-ink/8 pt-12 sm:grid-cols-3 sm:gap-x-10 sm:gap-y-0 sm:divide-x sm:divide-envrt-ink/8">
          {stats.map((s, i) => (
            <FadeUp key={s.label} delay={0.1 + i * 0.08}>
              <div className="sm:px-8 sm:first:pl-0 sm:last:pr-0">
                <p className="font-fraunces text-[5rem] font-medium italic leading-none tracking-tight text-envrt-ink sm:text-[6rem] lg:text-[7rem]">
                  {s.number}
                  {s.unit && (
                    <span className="ml-1 align-top font-fraunces text-2xl not-italic font-normal text-envrt-muted sm:text-3xl">
                      {s.unit}
                    </span>
                  )}
                </p>
                <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-envrt-teal">
                  {s.label}
                </p>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-envrt-charcoal/70">
                  {s.body}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
