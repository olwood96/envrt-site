"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { FadeUp } from "@/components/ui/Motion";
import { Eyebrow, SECTION_SPRING, SectionCorners } from "@/components/sections/v3/_shared";

// Polaroid stack — sticky 100vh window with five photo cards that fly in
// from below as scroll progresses, fanning into a centred stack like a
// research-notebook reference spread. Each polaroid corresponds to a
// lifecycle stage; the stage label + a single-line note sits in the white
// caption strip beneath the photo. Uses existing v3-assets only, no new
// sourcing required.

type Polaroid = {
  index: string;
  stage: string;
  note: string;
  src: string;
  alt: string;
  finalRotate: number;
  finalX: number; // px offset from centre
  finalY: number; // px offset from centre
};

const POLAROIDS: Polaroid[] = [
  {
    index: "01",
    stage: "Fibre",
    note: "Raw fibre, density and origin",
    src: "/v3-assets/story-fabric.jpg",
    alt: "Cream fabric texture, raw fibre",
    finalRotate: -10,
    finalX: -120,
    finalY: -10,
  },
  {
    index: "02",
    stage: "Yarn",
    note: "Spun thread, dyed in tier",
    src: "/v3-assets/provenance-loom.jpg",
    alt: "Coloured loom threads",
    finalRotate: -5,
    finalX: -60,
    finalY: 6,
  },
  {
    index: "03",
    stage: "Fabric",
    note: "Knit and finish",
    src: "/v3-assets/folded-clothes.jpg",
    alt: "Folded knitwear",
    finalRotate: 0,
    finalX: 0,
    finalY: 0,
  },
  {
    index: "04",
    stage: "Assembly",
    note: "Cut, sew, trims",
    src: "/v3-assets/manifesto.jpg",
    alt: "Sewing machine operator on the assembly floor",
    finalRotate: 6,
    finalX: 60,
    finalY: 4,
  },
  {
    index: "05",
    stage: "Finished",
    note: "Stitched, tagged, shipped",
    src: "/v3-assets/cta-texture.jpg",
    alt: "Stack of finished knit garments",
    finalRotate: 11,
    finalX: 120,
    finalY: -8,
  },
];

// Each polaroid's scroll window. Start offsets so cards stagger into the
// stack one after another; each takes 18% of section scroll to settle.
const ENTRY_WINDOW = 0.18;
const ENTRY_STAGGER = 0.12;

export function PolaroidStackSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: rawProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Shared smooth-scroll spring used across all v3 scroll-pinned sections.
  const progress = useSpring(rawProgress, SECTION_SPRING);

  return (
    <section
      ref={sectionRef}
      className="relative bg-envrt-brand-vista"
      style={{ height: "320vh", overflowX: "clip" }}
    >
      <SectionCorners left="ENVRT/02" right="Field notes" />

      <div className="sticky top-0 flex h-screen flex-col items-center justify-center px-5 sm:px-8 lg:px-16">
        <div className="mx-auto w-full max-w-[1100px]">
          <div className="mx-auto max-w-2xl text-center">
            <FadeUp>
              <Eyebrow>Field notes</Eyebrow>
            </FadeUp>
            <FadeUp delay={0.08}>
              <h2 className="mt-4 font-display text-3xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-4xl lg:text-[2.75rem]">
                Every stage, captured.{" "}
                <span className="text-envrt-brand-black/40">
                  Every input, traced.
                </span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.16}>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-envrt-brand-black/65 sm:text-base">
                Fibre, yarn, fabric, assembly, finished. Each lifecycle stage
                ties back to a verified factor source and a calculated impact.
              </p>
            </FadeUp>
          </div>

          {/* Stack stage — polaroids fly in from below as scroll
              progresses and fan into a centred spread. */}
          <div className="relative mx-auto mt-12 h-[440px] w-full max-w-[520px] sm:mt-16 sm:h-[480px]">
            {POLAROIDS.map((p, i) => (
              <PolaroidCard
                key={p.index}
                polaroid={p}
                progress={progress}
                start={i * ENTRY_STAGGER}
                end={i * ENTRY_STAGGER + ENTRY_WINDOW}
                zIndex={i + 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PolaroidCard({
  polaroid,
  progress,
  start,
  end,
  zIndex,
}: {
  polaroid: Polaroid;
  progress: MotionValue<number>;
  start: number;
  end: number;
  zIndex: number;
}) {
  // Polaroid enters from below the viewport and lands at finalX/finalY
  // with finalRotate. y starts at 120% (well below the stack), rotation
  // starts at -25° (looks tossed onto the stack), opacity 0 → 1.
  const y = useTransform(progress, [start, end], [600, polaroid.finalY]);
  const x = useTransform(progress, [start, end], [0, polaroid.finalX]);
  const rotate = useTransform(progress, [start, end], [-25, polaroid.finalRotate]);
  const opacity = useTransform(progress, [start, start + 0.02], [0, 1]);

  return (
    <motion.div
      style={{ x, y, rotate, opacity, zIndex }}
      className="absolute left-1/2 top-1/2 -ml-[120px] -mt-[155px] sm:-ml-[140px] sm:-mt-[185px]"
    >
      <div className="w-[240px] rounded-sm bg-white p-3 pb-5 shadow-[0_24px_50px_-18px_rgba(14,14,14,0.35)] ring-1 ring-envrt-brand-black/8 sm:w-[280px] sm:p-4 sm:pb-6">
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={polaroid.src}
            alt={polaroid.alt}
            fill
            sizes="(min-width: 640px) 280px, 240px"
            className="object-cover"
          />
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-2 px-1 sm:mt-4">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine">
            {polaroid.index} · {polaroid.stage}
          </span>
        </div>
        <p className="mt-1 px-1 font-mono text-[10px] uppercase tracking-[0.14em] text-envrt-brand-black/55">
          {polaroid.note}
        </p>
      </div>
    </motion.div>
  );
}
