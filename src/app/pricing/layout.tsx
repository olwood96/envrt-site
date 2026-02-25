import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Digital Product Passport Plans | ENVRT",
  description:
    "Choose a Digital Product Passport plan for your brand. Starter from £149/mo, Growth from £495/mo, Pro from £1,295/mo. DPP creation, lifecycle metrics and sustainability analytics included.",
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
      "From your first DPP to full sustainability operations. Starter, Growth, and Pro plans.",
    url: "https://envrt.com/pricing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — Digital Product Passport Plans | ENVRT",
    description:
      "Digital Product Passport plans from £149/month.",
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
  return children;
}
