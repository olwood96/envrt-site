import { forwardRef, type InputHTMLAttributes } from "react";

// Text input. Brand-aligned border, ultramarine focus ring, Karla body type.

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid = false, className, ...rest },
  ref,
) {
  const borderTone = invalid
    ? "border-envrt-brand-crimson focus:border-envrt-brand-crimson focus:ring-envrt-brand-crimson/20"
    : "border-envrt-brand-black/15 focus:border-envrt-brand-ultramarine focus:ring-envrt-brand-ultramarine/20";

  return (
    <input
      ref={ref}
      className={`w-full rounded-xl border bg-white px-4 py-3 font-karla text-sm text-envrt-brand-black placeholder:text-envrt-brand-black/35 focus:outline-none focus:ring-2 ${borderTone} ${className ?? ""}`}
      {...rest}
    />
  );
});
