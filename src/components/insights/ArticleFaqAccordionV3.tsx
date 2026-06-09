"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_BRAND } from "@/components/sections/v3/_shared";

type Item = { question: string; answer: string };

export function ArticleFaqAccordionV3({ items }: { items: Item[] }) {
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
              type="button"
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
