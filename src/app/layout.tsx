import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SupplyChainBackground } from "@/components/ui/SupplyChainBackground";
import { siteConfig } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden">
      <head>
        <link rel="preconnect" href="https://dashboard.envrt.com" />
        <link rel="dns-prefetch" href="https://dashboard.envrt.com" />
      </head>
      <body className="font-n27 bg-envrt-offwhite text-envrt-charcoal antialiased overflow-x-hidden">
        <Navbar />

        {/* SVG filter for liquid glass bottom-edge refraction */}
        <svg
          aria-hidden="true"
          style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
        >
          <defs>
            {/*
              Bottom-edge refraction:
              A vertical gradient displacement map — neutral gray at top (no warp),
              shifting away from gray at the bottom (max warp).
              Content distorts smoothly as it approaches the navbar's bottom edge.
            */}
            <linearGradient id="glass-grad" x1="0" y1="0" x2="0" y2="1">
              {/* Top of navbar: pure neutral gray = zero displacement */}
              <stop offset="0%" stopColor="rgb(128,128,128)" />
              {/* Middle: still mostly neutral */}
              <stop offset="50%" stopColor="rgb(128,128,128)" />
              {/* Bottom edge: offset from gray = maximum displacement */}
              <stop offset="100%" stopColor="rgb(148,118,138)" />
            </linearGradient>

            <filter id="liquid-glass-refract" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
              {/* Draw the vertical gradient as the displacement source */}
              <feFlood floodColor="rgb(128,128,128)" result="base" />
              <feImage href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='rgb(128,128,128)'/%3E%3Cstop offset='45%25' stop-color='rgb(128,128,128)'/%3E%3Cstop offset='100%25' stop-color='rgb(158,108,143)'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23g)'/%3E%3C/svg%3E"
                preserveAspectRatio="none"
                result="gradMap"
              />
              {/* Soften the gradient so the transition is buttery smooth */}
              <feGaussianBlur in="gradMap" stdDeviation="3" result="smoothGrad" />
              {/* Apply displacement — scale controls intensity */}
              <feDisplacementMap
                in="SourceGraphic"
                in2="smoothGrad"
                scale="22"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>

        <main className="min-h-screen">
          <SupplyChainBackground>
            {children}
          </SupplyChainBackground>
        </main>
        <Footer />

        {/* Hidden form for Netlify Forms bot detection — must be in server-rendered HTML */}
        <form name="contact" data-netlify="true" netlify-honeypot="bot-field" hidden>
          <input name="form-name" type="hidden" value="contact" />
          <input name="bot-field" />
          <input name="first-name" />
          <input name="last-name" />
          <input name="email" />
          <input name="company" />
          <textarea name="message" />
        </form>
      </body>
    </html>
  );
}