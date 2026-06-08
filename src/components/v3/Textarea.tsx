import { forwardRef, type TextareaHTMLAttributes } from "react";

// Multi-line text input. Same brand recipe as Input, taller.

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ invalid = false, className, rows = 4, ...rest }, ref) {
    const borderTone = invalid
      ? "border-envrt-brand-crimson focus:border-envrt-brand-crimson focus:ring-envrt-brand-crimson/20"
      : "border-envrt-brand-black/15 focus:border-envrt-brand-ultramarine focus:ring-envrt-brand-ultramarine/20";

    return (
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full rounded-xl border bg-white px-4 py-3 font-karla text-sm leading-relaxed text-envrt-brand-black placeholder:text-envrt-brand-black/35 focus:outline-none focus:ring-2 ${borderTone} ${className ?? ""}`}
        {...rest}
      />
    );
  },
);
