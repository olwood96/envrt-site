"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { howItWorksSteps } from "@/lib/config";

const NAV_H = 72;
const TAB_H = 44;
const TOTAL = howItWorksSteps.length;

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

  // 3 transitions spread evenly across 0-1. No dead scroll zones.
  const transitions = TOTAL - 1;
  const phaseStart = (index - 1) / transitions;
  const phaseEnd = index / transitions;

  const y = useTransform(
    progress,
    index === 0 ? [0, 1] : [phaseStart, phaseEnd],
    index === 0 ? [0, 0] : [2000, 0],
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
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-envrt-charcoal/[0.06] bg-white shadow-lg shadow-envrt-green/[0.06]">
        {/* Tab - just the title, stays visible when covered */}
        <div
          className="flex flex-shrink-0 items-center gap-3 border-b border-envrt-charcoal/[0.04] bg-envrt-cream/40 px-5 sm:px-7"
          style={{ height: TAB_H }}
        >
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-envrt-teal/10 text-xs font-bold text-envrt-teal">
            {index + 1}
          </span>
          <p className="truncate text-sm font-semibold text-envrt-charcoal">
            {step.verb}
            <span className="ml-2 font-normal text-envrt-muted">
              - {step.title}
            </span>
          </p>
        </div>

        {/* Content: text left (1/4), image right (3/4) */}
        <div className="grid min-h-0 flex-1 grid-cols-[1fr_3fr]">
          <div className="flex flex-col justify-center border-r border-envrt-charcoal/[0.04] p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-envrt-charcoal">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-envrt-muted">
              {step.description}
            </p>
            <ul className="mt-3 space-y-1.5">
              {step.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-xs text-envrt-charcoal/80"
                >
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-envrt-teal" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="overflow-hidden bg-envrt-cream/30 p-4 sm:p-5">
            <div className="flex h-full items-center justify-center overflow-hidden rounded-lg">
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
      <div
        ref={containerRef}
        className="mx-auto max-w-[1360px]"
        style={{ height: `${TOTAL * 100}vh` }}
      >
        <div
          style={{
            position: "sticky",
            top: NAV_H,
            height: `calc(100vh - ${NAV_H + 16}px)`,
          }}
        >
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
              <div className="flex-shrink-0 pb-6 pt-10 text-center">
                <p className="text-xs font-medium uppercase tracking-widest text-envrt-teal">
                  How it works
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-envrt-charcoal sm:text-4xl">
                  Onboard once. Generate DPPs in minutes.
                </h2>
              </div>

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
