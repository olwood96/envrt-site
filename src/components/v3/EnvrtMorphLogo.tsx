"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// Morphs between the two real brand marks: the full ENVRT wordmark
// and the standalone NV mark. The pill itself shrinks via parent
// `transform: scale()` (GPU-composited); this component handles the
// cross-fade between the two assets and snaps its container width
// so the surrounding pill can collapse to a button shape around just
// NV in compact mode.
//
// The width snap is one-shot on the compact toggle, not a per-frame
// animation, so it doesn't stutter the scroll-pinned sections
// (Polaroid, ScrollTour) the way continuous layout-property
// animations would. The cross-fade remains opacity only.

const FADE = { duration: 0.18, ease: "easeOut" } as const;

// Source dimensions. The container resizes between two fixed widths:
// envrtWidth when expanded, nvWidth when compact. overflow: hidden
// clips the ENVRT image during the fade-out so it doesn't extend
// past the new right edge.
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
        width: compact ? nvWidth : envrtWidth,
        height,
        position: "relative",
        overflow: "hidden",
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
