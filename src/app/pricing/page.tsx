import type { Metadata } from "next";
import Image from "next/image";
import { pricingFaqItems } from "@/lib/config";
import { PageHero, FaqSnippet, ButtonV3 } from "@/components/v3";
import { Eyebrow, SectionCorners } from "@/components/sections/v3/_shared";
import { FadeUp } from "@/components/ui/Motion";
import { FinalCtaV3 } from "@/components/sections/v3/FinalCtaV3";
import { ComparisonMatrix } from "@/components/v3/pricing/ComparisonMatrix";
import { PricingTiersV3 } from "@/components/v3/pricing/PricingTiersV3";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { SITE_PLAN_FLEXIBILITY_NOTE } from "@/lib/plans.generated";

export const metadata: Metadata = {
  title: "Pricing | ENVRT for fashion brands",
  description:
    "Three tiers built for fashion. Per-garment LCA indicators, fibre-to-assembly supply chain reconstruction, embeddable widgets and regulation-ready DPPs on every tier. EUR, GBP and USD pricing.",
  alternates: { canonical: "/pricing" },
};

export default function PricingV3Page() {
  return (
    <main>
      <SoftwareApplicationJsonLd />
      <FAQJsonLd items={pricingFaqItems} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://envrt.com" },
          { name: "Pricing", url: "https://envrt.com/pricing" },
        ]}
      />
      <PageHero
        eyebrow="Pricing"
        heading={
          <>
            Built for fashion brands.{" "}
            <span className="text-envrt-brand-black/40">
              Not enterprise SaaS.
            </span>
          </>
        }
        body="Per-garment lifecycle indicators, fibre-to-assembly supply chain reconstruction, embeddable widgets and regulation-ready DPPs on every tier. Switch currency or billing period below."
        actions={
          <>
            <ButtonV3 href="/free-dpp" variant="primary">
              Try ENVRT on one garment<span>→</span>
            </ButtonV3>
            <ButtonV3 href="/contact" variant="ghost">
              Book a demo<span>→</span>
            </ButtonV3>
          </>
        }
        cornerLeft="ENVRT/01"
        cornerRight="Pricing"
      />

      <PricingTiers />
      <ComparisonTable />

      <FaqSnippet
        eyebrow="Pricing questions"
        heading="Common pricing questions"
        items={pricingFaqItems}
        ctaHref="/faq"
        ctaLabel="See all FAQs"
      />

      <FinalCtaV3 />
    </main>
  );
}

// ─── Tier cards ──────────────────────────────────────────────────────────

function PricingTiers() {
  return (
    <section className="relative overflow-hidden bg-envrt-brand-vista py-20 sm:py-24 lg:py-28">
      <SectionCorners left="ENVRT/02" right="Tiers" />

      {/* Ambient texture strip on the right edge. The vista-to-transparent
          gradient stops it competing with the tier cards. Opacity bumped
          + gradient pulled back so the texture reads more clearly without
          fighting the tier cards. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[45%] overflow-hidden lg:block"
      >
        <Image
          src="/v3-assets/story-fabric.jpg"
          alt=""
          fill
          sizes="45vw"
          className="object-cover opacity-[0.55]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-envrt-brand-vista via-envrt-brand-vista/70 to-envrt-brand-vista/15" />
      </div>

      <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-16">
        <PricingTiersV3 />
      </div>
    </section>
  );
}

// ─── Comparison table ────────────────────────────────────────────────────

function ComparisonTable() {
  return (
    <section
      className="relative bg-white py-20 sm:py-24 lg:py-32"
      style={{ overflowX: "clip" }}
    >
      <SectionCorners left="ENVRT/03" right="Compare" />
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-2xl text-center">
          <FadeUp>
            <Eyebrow>What is in each tier</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="mt-4 font-display text-3xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-4xl">
              Full feature breakdown.
            </h2>
          </FadeUp>
        </div>

        <FadeUp delay={0.16}>
          <div className="mt-12 sm:mt-16">
            <ComparisonMatrix />
          </div>
        </FadeUp>

        {/* Custom-plans note: canonical copy from the plans source of truth. */}
        <FadeUp delay={0.2}>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-envrt-brand-black/60">
            {SITE_PLAN_FLEXIBILITY_NOTE}
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

