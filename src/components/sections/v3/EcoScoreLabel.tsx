// ─── Coût Environnemental label ──────────────────────────────────────────
// Inline render matching the French government Eco-Score / Coût Environnemental
// label format. Replaces the previous screenshot of a screenshot. Stays crisp
// at any size and scales to the layout.
//
// Format reference:
//   - Black header strip with "COÛT ENVIRONNEMENTAL"
//   - Big score in points d'impact
//   - "X pts/100g" intensity at the foot
//
// Props let callers swap the numbers for the garment they're displaying.

type Props = {
  /** Headline points d'impact for the garment. */
  score: number;
  /** Per-100g intensity figure shown in the small footer. */
  perHundredG: number;
  /** Optional accent — for ENVRT pages a thin aqua corner reads as "verified". */
  envrtAccent?: boolean;
  className?: string;
};

export function EcoScoreLabel({
  score,
  perHundredG,
  envrtAccent = false,
  className = "",
}: Props) {
  return (
    <div
      className={`inline-flex flex-col items-stretch overflow-hidden rounded-md bg-white shadow-[0_4px_14px_-6px_rgba(0,0,0,0.18)] ring-2 ring-black ${className}`}
    >
      {/* Header strip */}
      <div className="flex items-center justify-between gap-3 bg-black px-3 py-1.5">
        <p className="font-manrope text-[10px] font-bold uppercase tracking-[0.14em] text-white">
          Coût Environnemental
        </p>
        {/* Iconic glyph — geometric dot pattern that nods to the official label */}
        <Glyph />
      </div>

      {/* Score body */}
      <div className="flex items-baseline gap-2 px-3 py-2.5">
        <p className="font-manrope text-3xl font-bold leading-none tracking-tight tabular-nums text-black">
          {score.toLocaleString("fr-FR")}
        </p>
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-black/65">
          points d&apos;impact
        </p>
      </div>

      {/* Per-100g footer. When envrtAccent is on, the verification chip uses
          the brand-stated pairing "Shamrock green + Sunny yellow" — Sunny
          Yellow background with Shamrock Green text reads as a certification
          badge, which is exactly what a "verified by" stamp is. */}
      <div
        className={`border-t border-black/10 px-3 py-1 ${
          envrtAccent ? "bg-envrt-brand-sunny" : "bg-[#fafaf8]"
        }`}
      >
        <p
          className={`text-[10px] font-semibold uppercase tracking-[0.12em] tabular-nums ${
            envrtAccent ? "text-envrt-brand-shamrock" : "text-black/70"
          }`}
        >
          {perHundredG} pts/100g
          {envrtAccent && (
            <span className="ml-2">· verified by ENVRT</span>
          )}
        </p>
      </div>
    </div>
  );
}

function Glyph() {
  // Geometric dot pattern — small abstraction of the Ecobalyse mark
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 flex-shrink-0"
      aria-hidden
    >
      <g fill="white">
        <circle cx="4" cy="5" r="1.4" />
        <circle cx="11" cy="3" r="1" />
        <circle cx="18" cy="6" r="1.6" />
        <circle cx="8" cy="11" r="2" />
        <circle cx="17" cy="12" r="1.4" />
        <circle cx="4" cy="17" r="1.2" />
        <circle cx="13" cy="19" r="1.8" />
        <circle cx="20" cy="18" r="1" />
      </g>
    </svg>
  );
}
