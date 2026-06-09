import type { Metadata } from "next";
import { pricingPlans, pricingComparison } from "@/lib/config";
import { PageHero, FaqSnippet, Card, ButtonV3 } from "@/components/v3";
import { AssetIcon } from "@/components/sections/v3/AssetIcon";
import { Eyebrow, SectionCorners } from "@/components/sections/v3/_shared";
import { FadeUp } from "@/components/ui/Motion";
import { FinalCtaV3 } from "@/components/sections/v3/FinalCtaV3";

export const metadata: Metadata = {
  title: "Pricing | ENVRT v3",
  description: "Three tiers. SME pricing for fashion environmental work.",
  robots: { index: false, follow: false },
};

const pricingFaqs = [
  {
    question: "How does ENVRT compare on price to other DPP platforms?",
    answer:
      "Starter is £149 a month, Growth £495 a month. The closest competitor on entry pricing is tex.tracer at around £600 a month, with LCA as an add-on that pushes total cost to 4-10x ours. Carbonfact, Fairly Made and TrusTrace are typically £15-50k per year, often without traceability or DPP included natively.",
  },
  {
    question: "What is included in the £149 Starter plan?",
    answer:
      "Up to 50 products, regulation-ready DPPs, CO₂e and AWARE water indicators, French Eco-Score, fibre-to-assembly supply chain reconstruction, evidence uploads, transparency score per product and compliance exports. Full breakdown in the comparison table above.",
  },
  {
    question: "Can I upgrade or downgrade plans mid-cycle?",
    answer:
      "Yes. Plans switch on demand. Annual billing saves 15% compared to monthly pricing across all tiers.",
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
    <section className="relative bg-envrt-brand-vista py-20 sm:py-24 lg:py-28">
      <SectionCorners left="ENVRT/02" right="Tiers" />
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-16">
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
          <div className="mt-12 overflow-hidden rounded-3xl border border-envrt-brand-black/12 bg-white sm:mt-16">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] table-fixed">
                <colgroup>
                  <col className="w-[40%]" />
                  <col className="w-[20%]" />
                  <col className="w-[20%]" />
                  <col className="w-[20%]" />
                </colgroup>
                <thead className="sticky top-0 bg-envrt-brand-vista">
                  <tr>
                    <th className="px-4 py-4 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55 sm:px-6">
                      Feature
                    </th>
                    {pricingPlans.map((plan) => (
                      <th
                        key={plan.slug}
                        className="px-3 py-4 text-center font-display text-sm font-semibold tracking-tight text-envrt-brand-black sm:px-6 sm:text-base"
                      >
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                {pricingComparison.categories.map((cat) => (
                  <tbody key={cat.name}>
                    <tr className="bg-envrt-brand-vista/50">
                      <td
                        colSpan={4}
                        className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine sm:px-6"
                      >
                        {cat.name}
                      </td>
                    </tr>
                    {cat.features.map((feat) => (
                      <tr
                        key={feat.name}
                        className="border-t border-envrt-brand-black/8"
                      >
                        <td className="px-4 py-3 text-sm text-envrt-brand-black/75 sm:px-6">
                          {feat.name}
                        </td>
                        <td className="px-3 py-3 text-center text-sm sm:px-6">
                          <Cell value={feat.starter} />
                        </td>
                        <td className="px-3 py-3 text-center text-sm sm:px-6">
                          <Cell value={feat.growth} />
                        </td>
                        <td className="px-3 py-3 text-center text-sm sm:px-6">
                          <Cell value={feat.pro} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ))}
              </table>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === "boolean") {
    return value ? (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-envrt-brand-ultramarine/10 text-envrt-brand-ultramarine">
        <AssetIcon type="audit" size={12} />
      </span>
    ) : (
      <span aria-hidden className="text-envrt-brand-black/25">
        —
      </span>
    );
  }
  return (
    <span className="text-xs text-envrt-brand-black/75 sm:text-sm">{value}</span>
  );
}
