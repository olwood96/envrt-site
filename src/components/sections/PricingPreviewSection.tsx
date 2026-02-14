"use client";

import { useState, useEffect, useRef } from "react";
import { Container } from "../ui/Container";
import { SectionCard } from "../ui/SectionCard";
import { Button } from "../ui/Button";
import { FadeUp, StaggerChildren, StaggerItem } from "../ui/Motion";

type PricingPlan = {
  name: string;
  subheading: string;
  priceGBP: number;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Starter",
    subheading: "Your DPP Hub",
    priceGBP: 149,
    description:
      "Regulation-ready Digital Product Passports. Perfect for getting started with trusted product disclosure.",
    features: [
      "Up to 25 DPP pages",
      "QR-ready passport pages",
      "Traceability score per product",
      "Evidence uploads and product documentation",
      "Auto-generated disclosures and templates",
      "CO\u2082e and AWARE water scarcity indicators",
      "Fibre-to-assembly supply chain reconstruction",
      "Email support with onboarding call",
    ],
    cta: "View full comparison",
  },
  {
    name: "Growth",
    subheading: "Your Impact Analyst",
    priceGBP: 495,
    description:
      "Sustainability metrics and insights. Built for brands that need credible lifecycle outputs.",
    features: [
      "Up to 100 DPP pages",
      "Expanded product data in DPP",
      "Core LCA metrics beyond indicators",
      "Process-level supply chain reconstruction",
      "Hotspot detection across lifecycle stages",
      "Entry-level decarbonisation guidance",
      "Stage-linked evidence library",
      "Hotspot insights with reduction opportunities",
      "Priority support",
    ],
    cta: "View full comparison",
    highlighted: true,
  },
  {
    name: "Pro",
    subheading: "Your Sustainability Team",
    priceGBP: 1295,
    description:
      "A hands-on plan that replaces the need for an internal sustainability team. Built for scale and supplier complexity.",
    features: [
      "Custom DPP allocation",
      "Complete PEF-aligned metrics",
      "Advanced modelling and optimisation frameworks",
      "Seasonal product-line impact reports",
      "Eco-design strategy and claims support",
      "Dedicated account specialist",
      "Supplier follow-up and data-chasing assistance",
      "Fast-response SLA with weekly reviews",
    ],
    cta: "View full comparison",
  },
];

const GBP_TO_EUR = 1.18;
const ANNUAL_DISCOUNT = 0.15;

type Currency = "GBP" | "EUR";
type Interval = "monthly" | "annual";

function formatPrice(amount: number, currency: Currency): string {
  const symbol = currency === "GBP" ? "\u00A3" : "\u20AC";
  return `${symbol}${Math.round(amount).toLocaleString("en-GB")}`;
}

function Toggle({
  options,
  active,
  onChange,
  badge,
}: {
  options: [string, string];
  active: 0 | 1;
  onChange: (i: 0 | 1) => void;
  badge?: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-envrt-charcoal/8 bg-envrt-cream/60 p-1">
      {options.map((label, i) => (
        <button
          key={label}
          onClick={() => onChange(i as 0 | 1)}
          className={`relative rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
            active === i
              ? "bg-white text-envrt-charcoal shadow-sm"
              : "text-envrt-muted hover:text-envrt-charcoal/70"
          }`}
        >
          {label}
          {i === 1 && badge && active === 1 && (
            <span className="ml-1.5 inline-block rounded-full bg-envrt-teal/10 px-1.5 py-0.5 text-[9px] font-semibold text-envrt-teal">
              {badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function useNudge(intervalMs = 3500) {
  const [nudge, setNudge] = useState(false);
  const hoveredRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (hoveredRef.current) return;
      setNudge(true);
      setTimeout(() => setNudge(false), 700);
    }, intervalMs);
    return () => clearInterval(timerRef.current);
  }, [intervalMs]);

  const onEnter = () => {
    hoveredRef.current = true;
    setNudge(false);
  };
  const onLeave = () => {
    hoveredRef.current = false;
  };

  return { nudge, onEnter, onLeave };
}

export function PricingPreviewSection() {
  const [currency, setCurrency] = useState<Currency>("GBP");
  const [interval, setInterval_] = useState<Interval>("monthly");
  const { nudge, onEnter, onLeave } = useNudge(3500);

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
            {PRICING_PLANS.map((plan) => {
              let price = plan.priceGBP;
              if (currency === "EUR") price = price * GBP_TO_EUR;
              if (interval === "annual") price = price * (1 - ANNUAL_DISCOUNT);

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
                          <svg
                            className="mt-0.5 h-4 w-4 flex-shrink-0 text-envrt-teal"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                          >
                            <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                          </svg>
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
                        {plan.cta}
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

      {/* Nudge keyframes */}
      <style jsx global>{`
        @keyframes nudge {
          0%,
          100% {
            transform: translateX(0) rotate(0deg);
          }
          10% {
            transform: translateX(-4px) rotate(-0.7deg);
          }
          20% {
            transform: translateX(4px) rotate(0.7deg);
          }
          30% {
            transform: translateX(-4px) rotate(-0.7deg);
          }
          40% {
            transform: translateX(4px) rotate(0.7deg);
          }
          50% {
            transform: translateX(-3px) rotate(-0.5deg);
          }
          60% {
            transform: translateX(3px) rotate(0.5deg);
          }
          70% {
            transform: translateX(-2px) rotate(-0.3deg);
          }
          80% {
            transform: translateX(1px) rotate(0);
          }
        }
        .animate-nudge {
          animation: nudge 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}
