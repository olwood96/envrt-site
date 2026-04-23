"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { howItWorksSteps } from "@/lib/config";

const NAV_H = 72;
const TAB_H = 84;
const TOTAL = howItWorksSteps.length;
const TRANSITIONS = TOTAL - 1;
const TRANSITION_END = 0.8; // last 20% of scroll is hold time

function StepCard({
  step,
  index,
  progress,
}: {
  step: (typeof howItWorksSteps)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const isVideo = /\.(mp4|mov|webm|m4v)$/i.test(step.mockImage);

  // Card 0 stays in place. Cards 1+ slide up from below during their phase.
  const phaseStart = ((index - 1) / TRANSITIONS) * TRANSITION_END;
  const phaseEnd = (index / TRANSITIONS) * TRANSITION_END;

  const y = useTransform(
    progress,
    index === 0 ? [0, 1] : [phaseStart, phaseEnd],
    index === 0 ? [0, 0] : [3000, 0],
  );

  return (
    <motion.div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: index * TAB_H,
        bottom: 0,
        zIndex: index,
        y,
        willChange: "transform",
      }}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-t-xl border border-b-0 border-envrt-charcoal/[0.06] bg-white shadow-lg shadow-envrt-green/[0.06]">
        {/* Tab - always visible when covered by the next card */}
        <div
          className="flex flex-shrink-0 flex-col justify-center gap-0.5 border-b border-envrt-charcoal/[0.04] bg-envrt-cream/40 px-5 sm:px-7"
          style={{ height: TAB_H }}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-envrt-teal/10 text-xs font-bold text-envrt-teal">
              {index + 1}
            </span>
            <p className="truncate text-sm font-semibold text-envrt-charcoal">
              {step.verb}
              <span className="ml-2 font-normal text-envrt-muted">
                - {step.title}
              </span>
            </p>
          </div>
          <p className="truncate pl-10 text-xs text-envrt-muted">
            {step.description}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Image */}
          <div className="border-b border-envrt-charcoal/[0.04] bg-envrt-cream/30 p-4 sm:p-6">
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
          <div className="p-5 sm:p-6">
            <p className="text-base leading-relaxed text-envrt-muted">
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
      </div>
    </motion.div>
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
      {/* Tall scroll runway - invisible, just provides scroll distance */}
      <div
        ref={containerRef}
        className="mx-auto max-w-[1360px]"
        style={{ height: `${TOTAL * 100}vh` }}
      >
        {/* Sticky viewport - pins to screen while you scroll through the runway */}
        <div
          style={{
            position: "sticky",
            top: NAV_H,
            height: `calc(100vh - ${NAV_H + 16}px)`,
          }}
        >
          {/* Visual container */}
          <div
            className="noise-overlay flex h-full flex-col rounded-scene"
            style={{
              background: "linear-gradient(135deg, #faf9f7 0%, #f6f5f2 100%)",
              border: "1px solid rgba(0, 0, 0, 0.04)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div className="flex h-full flex-col px-5 sm:px-8">
              {/* Heading */}
              <div className="flex-shrink-0 pb-6 pt-10 text-center">
                <p className="text-xs font-medium uppercase tracking-widest text-envrt-teal">
                  How it works
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-envrt-charcoal sm:text-4xl">
                  Onboard once. Generate DPPs in minutes.
                </h2>
              </div>

              {/* Cards area */}
              <div className="relative mb-6 min-h-0 flex-1">
                {howItWorksSteps.map((step, i) => (
                  <StepCard
                    key={step.id}
                    step={step}
                    index={i}
                    progress={scrollYProgress}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
