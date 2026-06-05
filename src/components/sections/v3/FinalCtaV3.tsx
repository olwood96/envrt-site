"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/ui/Motion";

export function FinalCtaV3() {
  return (
    <section className="relative overflow-hidden bg-envrt-stone py-20 sm:py-28 lg:py-36">
      {/* Background photo: knit textile stack, very subtle so the text and
          halo stay the focus */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src="/v3-assets/cta-texture.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.18]"
        />
        {/* Warm stone wash on top to hold the brand tone */}
        <div className="absolute inset-0 bg-envrt-stone/55" />
      </div>

      {/* Soft aqua halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-envrt-aqua/[0.14] blur-3xl"
      />

      <div className="relative mx-auto max-w-[1100px] px-5 text-center sm:px-8 lg:px-16">
        <FadeUp>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-aqua sm:text-[11px]">
            One last thing
          </p>
        </FadeUp>
        <FadeUp delay={0.08}>
          <h2 className="mx-auto mt-6 max-w-3xl font-manrope text-[1.85rem] font-semibold leading-[1.1] tracking-[-0.02em] text-envrt-ink sm:mt-8 sm:text-4xl lg:text-[2.85rem]">
            Try ENVRT on one garment. See if it earns the QR.
          </h2>
        </FadeUp>
        <FadeUp delay={0.18}>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-envrt-charcoal/70 sm:mt-6 sm:text-base lg:text-lg">
            Submit a single product. We&apos;ll return a regulation-ready
            Digital Product Passport within a day, no card required.
          </p>
        </FadeUp>
        <FadeUp delay={0.26}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row">
            <Button
              href="/free-dpp"
              size="md"
              className="w-full sm:w-auto sm:px-10 sm:py-3.5 sm:text-base"
              data-cta="final-v3-free-dpp"
            >
              Get a free DPP<span className="ml-2">→</span>
            </Button>
            <Button
              href="/contact"
              variant="secondary"
              size="md"
              className="w-full sm:w-auto sm:px-10 sm:py-3.5 sm:text-base"
              data-cta="final-v3-book-demo"
            >
              Book a demo
            </Button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
