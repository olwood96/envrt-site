import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden">
      <body className="font-n27 bg-envrt-offwhite text-envrt-charcoal antialiased overflow-x-hidden">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />

        {/* Hidden form for Netlify Forms bot detection — must be in server-rendered HTML */}
        <form name="contact" data-netlify="true" netlify-honeypot="bot-field" hidden>
          <input name="form-name" type="hidden" value="contact" />
          <input name="bot-field" />
          <input name="first-name" />
          <input name="last-name" />
          <input name="email" />
          <input name="company" />
          <textarea name="message" />
        </form>
      </body>
    </html>
  );
}