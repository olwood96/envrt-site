"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { Container } from "../../ui/Container";
import { FadeUp } from "../../ui/Motion";
import { siteConfig } from "@/lib/config";

// ─── Geometry ─────────────────────────────────────────────────────────────
// Visible window of the DPP visual.
const FRAME_HEIGHT = 600;
// Natural rendered height we give the iframe so the whole DPP page is laid
// out inside it. Tune by eye once the section is live.
const IFRAME_NATURAL_HEIGHT = 2400;
// How far the iframe can translate upward inside the window.
const TRANSLATE_RANGE = IFRAME_NATURAL_HEIGHT - FRAME_HEIGHT;
// Outer stage height in viewport units. Sets the scroll runway.
const STAGE_HEIGHT_VH = 320;

type Callout = {
  id: number;
  label: string;
  body: string;
  // Active range as fractions of section scroll progress (0–1).
  range: [number, number];
};

const callouts: Callout[] = [
  {
    id: 1,
    label: "Scanned from the tag",
    body: "What a customer sees when they scan the QR on the garment label.",
    range: [0.0, 0.25],
  },
  {
    id: 2,
    label: "Headline impact",
    body: "CO₂e and water scarcity per garment, calculated using peer-reviewed methods.",
    range: [0.25, 0.5],
  },
  {
    id: 3,
    label: "Full supply chain",
    body: "Every stage from fibre to finished garment, mapped and traceable.",
    range: [0.5, 0.75],
  },
  {
    id: 4,
    label: "French Eco-Score",
    body: "Regulation-recognised environmental class, calculated to the published methodology.",
    range: [0.75, 1.0],
  },
];

function rangeMidpoint(c: Callout) {
  return (c.range[0] + c.range[1]) / 2;
}

export function DppAnatomySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Damp the raw scroll value so the iframe pan feels gentle.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const iframeY = useTransform(smoothProgress, [0, 1], [0, -TRANSLATE_RANGE]);

  // Anchor dot vertical position on the visual frame, derived from progress.
  const anchorTop = useTransform(
    smoothProgress,
    callouts.map(rangeMidpoint),
    callouts.map((_, i) => `${(i / (callouts.length - 1)) * 80 + 10}%`),
  );

  const [activeIndex, setActiveIndex] = useState(0);
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    const next = callouts.findIndex((c) => latest >= c.range[0] && latest < c.range[1]);
    setActiveIndex(next === -1 ? callouts.length - 1 : next);
  });

  return (
    <section className="px-4 sm:px-6" id="what-is-a-dpp">
      <Container>
        <FadeUp>
          <div className="mx-auto max-w-2xl pt-16 text-center sm:pt-24">
            <p className="text-xs font-medium uppercase tracking-widest text-envrt-teal">
              The product
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-envrt-charcoal sm:text-4xl">
              What&apos;s in a Digital Product Passport.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-envrt-muted sm:text-lg">
              Scroll the page to walk through a live passport. Labels light up as each part comes into view.
            </p>
          </div>
        </FadeUp>

        {/* Mobile: simple stacked view */}
        <div className="lg:hidden">
          <FadeUp delay={0.1}>
            <div className="mx-auto mt-12 w-full max-w-[300px]">
              <div className="relative overflow-hidden rounded-[2rem] border border-envrt-charcoal/10 bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)]">
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: "9 / 16" }}>
                  <iframe
                    src={siteConfig.dppDemoEmbedUrl}
                    title="What's in a Digital Product Passport"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full border-0"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-envrt-muted/70">
                ↕ Scroll inside the passport
              </p>
            </div>
          </FadeUp>
          <ol className="mx-auto mt-12 grid max-w-md gap-7 pb-16 sm:pb-24">
            {callouts.map((c, i) => (
              <FadeUp key={c.id} delay={0.05 * (i + 1)}>
                <li className="flex gap-5">
                  <span className="text-2xl font-bold leading-none text-envrt-teal">
                    {String(c.id).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-envrt-charcoal">{c.label}</p>
                    <p className="mt-1 text-sm leading-relaxed text-envrt-muted">{c.body}</p>
                  </div>
                </li>
              </FadeUp>
            ))}
          </ol>
        </div>

        {/* Desktop: scrollytelling stage */}
        <div
          ref={containerRef}
          className="relative mx-auto hidden max-w-[1100px] lg:block"
          style={{ height: `${STAGE_HEIGHT_VH}vh` }}
        >
          <div className="sticky top-0 flex h-screen items-center justify-center pt-12">
            <div className="grid w-full grid-cols-[1fr_1fr] items-center gap-12 xl:gap-20">
              {/* Sticky callouts column */}
              <div className="flex flex-col gap-8">
                {callouts.map((c, i) => (
                  <DesktopCallout key={c.id} callout={c} isActive={i === activeIndex} />
                ))}
              </div>

              {/* Visual frame */}
              <div className="relative mx-auto w-full max-w-[340px]">
                <div
                  className="relative overflow-hidden rounded-[2rem] border border-envrt-charcoal/10 bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)]"
                  style={{ height: FRAME_HEIGHT }}
                >
                  <motion.iframe
                    src={siteConfig.dppDemoEmbedUrl}
                    title="What's in a Digital Product Passport"
                    loading="lazy"
                    className="pointer-events-none absolute left-0 top-0 w-full border-0"
                    style={{ y: iframeY, height: IFRAME_NATURAL_HEIGHT }}
                    sandbox="allow-scripts allow-same-origin"
                  />
                  {/* Hairline anchor dot that tracks the active callout */}
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 z-10 flex items-center"
                    style={{ top: anchorTop }}
                  >
                    <span className="block h-px w-6 bg-envrt-teal" />
                    <span className="block h-2 w-2 -translate-x-1/2 rounded-full bg-envrt-teal" />
                  </motion.div>
                </div>
                <p className="mt-3 text-center text-xs text-envrt-muted/60">
                  ↕ Page scroll pans the passport
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function DesktopCallout({ callout, isActive }: { callout: Callout; isActive: boolean }) {
  return (
    <motion.div
      animate={{ opacity: isActive ? 1 : 0.35 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex gap-5"
    >
      <span className="text-3xl font-bold leading-none tracking-tight text-envrt-teal sm:text-4xl">
        {String(callout.id).padStart(2, "0")}
      </span>
      <div className="flex-1">
        <p className="text-lg font-semibold text-envrt-charcoal">{callout.label}</p>
        <p className="mt-2 text-sm leading-relaxed text-envrt-muted">{callout.body}</p>
      </div>
    </motion.div>
  );
}
