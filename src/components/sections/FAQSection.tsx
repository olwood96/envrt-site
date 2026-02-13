"use client";

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
        </div>
      </Container>
    </section>
  );
}
