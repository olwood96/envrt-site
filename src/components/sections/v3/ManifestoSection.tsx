"use client";

import Image from "next/image";
import { FadeUp } from "@/components/ui/Motion";

export function ManifestoSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28 lg:py-36">
      {/* Background photo: garment factory seamstress, very low opacity so it
          reads as a textural mood rather than a foreground image */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src="/v3-assets/manifesto.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.12]"
        />
        {/* Soft white fade to keep text legible */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-white/30" />
      </div>

      <div className="relative mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-16">
        <FadeUp>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-aqua sm:text-[11px]">
            Why ENVRT
          </p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <p className="mt-6 font-manrope text-[1.75rem] font-semibold leading-[1.12] tracking-[-0.02em] text-envrt-ink sm:mt-8 sm:text-4xl lg:text-[3rem]">
            Compliance is the floor. The ceiling is a passport a customer
            actually wants to scan.
          </p>
        </FadeUp>
        <FadeUp delay={0.22}>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-envrt-charcoal/70 sm:mt-8 sm:text-base lg:text-lg">
            Every garment carries a Digital Product Passport that satisfies
            EU ESPR and rewards the customer who picks it up. Audit-grade
            data underneath. Editorial finish on top.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
