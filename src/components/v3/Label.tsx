import type { ReactNode } from "react";

// Form field label. Mono caps, brand-aligned.

export function Label({
  htmlFor,
  children,
  optional = false,
  className,
}: {
  htmlFor?: string;
  children: ReactNode;
  optional?: boolean;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/65 ${className ?? ""}`}
    >
      {children}
      {optional && (
        <span className="ml-1.5 font-mono text-[9px] font-medium tracking-[0.16em] text-envrt-brand-black/35">
          optional
        </span>
      )}
    </label>
  );
}
