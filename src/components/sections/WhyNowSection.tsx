"use client";

import { Container } from "../ui/Container";
import { FadeUp, StaggerChildren, StaggerItem } from "../ui/Motion";
import { whyNowCards } from "@/lib/config";

export function WhyNowSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24" id="why-now">
      <Container>
        <FadeUp>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-envrt-charcoal sm:text-4xl">
              The world is changing. Are your products keeping up?
            </h2>
            <p className="mt-4 text-base text-envrt-muted sm:text-lg">
              Fashion brands face new expectations from regulators, retailers, and
              consumers. Here&apos;s why acting now matters.
            </p>
          </div>
        </FadeUp>

        <StaggerChildren className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyNowCards.map((card) => (
            <StaggerItem key={card.title}>
              <div className="group rounded-2xl border border-envrt-charcoal/5 bg-white p-6 transition-all duration-300 hover:border-envrt-teal/20 hover:shadow-lg hover:shadow-envrt-teal/5">
                <span className="text-2xl">{card.icon}</span>
                <h3 className="mt-4 text-base font-semibold text-envrt-charcoal">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-envrt-muted">
                  {card.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Container>
    </section>
  );
}
