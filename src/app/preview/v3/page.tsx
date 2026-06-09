import type { Metadata } from "next";
import Link from "next/link";
import {
  Eyebrow,
  SectionCorners,
} from "@/components/sections/v3/_shared";
import { ButtonV3 } from "@/components/v3";

// Temporary index page for /preview/v3/ while individual pages are built
// out. Lists every v3 surface so reviewers can navigate around. Once the
// homepage at /preview/home-v3 is migrated here, this gets replaced by
// that content.

export const metadata: Metadata = {
  title: "v3 preview index",
  robots: { index: false, follow: false },
};

const SHIPPED = [
  {
    href: "/preview/home-v3",
    label: "Homepage v3",
    note: "Currently lives at /preview/home-v3, will move here on cutover",
  },
  { href: "/preview/v3/pricing", label: "Pricing", note: "Three tiers + full comparison" },
  { href: "/preview/v3/platform", label: "Platform", note: "Nine-capability deep dive" },
  { href: "/preview/v3/free-dpp", label: "Free DPP", note: "Three-step wizard" },
  { href: "/preview/v3/contact", label: "Contact", note: "Demo booking form" },
  { href: "/preview/v3/roi", label: "ROI calculator", note: "Live savings comparison" },
  { href: "/preview/v3/assessment", label: "Readiness assessment", note: "10-minute DPP readiness quiz" },
  { href: "/preview/v3/dpp-timeline", label: "DPP timeline", note: "Regulatory milestones, live countdown" },
  { href: "/preview/v3/lab", label: "Lab", note: "Calculation engine + factor sources" },
  { href: "/preview/v3/faq", label: "FAQ", note: "Five grouped sections, all common questions" },
  { href: "/preview/v3/glossary", label: "Glossary", note: "A-Z plain definitions" },
  { href: "/preview/v3/team", label: "Team", note: "Founders and advisors" },
  { href: "/preview/v3/about", label: "About", note: "Manifesto and founding story" },
  { href: "/preview/v3/insights", label: "Insights", note: "Long-form articles index" },
  { href: "/preview/v3/insights/dpp-cost-components-fashion-2027", label: "Insights article", note: "Article template with v3 prose typography" },
];

const PENDING = [
  "/preview/v3/collective",
  "/preview/v3/collective/[brand]",
  "/preview/v3/collective/compare",
  "/preview/v3/payment/success",
  "/preview/v3/privacy",
  "/preview/v3/terms",
];

export default function V3IndexPage() {
  return (
    <main className="relative bg-envrt-brand-vista">
      <SectionCorners left="ENVRT/v3" right="Preview index" />

      <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-28 lg:px-16 lg:py-32">
        <Eyebrow>v3 preview</Eyebrow>
        <h1 className="mt-5 max-w-3xl font-display text-4xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-5xl lg:text-[3.5rem]">
          The v3 site under construction.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-envrt-brand-black/70 sm:text-lg">
          Every page under /preview/v3/. The live site at the root is
          untouched until v3 is approved. Once approved, /preview/v3
          becomes the new root.
        </p>

        <h2 className="mt-16 font-display text-2xl font-medium tracking-tight text-envrt-brand-black sm:text-3xl">
          Shipped
        </h2>
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SHIPPED.map((page) => (
            <li
              key={page.href}
              className="rounded-2xl border border-envrt-brand-black/12 bg-white p-5 shadow-[0_10px_24px_-18px_rgba(14,14,14,0.1)]"
            >
              <Link
                href={page.href}
                className="group block"
                target={page.href.startsWith("/preview/") ? "_self" : undefined}
              >
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine">
                  {page.href}
                </p>
                <p className="mt-2 font-display text-lg font-semibold tracking-tight text-envrt-brand-black group-hover:text-envrt-brand-ultramarine">
                  {page.label}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-envrt-brand-black/60">
                  {page.note}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="mt-16 font-display text-2xl font-medium tracking-tight text-envrt-brand-black sm:text-3xl">
          Pending
        </h2>
        <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {PENDING.map((path) => (
            <li
              key={path}
              className="rounded-xl border border-envrt-brand-black/8 bg-envrt-brand-vista/50 px-3 py-2 font-mono text-[11px] text-envrt-brand-black/55"
            >
              {path}
            </li>
          ))}
        </ul>

        <div className="mt-16 flex flex-col gap-3 sm:flex-row">
          <ButtonV3 href="/preview/home-v3" variant="primary">
            View v3 homepage<span>→</span>
          </ButtonV3>
          <ButtonV3 href="/preview/v3/pricing" variant="secondary">
            Open pricing<span>→</span>
          </ButtonV3>
          <ButtonV3 href="/preview/v3/platform" variant="ghost">
            Open platform<span>→</span>
          </ButtonV3>
        </div>
      </div>
    </main>
  );
}
