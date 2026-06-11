import type { Metadata } from "next";
import Image from "next/image";
import { pricingPlans } from "@/lib/config";
import { PageHero, FaqSnippet, Card, ButtonV3 } from "@/components/v3";
import { Eyebrow, SectionCorners } from "@/components/sections/v3/_shared";
import { FadeUp } from "@/components/ui/Motion";
import { FinalCtaV3 } from "@/components/sections/v3/FinalCtaV3";
import { ComparisonMatrix } from "@/components/v3/pricing/ComparisonMatrix";

export const metadata: Metadata = {
  title: "Pricing | ENVRT v3",
  description: "Three tiers. SME pricing for fashion environmental work.",
  robots: { index: false, follow: false },
};

const pricingFaqs = [
  {
    question: "What is included in the £149 Starter plan?",
    answer:
      "Up to 50 products, regulation-ready DPPs, CO₂e and AWARE water indicators, French Eco-Score, fibre-to-assembly supply chain reconstruction, evidence uploads, transparency score per product and compliance exports. Full breakdown in the comparison table above.",
  },
  {
    question: "Can I upgrade or downgrade plans mid-cycle?",
    answer:
      "Yes, you can upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle.",
  },
  {
    question: "What happens if I outgrow my SKU allowance?",
    answer:
      "Starter caps at 50 SKUs, Growth at 250. Above that, Pro is custom-priced based on SKU count, supplier complexity and support needs. Contact us for a quote.",
  },
];

export default function PricingV3Page() {
  return (
    <main>
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
        body="From £149 a month. Per-garment lifecycle assessment, fibre-to-assembly supply chain reconstruction, French Eco-Score and ESPR-ready DPPs included on every tier."
        actions={
          <>
            <ButtonV3 href="/preview/v3/free-dpp" variant="primary">
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
        items={pricingFaqs}
        ctaHref="/preview/v3/faq"
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
        <div className="mx-auto max-w-2xl text-center">
          <FadeUp>
            <Eyebrow>Three tiers</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="mt-4 font-display text-3xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-4xl">
              Pick the tier that matches your SKU count and depth needs.
            </h2>
          </FadeUp>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 lg:grid-cols-3 lg:gap-6">
          {pricingPlans.map((plan, i) => (
            <FadeUp key={plan.slug} delay={0.08 + i * 0.06}>
              <TierCard plan={plan} />
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.4}>
          <p className="mt-10 text-center text-xs text-envrt-brand-black/55 sm:text-sm">
            All plans run on a 6-month minimum term, then continue month-to-month. Annual billing saves 15% on Starter and Growth.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

function TierCard({ plan }: { plan: (typeof pricingPlans)[number] }) {
  const isHighlighted = plan.highlighted;

  return (
    <Card
      variant={isHighlighted ? "cta" : "default"}
      className={`flex h-full flex-col ${
        isHighlighted
          ? "ring-1 ring-envrt-brand-ultramarine/20"
          : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-display text-xl font-semibold tracking-[-0.01em] text-envrt-brand-black sm:text-2xl">
          {plan.name}
        </span>
        {isHighlighted && (
          <span className="rounded-full bg-envrt-brand-ultramarine/10 px-3 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine">
            Most popular
          </span>
        )}
      </div>

      <p className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine">
        {plan.subheading}
      </p>

      <div className="mt-6 flex items-baseline gap-1.5">
        {plan.customPricing ? (
          <span className="font-display text-3xl font-semibold tracking-tight text-envrt-brand-black sm:text-4xl">
            Custom
          </span>
        ) : (
          <>
            <span className="font-display text-4xl font-semibold tracking-tight text-envrt-brand-black sm:text-5xl">
              £{plan.priceGBP}
            </span>
            <span className="text-sm text-envrt-brand-black/55">/month</span>
          </>
        )}
      </div>
      {plan.customSubline && (
        <p className="mt-2 text-xs leading-relaxed text-envrt-brand-black/55">
          {plan.customSubline}
        </p>
      )}

      <p className="mt-5 text-sm leading-relaxed text-envrt-brand-black/70">
        {plan.description}
      </p>

      <ul className="mt-6 space-y-2.5 border-t border-envrt-brand-black/10 pt-6">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-sm leading-snug text-envrt-brand-black/75"
          >
            <span
              aria-hidden
              className="mt-1 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-envrt-brand-ultramarine"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 pt-2">
        <ButtonV3
          href={plan.customPricing ? "/contact" : "/preview/v3/free-dpp"}
          variant={isHighlighted ? "primary" : "secondary"}
          className="w-full"
        >
          {plan.customPricing ? "Contact sales" : "Start with " + plan.name}
          <span>→</span>
        </ButtonV3>
      </div>
    </Card>
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
      </div>
    </section>
  );
}

