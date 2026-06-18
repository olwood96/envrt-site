"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, ButtonV3 } from "@/components/v3";
import { Eyebrow } from "@/components/sections/v3/_shared";
import { FadeUp } from "@/components/ui/Motion";
import { pricingPlans, type PricingPlan } from "@/lib/config";
import {
  planPrice,
  formatPrice,
  usePricing,
} from "@/components/v3/pricing/PricingContext";
import { PricingToggle } from "@/components/v3/pricing/PricingToggle";

// Client wrapper around the tier cards. Reads currency + billing from
// PricingContext so prices update without a route navigation. The
// PricingToggle sits above the three cards.

export function PricingTiersV3() {
  return (
    <>
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

      {/* Currency + billing tabs */}
      <FadeUp delay={0.14}>
        <div className="mt-10 flex justify-center sm:mt-12">
          <PricingToggle />
        </div>
      </FadeUp>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 lg:grid-cols-3 lg:gap-6">
        {pricingPlans.map((plan, i) => (
          <FadeUp key={plan.slug} delay={0.16 + i * 0.06}>
            <TierCard plan={plan} />
          </FadeUp>
        ))}
      </div>

      <FadeUp delay={0.4}>
        <p className="mt-10 text-center text-xs text-envrt-brand-black/55 sm:text-sm">
          All plans are annual. Annual upfront billing saves 15% on Starter
          and Growth.
        </p>
      </FadeUp>
    </>
  );
}

function TierCard({ plan }: { plan: PricingPlan }) {
  const isHighlighted = plan.highlighted;
  const { currency, billing } = usePricing();
  const price = planPrice(plan, currency, billing);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: plan.slug,
          interval: billing,
          currency: currency.toLowerCase(),
        }),
      });
      const data: { url?: string; error?: string } = await res
        .json()
        .catch(() => ({}));
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Couldn't start checkout. Try again.");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  }

  return (
    <Card
      variant={isHighlighted ? "cta" : "default"}
      className={`flex h-full flex-col ${
        isHighlighted ? "ring-1 ring-envrt-brand-ultramarine/20" : ""
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
        {plan.customPricing || price === null ? (
          <span className="font-display text-3xl font-semibold tracking-tight text-envrt-brand-black sm:text-4xl">
            Custom
          </span>
        ) : (
          <>
            <span className="font-display text-4xl font-semibold tracking-tight text-envrt-brand-black sm:text-5xl">
              {formatPrice(price, currency)}
            </span>
            <span className="text-sm text-envrt-brand-black/55">
              /month{billing === "annual" ? ", billed annually" : ""}
            </span>
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

      <div className="mt-auto pt-8">
        {plan.customPricing ? (
          <ButtonV3
            href="/contact"
            variant={isHighlighted ? "primary" : "secondary"}
            className="w-full"
            data-cta={`pricing-${plan.slug}-contact`}
          >
            Contact sales<span>→</span>
          </ButtonV3>
        ) : (
          <ButtonV3
            onClick={handleCheckout}
            disabled={isLoading}
            variant={isHighlighted ? "primary" : "secondary"}
            className="w-full"
            data-cta={`pricing-${plan.slug}-checkout`}
          >
            {isLoading ? "Loading…" : `Start with ${plan.name}`}
            {!isLoading && <span>→</span>}
          </ButtonV3>
        )}
        {error && (
          <p className="mt-2 text-center text-xs text-red-600">{error}</p>
        )}
        {!plan.customPricing && (
          <p className="mt-3 text-center text-xs text-envrt-brand-black/55">
            Want to try first?{" "}
            <Link
              href="/free-dpp"
              className="text-envrt-brand-ultramarine hover:underline"
            >
              Run one garment free
            </Link>
          </p>
        )}
      </div>
    </Card>
  );
}
