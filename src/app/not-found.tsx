import type { Metadata } from "next";
import Link from "next/link";
import { ButtonV3 } from "@/components/v3";
import { DotGridBackground } from "@/components/sections/v3/_shared";

// Custom 404 for /any/unknown/path. Next.js renders this for both
// notFound() calls in route handlers and for unmatched URLs.

export const metadata: Metadata = {
  title: "Page not found | ENVRT",
  description:
    "The page you were after is not here. Head back to the homepage or browse our Insights, Platform and Collective.",
  robots: { index: false, follow: false },
};

const SUGGESTIONS: { label: string; href: string; description: string }[] = [
  {
    label: "Platform",
    href: "/platform",
    description: "Nine capabilities, one platform.",
  },
  {
    label: "Insights",
    href: "/insights",
    description: "Guides on DPPs, LCA and fashion environmental data.",
  },
  {
    label: "Free DPP",
    href: "/free-dpp",
    description: "Try ENVRT on one garment, no card.",
  },
  {
    label: "Collective",
    href: "/collective",
    description: "Live Digital Product Passports from brands using ENVRT.",
  },
];

export default function NotFound() {
  return (
    <main className="relative flex min-h-[78vh] items-center justify-center overflow-hidden bg-envrt-brand-vista px-5 py-24 sm:px-8">
      <DotGridBackground opacity={0.05} size={22} />

      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute left-4 top-6 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/25 sm:left-6 sm:top-8">
          ENVRT/404
        </span>
        <span className="absolute right-4 top-6 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-ultramarine/55 sm:right-6 sm:top-8">
          Off the rail
        </span>
        <span className="absolute bottom-4 left-4 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/25 sm:bottom-6 sm:left-6">
          No such pattern
        </span>
        <span className="absolute bottom-4 right-4 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/25 sm:bottom-6 sm:right-6">
          Lost SKU
        </span>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
        <p className="font-n27 text-[6rem] font-bold leading-none tracking-[-0.04em] text-envrt-brand-black/15 sm:text-[8rem] lg:text-[10rem]">
          404
        </p>

        <p className="mt-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine">
          Page not found
        </p>

        <h1 className="mt-5 font-display text-[2.25rem] font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-5xl lg:text-[3.25rem]">
          We could not find that page.{" "}
          <span className="text-envrt-brand-black/45">
            The link may have moved or expired.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-envrt-brand-black/70 sm:text-lg">
          We recently rebuilt the site. If you followed a bookmark from before
          today, the redirects should catch most of them. Otherwise, try one of
          the destinations below.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonV3 href="/" variant="primary">
            Back to homepage<span>→</span>
          </ButtonV3>
          <ButtonV3 href="/contact" variant="ghost">
            Contact support<span>→</span>
          </ButtonV3>
        </div>

        <div className="mt-16 border-t border-envrt-brand-black/10 pt-10">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55 sm:text-[11px]">
            Try one of these
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-3 text-left sm:grid-cols-2 sm:gap-4">
            {SUGGESTIONS.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="group block rounded-2xl border border-envrt-brand-black/10 bg-white p-5 transition-colors duration-300 hover:border-envrt-brand-ultramarine/30"
                >
                  <p className="font-display text-lg font-semibold leading-tight tracking-[-0.01em] text-envrt-brand-black transition-colors duration-200 group-hover:text-envrt-brand-ultramarine">
                    {s.label}{" "}
                    <span
                      aria-hidden
                      className="text-envrt-brand-black/40 transition-colors duration-200 group-hover:text-envrt-brand-ultramarine"
                    >
                      →
                    </span>
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-envrt-brand-black/65">
                    {s.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
