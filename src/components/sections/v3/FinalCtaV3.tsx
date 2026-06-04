"use client";

import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/ui/Motion";

export function FinalCtaV3() {
  return (
    <section className="relative overflow-hidden bg-envrt-ink py-24 sm:py-32 lg:py-40">
      {/* Subtle teal halo to lift the dark ground */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-envrt-teal/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-[1100px] px-6 text-center sm:px-10 lg:px-16">
        <FadeUp>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-envrt-teal-light">
            One last thing
          </p>
        </FadeUp>
        <FadeUp delay={0.08}>
          <h2 className="mx-auto mt-8 max-w-3xl text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-envrt-offwhite sm:text-4xl lg:text-[3rem]">
            Try ENVRT on one garment. See if it earns the QR.
          </h2>
        </FadeUp>
        <FadeUp delay={0.18}>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-envrt-offwhite/65 sm:text-lg">
            Submit a single product. We&apos;ll return a regulation-ready
            Digital Product Passport within a day, no card required.
          </p>
        </FadeUp>
        <FadeUp delay={0.26}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              href="/free-dpp"
              size="md"
              className="sm:px-10 sm:py-4 sm:text-base"
              data-cta="final-v3-free-dpp"
            >
              Get a free DPP<span className="ml-2">→</span>
            </Button>
            <Button
              href="/contact"
              variant="secondary"
              size="md"
              className="sm:px-10 sm:py-4 sm:text-base"
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
