"use client";

import { Container } from "../ui/Container";
import { SectionCard } from "../ui/SectionCard";
import { Button } from "../ui/Button";
import { FadeUp, StaggerChildren, StaggerItem } from "../ui/Motion";

type PricingPlan = {
  name: string;
  subheading: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Starter",
    subheading: "Your DPP Hub",
    price: "£149",
    period: " / month",
    description:
      "Create compliant Digital Product Passports fast. Perfect for getting started with trusted disclosure.",
    features: [
      "Compliant Digital Product Passports (DPPs)",
      "Traceability score per product",
      "Evidence uploads and product documentation",
      "Auto-generated disclosures and templates",
      "Shareable DPP link and QR-ready output",
      "1 onboarding call included",
    ],
    cta: "View full comparison",
  },
  {
    name: "Growth",
    subheading: "Your Impact Analyst",
    price: "£495",
    period: " / month",
    description:
      "Add sustainability metrics and insights. Built for brands that need credible CO₂e and water scarcity outputs.",
    features: [
      "Everything in Starter",
      "ISO-aligned sustainability metrics (CO₂e + water scarcity)",
      "Automated hotspot detection across lifecycle stages",
      "Decarbonisation and eco-design recommendations",
      "Exportable insights for stakeholders and reporting",
      "Priority support and faster turnaround",
    ],
    cta: "View full comparison",
    highlighted: true,
  },
  {
    name: "Pro",
    subheading: "Your Sustainability Team",
    price: "£1,295",
    period: " / month",
    description:
      "A hands-on, high-touch plan that replaces the need for an internal team. Best for rapid scaling and supplier complexity.",
    features: [
      "Everything in Growth",
      "Dedicated sustainability analyst support",
      "Supplier follow-up and data-chasing assistance",
      "Weekly reviews and optimisation roadmap",
      "Custom outputs and tailored reporting support",
      "Fast response SLA",
    ],
    cta: "View full comparison",
  },
];

export function PricingPreviewSection() {
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
                From compliant DPPs to a full sustainability function. Scale as you grow.
              </p>
            </div>
          </FadeUp>

          <StaggerChildren className="mt-14 grid gap-5 lg:grid-cols-3">
            {PRICING_PLANS.map((plan) => (
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
                    {plan.features.slice(0, 6).map((f) => (
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
                    {plan.features.length > 6 && (
                      <li className="text-xs text-envrt-muted">
                        + {plan.features.length - 6} more features
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
            ))}
          </StaggerChildren>

          <FadeUp delay={0.2}>
            <p className="mt-10 text-center text-sm text-envrt-muted">
              Prefer an annual plan or need enterprise terms?{" "}
              <a href="/contact" className="text-envrt-teal hover:underline">
                Talk to us →
              </a>
            </p>
          </FadeUp>
        </Container>
      </SectionCard>
    </div>
  );
}
