"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Container } from "../ui/Container";
import { FadeUp } from "../ui/Motion";
import { howItWorksSteps } from "@/lib/config";

const NAV_H = 72;
const HEADER_H = 48;
const TOTAL = howItWorksSteps.length;

function StepCard({
  step,
  index,
  containerProgress,
}: {
  step: (typeof howItWorksSteps)[number];
  index: number;
  containerProgress: MotionValue<number>;
}) {
  const stickyTop = NAV_H + 8 + index * HEADER_H;
  const isVideo = /\.(mp4|mov|webm|m4v)$/i.test(step.mockImage);
  const isLast = index === TOTAL - 1;

  // Earlier cards scale down more when fully covered — creates depth
  // Card 0 → 0.88, Card 1 → 0.92, Card 2 → 0.96, Card 3 → 1.0
  const targetScale = isLast ? 1 : 1 - (TOTAL - 1 - index) * 0.04;
  const rangeStart = index / TOTAL;
  const scale = useTransform(containerProgress, [rangeStart, 1], [1, targetScale]);
  const opacity = useTransform(
    containerProgress,
    [rangeStart, 1],
    isLast ? [1, 1] : [1, 0.4]
  );

  return (
    // Wrapper height provides scroll runway — the empty space is covered
    // by the next sticky card so it's never visible
    <div style={{ height: isLast ? "auto" : "100vh" }}>
      <motion.div
        className="sticky"
        style={{
          top: stickyTop,
          zIndex: 10 + index,
          scale,
          opacity,
          transformOrigin: "top center",
          willChange: "transform",
        }}
      >
        <div className="overflow-hidden rounded-2xl border border-envrt-charcoal/[0.06] bg-white shadow-lg shadow-envrt-green/[0.04]">
          {/* Header strip — stays visible when next card covers the body */}
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

          {/* Image — full width centrepiece */}
          <div className="overflow-hidden border-b border-envrt-charcoal/[0.04] bg-envrt-cream/30 p-4 sm:p-6">
            <div className="overflow-hidden rounded-lg">
              {isVideo ? (
                <video
                  src={step.mockImage}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full object-contain"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={step.mockImage}
                  alt={`${step.verb} step`}
                  className="w-full object-contain"
                />
              )}
            </div>
          </div>

          {/* Text */}
          <div className="p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-envrt-charcoal sm:text-2xl">
              {step.title}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-envrt-muted">
              {step.description}
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {step.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-sm text-envrt-charcoal/80"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-envrt-teal" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section className="px-4 py-8 sm:px-6" id="how-it-works">
      <div
        className="noise-overlay mx-auto max-w-[1360px] rounded-scene"
        style={{
          overflow: "visible",
          background: "linear-gradient(135deg, #faf9f7 0%, #f6f5f2 100%)",
          border: "1px solid rgba(0, 0, 0, 0.04)",
          position: "relative",
        }}
      >
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

          <div ref={containerRef} className="mt-14">
            {howItWorksSteps.map((step, i) => (
              <StepCard
                key={step.id}
                step={step}
                index={i}
                containerProgress={scrollYProgress}
              />
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
