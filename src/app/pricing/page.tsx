"use client";

import React from "react";
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

const pricingPlans = [
  {
    name: "Starter",
    subheading: "Your DPP Hub",
    price: "£149",
    period: " / month",
    description: "Ideal for brands needing fast, compliant Digital Product Passports.",
    features: [
      "Digital Product Passports: Limited Allocation",
      "AI-assisted reconstruction of primary fibre-to-assembly stages",
      "CO₂e and AWARE water scarcity impact indicators mapped for DPP compliance",
      "QR-ready passport pages",
      "Optional ENVRT Marketplace onboarding",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Growth",
    subheading: "Your Impact Analyst",
    price: "£495",
    period: " / month",
    description:
      "For brands ready to measure, compare and improve their environmental impact with richer data and deeper visibility.",
    features: [
      "Digital Product Passports: Expanded Allocation",
      "Enhanced supply-chain modelling with detailed process-level reconstruction",
      "CO₂e, AWARE water scarcity and core LCA metrics",
      "Verification-grade DPPs with expanded product data",
      "Product dashboard with hotspot detection and comparisons",
      "Entry-level decarbonisation strategies",
      "Priority support",
    ],
    cta: "Get Started",
    highlighted: true,
  },
  {
    name: "Pro",
    subheading: "Your Sustainability Team",
    price: "£1,295",
    period: " / month",
    description:
      "Full-scale environmental intelligence, advanced modelling and strategic decarbonisation support for low-impact collections.",
    features: [
      "Digital Product Passports: Unlimited",
      "Unlimited full LCAs + complete PEF-aligned metrics",
      "Seasonal product-line impact reports",
      "Design-stage eco-modelling and material pathway evaluation",
      "Supplier, logistics and process optimisation frameworks",
      "Eco-design strategy and compliant sustainability claims support",
      "Dedicated account specialist",
    ],
    cta: "Get Started",
    highlighted: false,
  },
] as const;

const pricingComparison = {
  categories: [
    {
      name: "DPP creation",
      features: [
        { name: "Digital Product Passports (allocation)", starter: "Limited", growth: "Expanded", pro: "Unlimited" },
        { name: "QR-ready passport pages", starter: true, growth: true, pro: true },
        { name: "Verification-grade DPPs", starter: false, growth: true, pro: true },
        { name: "Expanded product data in DPP", starter: false, growth: true, pro: true },
      ],
    },
    {
      name: "Supply chain modelling",
      features: [
        { name: "AI-assisted reconstruction (fibre-to-assembly)", starter: true, growth: true, pro: true },
        { name: "Detailed process-level reconstruction", starter: false, growth: true, pro: true },
        { name: "Advanced modelling + optimisation frameworks", starter: false, growth: false, pro: true },
      ],
    },
    {
      name: "Metrics",
      features: [
        { name: "CO₂e indicators", starter: true, growth: true, pro: true },
        { name: "AWARE water scarcity indicators", starter: true, growth: true, pro: true },
        { name: "Core LCA metrics (beyond indicators)", starter: false, growth: true, pro: true },
        { name: "Complete PEF-aligned metrics", starter: false, growth: false, pro: true },
      ],
    },
    {
      name: "Dashboard & insights",
      features: [
        { name: "Product dashboard", starter: false, growth: true, pro: true },
        { name: "Hotspot detection", starter: false, growth: true, pro: true },
        { name: "Product comparisons", starter: false, growth: true, pro: true },
        { name: "Seasonal product-line impact reports", starter: false, growth: false, pro: true },
      ],
    },
    {
      name: "Strategy & support",
      features: [
        { name: "Priority support", starter: false, growth: true, pro: true },
        { name: "Entry-level decarbonisation strategies", starter: false, growth: true, pro: true },
        { name: "Eco-design strategy + claims support", starter: false, growth: false, pro: true },
        { name: "Dedicated account specialist", starter: false, growth: false, pro: true },
      ],
    },
    {
      name: "Marketplace",
      features: [
        { name: "Optional ENVRT Marketplace onboarding", starter: true, growth: true, pro: true },
      ],
    },
  ],
} as const;

export default function PricingPage() {
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

        {/* Plan cards — subheading inside card, matching preview section */}
        <StaggerChildren className="mt-14 grid gap-5 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <StaggerItem key={plan.name}>
              <div
                className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? "border-envrt-teal/30 bg-white shadow-xl shadow-envrt-teal/5"
                    : "border-envrt-charcoal/5 bg-white hover:border-envrt-charcoal/10"
                }`}
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
                  <span className="text-3xl font-bold text-envrt-charcoal">
                    {plan.price}
                  </span>
                  <span className="text-sm text-envrt-muted">{plan.period}</span>
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
          ))}
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
          <SectionCard className="mx-auto mt-10 max-w-5xl overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
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
          </SectionCard>
        </FadeUp>
      </Container>
    </div>
  );
}
