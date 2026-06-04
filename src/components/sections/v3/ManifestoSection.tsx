"use client";

import { FadeUp } from "@/components/ui/Motion";

export function ManifestoSection() {
  return (
    <section className="bg-envrt-ink py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[1100px] px-6 sm:px-10 lg:px-16">
        <FadeUp>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-envrt-teal-light">
            Why ENVRT
          </p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <p className="mt-8 font-fraunces text-3xl font-normal italic leading-[1.15] tracking-tight text-envrt-offwhite sm:text-4xl lg:text-[3.2rem]">
            Compliance is the floor. The ceiling is a passport a customer
            actually wants to scan.
          </p>
        </FadeUp>
        <FadeUp delay={0.22}>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-envrt-offwhite/65 sm:text-lg">
            Every garment carries a Digital Product Passport that satisfies
            EU ESPR and rewards the customer who picks it up. Audit-grade
            data underneath. Editorial finish on top.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
