import type { ReactNode } from "react";
import { Big_Shoulders_Text, Karla } from "next/font/google";
import { SmoothScroll } from "@/components/sections/v3/SmoothScroll";
import { Navbar } from "@/components/v3";
import { FooterV3 } from "@/components/v3/FooterV3";
import { PricingProvider } from "@/components/v3/pricing/PricingContext";

// Shared layout for every page under /preview/v3/. Loads the brand fonts
// once, mounts the v3 navbar and footer, wraps content in Lenis smooth
// scroll, applies the page background and text colour. Individual page
// files only render their section components.

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
    <PricingProvider>
      <SmoothScroll>
        <div
          className={`${display.variable} ${body.variable} font-karla bg-envrt-brand-vista text-envrt-brand-black`}
        >
          <Navbar />
          {children}
          <FooterV3 />
        </div>
      </SmoothScroll>
    </PricingProvider>
  );
}
