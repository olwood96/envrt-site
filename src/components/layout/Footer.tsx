"use client";

import Link from "next/link";
import { Container } from "../ui/Container";
import { GlitchLink } from "./GlitchLink";
import { siteConfig } from "@/lib/config";

const footerLinks = [
  {
    heading: "Product",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "ROI calculator", href: "/roi" },
      { label: "Insights", href: "/insights" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Team", href: "/team" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
    ],
  },
];

function FooterLogo() {
  return (
    <Link href="/" className="inline-block">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/envrt-logo.png"
        alt={siteConfig.name}
        className="h-8 w-auto"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
          const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = "flex";
        }}
      />
      <span className="hidden items-center gap-1.5 text-lg font-bold tracking-tight text-envrt-charcoal">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-envrt-green text-xs font-bold text-white">E</span>
        {siteConfig.name}
      </span>
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-envrt-charcoal/5 bg-envrt-offwhite py-16">
      <Container>
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          {/* Brand block */}
          <div className="lg:max-w-xs">
            <FooterLogo />
            <p className="mt-4 text-sm leading-relaxed text-envrt-muted">{siteConfig.tagline}</p>
            <a href={`mailto:${siteConfig.contact.email}`} data-cta="footer-email" className="mt-2 block text-xs text-envrt-muted/60 hover:text-envrt-muted transition-colors">
              {siteConfig.contact.email}
            </a>
          </div>
          {/* Link columns — always 3-col, even on mobile */}
          <div className="grid flex-1 grid-cols-3 gap-6 sm:gap-10">
            {footerLinks.map((col) => (
              <div key={col.heading}>
                <h4 className="mb-3 text-xs font-medium uppercase tracking-widest text-envrt-muted">{col.heading}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <GlitchLink
                        href={link.href}
                        label={link.label}
                        className="text-sm text-envrt-charcoal/70"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-envrt-charcoal/5 pt-8 sm:flex-row">
          <p className="text-xs text-envrt-muted">&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p className="text-xs text-envrt-muted/50">Built for a more sustainable fashion industry.</p>
        </div>
      </Container>
    </footer>
  );
}
