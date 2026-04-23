"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Container } from "../ui/Container";
import { FadeUp } from "../ui/Motion";
import { howItWorksSteps } from "@/lib/config";

const NAV_H = 72;
const HEADER_H = 48;
const TOTAL = howItWorksSteps.length;

function StepCard({
  step,
  index,
}: {
  step: (typeof howItWorksSteps)[number];
  index: number;
}) {
  const stickyTop = NAV_H + 8 + index * HEADER_H;
  const isVideo = /\.(mp4|mov|webm|m4v)$/i.test(step.mockImage);
  const isLast = index === TOTAL - 1;

  // Each card lives inside a tall wrapper that gives scroll runway
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    // "start start" = when top of wrapper hits top of viewport
    // "end start"   = when bottom of wrapper hits top of viewport
    offset: ["start start", "end start"],
  });

  // Once you scroll past this card's wrapper the card is "covered" by the next.
  // Scale down from 1 -> 0.94 and dim from 1 -> 0.55 as scroll progresses.
  // Last card stays at full scale/opacity since nothing covers it.
  const scale = useTransform(scrollYProgress, [0, 1], isLast ? [1, 1] : [1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 1], isLast ? [1, 1] : [1, 0.55]);

  return (
    <div ref={wrapperRef} style={{ height: isLast ? "auto" : "70vh" }}>
      <motion.div
        className="sticky"
        style={{
          top: stickyTop,
          zIndex: 10 + index,
          scale,
          opacity,
          transformOrigin: "top center",
        }}
      >
        <div className="overflow-hidden rounded-2xl border border-envrt-charcoal/[0.06] bg-white shadow-lg shadow-envrt-green/[0.04]">
          {/* Header strip -- stays visible when next card covers the body */}
          <div className="flex items-center gap-3 border-b border-envrt-charcoal/[0.04] bg-envrt-cream/40 px-5 py-3 sm:px-7">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-envrt-teal/10 text-xs font-bold text-envrt-teal">
              {index + 1}
            </span>
            <span className="text-sm font-semibold text-envrt-charcoal">
              {step.verb}
            </span>
            <span className="hidden text-sm text-envrt-muted sm:inline">
              - {step.title}
            </span>
          </div>

          {/* Content */}
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
            <div className="flex flex-col justify-center">
              <h3 className="text-xl font-semibold text-envrt-charcoal sm:text-2xl">
                {step.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-envrt-muted">
                {step.description}
              </p>
              <ul className="mt-5 space-y-2.5">
                {step.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2.5 text-sm text-envrt-charcoal/80"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-envrt-teal" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-xl border border-envrt-charcoal/[0.04] bg-envrt-cream/30">
              {isVideo ? (
                <video
                  src={step.mockImage}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-contain"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={step.mockImage}
                  alt={`${step.verb} step`}
                  className="h-full w-full object-contain"
                />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function HowItWorksSection() {
  return (
    <div className="px-4 py-8 sm:px-6" id="how-it-works">
      <div className="scene-card noise-overlay mx-auto max-w-[1360px] overflow-visible rounded-scene">
        <Container className="py-16 sm:py-20">
          <FadeUp>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-envrt-teal">
                How it works
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-envrt-charcoal sm:text-4xl">
                Onboard once. Generate DPPs in minutes.
              </h2>
            </div>
          </FadeUp>

          <div className="mt-14">
            {howItWorksSteps.map((step, i) => (
              <StepCard key={step.id} step={step} index={i} />
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
}
