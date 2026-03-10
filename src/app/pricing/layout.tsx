import type { Metadata } from "next";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { pricingFaqItems } from "@/lib/config";

export const metadata: Metadata = {
  title: "Pricing — Digital Product Passport Plans | ENVRT",
  description:
    "Digital Product Passport pricing from £149/month. Compare Starter, Growth, and Pro plans — DPP creation, lifecycle metrics, analytics, and AI-powered data ingestion included.",
  keywords: [
    "Digital Product Passport pricing",
    "DPP platform pricing",
    "DPP software cost",
    "sustainability software pricing UK",
    "ENVRT pricing",
  ],
  openGraph: {
    title: "Pricing — Digital Product Passport Plans | ENVRT",
    description:
      "Digital Product Passport plans from £149/month. DPP creation, lifecycle metrics, analytics, and AI-powered data ingestion.",
    url: "https://envrt.com/pricing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — Digital Product Passport Plans | ENVRT",
    description:
      "Digital Product Passport plans from £149/month. DPP creation, analytics, and sustainability insights.",
  },
  alternates: {
    canonical: "https://envrt.com/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FAQJsonLd items={pricingFaqItems} />
      <SoftwareApplicationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://envrt.com" },
          { name: "Pricing", url: "https://envrt.com/pricing" },
        ]}
      />
      {children}
    </>
  );
}
