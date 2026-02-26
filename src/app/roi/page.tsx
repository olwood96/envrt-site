"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionCard } from "@/components/ui/SectionCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FadeUp } from "@/components/ui/Motion";

/* ================================================================
   TYPES
   ================================================================ */

type Screen = "hero" | "calculator" | "email" | "results";
type Market = "eu" | "uk" | "both";
type Approach = "none" | "spreadsheets" | "consultant" | "inhouse";
type TeamSize = "founder" | "small" | "dedicated";

interface CalcInputs {
  skuCount: number;
  hoursPerProduct: number;
  market: Market;
  approach: Approach;
  teamSize: TeamSize;
}

interface CalcResults {
  envrtCost: number;
  envrtPlan: string;
  envrtPlanPrice: string;
  consultantCost: number;
  inhouseCost: number;
  maxSaving: number;
  savingVsConsultant: number;
  savingVsInhouse: number;
  hoursSaved: number;
  daysSaved: number;
}

/* ================================================================
   CALCULATION LOGIC
   ================================================================ */

function calculateROI(inputs: CalcInputs): CalcResults {
  // ENVRT cost: auto-select plan by SKU count
  let envrtMonthly: number;
  let envrtPlan: string;
  let envrtPlanPrice: string;
  if (inputs.skuCount <= 25) {
    envrtMonthly = 149;
    envrtPlan = "Starter";
    envrtPlanPrice = "£149/mo";
  } else if (inputs.skuCount <= 100) {
    envrtMonthly = 495;
    envrtPlan = "Growth";
    envrtPlanPrice = "£495/mo";
  } else {
    envrtMonthly = 1295;
    envrtPlan = "Pro";
    envrtPlanPrice = "£1,295/mo";
  }
  const envrtCost = envrtMonthly * 12;

  // Consultant cost
  const dayRates: Record<TeamSize, number> = {
    founder: 500,
    small: 650,
    dedicated: 800,
  };
  const marketMultiplier = inputs.market === "both" ? 1.3 : 1.0;
  const consultantDays = 5 + inputs.skuCount * 1.5;
  const consultantCost =
    consultantDays * dayRates[inputs.teamSize] * marketMultiplier;

  // In-house cost (salary + overhead)
  const salaries: Record<TeamSize, number> = {
    founder: 43000,
    small: 55000,
    dedicated: 67000,
  };
  const inhouseCost = salaries[inputs.teamSize];

  // Savings
  const savingVsConsultant = Math.max(0, consultantCost - envrtCost);
  const savingVsInhouse = Math.max(0, inhouseCost - envrtCost);
  const maxSaving = Math.max(savingVsConsultant, savingVsInhouse);

  // Time savings: (current hours - 1 hour with ENVRT) per SKU per year
  const hoursSaved = Math.max(0, (inputs.hoursPerProduct - 1) * inputs.skuCount);
  const daysSaved = Math.round(hoursSaved / 8);

  return {
    envrtCost,
    envrtPlan,
    envrtPlanPrice,
    consultantCost: Math.round(consultantCost),
    inhouseCost,
    maxSaving: Math.round(maxSaving),
    savingVsConsultant: Math.round(savingVsConsultant),
    savingVsInhouse: Math.round(savingVsInhouse),
    hoursSaved: Math.round(hoursSaved),
    daysSaved,
  };
}

/* ================================================================
   SUB-COMPONENTS
   ================================================================ */

function RangeSlider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  format,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  const display = format ? format(value) : String(value);
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-medium text-envrt-charcoal">{label}</span>
        <span className="text-lg font-bold text-envrt-teal">{display}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="roi-slider w-full"
        />
        {/* Filled track */}
        <div
          className="pointer-events-none absolute left-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-envrt-teal"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-xs text-envrt-muted/60">
        <span>{format ? format(min) : min}</span>
        <span>{format ? format(max) : max}</span>
      </div>
    </div>
  );
}

function OptionTile<T extends string>({
  label,
  value,
  selected,
  onSelect,
}: {
  label: string;
  value: T;
  selected: boolean;
  onSelect: (v: T) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 ${
        selected
          ? "border-envrt-teal bg-envrt-teal/5 text-envrt-teal shadow-sm"
          : "border-envrt-charcoal/10 text-envrt-charcoal/70 hover:border-envrt-charcoal/30 hover:bg-envrt-cream/50"
      }`}
    >
      {label}
    </button>
  );
}

function CostBar({
  label,
  amount,
  maxAmount,
  color,
  animated,
  delay,
}: {
  label: string;
  amount: number;
  maxAmount: number;
  color: "teal" | "muted" | "charcoal";
  animated: boolean;
  delay: number;
}) {
  const [displayAmount, setDisplayAmount] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const pct = maxAmount > 0 ? Math.max(5, (amount / maxAmount) * 100) : 5;

  const colors = {
    teal: "bg-envrt-teal",
    muted: "bg-envrt-muted/40",
    charcoal: "bg-envrt-charcoal/60",
  };

  useEffect(() => {
    if (!animated) return;
    const timer = setTimeout(() => {
      setBarWidth(pct);
      // Count up animation
      const duration = 1200;
      const steps = 40;
      const increment = amount / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= amount) {
          setDisplayAmount(amount);
          clearInterval(interval);
        } else {
          setDisplayAmount(Math.round(current));
        }
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [animated, amount, pct, delay]);

  return (
    <div className="mb-6 last:mb-0">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-medium text-envrt-charcoal">{label}</span>
        <span className="text-lg font-bold text-envrt-charcoal">
          £{displayAmount.toLocaleString()}
          <span className="text-xs font-normal text-envrt-muted">/yr</span>
        </span>
      </div>
      <div className="h-4 w-full overflow-hidden rounded-full bg-envrt-charcoal/5">
        <div
          className={`h-full rounded-full ${colors[color]} transition-all duration-1000 ease-out`}
          style={{ width: `${barWidth}%` }}
        />
      </div>
    </div>
  );
}

/* ================================================================
   MAIN PAGE
   ================================================================ */

export default function ROICalculatorPage() {
  const [screen, setScreen] = useState<Screen>("hero");
  const [emailSending, setEmailSending] = useState(false);
  const [animateResults, setAnimateResults] = useState(false);
  const [assumptionsOpen, setAssumptionsOpen] = useState(false);

  // Calculator inputs
  const [skuCount, setSkuCount] = useState(25);
  const [hoursPerProduct, setHoursPerProduct] = useState(4);
  const [market, setMarket] = useState<Market>("both");
  const [approach, setApproach] = useState<Approach>("spreadsheets");
  const [teamSize, setTeamSize] = useState<TeamSize>("small");

  // Results
  const [results, setResults] = useState<CalcResults | null>(null);

  // Stored form data for email
  const formDataRef = useRef<{
    firstName: string;
    brandName: string;
    email: string;
    marketingConsent: boolean;
  } | null>(null);

  const calculate = useCallback(() => {
    const inputs: CalcInputs = {
      skuCount,
      hoursPerProduct,
      market,
      approach,
      teamSize,
    };
    const r = calculateROI(inputs);
    setResults(r);
    setScreen("email");
    window.scrollTo(0, 0);
  }, [skuCount, hoursPerProduct, market, approach, teamSize]);

  const showResults = useCallback(() => {
    setScreen("results");
    setAnimateResults(false);
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimateResults(true));
    });
  }, []);

  const recalculate = useCallback(() => {
    setScreen("calculator");
    setResults(null);
    setAnimateResults(false);
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* ---- HERO ---- */}
      {screen === "hero" && (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-5 py-20 text-center">
          <FadeUp>
            <div className="mx-auto max-w-2xl">
              <Badge className="mb-6">ROI Calculator</Badge>
              <h1 className="text-3xl font-bold tracking-tight text-envrt-charcoal sm:text-5xl">
                What does DPP compliance actually cost?
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base text-envrt-muted sm:text-lg">
                Compare the cost of ENVRT against hiring a consultant or
                building an in-house sustainability team. Get your personalised
                savings estimate in under 3 minutes.
              </p>

              <div className="mt-8 flex flex-col gap-2.5 text-left">
                {[
                  "Free, no account required",
                  "Personalised cost comparison in under 3 minutes",
                  "ENVRT vs consultant vs in-house hire",
                ].map((text) => (
                  <div
                    key={text}
                    className="flex items-center gap-2.5 text-sm text-envrt-muted"
                  >
                    <svg
                      className="h-4 w-4 flex-shrink-0 text-envrt-teal"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <circle cx="8" cy="8" r="6.5" />
                      <path d="M5.5 8.5l2 2 3.5-4" />
                    </svg>
                    {text}
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Button
                  size="lg"
                  onClick={() => {
                    setScreen("calculator");
                    window.scrollTo(0, 0);
                  }}
                >
                  Calculate your savings <span className="ml-2">&rarr;</span>
                </Button>
              </div>
            </div>
          </FadeUp>
        </div>
      )}

      {/* ---- CALCULATOR ---- */}
      {screen === "calculator" && (
        <div className="pb-20 pt-28 sm:pt-32">
          <Container className="max-w-[640px]">
            <FadeUp>
              <div className="mb-10 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-envrt-charcoal sm:text-3xl">
                  Tell us about your brand
                </h2>
                <p className="mt-3 text-sm text-envrt-muted">
                  Adjust the inputs below. We will calculate your costs
                  instantly.
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <SectionCard>
                <div className="space-y-8 p-6 sm:p-8">
                  {/* SKU count slider */}
                  <RangeSlider
                    label="Number of product styles"
                    min={1}
                    max={500}
                    step={1}
                    value={skuCount}
                    onChange={setSkuCount}
                  />

                  {/* Hours per product slider */}
                  <RangeSlider
                    label="Hours per product on sustainability data"
                    min={0.5}
                    max={40}
                    step={0.5}
                    value={hoursPerProduct}
                    onChange={setHoursPerProduct}
                    format={(v) => `${v}h`}
                  />

                  {/* Markets */}
                  <div>
                    <p className="mb-3 text-sm font-medium text-envrt-charcoal">
                      Target markets
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          { value: "eu", label: "EU only" },
                          { value: "uk", label: "UK only" },
                          { value: "both", label: "EU and UK" },
                        ] as const
                      ).map((opt) => (
                        <OptionTile
                          key={opt.value}
                          label={opt.label}
                          value={opt.value}
                          selected={market === opt.value}
                          onSelect={setMarket}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Current approach */}
                  <div>
                    <p className="mb-3 text-sm font-medium text-envrt-charcoal">
                      Current approach to sustainability data
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          { value: "none", label: "Nothing yet" },
                          { value: "spreadsheets", label: "Spreadsheets" },
                          { value: "consultant", label: "Consultant" },
                          { value: "inhouse", label: "In-house team" },
                        ] as const
                      ).map((opt) => (
                        <OptionTile
                          key={opt.value}
                          label={opt.label}
                          value={opt.value}
                          selected={approach === opt.value}
                          onSelect={setApproach}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Team size */}
                  <div>
                    <p className="mb-3 text-sm font-medium text-envrt-charcoal">
                      Team size
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          { value: "founder", label: "Founder-led" },
                          { value: "small", label: "Small team" },
                          { value: "dedicated", label: "Dedicated person" },
                        ] as const
                      ).map((opt) => (
                        <OptionTile
                          key={opt.value}
                          label={opt.label}
                          value={opt.value}
                          selected={teamSize === opt.value}
                          onSelect={setTeamSize}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Calculate button */}
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={calculate}
                  >
                    See my savings
                    <span className="ml-2">&rarr;</span>
                  </Button>
                </div>
              </SectionCard>
            </FadeUp>
          </Container>
        </div>
      )}

      {/* ---- EMAIL CAPTURE ---- */}
      {screen === "email" && (
        <div className="pb-20 pt-28 sm:pt-32">
          <Container className="max-w-[480px]">
            <FadeUp>
              <SectionCard>
                <div className="space-y-5 p-6 sm:p-8">
                  <div className="text-center">
                    <h2 className="text-xl font-bold tracking-tight text-envrt-charcoal sm:text-2xl">
                      Your savings report is ready
                    </h2>
                    <p className="mt-2 text-sm text-envrt-muted">
                      Enter your details to view your results. We will also
                      email you a copy.
                    </p>
                  </div>

                  <form
                    className="space-y-4"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setEmailSending(true);
                      const fd = new FormData(e.currentTarget);
                      const firstName = fd.get("firstName") as string;
                      const brandName = fd.get("brandName") as string;
                      const email = fd.get("email") as string;
                      const marketingConsent = !!fd.get("marketingConsent");

                      formDataRef.current = {
                        firstName,
                        brandName,
                        email,
                        marketingConsent,
                      };

                      if (results) {
                        try {
                          await fetch("/.netlify/functions/roi-lead", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              firstName,
                              brandName,
                              email,
                              marketingConsent,
                              skuCount,
                              hoursPerProduct,
                              market,
                              approach,
                              teamSize,
                              ...results,
                            }),
                          });
                        } catch {
                          // Email failed silently - still show results
                        }
                      }
                      setEmailSending(false);
                      showResults();
                    }}
                  >
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-envrt-charcoal">
                        First name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        placeholder="Your first name"
                        className="w-full rounded-xl border border-envrt-charcoal/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-envrt-teal/40 focus:ring-1 focus:ring-envrt-teal/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-envrt-charcoal">
                        Brand name
                      </label>
                      <input
                        type="text"
                        name="brandName"
                        required
                        placeholder="Your brand name"
                        className="w-full rounded-xl border border-envrt-charcoal/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-envrt-teal/40 focus:ring-1 focus:ring-envrt-teal/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-envrt-charcoal">
                        Email address
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="you@brand.com"
                        className="w-full rounded-xl border border-envrt-charcoal/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-envrt-teal/40 focus:ring-1 focus:ring-envrt-teal/20"
                      />
                    </div>
                    <label className="flex items-start gap-2.5 pt-1">
                      <input
                        type="checkbox"
                        name="marketingConsent"
                        className="mt-0.5 h-4 w-4 rounded border-envrt-charcoal/20 text-envrt-teal accent-envrt-teal"
                      />
                      <span className="text-xs leading-relaxed text-envrt-muted">
                        I am happy to receive follow-up communications from
                        ENVRT about DPP compliance and product updates.
                      </span>
                    </label>
                    <Button
                      type="submit"
                      className={`w-full ${emailSending ? "pointer-events-none opacity-60" : ""}`}
                      size="lg"
                    >
                      {emailSending ? (
                        "Sending your report..."
                      ) : (
                        <>
                          View My Savings Report{" "}
                          <span className="ml-2">&rarr;</span>
                        </>
                      )}
                    </Button>
                    <p className="text-center text-[11px] leading-relaxed text-envrt-muted/70">
                      Your results will be emailed to you. See our{" "}
                      <Link
                        href="/privacy"
                        className="underline hover:text-envrt-teal"
                      >
                        privacy policy
                      </Link>{" "}
                      for how we handle your data.
                    </p>
                  </form>

                  <button
                    type="button"
                    onClick={showResults}
                    className="mx-auto mt-5 block text-xs text-envrt-muted underline transition-colors hover:text-envrt-teal"
                  >
                    Skip and view results without saving
                  </button>
                </div>
              </SectionCard>
            </FadeUp>
          </Container>
        </div>
      )}

      {/* ---- RESULTS ---- */}
      {screen === "results" && results && (
        <div className="pb-20 pt-28 sm:pt-32">
          <Container className="max-w-[720px]">
            {/* Savings headline */}
            <FadeUp>
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-envrt-teal">
                  Your estimated annual saving
                </p>
                <p className="mt-3 text-5xl font-bold tracking-tight text-envrt-charcoal sm:text-6xl">
                  <CountUp target={results.maxSaving} animated={animateResults} prefix="£" />
                </p>
                <p className="mt-3 text-base text-envrt-muted">
                  by switching to ENVRT instead of the most expensive alternative
                </p>
              </div>
            </FadeUp>

            {/* Cost comparison bars */}
            <FadeUp delay={0.15}>
              <SectionCard className="mt-10">
                <div className="p-6 sm:p-8">
                  <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-envrt-charcoal">
                    Annual Cost Comparison
                  </h3>
                  <CostBar
                    label="ENVRT"
                    amount={results.envrtCost}
                    maxAmount={Math.max(
                      results.envrtCost,
                      results.consultantCost,
                      results.inhouseCost
                    )}
                    color="teal"
                    animated={animateResults}
                    delay={200}
                  />
                  <CostBar
                    label="Consultant"
                    amount={results.consultantCost}
                    maxAmount={Math.max(
                      results.envrtCost,
                      results.consultantCost,
                      results.inhouseCost
                    )}
                    color="muted"
                    animated={animateResults}
                    delay={400}
                  />
                  <CostBar
                    label="In-house hire"
                    amount={results.inhouseCost}
                    maxAmount={Math.max(
                      results.envrtCost,
                      results.consultantCost,
                      results.inhouseCost
                    )}
                    color="charcoal"
                    animated={animateResults}
                    delay={600}
                  />
                </div>
              </SectionCard>
            </FadeUp>

            {/* Time savings + recommended plan */}
            <FadeUp delay={0.25}>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <SectionCard>
                  <div className="p-6">
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-envrt-charcoal">
                      Time Savings
                    </h3>
                    <p className="text-3xl font-bold text-envrt-teal">
                      {results.hoursSaved.toLocaleString()}h
                    </p>
                    <p className="mt-1 text-sm text-envrt-muted">
                      saved per year ({results.daysSaved} working days)
                    </p>
                  </div>
                </SectionCard>
                <SectionCard>
                  <div className="p-6">
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-envrt-charcoal">
                      Recommended Plan
                    </h3>
                    <p className="text-3xl font-bold text-envrt-teal">
                      {results.envrtPlan}
                    </p>
                    <p className="mt-1 text-sm text-envrt-muted">
                      {results.envrtPlanPrice} for {skuCount} products
                    </p>
                    <Link
                      href="/pricing"
                      className="mt-3 inline-block text-xs font-medium text-envrt-teal underline hover:text-envrt-teal/80"
                    >
                      View full pricing details
                    </Link>
                  </div>
                </SectionCard>
              </div>
            </FadeUp>

            {/* Breakdown */}
            <FadeUp delay={0.3}>
              <SectionCard className="mt-6">
                <div className="p-6 sm:p-8">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-envrt-charcoal">
                    Savings Breakdown
                  </h3>
                  <div className="divide-y divide-envrt-charcoal/5">
                    <div className="flex items-baseline justify-between py-3">
                      <span className="text-sm text-envrt-charcoal/80">
                        Saving vs consultant
                      </span>
                      <span className="text-sm font-bold text-envrt-charcoal">
                        £{results.savingVsConsultant.toLocaleString()}/yr
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between py-3">
                      <span className="text-sm text-envrt-charcoal/80">
                        Saving vs in-house hire
                      </span>
                      <span className="text-sm font-bold text-envrt-charcoal">
                        £{results.savingVsInhouse.toLocaleString()}/yr
                      </span>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </FadeUp>

            {/* Assumptions */}
            <FadeUp delay={0.35}>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setAssumptionsOpen(!assumptionsOpen)}
                  className="flex w-full items-center justify-between rounded-xl border border-envrt-charcoal/10 bg-white px-6 py-4 text-left transition-colors hover:bg-envrt-cream/50"
                >
                  <span className="text-sm font-medium text-envrt-charcoal">
                    Assumptions and methodology
                  </span>
                  <span
                    className={`text-envrt-muted transition-transform duration-200 ${assumptionsOpen ? "rotate-180" : ""}`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M4 6l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
                {assumptionsOpen && (
                  <div className="mt-2 rounded-xl border border-envrt-charcoal/10 bg-white p-6">
                    <div className="space-y-3 text-xs leading-relaxed text-envrt-muted">
                      <p>
                        <strong className="text-envrt-charcoal">ENVRT pricing:</strong>{" "}
                        Based on published plan rates. Starter (up to 25 products) at £149/mo, Growth (up to 100) at £495/mo, Pro (100+) at £1,295/mo.
                      </p>
                      <p>
                        <strong className="text-envrt-charcoal">Consultant cost:</strong>{" "}
                        Calculated as (5 setup days + {skuCount} products x 1.5 days each) x day rate{market === "both" ? " x 1.3 dual-market multiplier" : ""}. Day rates vary by team context: £500 (founder-led), £650 (small team), £800 (dedicated hire).
                      </p>
                      <p>
                        <strong className="text-envrt-charcoal">In-house cost:</strong>{" "}
                        Based on typical UK salary plus overhead for a sustainability-focused role: £43k (founder doing it themselves), £55k (junior hire in small team), £67k (dedicated sustainability manager).
                      </p>
                      <p>
                        <strong className="text-envrt-charcoal">Time savings:</strong>{" "}
                        Based on your estimate of {hoursPerProduct}h per product currently, reduced to approximately 1h per product with ENVRT, across {skuCount} products.
                      </p>
                      <p className="pt-2 text-envrt-muted/60">
                        These are estimates for illustration only and may vary based on your specific circumstances.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </FadeUp>

            {/* CTA block */}
            <FadeUp delay={0.4}>
              <SectionCard dark className="mt-10">
                <div className="px-6 py-16 sm:px-10 sm:py-20">
                  <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      Ready to save £{results.maxSaving.toLocaleString()} this year?
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-white/80">
                      ENVRT replaces the need for expensive consultants or
                      in-house hires. Get in touch and we will walk you through
                      how it works for your brand.
                    </p>
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                      <Link
                        href="/contact"
                        data-cta="roi-cta-contact"
                        className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-medium text-envrt-green transition-all duration-300 hover:bg-envrt-cream shadow-sm hover:shadow-md"
                      >
                        Get in touch
                        <span className="ml-2">&rarr;</span>
                      </Link>
                      <Link
                        href="/pricing"
                        data-cta="roi-cta-pricing"
                        className="inline-flex items-center justify-center rounded-xl border border-white/30 px-8 py-4 text-lg font-medium text-white transition-all duration-300 hover:border-white/60 hover:bg-white/10"
                      >
                        View pricing
                      </Link>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </FadeUp>

            {/* Recalculate */}
            <div className="mt-8 text-center">
              <Button variant="ghost" onClick={recalculate}>
                Recalculate
              </Button>
            </div>
          </Container>
        </div>
      )}

      {/* Slider styles */}
      <style jsx global>{`
        .roi-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          background: rgba(27, 58, 45, 0.08);
          border-radius: 9999px;
          outline: none;
          position: relative;
          z-index: 1;
        }
        .roi-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #1a7a6d;
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
          position: relative;
          z-index: 2;
        }
        .roi-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #1a7a6d;
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
        }
        .roi-slider::-moz-range-track {
          height: 8px;
          background: rgba(27, 58, 45, 0.08);
          border-radius: 9999px;
        }
      `}</style>
    </>
  );
}

/* ================================================================
   COUNT-UP COMPONENT
   ================================================================ */

function CountUp({
  target,
  animated,
  prefix = "",
}: {
  target: number;
  animated: boolean;
  prefix?: string;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!animated) {
      setValue(0);
      return;
    }
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setValue(target);
        clearInterval(interval);
      } else {
        setValue(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [animated, target]);

  return (
    <>
      {prefix}
      {value.toLocaleString()}
    </>
  );
}
