interface CompositionTagProps {
  /** First line, always shown. Eg "100% Cotton" or "60% Cotton · 40% Polyester". */
  material: string;
  /** Second line. Eg "Made in Portugal". Omitted when null. */
  origin: string | null;
  /** Third line. Eg 2026. Omitted when null. */
  year: number | null;
  /** Plays the one-time settle-in wobble on first mount. */
  animateOnMount?: boolean;
}

/**
 * Small kraft-paper hangtag pinned to the top-left corner of the card image.
 *
 * Resting state: rotated -5deg, height clipped to show only the material line.
 * On parent hover (closest `.group` ancestor): rotates to 0deg, height
 * expands to reveal origin and year. Transitions are 250ms ease-out.
 *
 * The tag deliberately reads like a real garment hangtag and the data on it
 * (material composition, country of origin, year of listing) is universal
 * across every DPP so it never causes scrutiny.
 */
export function CompositionTag({
  material,
  origin,
  year,
  animateOnMount = false,
}: CompositionTagProps) {
  const wobbleClass = animateOnMount ? "animate-tag-wobble" : "";

  return (
    <div
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
