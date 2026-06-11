import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-envrt-brand-ultramarine/20 bg-envrt-brand-ultramarine/5 px-3.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine sm:text-[11px] ${className}`}
    >
      {children}
    </span>
  );
}
