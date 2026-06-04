"use client";

import { FadeUp } from "@/components/ui/Motion";

export function ManifestoSection() {
  return (
    <section className="relative overflow-hidden bg-envrt-deep py-20 sm:py-28 lg:py-36">
      {/* Aqua sweep behind the statement */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-envrt-aqua/[0.06] blur-3xl"
      />
      <div className="relative mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-16">
        <FadeUp>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-aqua sm:text-[11px]">
            Why ENVRT
          </p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <p className="mt-6 font-manrope text-[1.75rem] font-semibold leading-[1.12] tracking-[-0.02em] text-white sm:mt-8 sm:text-4xl lg:text-[3rem]">
            Compliance is the floor. The ceiling is a passport a customer
            actually wants to scan.
          </p>
        </FadeUp>
        <FadeUp delay={0.22}>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-envrt-mute-cool sm:mt-8 sm:text-base lg:text-lg">
            Every garment carries a Digital Product Passport that satisfies
            EU ESPR and rewards the customer who picks it up. Audit-grade
            data underneath. Editorial finish on top.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
