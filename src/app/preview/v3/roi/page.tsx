"use client";

import { useState } from "react";
import {
  PageHero,
  FaqSnippet,
  ButtonV3,
  Card,
  Label,
} from "@/components/v3";
import { DropdownV3 } from "@/components/v3/DropdownV3";
import {
  Eyebrow,
  SectionCorners,
} from "@/components/sections/v3/_shared";
import { FadeUp } from "@/components/ui/Motion";
import { FinalCtaV3 } from "@/components/sections/v3/FinalCtaV3";

// /preview/v3/roi — ROI calculator. SKU count + data maturity + market +
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
  if (skuCount <= 50) {
    envrtMonthly = 149;
    envrtPlan = "Starter";
    envrtPlanPrice = "£149/mo";
  } else if (skuCount <= 250) {
    envrtMonthly = 495;
    envrtPlan = "Growth";
    envrtPlanPrice = "£495/mo";
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

const formatGBP = (n: number) =>
  `£${n.toLocaleString("en-GB", { maximumFractionDigits: 0 })}`;

const faqs = [
  {
    question: "How does the calculator decide which ENVRT plan I need?",
    answer:
      "By your SKU count. Up to 50 SKUs is Starter (£149 a month). Up to 250 is Growth (£495 a month). Above that is Pro, which is custom-priced. The annual cost shown is monthly fee times twelve.",
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
      "Yes. The calculator runs locally in your browser. Nothing is sent to ENVRT until you book a demo or submit the free DPP form.",
  },
];

export default function RoiV3Page() {
  const [skuCount, setSkuCount] = useState(60);
  const [dataMaturity, setDataMaturity] = useState<DataMaturity>("manual");
  const [market, setMarket] = useState<Market>("eu");
  const [approach, setApproach] = useState<Approach>("spreadsheets");

  const results = calculateROI(skuCount, dataMaturity, market, approach);

  return (
    <main>
      <PageHero
        eyebrow="ROI calculator"
        heading={
          <>
            See what ENVRT saves you.{" "}
            <span className="text-envrt-brand-black/40">
              Against consultants. Against in-house.
            </span>
          </>
        }
        body="Plug in your SKU count, data maturity and current approach. The calculator shows your annual ENVRT cost, the consultant equivalent and the in-house equivalent. Runs locally in your browser, nothing is sent."
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
                  sub={`${results.envrtPlan} plan, ${results.envrtPlanPrice}`}
                  value={formatGBP(results.envrtCost)}
                />
                <ResultRow
                  tone="muted"
                  label="External consultant"
                  sub="Same work, day-rate billing"
                  value={formatGBP(results.consultantCost)}
                />
                <ResultRow
                  tone="muted"
                  label="In-house hire"
                  sub="Sustainability analyst, with overhead"
                  value={formatGBP(results.inhouseCost)}
                />
              </div>

              <div className="mt-8 rounded-2xl bg-envrt-brand-ultramarine/8 p-5">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine">
                  Maximum annual saving
                </p>
                <p className="mt-2 font-display text-4xl font-semibold tracking-tight text-envrt-brand-ultramarine sm:text-5xl">
                  {formatGBP(results.maxSaving)}
                </p>
                <p className="mt-3 text-sm text-envrt-brand-black/70">
                  Plus {results.daysSaved.toLocaleString()} working days back
                  for your team across the year.
                </p>
              </div>

              <div className="mt-6">
                <ButtonV3
                  href="/preview/v3/free-dpp"
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
        eyebrow="Common questions"
        heading="About the ROI calculator"
        items={faqs}
        ctaHref="/preview/v3/faq"
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
