import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "DPP Readiness Assessment - Is Your Brand Prepared? | ENVRT",
  description:
    "Free 10-minute assessment to measure your Digital Product Passport readiness. Get a personalised compliance report covering supply chain, product data, regulatory awareness and infrastructure.",
  keywords: [
    "DPP readiness assessment",
    "Digital Product Passport compliance check",
    "ESPR readiness test",
    "fashion compliance assessment",
    "DPP preparedness score",
    "textile regulation readiness",
  ],
  openGraph: {
    title: "DPP Readiness Assessment - Is Your Brand Prepared? | ENVRT",
    description:
      "Free 10-minute assessment to measure your Digital Product Passport readiness. Personalised compliance report in minutes.",
    url: "https://envrt.com/assessment",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DPP Readiness Assessment - Is Your Brand Prepared? | ENVRT",
    description:
      "Free 10-minute assessment to measure your Digital Product Passport readiness.",
  },
  alternates: {
    canonical: "https://envrt.com/assessment",
  },
};

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://envrt.com" },
          { name: "DPP Readiness Assessment", url: "https://envrt.com/assessment" },
        ]}
      />
      {children}
    </>
  );
}
