"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionCard } from "@/components/ui/SectionCard";
import { ButtonV3 } from "@/components/v3/Button";
import { Badge } from "@/components/ui/Badge";
import { FadeUp } from "@/components/ui/Motion";
import { HiddenTurnstile } from "@/components/ui/TurnstileWidget";
import {
  bandFromOverall,
  decodeResultsFromUrl,
  encodeResultsToUrl,
  getBandCta,
  getBenchmarkContext,
  getGreenClaimsReading,
  getReadingForWeakestDimension,
} from "@/lib/assessment-helpers";

/* ================================================================
   TYPE DEFINITIONS
   ================================================================ */

interface QuestionOption {
  label: string;
  value: string;
}

interface Question {
  id: string;
  type: "single" | "multi";
  text: string;
  hint?: string;
  maxSelect?: number;
  options: QuestionOption[];
}

interface Section {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

interface Scores {
  supplyChain: number;
  productData: number;
  regulatory: number;
  infrastructure: number;
  overall: number;
  greenClaimsFlag: boolean;
}

type Answers = Record<string, string | string[]>;

type Screen = "hero" | "assessment" | "email" | "results";

/* ================================================================
   QUESTION DATA
   ================================================================ */

const sections: Section[] = [
  {
    id: "business-profile",
    title: "Tell us about your brand",
    description:
      "This helps us understand your regulatory exposure and timeline risk.",
    questions: [
      {
        id: "q1",
        type: "single",
        text: "How many new styles do you release per year?",
        options: [
          { label: "Under 10", value: "under10" },
          { label: "10-25", value: "10-25" },
          { label: "26-75", value: "26-75" },
          { label: "76-150", value: "76-150" },
          { label: "150+", value: "150+" },
        ],
      },
      {
        id: "q2",
        type: "multi",
        text: "Which markets do you primarily sell into?",
        hint: "Select all that apply",
        options: [
          { label: "United Kingdom", value: "uk" },
          { label: "European Union", value: "eu" },
          { label: "United States", value: "us" },
          { label: "Rest of World", value: "row" },
        ],
      },
      {
        id: "q3",
        type: "multi",
        text: "What product categories do you sell?",
        hint: "Select all that apply",
        options: [
          { label: "Womenswear", value: "womenswear" },
          { label: "Menswear", value: "menswear" },
          { label: "Childrenswear", value: "childrenswear" },
          { label: "Footwear", value: "footwear" },
          { label: "Accessories", value: "accessories" },
          { label: "Homeware", value: "homeware" },
          { label: "Activewear", value: "activewear" },
        ],
      },
      {
        id: "q4",
        type: "single",
        text: "What size best describes your brand?",
        options: [
          { label: "Startup or emerging", value: "under250k" },
          { label: "Small (under 20 employees)", value: "250k-1m" },
          { label: "Growing (20-50 employees)", value: "1m-5m" },
          { label: "Established (50-200 employees)", value: "5m-20m" },
          { label: "Enterprise (200+)", value: "20m+" },
        ],
      },
      {
        id: "q5",
        type: "single",
        text: "How would you describe your current sustainability position?",
        options: [
          { label: "Just getting started", value: "starting" },
          {
            label: "We have some initiatives but no formal strategy",
            value: "some-initiatives",
          },
          {
            label:
              "We have a sustainability strategy but lack data infrastructure",
            value: "strategy-no-data",
          },
          {
            label: "We are actively reporting on sustainability metrics",
            value: "actively-reporting",
          },
        ],
      },
    ],
  },
  {
    id: "supply-chain",
    title: "Supply chain transparency",
    description:
      "DPPs require verified data at every stage of production. This is where most brands fall short.",
    questions: [
      {
        id: "q6",
        type: "single",
        text: "How many tiers of your supply chain can you currently trace?",
        options: [
          {
            label: "We know our direct manufacturer only (Tier 1)",
            value: "tier1",
          },
          {
            label: "We know Tier 1 and fabric suppliers (Tier 2)",
            value: "tier1-2",
          },
          {
            label: "We can trace to raw material sources (Tier 3+)",
            value: "tier3+",
          },
          {
            label: "We have no formal supply chain mapping",
            value: "none",
          },
        ],
      },
      {
        id: "q7",
        type: "single",
        text: "Do you have material composition data at fibre level for your products?",
        options: [
          { label: "Yes, for all products", value: "all" },
          { label: "Yes, for some products", value: "some" },
          { label: "No, but we could obtain it", value: "could-obtain" },
          {
            label: "No, and it would be difficult to obtain",
            value: "difficult",
          },
        ],
      },
      {
        id: "q8",
        type: "single",
        text: "Do you know the country of origin for each stage of your production process?",
        options: [
          { label: "Yes, for all stages", value: "all" },
          { label: "Yes, for most stages", value: "most" },
          { label: "Only for final manufacturing", value: "final-only" },
          { label: "No", value: "no" },
        ],
      },
      {
        id: "q9",
        type: "multi",
        text: "How many of your key suppliers hold recognised certifications?",
        hint: "Select all that apply",
        options: [
          {
            label: "GOTS (Global Organic Textile Standard)",
            value: "gots",
          },
          { label: "GRS (Global Recycled Standard)", value: "grs" },
          { label: "Oeko-Tex", value: "oeko-tex" },
          { label: "BSCI or SMETA audit", value: "bsci-smeta" },
          { label: "Bluesign", value: "bluesign" },
          { label: "None of the above", value: "none" },
          { label: "I don’t know", value: "dont-know" },
        ],
      },
      {
        id: "q10",
        type: "single",
        text: "Do you have documented supplier agreements that include data-sharing obligations?",
        options: [
          {
            label: "Yes, formal agreements with all key suppliers",
            value: "formal-all",
          },
          { label: "Informal agreements with most", value: "informal-most" },
          { label: "Ad hoc - varies by supplier", value: "ad-hoc" },
          { label: "No formal agreements", value: "none" },
        ],
      },
    ],
  },
  {
    id: "product-data",
    title: "Product data completeness",
    description:
      "A DPP requires specific product-level data. Most brands don’t yet collect this systematically.",
    questions: [
      {
        id: "q11",
        type: "single",
        text: "Do you currently record the weight per garment for your products?",
        options: [
          { label: "Yes, for all products", value: "all" },
          { label: "Yes, for most", value: "most" },
          { label: "Only for some", value: "some" },
          { label: "No", value: "no" },
        ],
      },
      {
        id: "q12",
        type: "single",
        text: "Do you hold structured care and composition labelling data in a central system?",
        options: [
          { label: "Yes, in a dedicated system", value: "dedicated" },
          { label: "Yes, in spreadsheets", value: "spreadsheets" },
          {
            label: "It exists but is scattered across documents",
            value: "scattered",
          },
          { label: "No central record", value: "none" },
        ],
      },
      {
        id: "q13",
        type: "single",
        text: "Do you have any existing lifecycle assessment (LCA) data or carbon footprint calculations for your products?",
        options: [
          { label: "Yes, verified third-party LCA data", value: "verified" },
          { label: "Yes, self-calculated estimates", value: "self-calc" },
          {
            label:
              "We’ve done some research but have no formal data",
            value: "some-research",
          },
          { label: "No", value: "none" },
        ],
      },
      {
        id: "q14",
        type: "single",
        text: "Have you ever generated anything resembling a Digital Product Passport or sustainability data sheet for a product?",
        options: [
          { label: "Yes, we produce these already", value: "already" },
          {
            label: "We’ve done a pilot for one or two products",
            value: "pilot",
          },
          {
            label: "We’ve explored it but not produced anything",
            value: "explored",
          },
          { label: "No, this would be new to us", value: "new" },
        ],
      },
      {
        id: "q15",
        type: "single",
        text: "Do you currently provide end-of-life guidance (repair, resale, recycling instructions) on your products?",
        options: [
          { label: "Yes, prominently", value: "prominently" },
          { label: "Yes, but minimally", value: "minimally" },
          { label: "We plan to but haven’t yet", value: "planned" },
          { label: "No", value: "no" },
        ],
      },
    ],
  },
  {
    id: "regulatory-awareness",
    title: "Compliance knowledge",
    description:
      "Understanding which regulations apply to you, and when, is the foundation of any compliance strategy.",
    questions: [
      {
        id: "q16",
        type: "multi",
        text: "Which of the following regulations are you aware of?",
        hint: "Select all that apply",
        options: [
          {
            label:
              "EU ESPR (Ecodesign for Sustainable Products Regulation)",
            value: "espr",
          },
          { label: "EU Green Claims Directive", value: "green-claims" },
          {
            label:
              "UK DMCCA (Digital Markets, Competition and Consumers Act sustainability provisions)",
            value: "dmcca",
          },
          {
            label: "EU Textile Labelling Regulation updates",
            value: "textile-labelling",
          },
          { label: "None of the above", value: "none" },
        ],
      },
      {
        id: "q17",
        type: "single",
        text: "Do you know which ESPR product category deadlines apply to your products?",
        options: [
          {
            label: "Yes, I know our specific deadlines",
            value: "know-specifics",
          },
          {
            label: "I have a general sense but not specifics",
            value: "general-sense",
          },
          {
            label:
              "I’ve heard about ESPR but don’t know our deadlines",
            value: "heard",
          },
          { label: "No awareness of deadlines", value: "no-awareness" },
        ],
      },
      {
        id: "q18",
        type: "single",
        text: "Have you received formal guidance on DPP compliance from a trade body, consultant or legal advisor?",
        options: [
          {
            label: "Yes, we have active legal/consultant support",
            value: "active-support",
          },
          {
            label: "We’ve had informal conversations",
            value: "informal",
          },
          {
            label: "We’ve read about it independently",
            value: "independent",
          },
          { label: "No guidance received", value: "none" },
        ],
      },
      {
        id: "q19",
        type: "single",
        text: 'Has your brand made any public sustainability claims (e.g. “sustainable”, “eco-friendly”, “carbon neutral”) in marketing?',
        options: [
          { label: "Yes, regularly", value: "regularly" },
          { label: "Yes, occasionally", value: "occasionally" },
          { label: "We avoid making such claims", value: "avoid" },
          { label: "No", value: "no" },
        ],
      },
      {
        id: "q20",
        type: "single",
        text: "Have you reviewed your marketing materials against upcoming green claims legislation?",
        options: [
          {
            label: "Yes, we have fully reviewed and updated our claims",
            value: "reviewed",
          },
          { label: "We have started reviewing", value: "concerned" },
          {
            label: "It is on our to-do list",
            value: "heard",
          },
          { label: "Not yet", value: "new" },
        ],
      },
    ],
  },
  {
    id: "infrastructure",
    title: "Your current infrastructure",
    description:
      "The tools and processes you currently use determine how quickly you can become regulation-ready.",
    questions: [
      {
        id: "q21",
        type: "single",
        text: "How do you currently manage product data?",
        options: [
          { label: "Dedicated PLM or PDM system", value: "plm" },
          { label: "ERP with product data module", value: "erp" },
          {
            label: "Spreadsheets (Excel or Google Sheets)",
            value: "spreadsheets",
          },
          {
            label: "A mix of spreadsheets and shared documents",
            value: "mixed",
          },
          { label: "No structured system", value: "none" },
        ],
      },
      {
        id: "q22",
        type: "single",
        text: "How do you currently manage sustainability or compliance data?",
        options: [
          { label: "Dedicated sustainability platform", value: "dedicated" },
          {
            label: "Manual tracking in spreadsheets",
            value: "spreadsheets",
          },
          {
            label: "We don’t track this formally",
            value: "informal",
          },
          {
            label: "We outsource this to a consultant",
            value: "outsourced",
          },
        ],
      },
      {
        id: "q23",
        type: "single",
        text: "How many people in your organisation are responsible for sustainability or compliance?",
        options: [
          { label: "Dedicated full-time role(s)", value: "dedicated" },
          { label: "Part of someone’s wider role", value: "part-role" },
          { label: "The founder handles it", value: "founder" },
          { label: "Nobody currently owns this", value: "nobody" },
        ],
      },
      {
        id: "q24",
        type: "single",
        text: "What is your anticipated timeline for needing to be DPP-compliant?",
        options: [
          {
            label: "We need to be compliant within 12 months",
            value: "under-12",
          },
          { label: "12-24 months", value: "12-24" },
          { label: "24-36 months", value: "24-36" },
          { label: "We’re not sure", value: "not-sure" },
          {
            label: "We don’t think it applies to us",
            value: "not-applicable",
          },
        ],
      },
      {
        id: "q25",
        type: "multi",
        maxSelect: 2,
        text: "What is your primary barrier to DPP readiness right now?",
        hint: "Select up to two",
        options: [
          {
            label: "We don’t know where to start",
            value: "dont-know-start",
          },
          { label: "We lack supplier data", value: "lack-supplier-data" },
          {
            label: "We don’t have internal resource",
            value: "lack-resource",
          },
          { label: "Cost concerns", value: "cost" },
          {
            label: "We didn’t know this was required",
            value: "unaware",
          },
          {
            label: "We’re waiting for clearer regulatory guidance",
            value: "waiting-guidance",
          },
        ],
      },
    ],
  },
];

/* ================================================================
   SCORING ENGINE
   ================================================================ */

const scoringRules = {
  supplyChain: {
    q6: { none: 0, tier1: 10, "tier1-2": 20, "tier3+": 30 } as Record<string, number>,
    q7: { difficult: 0, "could-obtain": 6, some: 12, all: 20 } as Record<string, number>,
    q8: { no: 0, "final-only": 6, most: 13, all: 20 } as Record<string, number>,
    q10: { none: 0, "ad-hoc": 4, "informal-most": 9, "formal-all": 15 } as Record<string, number>,
  },
  productData: {
    q11: { no: 0, some: 9, most: 17, all: 25 } as Record<string, number>,
    q12: { none: 0, scattered: 8, spreadsheets: 17, dedicated: 25 } as Record<string, number>,
    q13: { none: 0, "some-research": 7, "self-calc": 15, verified: 25 } as Record<string, number>,
    q14: { new: 0, explored: 8, pilot: 17, already: 25 } as Record<string, number>,
  },
  regulatory: {
    q17: { "no-awareness": 0, heard: 8, "general-sense": 18, "know-specifics": 28 } as Record<string, number>,
    q18: { none: 0, independent: 7, informal: 13, "active-support": 20 } as Record<string, number>,
    q20: { new: 0, heard: 6, concerned: 13, reviewed: 20 } as Record<string, number>,
  },
  infrastructure: {
    q21: { none: 0, mixed: 8, spreadsheets: 12, erp: 22, plm: 30 } as Record<string, number>,
    q22: { informal: 8, outsourced: 12, spreadsheets: 18, dedicated: 30 } as Record<string, number>,
    q23: { nobody: 0, founder: 7, "part-role": 13, dedicated: 20 } as Record<string, number>,
    q24: { "not-applicable": 0, "not-sure": 5, "24-36": 13, "12-24": 20, "under-12": 20 } as Record<string, number>,
  },
};

function calculateScores(answers: Answers): Scores {
  const a = answers;
  const str = (key: string) => (a[key] as string) || "";
  const arr = (key: string) => (a[key] as string[]) || [];

  let sc = 0;
  sc += scoringRules.supplyChain.q6[str("q6")] ?? 0;
  sc += scoringRules.supplyChain.q7[str("q7")] ?? 0;
  sc += scoringRules.supplyChain.q8[str("q8")] ?? 0;
  const certValues = ["gots", "grs", "oeko-tex", "bsci-smeta", "bluesign"];
  const certCount = arr("q9").filter((v) => certValues.includes(v)).length;
  sc += Math.min(certCount * 5, 15);
  sc += scoringRules.supplyChain.q10[str("q10")] ?? 0;
  const supplyChain = Math.min(Math.round(sc), 100);

  let pd = 0;
  pd += scoringRules.productData.q11[str("q11")] ?? 0;
  pd += scoringRules.productData.q12[str("q12")] ?? 0;
  pd += scoringRules.productData.q13[str("q13")] ?? 0;
  pd += scoringRules.productData.q14[str("q14")] ?? 0;
  if (str("q15") === "prominently") pd += 5;
  const productData = Math.min(Math.round(pd), 100);

  let ra = 0;
  const regValues = ["espr", "green-claims", "dmcca", "textile-labelling"];
  const regCount = arr("q16").filter((v) => regValues.includes(v)).length;
  ra += Math.min(regCount * 8, 32);
  ra += scoringRules.regulatory.q17[str("q17")] ?? 0;
  ra += scoringRules.regulatory.q18[str("q18")] ?? 0;
  ra += scoringRules.regulatory.q20[str("q20")] ?? 0;
  const regulatory = Math.min(Math.round(ra), 100);

  let di = 0;
  di += scoringRules.infrastructure.q21[str("q21")] ?? 0;
  di += scoringRules.infrastructure.q22[str("q22")] ?? 0;
  di += scoringRules.infrastructure.q23[str("q23")] ?? 0;
  di += scoringRules.infrastructure.q24[str("q24")] ?? 0;
  const infrastructure = Math.min(Math.round(di), 100);

  const overall = Math.round(
    supplyChain * 0.3 +
      productData * 0.3 +
      regulatory * 0.2 +
      infrastructure * 0.2
  );

  const makingClaims =
    str("q19") === "regularly" || str("q19") === "occasionally";
  const noVerifiedData =
    str("q13") === "none" || str("q13") === "some-research";

  return {
    supplyChain,
    productData,
    regulatory,
    infrastructure,
    overall,
    greenClaimsFlag: makingClaims && noVerifiedData,
  };
}

/* ================================================================
   REPORT COPY GENERATORS
   ================================================================ */

const DIMENSION_LABELS = {
  supplyChain: "Supply Chain Transparency",
  productData: "Product Data Completeness",
  regulatory: "Regulatory Awareness",
  infrastructure: "Data Infrastructure",
} as const;

function getBand(overall: number) {
  if (overall <= 25)
    return {
      label: "CRITICAL EXPOSURE",
      cls: "bg-red-100 text-red-700",
      headline:
        "Your brand has significant compliance gaps that require immediate attention.",
      summary:
        "Based on your responses, your brand currently has limited visibility across your supply chain, incomplete product data and insufficient compliance infrastructure to meet incoming DPP requirements. Without action, you face real legal and commercial risk as ESPR deadlines approach.",
    };
  if (overall <= 45)
    return {
      label: "EARLY STAGE",
      cls: "bg-amber-100 text-amber-700",
      headline:
        "You’ve begun the compliance journey, but there’s substantial ground to cover.",
      summary:
        "Your brand has some foundations in place but significant gaps remain, particularly in supply chain transparency and structured product data. The good news is that brands at your stage typically achieve full compliance readiness within 3-6 months with the right tooling.",
    };
  if (overall <= 65)
    return {
      label: "DEVELOPING",
      cls: "bg-amber-50 text-amber-700",
      headline:
        "You’re further along than most SME brands, but key gaps remain.",
      summary:
        "Your brand has meaningful data infrastructure and some regulatory awareness, but you’re likely missing the systematic product-level data and supplier connectivity needed for full DPP generation. This is solvable, but requires structured action in the next 6-12 months.",
    };
  if (overall <= 80)
    return {
      label: "COMPLIANCE READY",
      cls: "bg-envrt-brand-ultramarine/10 text-envrt-brand-ultramarine",
      headline:
        "Strong foundations. Now it’s about formalising and scaling.",
      summary:
        "Your brand is well positioned relative to most SMEs in fashion. Your supply chain visibility and product data are reasonably mature. The priority now is consolidating that data into a compliant DPP format and ensuring you have systems that can scale as your product range grows.",
    };
  return {
    label: "ADVANCED",
    cls: "bg-envrt-brand-ultramarine/10 text-envrt-brand-ultramarine",
    headline:
      "You’re ahead of the curve. Let’s make sure it stays that way.",
    summary:
      "Your compliance infrastructure is strong. The focus for your brand should be on automating DPP generation at scale, maintaining data accuracy as your supplier base evolves and staying ahead of regulatory updates as ESPR implementation develops.",
  };
}

function getTimelineRisk(answers: Answers): string {
  const markets = (answers.q2 as string[]) || [];
  const awareness = (answers.q17 as string) || "";
  const aware =
    awareness === "know-specifics" || awareness === "general-sense";

  if (aware)
    return "You’re aware of your compliance window. The priority now is ensuring your data infrastructure can actually deliver compliant DPPs within that timeline, not just track toward it.";
  if (markets.includes("eu"))
    return "Products sold into the EU in your category are subject to ESPR Digital Product Passport requirements. Based on current implementation timelines, your deadline window is approaching. Brands that begin data collection now have a significant advantage over those waiting for final regulatory clarity.";
  if (markets.includes("uk") && !markets.includes("eu"))
    return "While UK DMCCA timelines differ from EU ESPR, the direction of travel is identical. Brands building DPP infrastructure now will be positioned for both regimes without duplicating effort.";
  return "Digital Product Passport requirements are being adopted globally, starting with the EU and UK. Brands that build compliance infrastructure now will be positioned to meet requirements as they extend to additional markets.";
}

function getRecommendedActions(scores: Scores, answers: Answers): string[] {
  const actions: string[] = [];

  if (scores.greenClaimsFlag) {
    actions.push(
      "Audit all public-facing sustainability claims immediately and either substantiate them with verified data or remove them before 2026 enforcement begins."
    );
  }
  if (scores.supplyChain < 40) {
    actions.push(
      "Map your full supply chain to at least Tier 2, documenting country of origin and material sources for your top 20 styles. This is the foundational data layer for any DPP."
    );
  }
  if (scores.productData < 40) {
    actions.push(
      "Establish a central product data record (even a structured spreadsheet) capturing weight, material composition, care instructions and country of origin for every active style. This is your DPP raw material."
    );
  }
  if (scores.regulatory < 50) {
    actions.push(
      "Commission a formal regulatory briefing for your specific product categories and markets. Understanding your likely deadlines is the prerequisite for any compliance strategy."
    );
  }
  if (scores.infrastructure < 40) {
    actions.push(
      "Your current tooling cannot support DPP generation at scale. Evaluate dedicated compliance platforms before investing further in manual processes that will need replacing."
    );
  }

  const generalActions: Record<string, string> = {
    supplyChain:
      "Strengthen supplier relationships by establishing formal data-sharing agreements and gradually extending your transparency to deeper supply chain tiers.",
    productData:
      "Consolidate your product-level data into a single, structured format that can serve as the foundation for DPP generation as requirements crystallise.",
    regulatory:
      "Stay informed on evolving ESPR and DMCCA requirements by subscribing to industry updates and engaging with trade bodies relevant to your product categories.",
    infrastructure:
      "Assess whether your current data management systems can scale to support the volume and granularity of data required for compliant Digital Product Passports.",
  };

  const dims = (
    [
      { key: "supplyChain", score: scores.supplyChain },
      { key: "productData", score: scores.productData },
      { key: "regulatory", score: scores.regulatory },
      { key: "infrastructure", score: scores.infrastructure },
    ] as { key: string; score: number }[]
  ).sort((a, b) => a.score - b.score);

  for (const dim of dims) {
    if (actions.length >= 5) break;
    const action = generalActions[dim.key];
    if (!actions.includes(action)) actions.push(action);
  }

  void answers;
  return actions.slice(0, 5);
}

/* ================================================================
   SUB-COMPONENTS
   ================================================================ */

function OptionTile({
  option,
  selected,
  type,
  onClick,
}: {
  option: QuestionOption;
  selected: boolean;
  type: "single" | "multi";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border-[1.5px] px-4 py-3.5 text-left transition-all duration-200
        ${
          selected
            ? "border-envrt-brand-ultramarine bg-envrt-brand-ultramarine/5 shadow-sm"
            : "border-envrt-brand-black/8 bg-white hover:border-envrt-brand-black/15 hover:shadow-sm"
        }`}
    >
      <span
        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center border-2 transition-all duration-200
          ${type === "single" ? "rounded-full" : "rounded"}
          ${
            selected
              ? "border-envrt-brand-ultramarine bg-envrt-brand-ultramarine"
              : "border-envrt-brand-black/40"
          }`}
      >
        {selected && type === "single" && (
          <span className="h-2 w-2 rounded-full bg-white" />
        )}
        {selected && type === "multi" && (
          <svg
            className="h-3 w-3 text-white"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M2.5 6.5l2.5 2.5 4.5-5" />
          </svg>
        )}
      </span>
      <span className="text-sm text-envrt-brand-black">{option.label}</span>
    </button>
  );
}

function ProgressBar({
  currentSection,
  answers,
}: {
  currentSection: number;
  answers: Answers;
}) {
  let answered = 0;
  let total = 0;
  sections.forEach((s) =>
    s.questions.forEach((q) => {
      total++;
      const a = answers[q.id];
      if (
        q.type === "multi"
          ? Array.isArray(a) && a.length > 0
          : a !== undefined
      )
        answered++;
    })
  );
  const pct = Math.round((answered / total) * 100);

  return (
    <div className="fixed left-0 right-0 top-[48px] sm:top-[60px] z-[45]">
      <div className="h-[3px] w-full bg-envrt-brand-black/[0.04]">
        <div
          className="h-full bg-envrt-brand-ultramarine transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="pointer-events-none flex justify-end px-5 sm:px-8">
        <span className="mt-2.5 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium tracking-wide text-envrt-brand-black/55 shadow-sm ring-1 ring-envrt-brand-black/[0.06] backdrop-blur-md">
          {currentSection + 1}
          <span className="text-envrt-brand-black/20">/</span>
          5
          <span className="ml-0.5 tabular-nums text-envrt-brand-ultramarine">{pct}%</span>
        </span>
      </div>
    </div>
  );
}

function ScoreRing({
  score,
  animated,
}: {
  score: number;
  animated: boolean;
}) {
  const circumference = 2 * Math.PI * 70;
  const offset = animated ? circumference * (1 - score / 100) : circumference;
  const [displayScore, setDisplayScore] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!animated) {
      setDisplayScore(0);
      return;
    }
    const start = performance.now();
    const duration = 1500;
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [animated, score]);

  return (
    <div className="relative mx-auto h-44 w-44">
      <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
        <circle
          cx="80"
          cy="80"
          r="70"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className="text-envrt-brand-black/5"
        />
        <circle
          cx="80"
          cy="80"
          r="70"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-envrt-brand-ultramarine transition-all duration-[1500ms] ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold text-envrt-brand-ultramarine">
          {displayScore}
        </span>
        <span className="mt-1 text-xs uppercase tracking-widest text-envrt-brand-black/55">
          out of 100
        </span>
      </div>
    </div>
  );
}

function DimensionBar({
  label,
  score,
  animated,
  delay,
}: {
  label: string;
  score: number;
  animated: boolean;
  delay: number;
}) {
  const [show, setShow] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!animated) return;
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [animated, delay]);

  useEffect(() => {
    if (!show) {
      setDisplayScore(0);
      return;
    }
    const start = performance.now();
    const duration = 1000;
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [show, score]);

  return (
    <div className="mb-5 last:mb-0">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-medium text-envrt-brand-black">
          {label}
        </span>
        <span className="text-sm font-bold text-envrt-brand-ultramarine">
          {displayScore}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-envrt-brand-black/5">
        <div
          className="h-full rounded-full bg-envrt-brand-ultramarine transition-all duration-[1200ms] ease-out"
          style={{ width: show ? `${score}%` : "0%" }}
        />
      </div>
    </div>
  );
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export default function AssessmentTool() {
  const [screen, setScreen] = useState<Screen>("hero");
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [scores, setScores] = useState<Scores | null>(null);
  const [animateResults, setAnimateResults] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [shareCopied, setShareCopied] = useState(false);
  const [shareView, setShareView] = useState(false);

  // Anchor scrolls between screens and section transitions to the top
  // of the quiz container, not the top of the page. Outer ref because
  // it persists across every screen (hero, assessment, email, results)
  // and survives screen-driven remounts.
  const toolRef = useRef<HTMLDivElement | null>(null);
  const scrollToQuestions = useCallback(() => {
    if (typeof window === "undefined") return;
    const target = toolRef.current;
    if (!target) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const rect = target.getBoundingClientRect();
    const top = window.scrollY + rect.top - 24;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const decoded = decodeResultsFromUrl(window.location.search);
    if (decoded) {
      setScores(decoded);
      setScreen("results");
      setShareView(true);
      setTimeout(() => setAnimateResults(true), 300);
    }
  }, []);

  const handleSelect = useCallback(
    (qid: string, value: string, type: "single" | "multi", maxSelect?: number) => {
      setAnswers((prev) => {
        const next = { ...prev };
        if (type === "single") {
          next[qid] = value;
        } else {
          const arr = [...((prev[qid] as string[]) || [])];
          const exclusives = ["none", "dont-know"];
          const isExclusive = exclusives.includes(value);

          if (isExclusive) {
            next[qid] = [value];
          } else {
            const filtered = arr.filter((v) => !exclusives.includes(v));
            const idx = filtered.indexOf(value);
            if (idx > -1) {
              filtered.splice(idx, 1);
            } else {
              if (maxSelect && filtered.length >= maxSelect) {
                filtered.shift();
              }
              filtered.push(value);
            }
            next[qid] = filtered;
          }
        }
        return next;
      });
    },
    []
  );

  const sectionComplete = sections[currentSection]?.questions.every((q) => {
    const a = answers[q.id];
    return q.type === "multi"
      ? Array.isArray(a) && a.length > 0
      : a !== undefined;
  });

  const goNext = () => {
    if (!sectionComplete) return;
    if (currentSection < sections.length - 1) {
      setCurrentSection((s) => s + 1);
      requestAnimationFrame(scrollToQuestions);
    } else {
      setScreen("email");
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToQuestions);
      });
    }
  };

  const goBack = () => {
    if (currentSection > 0) {
      setCurrentSection((s) => s - 1);
      requestAnimationFrame(scrollToQuestions);
    }
  };

  const showResults = (s: Scores) => {
    setScreen("results");
    setAnimateResults(false);
    if (typeof window !== "undefined") {
      const params = encodeResultsToUrl(s);
      const newUrl = `${window.location.pathname}?${params}`;
      window.history.replaceState(null, "", newUrl);
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToQuestions);
    });
    setTimeout(() => setAnimateResults(true), 300);
  };

  const retake = () => {
    setScreen("hero");
    setCurrentSection(0);
    setAnswers({});
    setScores(null);
    setAnimateResults(false);
    setShareView(false);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname);
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToQuestions);
    });
  };

  const copyShareLink = async () => {
    if (typeof window === "undefined" || !scores) return;
    const params = encodeResultsToUrl(scores);
    const shareUrl = `${window.location.origin}${window.location.pathname}?${params}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    } catch {
      // Clipboard API not available; do nothing
    }
  };

  const section = sections[currentSection];
  const band = scores ? getBand(scores.overall) : null;
  const bandKey = scores ? bandFromOverall(scores.overall) : null;
  const bandCta = bandKey ? getBandCta(bandKey) : null;
  const benchmark = bandKey ? getBenchmarkContext(bandKey) : null;
  const weakestReading = scores ? getReadingForWeakestDimension(scores) : null;
  const greenClaimsReading = scores?.greenClaimsFlag ? getGreenClaimsReading() : null;
  const barrierLabels: Record<string, string> = {
    "dont-know-start": "not knowing where to start",
    "lack-supplier-data": "lacking supplier data",
    "lack-resource": "insufficient internal resource",
    cost: "cost concerns",
    unaware: "not being aware of the requirement",
    "waiting-guidance": "waiting for clearer regulatory guidance",
  };
  const barriers = (answers.q25 as string[]) || [];

  return (
    <div ref={toolRef}>
      {screen === "hero" && (
        <div id="assessment-start" className="flex min-h-[60vh] items-center justify-center px-5 py-16 text-center">
          <FadeUp>
            <div className="mx-auto max-w-2xl">
              <Badge className="mb-6">Start your assessment</Badge>
              <h2 className="font-display text-3xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-4xl lg:text-[3rem]">
                Ready when you are.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-envrt-brand-black/65 sm:text-lg">
                25 questions across five sections. Around 10 minutes. Your results are emailed straight to you.
              </p>
              <div className="mt-10">
                <ButtonV3
                  size="lg"
                  onClick={() => {
                    setScreen("assessment");
                    // Defer until the assessment screen renders and
                    // questionsRef is mounted, then scroll to it
                    // rather than the top of the page.
                    requestAnimationFrame(() => {
                      requestAnimationFrame(scrollToQuestions);
                    });
                  }}
                >
                  Begin assessment <span className="ml-2">&rarr;</span>
                </ButtonV3>
              </div>
            </div>
          </FadeUp>
        </div>
      )}

      {screen === "assessment" && (
        <>
          <ProgressBar currentSection={currentSection} answers={answers} />
          <div className="pb-24 pt-16 sm:pt-20">
            <Container className="max-w-[720px]">
              <div
                key={section.id}
                className="animate-[fadeUp_0.4s_ease_forwards]"
              >
                <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine">
                  Section {currentSection + 1} of 5
                </p>
                <h2 className="font-display text-2xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-3xl lg:text-[2.5rem]">
                  {section.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-envrt-brand-black/65 sm:text-base">
                  {section.description}
                </p>

                <div className="mt-10 space-y-8">
                  {section.questions.map((q) => (
                    <div key={q.id}>
                      <p className="mb-1 text-sm font-semibold text-envrt-brand-black">
                        {q.text}
                      </p>
                      {q.hint && (
                        <p className="mb-3 text-xs text-envrt-brand-black/55">
                          {q.hint}
                        </p>
                      )}
                      {!q.hint && <div className="mb-3" />}
                      <div className="flex flex-col gap-2">
                        {q.options.map((opt) => {
                          const sel =
                            q.type === "multi"
                              ? ((answers[q.id] as string[]) || []).includes(
                                  opt.value
                                )
                              : answers[q.id] === opt.value;
                          return (
                            <OptionTile
                              key={opt.value}
                              option={opt}
                              selected={sel}
                              type={q.type}
                              onClick={() =>
                                handleSelect(
                                  q.id,
                                  opt.value,
                                  q.type,
                                  q.maxSelect
                                )
                              }
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex items-center justify-between border-t border-envrt-brand-black/5 pt-6">
                  {currentSection > 0 ? (
                    <ButtonV3 variant="ghost" onClick={goBack}>
                      &larr; Back
                    </ButtonV3>
                  ) : (
                    <span />
                  )}
                  <ButtonV3 onClick={goNext} className={sectionComplete ? "" : "pointer-events-none opacity-40"}>
                    {currentSection === sections.length - 1
                      ? "View Your Results"
                      : "Continue"}{" "}
                    <span className="ml-2">&rarr;</span>
                  </ButtonV3>
                </div>
              </div>
            </Container>
          </div>
        </>
      )}

      {screen === "email" && (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-5 py-20">
          <FadeUp>
            <SectionCard className="mx-auto max-w-md">
              <div className="p-8 text-center sm:p-10">
                <h2 className="text-xl font-bold tracking-tight text-envrt-brand-black sm:text-2xl">
                  Your report is ready
                </h2>
                <p className="mt-3 text-sm text-envrt-brand-black/55">
                  Enter your details to view your results and receive your
                  full personalised DPP Readiness Report by email.
                </p>

                <form
                  className="mt-8 space-y-4 text-left"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setEmailError(null);
                    setEmailSending(true);
                    const formData = new FormData(e.currentTarget);
                    const s = calculateScores(answers);
                    const b = getBand(s.overall);
                    let succeeded = false;
                    try {
                      const res = await fetch("/api/assessment-lead", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          firstName: formData.get("firstName"),
                          brandName: formData.get("brandName"),
                          email: formData.get("email"),
                          overall: s.overall,
                          band: b.label,
                          headline: b.headline,
                          summary: b.summary,
                          dimensions: [
                            { label: DIMENSION_LABELS.supplyChain, score: s.supplyChain },
                            { label: DIMENSION_LABELS.productData, score: s.productData },
                            { label: DIMENSION_LABELS.regulatory, score: s.regulatory },
                            { label: DIMENSION_LABELS.infrastructure, score: s.infrastructure },
                          ],
                          actions: getRecommendedActions(s, answers),
                          timelineRisk: getTimelineRisk(answers),
                          greenClaimsFlag: s.greenClaimsFlag,
                          marketingConsent: !!formData.get("marketingConsent"),
                          turnstileToken,
                        }),
                      });
                      succeeded = res.ok;
                      if (!res.ok) {
                        const data = await res.json().catch(() => null);
                        setEmailError(
                          (data && data.error) ||
                            "We couldn't send your report just now. Please try again."
                        );
                      }
                    } catch {
                      setEmailError(
                        "Network error sending your report. Please check your connection and try again."
                      );
                    }
                    setEmailSending(false);
                    if (succeeded) {
                      setScores(s);
                      showResults(s);
                    }
                  }}
                >
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-envrt-brand-black">
                      First name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      placeholder="Your first name"
                      className="w-full rounded-xl border border-envrt-brand-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-envrt-brand-ultramarine/40 focus:ring-1 focus:ring-envrt-brand-ultramarine/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-envrt-brand-black">
                      Brand name
                    </label>
                    <input
                      type="text"
                      name="brandName"
                      required
                      placeholder="Your brand name"
                      className="w-full rounded-xl border border-envrt-brand-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-envrt-brand-ultramarine/40 focus:ring-1 focus:ring-envrt-brand-ultramarine/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-envrt-brand-black">
                      Email address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="you@brand.com"
                      className="w-full rounded-xl border border-envrt-brand-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-envrt-brand-ultramarine/40 focus:ring-1 focus:ring-envrt-brand-ultramarine/20"
                    />
                  </div>
                  <label className="flex items-start gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      name="marketingConsent"
                      className="mt-0.5 h-4 w-4 rounded border-envrt-brand-black/20 text-envrt-brand-ultramarine accent-envrt-brand-ultramarine"
                    />
                    <span className="text-xs leading-relaxed text-envrt-brand-black/55">
                      I am happy to receive follow-up communications from ENVRT
                      about DPP compliance and product updates.
                    </span>
                  </label>
                  <HiddenTurnstile onToken={setTurnstileToken} className="justify-center" />
                  {emailError && (
                    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {emailError}
                    </div>
                  )}
                  <ButtonV3 type="submit" className={`w-full ${emailSending ? "pointer-events-none opacity-60" : ""}`} size="lg">
                    {emailSending ? "Sending your report..." : <>View My Report <span className="ml-2">&rarr;</span></>}
                  </ButtonV3>
                  <p className="text-center text-xs leading-relaxed text-envrt-brand-black/70">
                    Your results will be emailed to you. See our{" "}
                    <Link href="/privacy" className="underline hover:text-envrt-brand-ultramarine">
                      privacy policy
                    </Link>{" "}
                    for how we handle your data.
                  </p>
                </form>

              </div>
            </SectionCard>
          </FadeUp>
        </div>
      )}

      {screen === "results" && scores && band && bandCta && benchmark && (
        <div className="pb-20 pt-28">
          <Container className="max-w-[720px]">
            {shareView && (
              <div className="mb-6 rounded-xl border border-envrt-brand-ultramarine/15 bg-envrt-brand-ultramarine/5 px-4 py-3 text-sm text-envrt-brand-black/80">
                You are viewing a shared assessment result. <button onClick={retake} className="font-semibold text-envrt-brand-ultramarine underline-offset-2 hover:underline">Take the assessment yourself</button> to generate your own.
              </div>
            )}
            <FadeUp>
              <div className="text-center">
                <ScoreRing
                  score={scores.overall}
                  animated={animateResults}
                />
                <span
                  className={`mt-6 inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${band.cls}`}
                >
                  {band.label}
                </span>
                <h2 className="mt-5 text-xl font-bold tracking-tight text-envrt-brand-black sm:text-2xl">
                  {band.headline}
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-envrt-brand-black/80 sm:text-base">
                  {band.summary}
                </p>
                {!shareView && (
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <ButtonV3 variant="ghost" onClick={copyShareLink}>
                      {shareCopied ? "Link copied" : "Share these results"}
                    </ButtonV3>
                  </div>
                )}
              </div>
            </FadeUp>

            <FadeUp delay={0.12}>
              <SectionCard className="mt-10">
                <div className="p-6 sm:p-8">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-envrt-brand-black">
                    How You Compare
                  </h3>
                  <p className="text-sm leading-relaxed text-envrt-brand-black/80">
                    {benchmark.text}
                  </p>
                  <p className="mt-3 text-xs text-envrt-brand-black/55">{benchmark.caveat}</p>
                </div>
              </SectionCard>
            </FadeUp>

            <FadeUp delay={0.15}>
              <SectionCard className="mt-6">
                <div className="p-6 sm:p-8">
                  <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-envrt-brand-black">
                    Dimension Scores
                  </h3>
                  <DimensionBar
                    label={DIMENSION_LABELS.supplyChain}
                    score={scores.supplyChain}
                    animated={animateResults}
                    delay={200}
                  />
                  <DimensionBar
                    label={DIMENSION_LABELS.productData}
                    score={scores.productData}
                    animated={animateResults}
                    delay={400}
                  />
                  <DimensionBar
                    label={DIMENSION_LABELS.regulatory}
                    score={scores.regulatory}
                    animated={animateResults}
                    delay={600}
                  />
                  <DimensionBar
                    label={DIMENSION_LABELS.infrastructure}
                    score={scores.infrastructure}
                    animated={animateResults}
                    delay={800}
                  />
                </div>
              </SectionCard>
            </FadeUp>

            {scores.greenClaimsFlag && (
              <FadeUp delay={0.22}>
                <div className="mt-6 rounded-scene border border-red-200 bg-red-50 p-6 sm:p-8">
                  <h3 className="text-sm font-bold text-red-700">
                    {"⚠️"} Green Claims Risk Detected
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-envrt-brand-black/80">
                    Your brand is making public sustainability claims without
                    verified data to substantiate them. Under the EU Green
                    Claims Directive and UK DMCCA provisions coming into force
                    from 2026, this creates direct legal exposure. Resolving
                    this should be an immediate priority alongside DPP
                    readiness.
                  </p>
                  {greenClaimsReading && (
                    <div className="mt-4 space-y-2">
                      {greenClaimsReading.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block text-sm font-semibold text-red-700 underline-offset-2 hover:underline"
                        >
                          {link.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </FadeUp>
            )}

            {!shareView && (
              <FadeUp delay={0.3}>
                <SectionCard className="mt-6">
                  <div className="border-l-4 border-envrt-brand-ultramarine p-6 sm:p-8">
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-envrt-brand-black">
                      Timeline Risk
                    </h3>
                    <p className="text-sm leading-relaxed text-envrt-brand-black/80">
                      {getTimelineRisk(answers)}
                    </p>
                  </div>
                </SectionCard>
              </FadeUp>
            )}

            {!shareView && (
              <FadeUp delay={0.35}>
                <SectionCard className="mt-6">
                  <div className="p-6 sm:p-8">
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-envrt-brand-black">
                      Recommended Next Steps
                    </h3>
                    {barriers.length > 0 && (
                      <p className="mb-5 text-xs leading-relaxed text-envrt-brand-black/55">
                        You identified{" "}
                        {barriers.map((b) => barrierLabels[b] || b).join(" and ")}{" "}
                        as your primary barriers. The actions below are
                        prioritised with this in mind.
                      </p>
                    )}
                    <div className="divide-y divide-envrt-brand-black/5">
                      {getRecommendedActions(scores, answers).map((action, i) => (
                        <div key={i} className="flex gap-3.5 py-4 first:pt-0 last:pb-0">
                          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-envrt-brand-ultramarine/10 text-xs font-bold text-envrt-brand-ultramarine">
                            {i + 1}
                          </span>
                          <span className="text-sm leading-relaxed text-envrt-brand-black/80">
                            {action}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </SectionCard>
              </FadeUp>
            )}

            {weakestReading && (
              <FadeUp delay={0.4}>
                <SectionCard className="mt-6">
                  <div className="p-6 sm:p-8">
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-envrt-brand-black">
                      Recommended Reading
                    </h3>
                    <p className="mb-5 text-sm text-envrt-brand-black/55">
                      Your lowest-scoring area is <strong className="text-envrt-brand-black">{weakestReading.label}</strong>. These articles cover what to do next.
                    </p>
                    <div className="space-y-4">
                      {weakestReading.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block rounded-xl border border-envrt-brand-black/8 bg-white p-4 transition-all hover:border-envrt-brand-ultramarine/30 hover:shadow-sm"
                        >
                          <p className="text-sm font-semibold text-envrt-brand-black">{link.title}</p>
                          <p className="mt-1 text-xs text-envrt-brand-black/55">{link.description}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </SectionCard>
              </FadeUp>
            )}

            <FadeUp delay={0.45}>
              <SectionCard dark className="mt-10">
                <div className="py-16 sm:py-20">
                  <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      {bandCta.framing}
                    </h2>
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                      <Link
                        href={bandCta.primaryHref}
                        data-cta={`assessment-cta-${bandKey}-primary`}
                        className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-medium text-envrt-brand-ultramarine transition-all duration-300 hover:bg-envrt-brand-vista shadow-sm hover:shadow-md"
                      >
                        {bandCta.primaryLabel}
                        <span className="ml-2">&rarr;</span>
                      </Link>
                      <Link
                        href={bandCta.secondaryHref}
                        data-cta={`assessment-cta-${bandKey}-secondary`}
                        className="inline-flex items-center justify-center rounded-xl border border-white/30 px-8 py-4 text-lg font-medium text-white transition-all duration-300 hover:border-white/60 hover:bg-white/10"
                      >
                        {bandCta.secondaryLabel}
                      </Link>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </FadeUp>

            <div className="mt-8 text-center">
              <ButtonV3 variant="ghost" onClick={retake}>
                {shareView ? "Take the assessment yourself" : "Retake Assessment"}
              </ButtonV3>
            </div>
          </Container>
        </div>
      )}
    </div>
  );
}
