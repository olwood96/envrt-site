"use client";

import { useEffect, useRef, useState } from "react";

interface CompositionTagProps {
  /** First line, always shown. Eg "100% Cotton" or "60% Cotton · 40% Polyester". */
  material: string;
  /** Second line. Eg "Made in Portugal". Omitted when null. */
  origin: string | null;
  /** Third line. Eg 2026. Omitted when null. */
  year: number | null;
}

/**
 * Small kraft-paper hangtag pinned to the top-left corner of the card image.
 *
 * Resting state: rotated -5deg, height clipped to show only the material line.
 * On parent hover (closest `.group` ancestor): rotates to 0deg, height
 * expands to reveal origin and year. Transitions are 250ms ease-out.
 *
 * Plays a one-time settle-in wobble the first time the card scrolls into the
 * viewport. Driven by IntersectionObserver rather than mount so cards below
 * the fold animate when the user actually reaches them, and on mobile the
 * tag responds to the user's attention even without a hover state.
 */
export function CompositionTag({ material, origin, year }: CompositionTagProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hasWobbled, setHasWobbled] = useState(false);

  useEffect(() => {
    if (hasWobbled) return;
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      // SSR or older runtimes: skip the wobble entirely rather than guess.
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setHasWobbled(true);
            observer.disconnect();
            return;
          }
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasWobbled]);

  const wobbleClass = hasWobbled ? "animate-tag-wobble" : "";

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute left-3 top-2 z-30 origin-top-left"
      aria-label={`Composition: ${material}${origin ? ", " + origin : ""}${year ? ", " + year : ""}`}
    >
      {/* String anchoring the tag to the card */}
      <span aria-hidden="true" className="tag-string" />
      <div
        className={`tag-paper ${wobbleClass} group-hover:[transform:rotate(0deg)] group-hover:[max-height:60px]`}
      >
        <p className="tag-line">{material}</p>
        {origin && <p className="tag-line tag-line-secondary">{origin}</p>}
        {year && <p className="tag-line tag-line-secondary">{year}</p>}
      </div>
    </div>
  );
}
