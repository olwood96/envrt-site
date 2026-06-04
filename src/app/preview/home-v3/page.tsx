import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { HeroV3 } from "@/components/sections/v3/HeroV3";
import { ManifestoSection } from "@/components/sections/v3/ManifestoSection";
import { ScrollTourSection } from "@/components/sections/v3/ScrollTourSection";
import { WhatsInDppV3 } from "@/components/sections/v3/WhatsInDppV3";
import { NumbersSection } from "@/components/sections/v3/NumbersSection";
import { HowItWorksV3 } from "@/components/sections/v3/HowItWorksV3";
import { FinalCtaV3 } from "@/components/sections/v3/FinalCtaV3";
import { ComparisonSection } from "@/components/sections/ComparisonSection";
import { AlignedWithCarousel } from "@/components/sections/AlignedWithCarousel";
import { FAQSection } from "@/components/sections/FAQSection";

// Manrope: closest free equivalent to NexDyne's Nohemi (neo-grotesque sans).
// Used for v3.next display headings via `font-manrope` Tailwind class. SF Pro
// system stack stays for body/UI. N27 reserved for the brand wordmark only.
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Homepage v3 preview — ENVRT",
  description:
    "v3 redesign of the ENVRT homepage. Internal preview, not for public consumption.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  alternates: { canonical: undefined },
};

export const revalidate = 3600;

export default function HomeV3PreviewPage() {
  return (
    <div className={`${manrope.variable} font-system bg-envrt-deep`}>
      <HeroV3 />
      <ManifestoSection />
      <ScrollTourSection />
      <WhatsInDppV3 />
      <NumbersSection />
      <HowItWorksV3 />
      <ComparisonSection />
      <AlignedWithCarousel />
      <FAQSection />
      <FinalCtaV3 />
    </div>
  );
}
