import type { Metadata } from "next";
import { PageHero, ButtonV3 } from "@/components/v3";
import {
  Eyebrow,
  SectionCorners,
} from "@/components/sections/v3/_shared";
import { FadeUp } from "@/components/ui/Motion";
import { FinalCtaV3 } from "@/components/sections/v3/FinalCtaV3";

export const metadata: Metadata = {
  title: "Glossary v3 preview",
  robots: { index: false, follow: false },
};

type Term = { term: string; definition: string };

const TERMS: Term[] = [
  {
    term: "AWARE Method",
    definition:
      "Available WAter REmaining. The recommended water scarcity characterisation method under the EU Product Environmental Footprint (PEF) framework. AWARE weights water consumption against regional scarcity factors, producing a figure in cubic metres of world-equivalent water (m³ world-eq) that reflects actual environmental stress rather than volume alone.",
  },
  {
    term: "Carbon Footprint",
    definition:
      "The sum of greenhouse gas emissions and removals associated with a product, expressed in kilograms of carbon dioxide equivalent (kg CO₂e). For garments, this is calculated using Life Cycle Assessment across the product's supply chain stages.",
  },
  {
    term: "Cradle-to-Gate",
    definition:
      "A system boundary for Life Cycle Assessment that covers everything from raw material extraction through to the finished product leaving the factory. This is the most common scope in fashion LCA because it captures the bulk of supply chain impacts and is where brands have the most opportunity to intervene.",
  },
  {
    term: "Cradle-to-Grave",
    definition:
      "A system boundary for Life Cycle Assessment that extends from raw material extraction through manufacturing, consumer use (washing, drying, ironing) and end-of-life disposal. This scope introduces variability because consumer behaviour differs by geography and demographic.",
  },
  {
    term: "CSRD",
    definition:
      "Corporate Sustainability Reporting Directive. EU legislation requiring structured environmental and social disclosures from companies meeting defined size thresholds. Includes value chain (Scope 3) emissions reporting. Non-EU companies with more than €150 million in EU net turnover come into scope from 2028.",
  },
  {
    term: "Delegated Act",
    definition:
      "A legally binding regulation adopted by the European Commission under powers granted by a parent regulation. Under the ESPR, delegated acts define product-specific requirements including DPP content, performance standards and implementation timelines for each product group.",
  },
  {
    term: "Digital Product Passport (DPP)",
    definition:
      "A structured digital record linked to a physical product, typically via a QR code or NFC tag. Under the EU ESPR framework, the DPP provides standardised access to product information including environmental performance, material composition, durability and circularity data. The DPP applies at the product level, not the brand level.",
  },
  {
    term: "Environmental Footprint",
    definition:
      "A quantified assessment of a product's environmental impacts across its life cycle, covering multiple impact categories. Under the EU PEF method, this includes 16 categories such as climate change, water use, acidification and resource depletion. Not limited to carbon alone.",
  },
  {
    term: "ESPR",
    definition:
      "Ecodesign for Sustainable Products Regulation. EU regulation establishing a framework for improving the environmental sustainability and circularity of products placed on the EU market. Introduces the Digital Product Passport and empowers the Commission to set product-specific performance and information requirements through delegated acts.",
  },
  {
    term: "Green Claims Directive",
    definition:
      "Proposed EU legislation that will require brands to substantiate environmental marketing claims with a recognised methodology before publication. Claims such as “eco-friendly” or “sustainable” will need to be backed by verified, product-level performance data.",
  },
  {
    term: "Greenwashing",
    definition:
      "Making environmental claims that are misleading, unsubstantiated or disproportionate to the evidence available. In fashion, greenwashing most commonly results from disconnected workflows where marketing copy is written before the sustainability team has confirmed what can be proven at the product level.",
  },
  {
    term: "GHG Protocol",
    definition:
      "The Greenhouse Gas Protocol Corporate Standard, developed by the World Resources Institute (WRI) and the World Business Council for Sustainable Development (WBCSD). Defines three scopes of greenhouse gas emissions. For fashion brands, Scope 3 (value chain emissions) typically accounts for over 90% of total emissions.",
  },
  {
    term: "Hotspot",
    definition:
      "The life cycle stage, process or material that contributes the largest share of environmental impact for a product. In fashion, hotspots tend to cluster in fibre production, wet processing (dyeing and finishing) and manufacturing energy. Hotspots are not universal and shift depending on fibre mix, production geography and assessment scope.",
  },
  {
    term: "ISO 14040",
    definition:
      "International standard for Life Cycle Assessment, establishing principles and framework for how LCA studies should be defined, built and interpreted. Together with ISO 14044 (requirements and guidelines), it provides the methodological basis for credible, comparable environmental assessment.",
  },
  {
    term: "LCA (Life Cycle Assessment)",
    definition:
      "A structured method for quantifying the environmental impacts of a product across its life cycle, from raw material extraction through manufacturing, use and disposal. Governed by ISO 14040 and ISO 14044. In fashion, LCA traces a garment from fibre production through to the factory gate (cradle-to-gate) or through consumer use and end of life (cradle-to-grave).",
  },
  {
    term: "PEF (Product Environmental Footprint)",
    definition:
      "A standardised EU methodology for calculating the environmental performance of a product across its life cycle. More prescriptive than traditional LCA, PEF specifies 16 impact categories, characterisation methods, data quality rules and normalisation steps to enable comparable results across products in the same category.",
  },
  {
    term: "PEFCR",
    definition:
      "Product Environmental Footprint Category Rules. Product-specific rules within the PEF framework that define exactly how an LCA study should be conducted for a given product category, including the functional unit, system boundaries, data quality requirements and allocation rules. The PEFCR for apparel and footwear is the reference document for fashion.",
  },
  {
    term: "Scope 1 Emissions",
    definition:
      "Direct greenhouse gas emissions from sources owned or controlled by a company. For fashion brands, this typically means company-operated vehicles, on-site heating and any owned manufacturing facilities. Usually a small share of total emissions.",
  },
  {
    term: "Scope 2 Emissions",
    definition:
      "Indirect greenhouse gas emissions from purchased electricity, steam, heating and cooling consumed by a company. Office energy, warehouse operations and owned retail store electricity fall here. For most fashion brands, a relatively small share of total emissions.",
  },
  {
    term: "Scope 3 Emissions",
    definition:
      "All other indirect emissions occurring in a company's value chain, both upstream (supply chain) and downstream (product use and end of life). For fashion brands, Scope 3 typically accounts for over 90% of total greenhouse gas emissions because most brands do not own their factories or grow their raw materials.",
  },
  {
    term: "Substances of Concern",
    definition:
      "As defined by the ESPR, substances that adversely affect human health or the environment, or that hinder reuse, refurbishment or high-quality recycling. Includes SVHC under REACH, carcinogens, mutagens, reproductive toxins and persistent organic pollutants.",
  },
  {
    term: "Transparency Score",
    definition:
      "A proprietary ENVRT metric reflecting the quality and completeness of the data underpinning a product's environmental assessment. Higher scores indicate more specific, supplier-verified data inputs rather than database defaults or industry averages.",
  },
  {
    term: "Water Scarcity Impact",
    definition:
      "The environmental impact of water consumption weighted by regional scarcity. Measured using the AWARE method, which reflects how much water remains available in a watershed after human and ecosystem needs have been met. Water consumed in severely stressed basins can carry a scarcity factor 50 to 100 times higher than water-abundant regions.",
  },
  {
    term: "Wet Processing",
    definition:
      "The collective term for dyeing, finishing, washing and bleaching processes in textile manufacturing. Wet processing is typically among the most energy-intensive and water-intensive stages in garment production, and is often a significant environmental hotspot.",
  },
];

function slugify(term: string) {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type Group = { letter: string; items: Term[] };

const GROUPS: Group[] = (() => {
  const map = new Map<string, Term[]>();
  for (const t of TERMS) {
    const letter = t.term[0].toUpperCase();
    if (!map.has(letter)) map.set(letter, []);
    map.get(letter)!.push(t);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, items]) => ({ letter, items }));
})();

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function GlossaryV3Page() {
  const presentLetters = new Set(GROUPS.map((g) => g.letter));

  return (
    <main className="theme-sunny">
      <PageHero
        tone="sunny"
        eyebrow="Glossary"
        heading={
          <>
            The vocabulary.{" "}
            <span className="text-envrt-brand-black/40">
              Without the textbook.
            </span>
          </>
        }
        body="Key terms in fashion sustainability, Digital Product Passports, Life Cycle Assessment and environmental regulation. Plain definitions, no marketing gloss."
        actions={
          <>
            <ButtonV3 href="/preview/v3/free-dpp" variant="primary">
              Try ENVRT on one garment<span>→</span>
            </ButtonV3>
            <ButtonV3 href="/preview/v3/faq" variant="ghost">
              Read the FAQ<span>→</span>
            </ButtonV3>
          </>
        }
        cornerLeft="ENVRT/01"
        cornerRight="Glossary"
      />

      <AlphabetNav presentLetters={presentLetters} />
      <Groups />

      <FinalCtaV3 />
    </main>
  );
}

function AlphabetNav({ presentLetters }: { presentLetters: Set<string> }) {
  return (
    <section className="relative bg-envrt-brand-vista py-10 sm:py-14">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-16">
        <FadeUp>
          <ul className="flex flex-wrap gap-1.5 sm:gap-2">
            {ALPHABET.map((letter) => {
              const present = presentLetters.has(letter);
              if (!present) {
                return (
                  <li key={letter}>
                    <span
                      aria-disabled
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-envrt-brand-black/8 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/25 sm:h-10 sm:w-10"
                    >
                      {letter}
                    </span>
                  </li>
                );
              }
              return (
                <li key={letter}>
                  <a
                    href={`#letter-${letter}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-envrt-brand-black/12 bg-white font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/70 transition-colors duration-200 hover:border-envrt-brand-ultramarine/40 hover:text-envrt-brand-ultramarine sm:h-10 sm:w-10"
                  >
                    {letter}
                  </a>
                </li>
              );
            })}
          </ul>
        </FadeUp>
      </div>
    </section>
  );
}

function Groups() {
  return (
    <>
      {GROUPS.map((g, i) => (
        <LetterSection key={g.letter} group={g} isLast={i === GROUPS.length - 1} />
      ))}
    </>
  );
}

function LetterSection({ group, isLast }: { group: Group; isLast: boolean }) {
  return (
    <section
      id={`letter-${group.letter}`}
      className={`relative bg-envrt-brand-vista pb-14 sm:pb-16 ${isLast ? "" : ""}`}
    >
      <SectionCorners left={`ENVRT/${group.letter}`} right={`${group.items.length} terms`} />
      <div className="mx-auto max-w-[900px] px-5 sm:px-8 lg:px-16">
        <div className="border-t border-envrt-brand-black/8 pt-12 sm:pt-14">
          <FadeUp>
            <div className="flex items-baseline gap-4">
              <span className="font-display text-5xl font-medium leading-none tracking-[-0.025em] text-envrt-brand-ultramarine sm:text-6xl">
                {group.letter}
              </span>
              <Eyebrow>{`${group.items.length} terms`}</Eyebrow>
            </div>
          </FadeUp>

          <div className="mt-8 space-y-8 sm:mt-10">
            {group.items.map((item, idx) => (
              <FadeUp key={item.term} delay={Math.min(idx * 0.04, 0.2)}>
                <div
                  id={slugify(item.term)}
                  className="scroll-mt-28 border-b border-envrt-brand-black/10 pb-7 last:border-0 last:pb-0"
                >
                  <h2 className="font-display text-xl font-medium leading-tight tracking-tight text-envrt-brand-black sm:text-2xl">
                    {item.term}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-envrt-brand-black/70 sm:text-base">
                    {item.definition}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
