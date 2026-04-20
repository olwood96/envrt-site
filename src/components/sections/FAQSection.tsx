"use client";

import Link from "next/link";
import { Container } from "../ui/Container";
import { Accordion } from "../ui/Accordion";
import { FadeUp } from "../ui/Motion";
import { faqItems } from "@/lib/config";

export function FAQSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24" id="faq">
      <Container>
        <div className="mx-auto max-w-2xl">
          <FadeUp>
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-envrt-teal">
                FAQ
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-envrt-charcoal sm:text-4xl">
                Common questions
              </h2>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="mt-12">
              <Accordion items={faqItems} />
            </div>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="mt-8 text-center">
              <Link
                href="/faq"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-envrt-teal transition-colors hover:text-envrt-teal/80"
              >
                See all FAQs
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </FadeUp>
        </div>
      </Container>
    </section>
  );
}
