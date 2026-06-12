"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// Morphs between the two real brand marks: the full ENVRT wordmark
// and the standalone NV mark. Visual shrink of the pill itself is
// done on the parent via `transform: scale()` (GPU-composited), so
// this component only handles the cross-fade between the two assets.
//
// Critical: this component MUST NOT animate width, height, padding,
// margin or any other layout property. Layout-property animations
// during scroll-pinned section playback cause main-thread reflow
// that stutters the heavy useScroll/useTransform chains in those
// sections (Polaroid, ScrollTour). All animations here are opacity
// only — pure GPU composite, no main-thread cost.

const FADE = { duration: 0.18, ease: "easeOut" } as const;

// Source dimensions used to pick a stable container size. Container
// width is the FULL ENVRT width at all times so layout never moves;
// the NV image renders left-aligned inside that fixed slot.
const ENVRT_RATIO = 1643 / 518;
const NV_RATIO = 384 / 344;

export function EnvrtMorphLogo({
  compact,
  height = 24,
}: {
  compact: boolean;
  height?: number;
}) {
  const envrtWidth = Math.round(height * ENVRT_RATIO);
  const nvWidth = Math.round(height * NV_RATIO);

  return (
    <div
      role="img"
      aria-label="ENVRT"
      style={{
        // Fixed-width container. The pill shrinks via parent scale
        // transform, not by changing this width.
        width: envrtWidth,
        height,
        position: "relative",
      }}
    >
      {/* Full ENVRT wordmark — left-anchored, fades out on compact. */}
      <motion.div
        initial={false}
        animate={{ opacity: compact ? 0 : 1 }}
        transition={FADE}
        style={{
          position: "absolute",
          inset: 0,
          width: envrtWidth,
          height,
        }}
      >
        <Image
          src="/brand/envrt-logo.png"
          alt=""
          width={envrtWidth}
          height={height}
          priority
          style={{ display: "block", width: envrtWidth, height }}
        />
      </motion.div>

      {/* NV mark — sits in the leftmost slot, fades in on compact. */}
      <motion.div
        initial={false}
        animate={{ opacity: compact ? 1 : 0 }}
        transition={FADE}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: nvWidth,
          height,
        }}
      >
        <Image
          src="/brand/envrt-nv.png"
          alt=""
          width={nvWidth}
          height={height}
          priority
          style={{ display: "block", width: nvWidth, height }}
        />
      </motion.div>
    </div>
  );
}
