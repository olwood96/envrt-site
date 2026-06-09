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
import AssessmentTool from "@/components/assessment/AssessmentTool";

export const metadata: Metadata = {
  title: "DPP Readiness Assessment — ENVRT v3",
  description:
    "A free 10-minute readiness assessment across four DPP dimensions: supply chain, product data, regulatory awareness and infrastructure.",
  robots: { index: false, follow: false },
};

// /preview/v3/assessment — DPP readiness quiz. v3 marketing page wraps the
// existing AssessmentTool component. The tool itself keeps the v1
// implementation for now (25 questions, 4 weighted dimensions). It will
// get its own brand restyle in a follow-up wave.

const DIMENSIONS = [
  {
    icon: "supply-chain" as const,
    name: "Supply chain transparency",
    body: "How deep does your supplier mapping reach? Tier 1 only, or all the way to raw fibre?",
  },
  {
    icon: "audit" as const,
    name: "Product data completeness",
    body: "Material composition, weight, country of origin, certifications. How much of this exists per SKU?",
  },
  {
    icon: "compliance" as const,
    name: "Regulatory awareness",
    body: "EU ESPR, UK DMCCA, Green Claims Directive. How clearly mapped are your obligations?",
  },
  {
    icon: "vault" as const,
    name: "Data infrastructure",
    body: "Are you running on spreadsheets, on systems, or on dedicated DPP tooling?",
  },
];

const PROOF_POINTS = [
  "Free, no account required",
  "Five sections, 25 questions, around 10 minutes",
  "Scored across four weighted dimensions",
  "Full HTML report emailed within minutes",
  "Mapped to EU ESPR, UK DMCCA and Green Claims Directive",
  "Green-claims risk flag included where exposure is detected",
];

const faqs = [
  {
    question: "How is my brand scored?",
    answer:
      "Across four weighted dimensions. Supply chain transparency, product data completeness, regulatory awareness and data infrastructure. Each section feeds into a total band (Foundational, Developing, Established or Advanced) plus a per-dimension breakdown.",
  },
  {
    question: "What is in the emailed report?",
    answer:
      "Your overall band, per-dimension scores, your weakest area with a specific next step, your exposure to EU ESPR, UK DMCCA and the Green Claims Directive, and a green-claims risk flag if any of your inputs suggest one.",
  },
  {
    question: "Will my answers be shared?",
    answer:
      "No. Your scoring and the email it generates are private to you. We do not share or sell assessment data.",
  },
  {
    question: "What do I do with the result?",
    answer:
      "Use it to prioritise. The report flags your weakest dimension first so you can focus there. If you want help, book a demo and we will walk through what to fix.",
  },
];

export default function AssessmentV3Page() {
  return (
    <main>
      <PageHero
        eyebrow="Readiness assessment"
        heading={
          <>
            Is your brand ready for the DPP?{" "}
            <span className="text-envrt-brand-black/40">
              Score yourself in 10 minutes.
            </span>
          </>
        }
        body="A structured assessment across the four dimensions of DPP readiness. Supply chain transparency, product data completeness, regulatory awareness and data infrastructure. Free, no account, full HTML report by email."
        actions={
          <>
            <ButtonV3 href="#assessment-start" variant="primary">
              Start the assessment<span>→</span>
            </ButtonV3>
            <ButtonV3 href="/preview/v3/pricing" variant="ghost">
              See pricing<span>→</span>
            </ButtonV3>
          </>
        }
        cornerLeft="ENVRT/01"
        cornerRight="Assessment"
      />

      <Dimensions />
      <ProofRow />

      <section
        id="assessment-start"
        className="relative bg-envrt-brand-vista py-20 sm:py-24 lg:py-32"
      >
        <SectionCorners left="ENVRT/04" right="Start" />
        <div className="mx-auto max-w-[1000px] px-5 sm:px-8 lg:px-16">
          <div className="text-center">
            <FadeUp>
              <Eyebrow>The quiz</Eyebrow>
            </FadeUp>
            <FadeUp delay={0.08}>
              <h2 className="mt-4 font-display text-3xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-4xl">
                25 questions, 5 sections, 10 minutes.
              </h2>
            </FadeUp>
          </div>
          <FadeUp delay={0.16}>
            <div className="mt-12">
              <AssessmentTool />
            </div>
          </FadeUp>
        </div>
      </section>

      <FaqSnippet
        eyebrow="Common questions"
        heading="About the readiness assessment"
        items={faqs}
        ctaHref="/preview/v3/faq"
        ctaLabel="See all FAQs"
      />
    </main>
  );
}

function Dimensions() {
  return (
    <section className="relative bg-envrt-brand-vista py-20 sm:py-24 lg:py-28">
      <SectionCorners left="ENVRT/02" right="Dimensions" />
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-2xl text-center">
          <FadeUp>
            <Eyebrow>What we score</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="mt-4 font-display text-3xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-4xl">
              Four dimensions of DPP readiness.
            </h2>
          </FadeUp>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 lg:gap-6">
          {DIMENSIONS.map((d, i) => (
            <FadeUp key={d.name} delay={0.08 + i * 0.06}>
              <Card variant="soft">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-envrt-brand-ultramarine/10 text-envrt-brand-ultramarine">
                    <AssetIcon type={d.icon} size={22} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold tracking-[-0.01em] text-envrt-brand-black sm:text-xl">
                      {d.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-envrt-brand-black/70">
                      {d.body}
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

function ProofRow() {
  return (
    <section className="relative bg-white py-16 sm:py-20 lg:py-24">
      <SectionCorners left="ENVRT/03" right="What you get" />
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-16">
        <FadeUp>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {PROOF_POINTS.map((point) => (
              <li
                key={point}
                className="flex items-start gap-2.5 text-sm leading-snug text-envrt-brand-black/75"
              >
                <span
                  aria-hidden
                  className="mt-1.5 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-envrt-brand-ultramarine"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </FadeUp>
      </div>
    </section>
  );
}
