import type { Metadata } from "next";
import {
  PageHero,
  FaqSnippet,
  ButtonV3,
  Card,
} from "@/components/v3";
import {
  Eyebrow,
  SectionCorners,
} from "@/components/sections/v3/_shared";
import { AssetIcon } from "@/components/sections/v3/AssetIcon";
import { FadeUp } from "@/components/ui/Motion";
import { AnatomyOfLcaSection } from "@/components/sections/v3/AnatomyOfLcaSection";
import { FinalCtaV3 } from "@/components/sections/v3/FinalCtaV3";

export const metadata: Metadata = {
  title: "Lab | ENVRT v3",
  description:
    "Inside the ENVRT calculation engine. EU PEF, ISO 14040, AWARE water scarcity. Built in-house, not licensed.",
  robots: { index: false, follow: false },
};

const FACTOR_SOURCES = [
  {
    icon: "compliance" as const,
    name: "AWARE",
    role: "Water scarcity weighting",
    note: "UN-recommended water scarcity model, applied per country for the dyeing stage.",
  },
  {
    icon: "eco-score" as const,
    name: "Ecobalyse",
    role: "French Coût Environnemental calculation",
    note: "Official French government methodology for textile environmental labelling.",
  },
  {
    icon: "audit" as const,
    name: "EU PEF",
    role: "Product Environmental Footprint method",
    note: "EU Joint Research Centre methodology with 16 impact categories.",
  },
];

const STANDARDS = [
  {
    name: "ISO 14040",
    description: "Lifecycle assessment principles and framework.",
  },
  {
    name: "ISO 14044",
    description: "Lifecycle assessment requirements and guidelines.",
  },
  {
    name: "EU PEF 3.1",
    description: "Product Environmental Footprint method, 16 impact categories.",
  },
  {
    name: "AWARE",
    description: "Available Water Remaining model for water scarcity.",
  },
  {
    name: "Ecobalyse 2024",
    description: "French Coût Environnemental textile method.",
  },
  {
    name: "ESPR-ready",
    description: "Data schema aligned with the textile delegated act draft.",
  },
];

const faqs = [
  {
    question: "Why did you build the calculation engine in-house?",
    answer:
      "Because licensing it from a third party makes the platform less defensible. Some platforms in our space run their own engine, others rely on partner providers for LCA. The depth and methodology become your differentiator only if you own the stack.",
  },
  {
    question: "Which impact categories do you calculate?",
    answer:
      "Per garment: CO₂e, water scarcity (AWARE-weighted), French Coût Environnemental score, and the full 16-category EU PEF profile on Pro. Stage-level breakdowns across fibre, yarn, fabric, dye, assembly and transport.",
  },
  {
    question: "How accurate is the calculation?",
    answer:
      "We reference the EU PEF 3.1 factor set and apply named methodologies including ISO 14040, AWARE water scarcity and Ecobalyse for the French Coût Environnemental. Accuracy depends on input data quality. The platform flags low-confidence inputs and asks for evidence where it matters.",
  },
  {
    question: "Can I download the methodology pack?",
    answer:
      "Yes. Per garment, you can export an audit-ready proof pack in PDF and JSON. Includes calculation inputs, factor sources, methodology versioning and the full audit trail. One click. CSV export and supplier evidence bundling are on the roadmap.",
  },
];

export default function LabV3Page() {
  return (
    <main>
      <PageHero
        eyebrow="ENVRT Lab"
        heading={
          <>
            We built the engine.{" "}
            <span className="text-envrt-brand-black/40">
              Not licensed it.
            </span>
          </>
        }
        body="EU PEF and ISO 14040 throughout, with AWARE water scarcity baked in. Real factor sources, named standards, exportable methodology per garment. The depth that lets us claim native LCA, not a partner API."
        actions={
          <>
            <ButtonV3 href="/preview/v3/free-dpp" variant="primary">
              Try ENVRT on one garment<span>→</span>
            </ButtonV3>
            <ButtonV3 href="/preview/v3/platform" variant="ghost">
              See the platform<span>→</span>
            </ButtonV3>
          </>
        }
        cornerLeft="ENVRT/01"
        cornerRight="Lab"
      />

      {/* Live calculation anatomy — reused from homepage */}
      <AnatomyOfLcaSection />

      <FactorSources />
      <StandardsList />

      <FaqSnippet
        eyebrow="Methodology questions"
        heading="About the calculation engine"
        items={faqs}
        ctaHref="/preview/v3/faq"
        ctaLabel="See all FAQs"
      />

      <FinalCtaV3 />
    </main>
  );
}

function FactorSources() {
  return (
    <section className="relative bg-envrt-brand-vista py-20 sm:py-24 lg:py-32">
      <SectionCorners left="ENVRT/03" right="Sources" />
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-2xl text-center">
          <FadeUp>
            <Eyebrow>Factor sources</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="mt-4 font-display text-3xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-4xl">
              The databases and methodologies behind every calculation.
            </h2>
          </FadeUp>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 lg:gap-6">
          {FACTOR_SOURCES.map((s, i) => (
            <FadeUp key={s.name} delay={0.08 + i * 0.06}>
              <Card variant="soft">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-envrt-brand-ultramarine/10 text-envrt-brand-ultramarine">
                    <AssetIcon type={s.icon} size={22} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine">
                      {s.role}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-semibold tracking-[-0.01em] text-envrt-brand-black sm:text-xl">
                      {s.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-envrt-brand-black/70">
                      {s.note}
                    </p>
                  </div>
                </div>
              </Card>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function StandardsList() {
  return (
    <section className="relative bg-white py-20 sm:py-24 lg:py-28">
      <SectionCorners left="ENVRT/04" right="Standards" />
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-2xl text-center">
          <FadeUp>
            <Eyebrow>Standards covered</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="mt-4 font-display text-3xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-4xl">
              Every calculation traces back to a named standard.
            </h2>
          </FadeUp>
        </div>

        <FadeUp delay={0.16}>
          <div className="mt-12 grid grid-cols-1 gap-3 sm:mt-14 sm:grid-cols-2 lg:gap-4">
            {STANDARDS.map((s) => (
              <div
                key={s.name}
                className="flex items-baseline justify-between gap-4 rounded-2xl border border-envrt-brand-black/12 bg-white p-5"
              >
                <div className="min-w-0">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine sm:text-[11px]">
                    Standard
                  </p>
                  <p className="mt-1 font-display text-base font-semibold tracking-tight text-envrt-brand-black sm:text-lg">
                    {s.name}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-envrt-brand-black/65 sm:text-sm">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
