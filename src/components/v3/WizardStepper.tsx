// Multi-step wizard progress indicator. Numbered nodes on a hairline rail,
// with the current step highlighted in ultramarine and completed steps
// filled. Used by /free-dpp and any other multi-step flow.

export function WizardStepper({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <div className="relative w-full">
      {/* Rail */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-envrt-brand-black/10"
      />

      <ol className="relative flex items-center justify-between">
        {steps.map((label, i) => {
          const reached = i <= current;
          const isActive = i === current;
          return (
            <li key={label} className="relative flex flex-col items-center">
              <span
                className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border transition-colors duration-300 ${
                  reached
                    ? "border-envrt-brand-ultramarine bg-envrt-brand-ultramarine text-white"
                    : "border-envrt-brand-black/15 bg-white text-envrt-brand-black/45"
                }`}
              >
                <span className="font-mono text-[10px] font-semibold tracking-[0.04em]">
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute inset-[-4px] animate-ping rounded-full bg-envrt-brand-ultramarine/30"
                  />
                )}
              </span>
              <span
                className={`mt-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 ${
                  reached
                    ? "text-envrt-brand-black"
                    : "text-envrt-brand-black/45"
                }`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
