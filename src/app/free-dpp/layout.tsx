import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Free Eco-Score DPP | ENVRT",
  description:
    "Get a free eco-score Digital Product Passport for one of your products. See your environmental impact score in under 2 minutes.",
  keywords: [
    "free DPP",
    "eco-score fashion",
    "digital product passport free",
    "ESPR compliance",
    "environmental score clothing",
    "sustainable fashion score",
  ],
  openGraph: {
    title: "Free Eco-Score DPP | ENVRT",
    description:
      "Get a free eco-score Digital Product Passport for one of your products. See your environmental impact score in under 2 minutes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Eco-Score DPP | ENVRT",
    description:
      "Free eco-score DPP for fashion brands. 2 minutes, no account needed.",
  },
  alternates: {
    canonical: "https://envrt.com/free-dpp",
  },
};

export default function FreeDppLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
