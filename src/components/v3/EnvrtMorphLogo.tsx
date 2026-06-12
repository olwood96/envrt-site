"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// Morphs between the two real brand marks: the full ENVRT wordmark
// and the standalone NV mark (the same one used as the favicon).
// Both PNGs sit stacked in the same fixed-height window; the visible
// one cross-fades while the outer container width animates to fit
// whichever mark is showing. NV stays anchored to the left edge so
// the wordmark feels like it's collapsing inward to its initials.
//
// Two source assets so each mark renders with its own designed
// geometry rather than as a crop of the other.

import type { Transition } from "framer-motion";

const SPRING: Transition = {
  type: "spring",
  stiffness: 280,
  damping: 18,
  mass: 0.7,
};

// ENVRT wordmark is 1643×518 → ratio ≈ 3.17
// NV mark is 384×344 → ratio ≈ 1.12 (two bars + diagonal, slightly
// wider than tall).
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
    <motion.div
      role="img"
      aria-label="ENVRT"
      initial={false}
      animate={{ width: compact ? nvWidth : envrtWidth }}
      transition={SPRING}
      style={{
        height,
        position: "relative",
      }}
    >
      {/* Full ENVRT wordmark — anchored to left edge, fades on compact.
          mix-blend-mode: multiply drops the PNG's white background so
          only the black strokes show against the glass pill. */}
      <motion.div
        initial={false}
        animate={{ opacity: compact ? 0 : 1 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: 0,
          width: envrtWidth,
          height,
          mixBlendMode: "multiply",
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

      {/* NV mark — anchored to left edge, fades in on compact. Same
          multiply blend so the PNG's white box dissolves. */}
      <motion.div
        initial={false}
        animate={{ opacity: compact ? 1 : 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: 0,
          width: nvWidth,
          height,
          mixBlendMode: "multiply",
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
    </motion.div>
  );
}
