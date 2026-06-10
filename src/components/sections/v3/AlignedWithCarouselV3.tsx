"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { FadeUp } from "@/components/ui/Motion";
import {
  ALIGNED_WITH_LOGOS,
  ALIGNED_WITH_STANDARDS,
} from "@/lib/aligned-with";
import { Eyebrow } from "./_shared";

// V3-styled variant of AlignedWithCarousel. Same data, brand-aligned styling.
// Logos animate in with a staggered cascade similar to merloop's pattern —
// each logo slides up + fades in 80ms after the previous one, once the grid
// enters the viewport.

export function AlignedWithCarouselV3() {
  return (
    <section
      aria-labelledby="aligned-with-v3-heading"
      className="relative bg-envrt-brand-vista py-16 sm:py-20 lg:py-24"
      style={{ overflowX: "clip" }}
    >
      <Container>
        <FadeUp>
          <Eyebrow className="text-center">Aligned with</Eyebrow>
          <h2
            id="aligned-with-v3-heading"
            className="mx-auto mt-4 max-w-2xl text-center font-display text-xl font-medium leading-tight tracking-tight text-envrt-brand-black sm:text-3xl lg:text-[2.25rem]"
          >
            Methodology that survives a regulator&apos;s PDF.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-envrt-brand-black/65 sm:text-base">
            EU Product Environmental Footprint, ISO 14040 lifecycle assessment
            standards and the AWARE water scarcity model. All cited, all live
            on every passport.
          </p>
        </FadeUp>

        {/* Logo grid with staggered cascade entrance (merloop-style) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08, delayChildren: 0.1 },
            },
          }}
          className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 sm:mt-14 md:grid-cols-3 md:gap-x-10 md:gap-y-12 lg:grid-cols-6 lg:gap-x-6"
        >
          {ALIGNED_WITH_LOGOS.map((logo) => (
            <motion.div
              key={logo.slug}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  },
                },
              }}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative flex h-12 w-full items-center justify-center grayscale transition-all duration-300 group-hover:grayscale-0 sm:h-16">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={180}
                  height={72}
                  sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw"
                  className="max-h-full w-auto object-contain"
                />
              </div>
              <span className="mt-4 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/55 sm:text-[11px]">
                {logo.label}
              </span>
              <span className="sr-only">{logo.description}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Standards line — Karla mono caps */}
        <p className="mx-auto mt-12 max-w-3xl text-center font-mono text-[10px] font-medium uppercase leading-relaxed tracking-[0.22em] text-envrt-brand-black/45 sm:mt-14 sm:text-[11px]">
          Referencing
          {ALIGNED_WITH_STANDARDS.map((standard) => (
            <span key={standard.slug}>
              <span aria-hidden> · </span>
              {standard.shortName}
              <span className="sr-only"> ({standard.description})</span>
            </span>
          ))}
        </p>
      </Container>
    </section>
  );
}
