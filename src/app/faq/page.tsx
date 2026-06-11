"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PageHero, ButtonV3 } from "@/components/v3";
import {
  Eyebrow,
  SectionCorners,
  EASE_BRAND,
} from "@/components/sections/v3/_shared";
import { FadeUp } from "@/components/ui/Motion";
import { FinalCtaV3 } from "@/components/sections/v3/FinalCtaV3";
import {
  faqItems,
  pricingFaqItems,
  roiFaqItems,
  freeDppFaqItems,
  readinessAssessmentFaqItems,
} from "@/lib/config";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

// //faq — full FAQ page. Five accordion sections grouped by
// topic. Each section's questions come from the existing config exports
// used by individual page FAQ snippets, so the dedicated page and the
// in-page snippets stay in lockstep.

type FaqItem = { question: string; answer: string };

type FaqSection = {
  index: string;
  label: string;
  description: string;
  items: FaqItem[];
};

// Methodology + regulatory FAQ groups. Live inline rather than in
// /lib/config because they cover engine-level + regulator-facing detail
// rather than buyer onboarding content.

const METHODOLOGY_FAQS: FaqItem[] = [
  {
    question: "How does ENVRT calculate the environmental impact of a garment?",
    answer:
      "Per garment, stage by stage. Six lifecycle stages (fibre, yarn, fabric, dyeing, assembly, transport) each run against per-stage emission factors, country-specific energy grids and the AWARE water scarcity weighting. Every passport runs the same engine, with 68,000+ reference cells per garment.",
  },
  {
    question: "Which lifecycle stages are modelled?",
    answer:
      "Fibre extraction, yarn spinning, fabric production, dyeing and finishing, assembly and tier-by-tier transport. Each stage has its own factor source, its own loss assumption and its own location-aware grid mix.",
  },
  {
    question: "What standards does the calculation engine follow?",
    answer:
      "EU PEF 3.1 for the Product Environmental Footprint method, ISO 14040 for lifecycle assessment principles, AWARE for water scarcity weighting and Ecobalyse for the French Coût Environnemental score. Every calculation traces back to a named standard with a published reference.",
  },
  {
    question: "Where does the factor data come from?",
    answer:
      "Public emission factor databases for fibre, yarn and fabric stages, IEA grid mix data per country for energy, AWARE for water scarcity and Ecobalyse for the French Eco-Score factors. The lab page lists every source by name.",
  },
];

const COMPLIANCE_FAQS: FaqItem[] = [
  {
    question: "Which DPP regulations does ENVRT cover?",
    answer:
      "EU ESPR for textile Digital Product Passports, the French Coût Environnemental labelling framework, UK DMCCA-aligned green-claims hygiene and the EU Green Claims Directive once enforcement begins. The DPP timeline page tracks the dates.",
  },
  {
    question: "When will the EU Digital Product Passport be required for textiles?",
    answer:
      "Mandatory passports phase in from 2027. The textile delegated act, which defines what a passport must contain and how it must be published, is expected mid-2026. Building now means you have a working passport well before the enforcement clock starts.",
  },
  {
    question: "Is the methodology aligned with the French Eco-Score?",
    answer:
      "Yes. The Coût Environnemental score is calculated for every garment using the official Ecobalyse methodology. Sixteen data blocks per product, French regulator-recognised, ready to display on the DPP or your own product pages.",
  },
  {
    question: "What evidence does ENVRT need to support a regulator audit?",
    answer:
      "Every input ties back to a versioned, dated source document in the evidence vault. Supplier declarations, test reports, audit certificates, geo-tagged photos. The DPP shows the customer-facing view; the underlying chain of evidence is available for export when a regulator asks.",
  },
];

const SECTIONS: FaqSection[] = [
  {
    index: "01",
    label: "Getting started",
    description: "How ENVRT works and what you need to begin.",
    items: faqItems as FaqItem[],
  },
  {
    index: "02",
    label: "Methodology",
    description: "How the calculation engine works, stage by stage.",
    items: METHODOLOGY_FAQS,
  },
  {
    index: "03",
    label: "Compliance and regulation",
    description: "EU ESPR, French Eco-Score, evidence for audits.",
    items: COMPLIANCE_FAQS,
  },
  {
    index: "04",
    label: "Pricing",
    description: "Plans, tiers, billing.",
    items: pricingFaqItems as FaqItem[],
  },
  {
    index: "05",
    label: "ROI and savings",
    description: "Cost compared to consultants and in-house teams.",
    items: roiFaqItems as FaqItem[],
  },
  {
    index: "06",
    label: "Free DPP",
    description: "What the free trial covers, what you get back.",
    items: freeDppFaqItems as FaqItem[],
  },
  {
    index: "07",
    label: "Readiness assessment",
    description: "How the 10-minute quiz scores your brand.",
    items: readinessAssessmentFaqItems as FaqItem[],
  },
];

export default function FaqV3Page() {
  const allFaqItems = [
    ...faqItems,
    ...pricingFaqItems,
    ...roiFaqItems,
    ...freeDppFaqItems,
    ...readinessAssessmentFaqItems,
    ...METHODOLOGY_FAQS,
    ...COMPLIANCE_FAQS,
  ];

  return (
    <main className="theme-sunny">
      <FAQJsonLd items={allFaqItems} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://envrt.com" },
          { name: "FAQ", url: "https://envrt.com/faq" },
        ]}
      />
      <PageHero
        tone="sunny"
        eyebrow="FAQ"
        heading={
          <>
            Common questions.{" "}
            <span className="text-envrt-brand-black/40">
              Straight answers.
            </span>
          </>
        }
        body="Everything we are asked most often, grouped by topic. If something is missing, message us and we will add it."
        actions={
          <>
            <ButtonV3 href="/free-dpp" variant="primary">
              Try ENVRT on one garment<span>→</span>
            </ButtonV3>
            <ButtonV3 href="/contact" variant="ghost">
              Ask a question<span>→</span>
            </ButtonV3>
          </>
        }
        cornerLeft="ENVRT/01"
        cornerRight="FAQ"
      />

      <SectionNav />
      <SectionsBody />

      <FinalCtaV3 />
    </main>
  );
}

function SectionNav() {
  return (
    <section className="relative bg-envrt-brand-vista py-10 sm:py-14">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-16">
        <FadeUp>
          <ul className="flex flex-wrap gap-2 sm:gap-3">
            {SECTIONS.map((s) => (
              <li key={s.index}>
                <a
                  href={`#section-${s.index}`}
                  className="inline-flex items-center gap-2 rounded-full border border-envrt-brand-black/12 bg-white px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/70 transition-colors duration-200 hover:border-envrt-brand-ultramarine/30 hover:text-envrt-brand-ultramarine sm:text-[11px]"
                >
                  <span className="text-envrt-brand-ultramarine">{s.index}</span>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </FadeUp>
      </div>
    </section>
  );
}

// Pool of thin photographic dividers cycled between FAQ sections. Adds
// an editorial rhythm without committing to "every section needs a hero
// photo". Wide horizontal crops only — these are bands, not banners.
const DIVIDER_BANDS = [
  "/v3-assets/provenance-loom.jpg",
  "/v3-assets/story-fabric.jpg",
  "/v3-assets/platform-thread-spools.jpg",
  "/v3-assets/folded-clothes.jpg",
  "/v3-assets/cta-texture.jpg",
];

function SectionsBody() {
  return (
    <>
      {SECTIONS.map((s, i) => (
        <div key={s.index}>
          <Section section={s} isLast={i === SECTIONS.length - 1} />
          {i < SECTIONS.length - 1 && (
            <PhotoDivider src={DIVIDER_BANDS[i % DIVIDER_BANDS.length]} />
          )}
        </div>
      ))}
    </>
  );
}

function PhotoDivider({ src }: { src: string }) {
  return (
    <div
      aria-hidden
      className="relative h-12 w-full overflow-hidden bg-envrt-brand-black/5 sm:h-16 lg:h-20"
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      {/* Slight darken at the edges so the divider doesn't fight nearby
          section type. */}
      <div className="absolute inset-0 bg-gradient-to-r from-envrt-brand-vista/30 via-transparent to-envrt-brand-vista/30" />
    </div>
  );
}

function Section({
  section,
  isLast,
}: {
  section: FaqSection;
  isLast: boolean;
}) {
  return (
    <section
      id={`section-${section.index}`}
      className={`relative bg-envrt-brand-vista pb-20 sm:pb-24 lg:pb-32 ${
        isLast ? "" : ""
      }`}
    >
      <SectionCorners
        left={`ENVRT/${section.index}`}
        right={section.label}
      />
      <div className="mx-auto max-w-[900px] px-5 sm:px-8 lg:px-16">
        <div className="border-t border-envrt-brand-black/8 pt-14 sm:pt-16">
          <FadeUp>
            <Eyebrow>{`${section.index} · ${section.label}`}</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="mt-4 font-display text-2xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-3xl lg:text-4xl">
              {section.description}
            </h2>
          </FadeUp>

          <FadeUp delay={0.16}>
            <div className="mt-10">
              <FaqList items={section.items} />
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function FaqList({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={item.question}
            className="border-b border-envrt-brand-black/12 last:border-0"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="group flex w-full items-center justify-between gap-4 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-display text-base font-medium leading-tight tracking-tight text-envrt-brand-black transition-colors duration-200 group-hover:text-envrt-brand-ultramarine sm:text-lg">
                {item.question}
              </span>
              <span
                aria-hidden
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-envrt-brand-black/25 text-sm font-medium transition-transform duration-300 ${
                  isOpen
                    ? "rotate-45 border-envrt-brand-ultramarine text-envrt-brand-ultramarine"
                    : "text-envrt-brand-black/65"
                }`}
              >
                +
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE_BRAND }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 text-sm leading-relaxed text-envrt-brand-black/70 sm:text-base">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
