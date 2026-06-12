"use client";

import { motion } from "framer-motion";

// Typography-based wordmark used in the mobile navbar pill so we can
// morph ENVRT ↔ NV smoothly as the bar compacts and expands on scroll.
// Renders as five separate letters using N27 (the brand's wordmark
// font); E, R and T collapse their max-width and fade out when
// compact, leaving N + V at full size. The pill width naturally
// shrinks as a result without any explicit width animation.
//
// Desktop continues to use the official PNG via <EnvrtLogo />. We
// reach for typography only on the surface where the morph is
// load-bearing.

type Letter = {
  char: string;
  keep: boolean;
};

const LETTERS: Letter[] = [
  { char: "E", keep: false },
  { char: "N", keep: true },
  { char: "V", keep: true },
  { char: "R", keep: false },
  { char: "T", keep: false },
];

// Spring tuned for a quick, springy expansion (Instagram-style bounce)
// and a slightly damped contraction. Same stiffness both ways keeps the
// motion familiar; mass and damping change the bounce character.
const SPRING = {
  type: "spring" as const,
  stiffness: 280,
  damping: 18,
  mass: 0.7,
};

export function EnvrtMorphLogo({ compact }: { compact: boolean }) {
  return (
    <span
      aria-label="ENVRT"
      className="inline-flex select-none items-baseline font-n27 text-[1.35rem] font-bold leading-none tracking-[0.01em] text-envrt-brand-black sm:text-[1.5rem]"
    >
      {LETTERS.map((l, i) => {
        const hide = compact && !l.keep;
        return (
          <motion.span
            key={i}
            initial={false}
            animate={{
              maxWidth: hide ? "0em" : "0.85em",
              opacity: hide ? 0 : 1,
            }}
            transition={SPRING}
            style={{
              display: "inline-block",
              overflow: "hidden",
              verticalAlign: "baseline",
            }}
            aria-hidden
          >
            {l.char}
          </motion.span>
        );
      })}
    </span>
  );
}
