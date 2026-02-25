import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Demo — Get in Touch | ENVRT",
  description:
    "Book a personalised demo of ENVRT's Digital Product Passport platform. See how your brand can create regulation-ready DPPs and share sustainability data with customers.",
  keywords: [
    "book DPP demo",
    "Digital Product Passport demo",
    "contact ENVRT",
    "sustainability platform demo UK",
  ],
  openGraph: {
    title: "Book a Demo — Get in Touch | ENVRT",
    description:
      "Book a personalised demo of ENVRT's Digital Product Passport platform.",
    url: "https://envrt.com/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a Demo — Get in Touch | ENVRT",
    description:
      "Book a personalised demo of ENVRT's Digital Product Passport platform.",
  },
  alternates: {
    canonical: "https://envrt.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
