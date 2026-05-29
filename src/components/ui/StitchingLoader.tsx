interface StitchingLoaderProps {
  /** Visible label beneath the stitch line. Defaults to "Loading". */
  label?: string;
  /** Optional extra classes on the wrapper for layout adjustments. */
  className?: string;
}

/**
 * Calm loading indicator. Renders a short italic label with an animated
 * dashed line beneath it that marches left-to-right like a sewing machine
 * stitch. The motion is the only animation, the label tells the user what
 * is happening. Honours `prefers-reduced-motion` via the .stitch-line
 * class in globals.css.
 */
export function StitchingLoader({
  label = "Loading",
  className = "",
}: StitchingLoaderProps) {
  return (
    <div
      role="status"
      className={`flex flex-col items-center gap-3 py-12 ${className}`}
    >
      <p className="text-xs italic text-envrt-muted">{label}</p>
      <div className="stitch-line w-40" aria-hidden="true" />
    </div>
  );
}
