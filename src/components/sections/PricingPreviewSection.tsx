"use client";

import { useState } from "react";
import { Container } from "../ui/Container";
import { SectionCard } from "../ui/SectionCard";
import { Button } from "../ui/Button";
import { FadeUp, StaggerChildren, StaggerItem } from "../ui/Motion";
import { Toggle } from "../ui/Toggle";
import { CheckIcon } from "../icons";
import { pricingPlans } from "@/lib/config";
import { formatPrice, computePrice, type Currency, type Interval } from "@/lib/pricing";
import { useNudge } from "@/hooks/useNudge";

export function PricingPreviewSection() {
  const [currency, setCurrency] = useState<Currency>("GBP");
  const [interval, setInterval_] = useState<Interval>("monthly");
  const { nudge, onEnter, onLeave } = useNudge();

  return (
    <div className="px-4 py-8 sm:px-6" id="pricing-preview">
      <SectionCard className="mx-auto max-w-[1360px]">
        <Container className="py-16 sm:py-20">
          <FadeUp>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-envrt-teal">
                Pricing
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-envrt-charcoal sm:text-4xl">
                Simple, transparent plans
              </h2>
              <p className="mt-4 text-base text-envrt-muted">
                From compliant DPPs to a full sustainability function. Scale as you
                grow.
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

          <StaggerChildren className="mt-14 grid gap-5 lg:grid-cols-3">
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
                      <h3 className="text-lg font-bold text-envrt-charcoal">
                        {plan.name}
                      </h3>
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

                    <p className="mt-3 text-sm text-envrt-muted">
                      {plan.description}
                    </p>

                    <ul className="mt-6 flex-1 space-y-2.5">
                      {plan.features.slice(0, plan.highlighted ? plan.features.length : 6).map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-sm text-envrt-charcoal/80"
                        >
                          <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-envrt-teal" />
                          {f}
                        </li>
                      ))}
                      {!plan.highlighted && plan.features.length > 6 && (
                        <li className="text-xs text-envrt-muted">
                          and more
                        </li>
                      )}
                    </ul>

                    <div className="mt-8">
                      <Button
                        href="/pricing"
                        variant={plan.highlighted ? "primary" : "secondary"}
                        className="w-full"
                      >
                        View full comparison
                      </Button>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerChildren>

          <FadeUp delay={0.2}>
            <p className="mt-10 text-center text-sm text-envrt-muted">
              Prefer an annual plan or need enterprise terms?{" "}
              <a href="/contact" className="text-envrt-teal hover:underline">
                Talk to us &rarr;
              </a>
            </p>
          </FadeUp>
        </Container>
      </SectionCard>
    </div>
  );
}
