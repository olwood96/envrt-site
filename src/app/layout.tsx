import type { Metadata } from "next";
import { Big_Shoulders_Text, Karla } from "next/font/google";
import { siteConfig } from "@/lib/config";
import WebsiteBeacon from "@/components/WebsiteBeacon";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { WebSiteJsonLd } from "@/components/seo/WebSiteJsonLd";
import { Navbar } from "@/components/v3";
import { FooterV3 } from "@/components/v3/FooterV3";
import { PricingProvider } from "@/components/v3/pricing/PricingContext";
import { ConsentProvider } from "@/components/v3/ConsentContext";
import { CookieBanner } from "@/components/v3/CookieBanner";
import { GA4 } from "@/components/v3/GA4";
import "./globals.css";

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

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  verification: {
    google: "j62BTjUf_jbiWVEIwjZhno6IFF9ePefSNWiBCLciaUc",
  },
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: "/og-image.png",
        width: 3072,
        height: 4096,
        alt: "ENVRT - The Infrastructure Layer For Product Transparency",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/og-image.png"],
  },
  keywords: [
    "Digital Product Passports",
    "DPP",
    "DPPs UK",
    "Digital Product Passport textiles",
    "EU Digital Product Passport",
    "sustainability data platform",
    "product transparency",
    "lifecycle assessment fashion",
    "supply chain transparency",
    "fashion sustainability",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preload" href="/fonts/n27/n27-regular-webfont.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/n27/n27-bold-webfont.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

        {/* Establish TCP+TLS to the DPP subdomain so the iframe handshake
            is warm by the time a user opens the demo. Cheap on its own
            (no payload). The full demo page is NOT prefetched any more
            because >95% of marketing visitors never open it. */}
        <link rel="preconnect" href="https://dashboard.envrt.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://dashboard.envrt.com" />
      </head>
      <body className="font-n27 bg-envrt-offwhite text-envrt-charcoal antialiased">
        <OrganizationJsonLd />
        <WebSiteJsonLd />

        {/* SVG filter for liquid glass bottom-edge refraction */}
        <svg
          aria-hidden="true"
          style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
        >
          <defs>
            <linearGradient id="glass-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(128,128,128)" />
              <stop offset="50%" stopColor="rgb(128,128,128)" />
              <stop offset="100%" stopColor="rgb(148,118,138)" />
            </linearGradient>

            <filter id="liquid-glass-refract" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
              <feFlood floodColor="rgb(128,128,128)" result="base" />
              <feImage href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='rgb(128,128,128)'/%3E%3Cstop offset='45%25' stop-color='rgb(128,128,128)'/%3E%3Cstop offset='100%25' stop-color='rgb(158,108,143)'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23g)'/%3E%3C/svg%3E"
                preserveAspectRatio="none"
                result="gradMap"
              />
              <feGaussianBlur in="gradMap" stdDeviation="3" result="smoothGrad" />
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

        <ConsentProvider>
          <PricingProvider>
            <div
              className={`${display.variable} ${body.variable} font-karla bg-envrt-brand-vista text-envrt-brand-black`}
            >
              <Navbar />
              {children}
              <FooterV3 />
            </div>
            <CookieBanner />
            <GA4 />
          </PricingProvider>
        </ConsentProvider>

        <WebsiteBeacon />
      </body>
    </html>
  );
}
