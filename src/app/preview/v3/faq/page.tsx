"use client";

import { useState } from "react";
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

// /preview/v3/faq — full FAQ page. Five accordion sections grouped by
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

const SECTIONS: FaqSection[] = [
  {
    index: "01",
    label: "Getting started",
    description: "How ENVRT works and what you need to begin.",
    items: faqItems as FaqItem[],
  },
  {
    index: "02",
    label: "Pricing",
    description: "Plans, tiers, billing.",
    items: pricingFaqItems as FaqItem[],
  },
  {
    index: "03",
    label: "ROI and savings",
    description: "Cost compared to consultants and in-house teams.",
    items: roiFaqItems as FaqItem[],
  },
  {
    index: "04",
    label: "Free DPP",
    description: "What the free trial covers, what you get back.",
    items: freeDppFaqItems as FaqItem[],
  },
  {
    index: "05",
    label: "Readiness assessment",
    description: "How the 10-minute quiz scores your brand.",
    items: readinessAssessmentFaqItems as FaqItem[],
  },
];

export default function FaqV3Page() {
  return (
    <main>
      <PageHero
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
            <ButtonV3 href="/preview/v3/free-dpp" variant="primary">
              Try ENVRT on one garment<span>→</span>
            </ButtonV3>
            <ButtonV3 href="/preview/v3/contact" variant="ghost">
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

function SectionsBody() {
  return (
    <>
      {SECTIONS.map((s, i) => (
        <Section key={s.index} section={s} isLast={i === SECTIONS.length - 1} />
      ))}
    </>
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
