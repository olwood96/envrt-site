import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Book a demo of ENVRT",
  description:
    "Book a demo. Three fields. We will reply within one working day with a walkthrough of the platform tailored to your brand.",
  alternates: { canonical: "/contact" },
  robots: { index: false, follow: false },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
