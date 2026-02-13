import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-envrt-teal/20 bg-envrt-teal/5 px-3.5 py-1.5 text-xs font-medium tracking-wide text-envrt-teal ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-envrt-teal animate-pulse" />
      {children}
    </span>
  );
}
