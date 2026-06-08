import type { ReactNode, HTMLAttributes } from "react";

// Brand card. Rounded-3xl, default border at /12 opacity, soft shadow.
// Variants control the shadow weight.

type CardVariant = "default" | "soft" | "cta" | "flat";
type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: CardVariant;
  interactive?: boolean;
};

const SHADOWS: Record<CardVariant, string> = {
  default:
    "shadow-[0_18px_40px_-22px_rgba(14,14,14,0.18)]",
  soft:
    "shadow-[0_18px_40px_-22px_rgba(14,14,14,0.10)]",
  cta:
    "shadow-[0_30px_70px_-30px_rgba(62,0,255,0.45)]",
  flat: "",
};

export function Card({
  children,
  variant = "default",
  interactive = false,
  className,
  ...rest
}: CardProps) {
  const base =
    "rounded-3xl border border-envrt-brand-black/12 bg-white p-6 sm:p-8";
  const hover = interactive
    ? "transition-all duration-300 hover:-translate-y-1 hover:border-envrt-brand-ultramarine/30 hover:shadow-[0_24px_50px_-22px_rgba(14,14,14,0.18)]"
    : "";

  return (
    <div
      className={`${base} ${SHADOWS[variant]} ${hover} ${className ?? ""}`}
      {...rest}
    >
      {children}
    </div>
  );
}
