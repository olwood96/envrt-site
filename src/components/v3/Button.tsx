import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

// v3 brand button. Three variants:
//   primary    ultramarine, white text, ultramarine glow shadow
//   secondary  white, black border, used as a side-by-side foil to primary
//   ghost      no background, hover lifts the ultramarine accent

type ButtonV3Variant = "primary" | "secondary" | "ghost";
type ButtonV3Size = "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  href?: string;
  variant?: ButtonV3Variant;
  size?: ButtonV3Size;
};

const VARIANTS: Record<ButtonV3Variant, string> = {
  primary:
    "bg-envrt-brand-ultramarine text-white shadow-[0_12px_28px_-14px_rgba(62,0,255,0.7)] hover:bg-envrt-brand-ultramarine/90",
  secondary:
    "bg-white text-envrt-brand-black border border-envrt-brand-black/12 hover:border-envrt-brand-black/25",
  ghost:
    "bg-transparent text-envrt-brand-black hover:text-envrt-brand-ultramarine",
};

const SIZES: Record<ButtonV3Size, string> = {
  md: "px-5 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base",
  lg: "px-6 py-3 text-base sm:px-8 sm:py-3.5 sm:text-lg",
};

export function ButtonV3({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...rest
}: Props) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 ${VARIANTS[variant]} ${SIZES[size]} ${className ?? ""}`;

  if (href) {
    // Forward data-* and other HTML attrs (e.g. data-cta) onto the anchor
    return (
      <Link href={href} className={classes} {...(rest as Record<string, unknown>)}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
