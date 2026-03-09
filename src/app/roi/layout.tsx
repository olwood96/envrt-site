import type { Metadata } from "next";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { roiFaqItems } from "@/lib/config";

export const metadata: Metadata = {
  title: "ROI Calculator — What Does DPP Compliance Cost? | ENVRT",
  description:
    "DPP compliance cost calculator — compare ENVRT against consultants or in-house teams. Get your personalised savings estimate in under 3 minutes.",
  keywords: [
    "DPP compliance cost",
    "Digital Product Passport ROI",
    "sustainability consultant cost",
    "DPP cost calculator",
    "fashion compliance savings",
    "ESPR compliance budget",
  ],
  openGraph: {
    title: "ROI Calculator — What Does DPP Compliance Cost? | ENVRT",
    description:
      "DPP compliance cost calculator — compare ENVRT against consultants or in-house teams. Personalised savings estimate in under 3 minutes.",
    url: "https://envrt.com/roi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ROI Calculator — What Does DPP Compliance Cost? | ENVRT",
    description:
      "DPP compliance cost calculator — compare ENVRT against consultants or in-house teams.",
  },
  alternates: {
    canonical: "https://envrt.com/roi",
  },
};

export default function ROILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FAQJsonLd items={roiFaqItems} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://envrt.com" },
          { name: "Why ENVRT?", url: "https://envrt.com/roi" },
        ]}
      />
      {children}
    </>
  );
}
