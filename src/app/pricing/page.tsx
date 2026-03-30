"use client";

import React, { useState, useCallback } from "react";
import { Container } from "@/components/ui/Container";
import { SectionCard } from "@/components/ui/SectionCard";
import { Button } from "@/components/ui/Button";
import { FadeUp, StaggerChildren, StaggerItem } from "@/components/ui/Motion";
import { Toggle } from "@/components/ui/Toggle";
import { CheckIcon, XIcon } from "@/components/icons";
import { pricingPlans, pricingComparison, type PlanSlug } from "@/lib/config";
import { formatPrice, computePrice, type Currency, type Interval } from "@/lib/pricing";
import { useNudge } from "@/hooks/useNudge";

function FeatureValue({ value }: { value: boolean | string }) {
  if (typeof value === "boolean")
    return value
      ? <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-envrt-teal" />
      : <XIcon className="h-4 w-4 text-envrt-charcoal/20" />;
  return <span className="text-sm text-envrt-charcoal">{value}</span>;
}

export default function PricingPage() {
  const { nudge, onEnter, onLeave } = useNudge();
  const [currency, setCurrency] = useState<Currency>("GBP");
  const [interval, setInterval_] = useState<Interval>("monthly");
  const [loadingPlan, setLoadingPlan] = useState<PlanSlug | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleBuyNow = useCallback(
    async (planSlug: PlanSlug) => {
      setLoadingPlan(planSlug);
      setCheckoutError(null);

      try {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan: planSlug,
            interval: interval.toLowerCase(),
            currency: currency.toLowerCase(),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setCheckoutError(data.error || "Something went wrong");
          return;
        }

        if (data.url) {
          window.location.href = data.url;
        }
      } catch {
        setCheckoutError("Failed to start checkout. Please try again.");
      } finally {
        setLoadingPlan(null);
      }
    },
    [interval, currency]
  );

  return (
    <div className="pt-28 pb-16">
      <Container>
        <FadeUp>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-envrt-charcoal sm:text-5xl">
              Pricing
            </h1>
            <p className="mt-4 text-base text-envrt-muted sm:text-lg">
              From your first DPP to full sustainability operations.
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={0.05}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Toggle
              options={["GBP", "EUR"]}
              active={currency === "GBP" ? 0 : 1}
              onChange={(i) => setCurrency(i === 0 ? "GBP" : "EUR")}
            />
            <Toggle
              options={["Monthly", "Annual"]}
              active={interval === "monthly" ? 0 : 1}
              onChange={(i) => setInterval_(i === 0 ? "monthly" : "annual")}
              badge="Save 15%"
            />
          </div>
        </FadeUp>

        {/* Every plan includes */}
        <FadeUp delay={0.08}>
          <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-envrt-teal/10 bg-envrt-teal/[0.03] px-6 py-5 sm:px-8">
            <p className="text-center text-xs font-medium uppercase tracking-widest text-envrt-teal">
              Every plan includes
            </p>
            <div className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "QR-ready DPP pages",
                "Multi-language DPP pages",
                "Onboarding call",
                "No setup fees",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-envrt-charcoal/80">
                  <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-envrt-teal" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Plan cards */}
        <StaggerChildren className="mt-10 grid gap-5 lg:grid-cols-3">
          {pricingPlans.map((plan) => {
              const price = computePrice(plan.priceGBP, currency, interval);

              return (
            <StaggerItem key={plan.name}>
              <div
                onMouseEnter={plan.highlighted ? onEnter : undefined}
                onMouseLeave={plan.highlighted ? onLeave : undefined}
                className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? "border-envrt-teal/30 bg-white shadow-xl shadow-envrt-teal/5"
                    : "border-envrt-charcoal/5 bg-white hover:border-envrt-charcoal/10"
                } ${plan.highlighted && nudge ? "animate-nudge" : ""}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-6 rounded-full bg-envrt-teal px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
                    Most popular
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-envrt-charcoal">{plan.name}</h3>
                  <p className="mt-1 text-lg font-extrabold text-envrt-teal">
                    {plan.subheading}
                  </p>
                </div>

                <div className="mt-5">
                  <span className="text-3xl font-bold text-envrt-charcoal transition-all duration-300">
                    {formatPrice(interval === "annual" ? price * 12 : price, currency)}
                  </span>
                  <span className="text-sm text-envrt-muted">
                    {interval === "annual" ? " / year" : " / month"}
                  </span>
                </div>

                <p className="mt-3 text-sm text-envrt-muted">{plan.description}</p>

                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-envrt-charcoal/80"
                    >
                      <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-envrt-teal" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 space-y-3">
                  <button
                    onClick={() => handleBuyNow(plan.slug)}
                    disabled={loadingPlan !== null}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-medium transition-all duration-300 ${
                      plan.highlighted
                        ? "bg-envrt-teal text-white hover:bg-envrt-teal/90"
                        : "bg-envrt-charcoal text-white hover:bg-envrt-charcoal/90"
                    } ${loadingPlan !== null ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    {loadingPlan === plan.slug ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Loading...
                      </>
                    ) : (
                      "Get started"
                    )}
                  </button>
                  <Button
                    href="/contact"
                    variant="secondary"
                    className="w-full"
                  >
                    Get in touch
                  </Button>
                </div>
              </div>
            </StaggerItem>
              );
            })}
        </StaggerChildren>

        {checkoutError && (
          <FadeUp>
            <div className="mx-auto mt-6 max-w-md rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
              {checkoutError}
            </div>
          </FadeUp>
        )}

        <FadeUp delay={0.12}>
          <div className="mx-auto mt-10 max-w-3xl text-center">
            <p className="text-sm text-envrt-muted">
              DPP allowances differ by plan and can be customised if needed. Passports are issued per product
              style rather than per SKU.
            </p>
          </div>
        </FadeUp>

        {/* Comparison table */}
        <FadeUp delay={0.15}>
          <div className="mt-24">
            <h2 className="text-center text-2xl font-bold text-envrt-charcoal sm:text-3xl">
              Full feature comparison
            </h2>
          </div>
        </FadeUp>

        <FadeUp delay={0.2}>
          <SectionCard className="mx-auto mt-10 max-w-5xl">
            <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-envrt-charcoal/8">
                  <th className="px-3 sm:px-6 py-4 text-envrt-muted font-medium">Feature</th>
                  <th className="px-2 sm:px-6 py-4 text-center font-semibold text-envrt-charcoal">Starter</th>
                  <th className="px-2 sm:px-6 py-4 text-center font-semibold text-envrt-teal">Growth</th>
                  <th className="px-2 sm:px-6 py-4 text-center font-semibold text-envrt-charcoal">Pro</th>
                </tr>
              </thead>
              <tbody>
                {pricingComparison.categories.map((cat) => (
                  <React.Fragment key={cat.name}>
                    <tr>
                      <td colSpan={4} className="bg-envrt-charcoal/[0.02] px-3 sm:px-6 py-3 text-xs font-semibold uppercase tracking-widest text-envrt-muted">
                        {cat.name}
                      </td>
                    </tr>
                    {cat.features.map((feat) => (
                      <tr key={feat.name} className="border-b border-envrt-charcoal/4 last:border-0">
                        <td className="px-3 sm:px-6 py-3.5 text-envrt-charcoal/70">{feat.name}</td>
                        <td className="px-2 sm:px-6 py-3.5 text-center"><span className="inline-flex justify-center"><FeatureValue value={feat.starter} /></span></td>
                        <td className="px-2 sm:px-6 py-3.5 text-center"><span className="inline-flex justify-center"><FeatureValue value={feat.growth} /></span></td>
                        <td className="px-2 sm:px-6 py-3.5 text-center"><span className="inline-flex justify-center"><FeatureValue value={feat.pro} /></span></td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            </div>
          </SectionCard>
        </FadeUp>
      </Container>

    </div>
  );
}
