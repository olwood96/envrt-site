import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ROI Calculator — What Does DPP Compliance Cost? | ENVRT",
  description:
    "Compare the cost of ENVRT against hiring a consultant or building an in-house sustainability team. Get your personalised savings estimate in under 3 minutes.",
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
      "Compare the cost of ENVRT against hiring a consultant or building an in-house sustainability team. Get your personalised savings estimate in under 3 minutes.",
    url: "https://envrt.com/roi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ROI Calculator — What Does DPP Compliance Cost? | ENVRT",
    description:
      "Compare the cost of ENVRT against hiring a consultant or building an in-house sustainability team. Get your personalised savings estimate in under 3 minutes.",
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
  return children;
}
