"use client";

export function Toggle({
  options,
  active,
  onChange,
  badge,
}: {
  options: [string, string];
  active: 0 | 1;
  onChange: (i: 0 | 1) => void;
  badge?: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-envrt-charcoal/8 bg-envrt-cream/60 p-1">
      {options.map((label, i) => (
        <button
          key={label}
          onClick={() => onChange(i as 0 | 1)}
          className={`relative rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
            active === i
              ? "bg-white text-envrt-charcoal shadow-sm"
              : "text-envrt-muted hover:text-envrt-charcoal/70"
          }`}
        >
          {label}
          {i === 1 && badge && active === 1 && (
            <span className="ml-1.5 inline-block rounded-full bg-envrt-teal/10 px-1.5 py-0.5 text-[9px] font-semibold text-envrt-teal">
              {badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
