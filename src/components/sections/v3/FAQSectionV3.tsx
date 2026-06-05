"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { FadeUp } from "@/components/ui/Motion";
import { faqItems } from "@/lib/config";

// V3-styled FAQ. Inline accordion (instead of the shared Accordion component)
// so the styling stays scoped to v3 brand rules.

export function FAQSectionV3() {
  return (
    <section id="faq" className="relative bg-envrt-brand-vista py-20 sm:py-24 lg:py-28">
      {/* Construction marks */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-4 top-6 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/25 sm:left-6"
      >
        ENVRT/FAQ
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 top-6 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/25 sm:right-6"
      >
        Q
      </span>

      <Container>
        <div className="mx-auto max-w-2xl">
          <FadeUp>
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine sm:text-[11px]">
                FAQ
              </p>
              <h2 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight text-envrt-brand-black sm:text-4xl">
                Common questions.
              </h2>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="mt-12">
              <FaqList />
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="mt-10 text-center">
              <Link
                href="/faq"
                className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black underline-offset-4 transition-colors hover:text-envrt-brand-ultramarine hover:underline sm:text-xs"
              >
                See all FAQs
                <span aria-hidden>→</span>
              </Link>
            </div>
          </FadeUp>
        </div>
      </Container>
    </section>
  );
}

function FaqList() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div>
      {faqItems.map((item, i) => {
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
                  isOpen ? "rotate-45 border-envrt-brand-ultramarine text-envrt-brand-ultramarine" : "text-envrt-brand-black/65"
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
