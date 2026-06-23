// Trust strip rendered inline at the bottom of HeroV3. Three stat columns,
// hairline divided. Brand logo rotator removed — replaced with a time-to-DPP
// stat to lead with the speed hook.

function StatCell({ value, unit, label }: { value: string; unit?: string; label: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <p className="font-display text-[2rem] font-medium leading-none tracking-[-0.025em] text-envrt-brand-black sm:text-[2.5rem]">
        {value}
        {unit && (
          <span className="ml-1 text-[1.1rem] font-medium tracking-[-0.01em] text-envrt-brand-black/55 sm:text-[1.3rem]">
            {unit}
          </span>
        )}
      </p>
      <p className="mt-3 max-w-[14rem] font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/55 sm:text-[10px]">
        {label}
      </p>
    </div>
  );
}

export function BrandStripV3() {
  return (
    <div className="grid grid-cols-1 items-center gap-y-8 border-t border-envrt-brand-black/10 pt-6 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-0 sm:divide-x sm:divide-envrt-brand-black/10 sm:pt-8">
      <div className="sm:px-6 sm:first:pl-0">
        <StatCell value="30" unit="min" label="Time to your first live DPP" />
      </div>
      <div className="sm:px-6">
        <StatCell value="75+" label="Network of apparel brands and partners" />
      </div>
      <div className="sm:px-6 sm:last:pr-0">
        <StatCell value="27" label="EU markets aligned with our methodology" />
      </div>
    </div>
  );
}
