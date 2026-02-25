import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo — See ENVRT in Action | ENVRT",
  description:
    "Watch short walkthroughs of ENVRT's Digital Product Passport platform. See DPP creation, sustainability metrics, embeddable widgets and more.",
  keywords: [
    "Digital Product Passport demo",
    "DPP software demo",
    "sustainability platform demo",
    "ENVRT demo",
  ],
  openGraph: {
    title: "Demo — See ENVRT in Action | ENVRT",
    description:
      "Watch walkthroughs of ENVRT's Digital Product Passport platform. See DPP creation, sustainability metrics and embeddable widgets.",
    url: "https://envrt.com/demo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Demo — See ENVRT in Action | ENVRT",
    description:
      "Watch walkthroughs of ENVRT's Digital Product Passport platform.",
  },
  alternates: {
    canonical: "https://envrt.com/demo",
  },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
