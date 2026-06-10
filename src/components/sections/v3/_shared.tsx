"use client";

import type { ReactNode } from "react";

// Shared v3 building blocks. Use these in every v3 section instead of
// hand-rolling the same construction marks, eyebrows, live pills or dot
// grids — keeps the vocabulary tight and the page mirrorable.

// ─── Tokens ───────────────────────────────────────────────────────────────

// Single brand ease. Use everywhere a curve is needed for scroll-driven or
// component-driven motion. Expo-out: fast start, soft landing.
export const EASE_BRAND = [0.16, 1, 0.3, 1] as const;

// ─── Section corners — small mono labels at top-left and top-right ────────

export function SectionCorners({
  left,
  right,
  bottomLeft,
  bottomRight,
  tone = "light",
}: {
  left: string;
  right: string;
  bottomLeft?: string;
  bottomRight?: string;
  tone?: "light" | "dark";
}) {
  const text =
    tone === "dark"
      ? "text-envrt-brand-lilac/45"
      : "text-envrt-brand-black/25";

  const cls = `pointer-events-none absolute z-10 font-mono text-[9px] font-medium uppercase tracking-[0.18em] ${text}`;

  return (
    <>
      <span aria-hidden className={`${cls} left-4 top-6 sm:left-6`}>
        {left}
      </span>
      <span aria-hidden className={`${cls} right-4 top-6 sm:right-6`}>
        {right}
      </span>
      {bottomLeft && (
        <span aria-hidden className={`${cls} bottom-6 left-4 sm:left-6`}>
          {bottomLeft}
        </span>
      )}
      {bottomRight && (
        <span aria-hidden className={`${cls} bottom-6 right-4 sm:right-6`}>
          {bottomRight}
        </span>
      )}
    </>
  );
}

// ─── Eyebrow — the small label above headings. Default ultramarine, with
//     per-area tones for the colour-scheme experiment.

export type EyebrowTone =
  | "default"
  | "neon"
  | "sunny"
  | "lilac"
  | "white";

const EYEBROW_TONE: Record<EyebrowTone, string> = {
  default: "text-envrt-brand-ultramarine",
  neon: "text-envrt-brand-neon",
  sunny: "text-envrt-brand-sunny",
  lilac: "text-envrt-brand-lilac",
  white: "text-white/85",
};

export function Eyebrow({
  children,
  className,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: EyebrowTone;
}) {
  return (
    <p
      className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${EYEBROW_TONE[tone]} sm:text-[11px] ${className ?? ""}`}
    >
      {children}
    </p>
  );
}

// ─── Live pill — green dot + ping + uppercase label ───────────────────────

export function LivePill({
  label = "Live",
  tone = "vibrant",
}: {
  label?: string;
  tone?: "vibrant" | "ultramarine";
}) {
  const text =
    tone === "ultramarine"
      ? "text-envrt-brand-ultramarine"
      : "text-envrt-brand-vibrant";
  const dot =
    tone === "ultramarine"
      ? "bg-envrt-brand-ultramarine"
      : "bg-envrt-brand-vibrant";

  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-[11px] ${text}`}
    >
      <span
        aria-hidden
        className="relative inline-flex h-1.5 w-1.5 items-center justify-center"
      >
        <span
          className={`absolute inset-0 animate-ping rounded-full opacity-70 ${dot}`}
        />
        <span className={`relative h-1.5 w-1.5 rounded-full ${dot}`} />
      </span>
      {label}
    </span>
  );
}

// ─── Dot grid background ──────────────────────────────────────────────────

export function DotGridBackground({
  tone = "ink",
  opacity = 0.05,
  size = 24,
}: {
  tone?: "ink" | "lilac";
  opacity?: number;
  size?: number;
}) {
  const colour =
    tone === "lilac"
      ? "rgba(223,95,255,0.9)"
      : "rgba(26,26,26,0.7)";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        opacity,
        backgroundImage: `radial-gradient(circle, ${colour} 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  );
}
