import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Collective | ENVRT",
  description:
    "Explore featured Digital Product Passports from brands using ENVRT. Browse sustainability metrics, compare products, and see transparency in action.",
  openGraph: {
    title: "The Collective | ENVRT",
    description:
      "Explore featured Digital Product Passports from brands using ENVRT. Browse sustainability metrics, compare products, and see transparency in action.",
    url: "https://envrt.com/collective",
    type: "website",
  },
  alternates: {
    canonical: "https://envrt.com/collective",
  },
};

export default function CollectiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
