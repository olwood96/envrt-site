"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ButtonV3 } from "@/components/v3";
import { FadeUp } from "@/components/ui/Motion";
import {
  DotGridBackground,
  Eyebrow,
  SECTION_SPRING,
  SectionCorners,
} from "./_shared";

export function FinalCtaV3() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: rawProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scrollYProgress = useSpring(rawProgress, SECTION_SPRING);
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

      <DotGridBackground />
      <span aria-hidden className="pointer-events-none absolute inset-x-12 top-0 h-px bg-[rgb(var(--accent-rgb)/0.45)]" />
      <span aria-hidden className="pointer-events-none absolute inset-x-12 bottom-0 h-px bg-[rgb(var(--accent-rgb)/0.45)]" />
      <SectionCorners left="ENVRT/CTA" right="v3" />

      <div className="relative mx-auto max-w-[1100px] px-5 text-center sm:px-8 lg:px-16">
        <FadeUp>
          <Eyebrow>One last thing</Eyebrow>
        </FadeUp>
        <FadeUp delay={0.08}>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-[1.55rem] font-medium leading-[1.1] tracking-[-0.02em] text-envrt-brand-black sm:mt-8 sm:text-4xl lg:text-[2.85rem]">
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
            <ButtonV3
              href="//free-dpp"
              variant="primary"
              size="lg"
              data-cta="final-v3-free-dpp"
            >
              Get a free DPP<span aria-hidden>→</span>
            </ButtonV3>
            <ButtonV3
              href="//contact"
              variant="secondary"
              size="lg"
              data-cta="final-v3-book-demo"
            >
              Book a demo
            </ButtonV3>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
