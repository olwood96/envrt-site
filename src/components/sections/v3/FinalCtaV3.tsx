"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/ui/Motion";

export function FinalCtaV3() {
  // Subtle parallax on the background image — moves slower than the page
  // scroll over the section's height.
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-envrt-stone py-20 sm:py-28 lg:py-36">
      {/* Background photo with parallax shift */}
      <motion.div
        aria-hidden
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-x-0 -top-[6%] -bottom-[6%]"
      >
        <Image
          src="/v3-assets/cta-texture.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.18]"
        />
        <div className="absolute inset-0 bg-envrt-stone/55" />
      </motion.div>

      {/* Soft aqua halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-envrt-brand-ultramarine/[0.14] blur-3xl"
      />

      <div className="relative mx-auto max-w-[1100px] px-5 text-center sm:px-8 lg:px-16">
        <FadeUp>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine sm:text-[11px]">
            One last thing
          </p>
        </FadeUp>
        <FadeUp delay={0.08}>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-[1.85rem] font-medium leading-[1.1] tracking-[-0.02em] text-envrt-brand-black sm:mt-8 sm:text-4xl lg:text-[2.85rem]">
            Try ENVRT on one garment. See if it earns the QR.
          </h2>
        </FadeUp>
        <FadeUp delay={0.18}>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-envrt-brand-black/70 sm:mt-6 sm:text-base lg:text-lg">
            Submit a single product. We&apos;ll return a regulation-ready
            Digital Product Passport within a day, no card required.
          </p>
        </FadeUp>
        <FadeUp delay={0.26}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row">
            {/* Brand-aligned primary, matches hero. */}
            <Button
              href="/free-dpp"
              size="md"
              className="w-full !bg-envrt-brand-ultramarine !text-white shadow-[0_12px_28px_-14px_rgba(62,0,255,0.7)] hover:!bg-envrt-brand-ultramarine/90 sm:w-auto sm:px-10 sm:py-3.5 sm:text-base"
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
