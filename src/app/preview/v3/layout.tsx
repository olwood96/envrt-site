import type { ReactNode } from "react";
import { Big_Shoulders_Text, Karla } from "next/font/google";
import { SmoothScroll } from "@/components/sections/v3/SmoothScroll";

// Shared layout for every page under /preview/v3/. Loads the brand fonts
// once, wraps content in Lenis smooth scroll, applies the page background
// and text colour. Individual page files only render their section
// components — the chrome lives here.

const display = Big_Shoulders_Text({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const body = Karla({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700"],
  display: "swap",
});

export default function V3Layout({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <div
        className={`${display.variable} ${body.variable} font-karla bg-envrt-brand-vista text-envrt-brand-black`}
      >
        {children}
      </div>
    </SmoothScroll>
  );
}
