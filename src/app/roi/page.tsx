"use client";

import { useState } from "react";
import {
  STARTER_MONTHLY_GBP,
  GROWTH_MONTHLY_GBP,
  STARTER_SKU_LIMIT,
  GROWTH_SKU_LIMIT,
  STARTER_PRICE_LABEL,
  GROWTH_PRICE_LABEL,
} from "@/lib/plan-prices";
import {
  PageHero,
  FaqSnippet,
  ButtonV3,
  Card,
  Input,
  Label,
} from "@/components/v3";
import { DropdownV3 } from "@/components/v3/DropdownV3";
import {
  Eyebrow,
  SectionCorners,
} from "@/components/sections/v3/_shared";
import { FadeUp } from "@/components/ui/Motion";
import { FinalCtaV3 } from "@/components/sections/v3/FinalCtaV3";
import {
  formatFromGBP,
  usePricing,
} from "@/components/v3/pricing/PricingContext";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { HiddenTurnstile } from "@/components/ui/TurnstileWidget";

// //roi — ROI calculator. SKU count + data maturity + market +
// current approach determines the savings vs consultants and vs an
// in-house hire. Calculation logic ported verbatim from the v1 page.

type Market = "eu" | "uk" | "both";
type Approach = "none" | "spreadsheets" | "consultant" | "inhouse";
type DataMaturity = "not-started" | "manual" | "some-systems" | "digitised";

const DATA_MATURITY_MULTIPLIER: Record<DataMaturity, number> = {
  "not-started": 1.4,
  manual: 1.0,
  "some-systems": 0.75,
  digitised: 0.5,
};

const APPROACH_WEIGHT: Record<Approach, { consultant: number; inhouse: number }> = {
  none: { consultant: 1.0, inhouse: 1.0 },
  spreadsheets: { consultant: 1.0, inhouse: 1.0 },
  consultant: { consultant: 1.0, inhouse: 0.7 },
  inhouse: { consultant: 0.7, inhouse: 1.0 },
};

const DATA_MATURITY_HOURS: Record<DataMaturity, number> = {
  "not-started": 8,
  manual: 6,
  "some-systems": 4,
  digitised: 2,
};

type CalcResults = {
  envrtCost: number;
  envrtPlan: string;
  envrtPlanPrice: string;
  consultantCost: number;
  inhouseCost: number;
  maxSaving: number;
  savingVsConsultant: number;
  savingVsInhouse: number;
  hoursPerProduct: number;
  hoursSaved: number;
  daysSaved: number;
};

function calculateROI(
  skuCount: number,
  dataMaturity: DataMaturity,
  market: Market,
  approach: Approach,
): CalcResults {
  let envrtMonthly: number;
  let envrtPlan: string;
  let envrtPlanPrice: string;
  if (skuCount <= STARTER_SKU_LIMIT) {
    envrtMonthly = STARTER_MONTHLY_GBP;
    envrtPlan = "Starter";
    envrtPlanPrice = `${STARTER_PRICE_LABEL}/mo`;
  } else if (skuCount <= GROWTH_SKU_LIMIT) {
    envrtMonthly = GROWTH_MONTHLY_GBP;
    envrtPlan = "Growth";
    envrtPlanPrice = `${GROWTH_PRICE_LABEL}/mo`;
  } else {
    envrtMonthly = 1295;
    envrtPlan = "Pro";
    envrtPlanPrice = "Custom";
  }
  const envrtCost = envrtMonthly * 12;

  let consultantDayRate: number;
  let inhouseSalary: number;
  if (skuCount <= 50) {
    consultantDayRate = 500;
    inhouseSalary = 43000;
  } else if (skuCount <= 250) {
    consultantDayRate = 650;
    inhouseSalary = 55000;
  } else {
    consultantDayRate = 800;
    inhouseSalary = 67000;
  }

  const marketMultiplier = market === "both" ? 1.3 : 1.0;
  const maturityMultiplier = DATA_MATURITY_MULTIPLIER[dataMaturity];
  const approachWeight = APPROACH_WEIGHT[approach];
  const effectiveDaysPerProduct = (1.5 * maturityMultiplier) / (1 + skuCount / 120);
  const consultantDays = 5 + skuCount * effectiveDaysPerProduct;
  const consultantCost =
    consultantDays * consultantDayRate * marketMultiplier * approachWeight.consultant;

  const inhouseMaturityBonus =
    dataMaturity === "digitised" ? 0.85 : dataMaturity === "some-systems" ? 0.9 : 1.0;
  const inhouseCost = Math.round(inhouseSalary * inhouseMaturityBonus * approachWeight.inhouse);

  const savingVsConsultant = Math.max(0, consultantCost - envrtCost);
  const savingVsInhouse = Math.max(0, inhouseCost - envrtCost);
  const maxSaving = Math.max(savingVsConsultant, savingVsInhouse);

  const hoursPerProduct = DATA_MATURITY_HOURS[dataMaturity];
  const hoursSaved = Math.max(0, (hoursPerProduct - 1) * skuCount);
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
    hoursPerProduct,
    hoursSaved,
    daysSaved,
  };
}

const faqs = [
  {
    question: "How does the calculator decide which ENVRT plan I need?",
    answer:
      `By your SKU count. Up to ${STARTER_SKU_LIMIT} SKUs is Starter (${STARTER_PRICE_LABEL} a month). Up to ${GROWTH_SKU_LIMIT} is Growth (${GROWTH_PRICE_LABEL} a month). Above that is Pro, which is custom-priced. The annual cost shown is monthly fee times twelve.`,
  },
  {
    question: "Are the consultant and in-house figures realistic?",
    answer:
      "They are estimates calibrated to typical sustainability consultancy day rates in Europe and to sustainability-analyst salaries by brand size. Your real numbers depend on supplier quality, data maturity and market coverage. The calculator gives directional savings.",
  },
  {
    question: "What if I already have a sustainability team?",
    answer:
      "We work alongside in-house teams. Many brands use ENVRT to give their team faster turnaround on DPP generation and to consolidate evidence. The comparison shown is the cost of doing the same work in-house from scratch, not the cost of an existing team.",
  },
  {
    question: "Will my data stay private?",
    answer:
      "Yes. The calculator runs locally in your browser. Nothing is sent to ENVRT unless you opt in to email yourself a copy of the results, book a demo, or submit the free DPP form.",
  },
];

export default function RoiV3Page() {
  const [skuCount, setSkuCount] = useState(60);
  const [dataMaturity, setDataMaturity] = useState<DataMaturity>("manual");
  const [market, setMarket] = useState<Market>("eu");
  const [approach, setApproach] = useState<Approach>("spreadsheets");

  // Optional lead capture — emails the results, posts to /api/roi-lead.
  // Keeps the calculator instant + private by default; the form opens
  // on demand so buyers can ask for a written copy without forcing it.
  const [firstName, setFirstName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [email, setEmail] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");

  const results = calculateROI(skuCount, dataMaturity, market, approach);

  // Currency view — calculator numbers stay in GBP under the hood and
  // are converted at display time, so a currency toggle anywhere in the
  // site flows through here without recalculating.
  const { currency } = usePricing();
  const display = (gbp: number) => formatFromGBP(gbp, currency);

  async function handleEmailResults(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName || !brandName || !email) return;
    setEmailSending(true);
    setEmailError(null);
    try {
      const res = await fetch("/api/roi-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          brandName,
          email,
          marketingConsent,
          skuCount,
          dataMaturity,
          market,
          approach,
          turnstileToken,
          ...results,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Submission failed");
      }
      setEmailSent(true);
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Submission failed");
    }
    setEmailSending(false);
  }

  return (
    <main className="theme-sunny">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://envrt.com" },
          { name: "ROI calculator", url: "https://envrt.com/roi" },
        ]}
      />
      <FAQJsonLd items={faqs} />
      <PageHero
        tone="sunny"
        eyebrow="ROI calculator"
        heading={
          <>
            See what ENVRT saves you.{" "}
            <span className="text-envrt-brand-black/40">
              Against consultants. Against in-house.
            </span>
          </>
        }
        body="Plug in your SKU count, data maturity and current approach. The calculator shows your annual ENVRT cost, the consultant equivalent and the in-house equivalent. Email yourself a copy if useful, otherwise nothing leaves your browser."
        cornerLeft="ENVRT/01"
        cornerRight="ROI"
      />

      <section className="relative bg-envrt-brand-vista py-16 sm:py-20 lg:py-24">
        <SectionCorners left="ENVRT/02" right="Calculator" />
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-6 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-10 lg:px-16">
          {/* Inputs */}
          <FadeUp>
            <Card>
              <Eyebrow>Your inputs</Eyebrow>
              <div className="mt-6 space-y-6">
                <FieldRow>
                  <Label htmlFor="sku">SKU count in your collection</Label>
                  <div className="space-y-2">
                    <input
                      id="sku"
                      type="range"
                      min={10}
                      max={500}
                      step={10}
                      value={skuCount}
                      onChange={(e) => setSkuCount(parseInt(e.target.value))}
                      className="w-full accent-envrt-brand-ultramarine"
                    />
                    <div className="flex items-baseline justify-between">
                      <span className="font-display text-3xl font-semibold tracking-tight text-envrt-brand-black">
                        {skuCount}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-envrt-brand-black/55">
                        products / SKUs
                      </span>
                    </div>
                  </div>
                </FieldRow>

                <FieldRow>
                  <Label htmlFor="data">Data maturity</Label>
                  <DropdownV3
                    id="data"
                    value={dataMaturity}
                    onChange={(v) => setDataMaturity(v as DataMaturity)}
                    options={[
                      { value: "not-started", label: "Haven't started yet" },
                      { value: "manual", label: "Manual spreadsheets" },
                      { value: "some-systems", label: "Some systems in place" },
                      { value: "digitised", label: "Fully digitised" },
                    ]}
                  />
                </FieldRow>

                <FieldRow>
                  <Label htmlFor="market">Markets you sell into</Label>
                  <DropdownV3
                    id="market"
                    value={market}
                    onChange={(v) => setMarket(v as Market)}
                    options={[
                      { value: "eu", label: "European Union" },
                      { value: "uk", label: "United Kingdom" },
                      { value: "both", label: "Both" },
                    ]}
                  />
                </FieldRow>

                <FieldRow>
                  <Label htmlFor="approach">Current sustainability approach</Label>
                  <DropdownV3
                    id="approach"
                    value={approach}
                    onChange={(v) => setApproach(v as Approach)}
                    options={[
                      { value: "none", label: "Nothing structured yet" },
                      { value: "spreadsheets", label: "Spreadsheets and templates" },
                      { value: "consultant", label: "External consultant" },
                      { value: "inhouse", label: "In-house sustainability lead" },
                    ]}
                  />
                </FieldRow>
              </div>
            </Card>
          </FadeUp>

          {/* Results */}
          <FadeUp delay={0.08}>
            <Card variant="cta">
              <Eyebrow>Annual cost</Eyebrow>

              <div className="mt-6 grid grid-cols-1 gap-4">
                <ResultRow
                  tone="brand"
                  label="ENVRT"
                  sub={`${results.envrtPlan} plan, ${
                    results.envrtPlan === "Pro"
                      ? "custom-priced"
                      : `${display(results.envrtCost / 12)}/mo`
                  }`}
                  value={display(results.envrtCost)}
                />
                <ResultRow
                  tone="muted"
                  label="External consultant"
                  sub="Same work, day-rate billing"
                  value={display(results.consultantCost)}
                />
                <ResultRow
                  tone="muted"
                  label="In-house hire"
                  sub="Sustainability analyst, with overhead"
                  value={display(results.inhouseCost)}
                />
              </div>

              <div className="mt-8 rounded-2xl bg-envrt-brand-ultramarine/8 p-5">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine">
                  Maximum annual saving
                </p>
                <p className="mt-2 font-display text-4xl font-semibold tracking-tight text-envrt-brand-ultramarine sm:text-5xl">
                  {display(results.maxSaving)}
                </p>
                <p className="mt-3 text-sm text-envrt-brand-black/70">
                  Plus {results.daysSaved.toLocaleString()} working days back
                  for your team across the year.
                </p>
              </div>

              {/* Optional email-the-results form. Posts to /api/roi-lead
                  with the calculator state + results so sales gets the
                  whole picture in their inbox. */}
              <div className="mt-6 rounded-2xl border border-envrt-brand-black/12 bg-white p-5 sm:p-6">
                {emailSent ? (
                  <p className="text-sm text-envrt-brand-black/75 sm:text-base">
                    Thanks {firstName}. We have sent the breakdown to{" "}
                    <span className="font-semibold text-envrt-brand-black">
                      {email}
                    </span>
                    . If it does not arrive within five minutes, check spam.
                  </p>
                ) : (
                  <form className="space-y-4" onSubmit={handleEmailResults}>
                    <div>
                      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine sm:text-[11px]">
                        Optional
                      </p>
                      <p className="mt-1.5 font-display text-base font-medium tracking-tight text-envrt-brand-black sm:text-lg">
                        Email me a copy of these numbers
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-envrt-brand-black/60 sm:text-sm">
                        We send a one-page summary you can forward to your
                        CFO. No further outreach unless you tick consent.
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="roi-first-name">First name</Label>
                        <Input
                          id="roi-first-name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Your first name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="roi-brand-name">Brand name</Label>
                        <Input
                          id="roi-brand-name"
                          value={brandName}
                          onChange={(e) => setBrandName(e.target.value)}
                          placeholder="Your brand"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="roi-email">Email</Label>
                      <Input
                        id="roi-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@brand.com"
                        required
                      />
                    </div>
                    <label className="flex items-start gap-2 text-xs leading-relaxed text-envrt-brand-black/70 sm:text-sm">
                      <input
                        type="checkbox"
                        checked={marketingConsent}
                        onChange={(e) => setMarketingConsent(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-envrt-brand-black/30 text-envrt-brand-ultramarine focus:ring-envrt-brand-ultramarine"
                      />
                      <span>
                        Send me occasional ENVRT updates. Unsubscribe any
                        time.
                      </span>
                    </label>
                    {emailError && (
                      <p className="text-xs text-envrt-brand-crimson sm:text-sm">
                        {emailError}
                      </p>
                    )}
                    <HiddenTurnstile onToken={setTurnstileToken} />
                    <ButtonV3
                      type="submit"
                      variant="primary"
                      className="w-full"
                      disabled={emailSending}
                    >
                      {emailSending ? "Sending..." : "Email me the breakdown"}
                      <span>→</span>
                    </ButtonV3>
                  </form>
                )}
              </div>

              <div className="mt-6">
                <ButtonV3
                  href="/free-dpp"
                  variant="primary"
                  className="w-full"
                >
                  Try ENVRT on one garment<span>→</span>
                </ButtonV3>
              </div>
            </Card>
          </FadeUp>
        </div>
      </section>

      <FaqSnippet
        tone="sunny"
        eyebrow="Common questions"
        heading="About the ROI calculator"
        items={faqs}
        ctaHref="/faq"
        ctaLabel="See all FAQs"
      />

      <FinalCtaV3 />
    </main>
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2.5">{children}</div>;
}

function ResultRow({
  tone,
  label,
  sub,
  value,
}: {
  tone: "brand" | "muted";
  label: string;
  sub: string;
  value: string;
}) {
  return (
    <div className="flex items-baseline justify-between border-b border-envrt-brand-black/8 pb-4 last:border-0 last:pb-0">
      <div>
        <p
          className={`font-mono text-[10px] font-semibold uppercase tracking-[0.18em] ${
            tone === "brand"
              ? "text-envrt-brand-ultramarine"
              : "text-envrt-brand-black/55"
          }`}
        >
          {label}
        </p>
        <p className="mt-1 text-xs text-envrt-brand-black/60">{sub}</p>
      </div>
      <p
        className={`font-display text-xl font-semibold tracking-tight sm:text-2xl ${
          tone === "brand"
            ? "text-envrt-brand-ultramarine"
            : "text-envrt-brand-black"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
