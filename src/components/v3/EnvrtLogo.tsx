import Image from "next/image";

// Renders the official ENVRT wordmark from /brand/envrt-logo.png. Use
// this anywhere the brand identity needs to appear (navbar, scene marks
// between sections, hero credits). For construction-mark labels like
// "ENVRT/01" stay with typography — those are stylised technical
// labels, not the brand wordmark itself.

type EnvrtLogoSize = "xs" | "sm" | "md" | "lg" | "xl";
type EnvrtLogoTone = "default" | "inverted";

const SIZE: Record<EnvrtLogoSize, { height: string; widthPx: number; heightPx: number }> = {
  xs: { height: "h-3", widthPx: 38, heightPx: 12 },
  sm: { height: "h-4", widthPx: 51, heightPx: 16 },
  md: { height: "h-5 sm:h-6", widthPx: 76, heightPx: 24 },
  lg: { height: "h-7 sm:h-8", widthPx: 102, heightPx: 32 },
  xl: { height: "h-10 sm:h-12", widthPx: 152, heightPx: 48 },
};

export function EnvrtLogo({
  size = "md",
  tone = "default",
  className,
}: {
  size?: EnvrtLogoSize;
  tone?: EnvrtLogoTone;
  className?: string;
}) {
  const s = SIZE[size];
  const filter = tone === "inverted" ? "invert(1) brightness(2)" : undefined;

  return (
    <Image
      src="/brand/envrt-logo.png"
      alt="ENVRT"
      width={s.widthPx}
      height={s.heightPx}
      priority
      className={`${s.height} w-auto ${className ?? ""}`}
      style={filter ? { filter } : undefined}
    />
  );
}
