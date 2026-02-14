"use client";

import React, { useState, useEffect, useRef } from "react";
import { Container } from "@/components/ui/Container";
import { SectionCard } from "@/components/ui/SectionCard";
import { Button } from "@/components/ui/Button";
import { FadeUp, StaggerChildren, StaggerItem } from "@/components/ui/Motion";

function CheckIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-envrt-teal" viewBox="0 0 16 16" fill="currentColor">
      <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="h-4 w-4 text-envrt-charcoal/20" viewBox="0 0 16 16" fill="currentColor">
      <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
    </svg>
  );
}

function FeatureValue({ value }: { value: boolean | string }) {
  if (typeof value === "boolean") return value ? <CheckIcon /> : <XIcon />;
  return <span className="text-sm text-envrt-charcoal">{value}</span>;
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

const pricingPlans = [
  {
    name: "Starter",
    subheading: "Your DPP Hub",
    priceGBP: 149,
    description: "Regulation-ready Digital Product Passports. Perfect for getting started with trusted product disclosure.",
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
    cta: "Get Started",
    highlighted: false,
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
      "Product comparisons",
      "Entry-level decarbonisation guidance",
      "Stage-linked evidence library",
      "Hotspot insights with reduction opportunities",
      "Priority support",
    ],
    cta: "Get Started",
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
    cta: "Get Started",
    highlighted: false,
  },
] as const;

const pricingComparison = {
  categories: [
    {
      name: "DPP Creation",
      features: [
        { name: "DPP page allocation", starter: "Up to 25", growth: "Up to 100", pro: "Custom" },
        { name: "QR-ready passport pages", starter: true, growth: true, pro: true },
        { name: "Expanded product data in DPP", starter: false, growth: true, pro: true },
        { name: "Auto-generated disclosures and templates", starter: true, growth: true, pro: true },
      ],
    },
    {
      name: "Traceability and Evidence",
      features: [
        { name: "Traceability score per product", starter: true, growth: true, pro: true },
        { name: "Evidence uploads and product documentation", starter: true, growth: true, pro: true },
        { name: "Stage-linked evidence library", starter: false, growth: true, pro: true },
      ],
    },
    {
      name: "Supply Chain Modelling",
      features: [
        { name: "Fibre-to-assembly supply chain reconstruction", starter: true, growth: true, pro: true },
        { name: "Process-level supply chain reconstruction", starter: false, growth: true, pro: true },
        { name: "Advanced modelling and optimisation frameworks", starter: false, growth: false, pro: true },
      ],
    },
    {
      name: "Metrics",
      features: [
        { name: "CO\u2082e indicators", starter: true, growth: true, pro: true },
        { name: "AWARE water scarcity indicators", starter: true, growth: true, pro: true },
        { name: "Core LCA metrics beyond indicators", starter: false, growth: true, pro: true },
        { name: "Complete PEF-aligned metrics", starter: false, growth: false, pro: true },
      ],
    },
    {
      name: "Dashboard and Insights",
      features: [
        { name: "Hotspot detection across lifecycle stages", starter: false, growth: true, pro: true },
        { name: "Hotspot insights with reduction opportunities", starter: false, growth: true, pro: true },
        { name: "Product comparisons", starter: false, growth: true, pro: true },
        { name: "Collection summaries with CSV/PDF exports", starter: false, growth: true, pro: true },
        { name: "Seasonal product-line impact reports", starter: false, growth: false, pro: true },
      ],
    },
    {
      name: "Strategy and Decarbonisation",
      features: [
        { name: "Entry-level decarbonisation guidance", starter: false, growth: true, pro: true },
        { name: "Eco-design strategy and claims support", starter: false, growth: false, pro: true },
      ],
    },
    {
      name: "Support",
      features: [
        { name: "Email support", starter: true, growth: true, pro: true },
        { name: "Onboarding call", starter: true, growth: true, pro: true },
        { name: "Priority support", starter: false, growth: true, pro: true },
        { name: "Supplier follow-up and data-chasing assistance", starter: false, growth: false, pro: true },
        { name: "Dedicated account specialist", starter: false, growth: false, pro: true },
        { name: "Weekly reviews", starter: false, growth: false, pro: true },
        { name: "Fast-response SLA", starter: false, growth: false, pro: true },
      ],
    },
  ],
} as const;

export default function PricingPage() {
  const { nudge, onEnter, onLeave } = useNudge(3500);
  const [currency, setCurrency] = useState<Currency>("GBP");
  const [interval, setInterval_] = useState<Interval>("monthly");

  return (
    <div className="pt-28 pb-16">
      <Container>
        <FadeUp>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-envrt-charcoal sm:text-5xl">
              Pricing
            </h1>
            <p className="mt-4 text-base text-envrt-muted sm:text-lg">
              From your first DPP to full sustainability operations. Every plan includes
              a 14-day free trial.
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

        {/* Plan cards */}
        <StaggerChildren className="mt-14 grid gap-5 lg:grid-cols-3">
          {pricingPlans.map((plan) => {
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
                      <CheckIcon />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Button
                    href="/contact"
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
