import { forwardRef, type SelectHTMLAttributes } from "react";

// Select. Same border + focus recipe as Input. Custom chevron via background
// SVG so we control the colour and don't inherit the browser default.

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
};

const CHEVRON = encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 5l3 3 3-3" stroke="rgb(26 26 26 / 0.55)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
);

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { invalid = false, className, children, ...rest },
  ref,
) {
  const borderTone = invalid
    ? "border-envrt-brand-crimson focus:border-envrt-brand-crimson focus:ring-envrt-brand-crimson/20"
    : "border-envrt-brand-black/15 focus:border-envrt-brand-ultramarine focus:ring-envrt-brand-ultramarine/20";

  return (
    <select
      ref={ref}
      className={`w-full appearance-none rounded-xl border bg-white px-4 py-3 pr-10 font-karla text-sm text-envrt-brand-black focus:outline-none focus:ring-2 ${borderTone} ${className ?? ""}`}
      style={{
        backgroundImage: `url("data:image/svg+xml;utf8,${CHEVRON}")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 1rem center",
        backgroundSize: "12px",
      }}
      {...rest}
    >
      {children}
    </select>
  );
});
