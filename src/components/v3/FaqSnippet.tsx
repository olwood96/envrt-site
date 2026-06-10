"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eyebrow, type EyebrowTone } from "@/components/sections/v3/_shared";
import { FadeUp } from "@/components/ui/Motion";

// FAQ snippet block. 3-4 questions placed near the bottom of dedicated
// pages for AEO/SEO. Mirrors the FAQSectionV3 accordion but as a smaller,
// inline block. Question text should be shaped for long-tail search.

type FaqItem = {
  question: string;
  answer: string;
};

export function FaqSnippet({
  eyebrow = "Common questions",
  heading,
  items,
  ctaHref,
  ctaLabel = "See all FAQs",
  tone = "default",
}: {
  eyebrow?: string;
  heading?: string;
  items: FaqItem[];
  ctaHref?: string;
  ctaLabel?: string;
  tone?: EyebrowTone;
}) {
  return (
    <section className="relative bg-envrt-brand-vista py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-2xl px-5 sm:px-8 lg:px-16">
        <FadeUp>
          <div className="flex flex-col items-center text-center">
            <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
            {heading && (
              <h2 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight text-envrt-brand-black sm:text-4xl">
                {heading}
              </h2>
            )}
          </div>
        </FadeUp>

        <FadeUp delay={0.08}>
          <div className="mt-10">
            <FaqList items={items} />
          </div>
        </FadeUp>

        {ctaHref && (
          <FadeUp delay={0.16}>
            <div className="mt-10 text-center">
              <a
                href={ctaHref}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black underline-offset-4 transition-colors hover:text-envrt-brand-ultramarine hover:underline sm:text-xs"
              >
                {ctaLabel}
                <span aria-hidden>→</span>
              </a>
            </div>
          </FadeUp>
        )}
      </div>
    </section>
  );
}

function FaqList({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
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
