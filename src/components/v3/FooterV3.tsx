import Link from "next/link";
import { EnvrtLogo } from "./EnvrtLogo";
import { siteConfig } from "@/lib/config";

// v3 footer. Vista band, divider top and bottom, brand wordmark left,
// link columns right. Quiet brand-black ink, ultramarine on hover. The
// trailing strip carries the cipher, copyright and a one-line credit.

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "Platform", href: "//platform" },
      { label: "Lab", href: "//lab" },
      { label: "Free DPP", href: "//free-dpp" },
      { label: "Pricing", href: "//pricing" },
      { label: "The Collective", href: "//collective" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Insights", href: "//insights" },
      { label: "DPP timeline", href: "//dpp-timeline" },
      { label: "FAQ", href: "//faq" },
      { label: "Glossary", href: "//glossary" },
      { label: "Readiness assessment", href: "//assessment" },
      { label: "ROI calculator", href: "//roi" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "//about" },
      { label: "Team", href: "//team" },
      { label: "Contact", href: "//contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy policy", href: "//privacy" },
      { label: "Terms of service", href: "//terms" },
    ],
  },
];

export function FooterV3() {
  return (
    <footer className="relative bg-envrt-brand-vista">
      <div className="border-t border-envrt-brand-black/8">
        <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 sm:py-20 lg:px-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <BrandBlock />
            <LinkColumns />
          </div>
        </div>
      </div>

      <BottomBar />
    </footer>
  );
}

function BrandBlock() {
  return (
    <div className="max-w-sm">
      <Link
        href="/"
        aria-label={`${siteConfig.name} home`}
        className="inline-flex items-center"
      >
        <EnvrtLogo size="lg" />
      </Link>
      <p className="mt-6 text-base leading-relaxed text-envrt-brand-black/70">
        {siteConfig.tagline}
      </p>
      <a
        href={`mailto:${siteConfig.contact.email}`}
        data-cta="footer-email"
        className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/65 transition-colors duration-200 hover:text-envrt-brand-ultramarine sm:text-[11px]"
      >
        {siteConfig.contact.email}
        <span aria-hidden>→</span>
      </a>

      <ul className="mt-7 flex items-center gap-3">
        <li>
          <SocialLink
            href={siteConfig.social.linkedin}
            label="ENVRT on LinkedIn"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </SocialLink>
        </li>
        <li>
          <SocialLink
            href={siteConfig.social.instagram}
            label="ENVRT on Instagram"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 0zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </SocialLink>
        </li>
      </ul>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-envrt-brand-black/12 bg-white text-envrt-brand-black/70 transition-colors duration-200 hover:border-envrt-brand-ultramarine/30 hover:text-envrt-brand-ultramarine"
    >
      {children}
    </a>
  );
}

function LinkColumns() {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4 sm:gap-x-10">
      {COLUMNS.map((col) => (
        <div key={col.heading}>
          <h4 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine sm:text-[11px]">
            {col.heading}
          </h4>
          <ul className="mt-5 space-y-3">
            {col.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-envrt-brand-black/75 transition-colors duration-200 hover:text-envrt-brand-ultramarine"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function BottomBar() {
  const year = new Date().getFullYear();
  return (
    <div className="border-t border-envrt-brand-black/8">
      <div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-3 px-5 py-8 sm:flex-row sm:items-center sm:px-8 lg:px-16">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/45 sm:text-[11px]">
          ENVRT/{year}
        </p>
        <p className="text-xs text-envrt-brand-black/55">
          &copy; {year} {siteConfig.name}. All rights reserved.
        </p>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/45 sm:text-[11px]">
          Built for a more sustainable fashion industry
        </p>
      </div>
    </div>
  );
}
