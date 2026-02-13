"use client";

import { Container } from "../ui/Container";
import { FadeUp, StaggerChildren, StaggerItem } from "../ui/Motion";
import { outcomeCards } from "@/lib/config";

export function OutcomesSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24" id="outcomes">
      <Container>
        <FadeUp>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-envrt-teal">
              What you get
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-envrt-charcoal sm:text-4xl">
              Better data. Better decisions. Better products.
            </h2>
          </div>
        </FadeUp>

        <StaggerChildren className="mt-14 grid gap-5 sm:grid-cols-2">
          {outcomeCards.map((card) => (
            <StaggerItem key={card.title}>
              <div className="group relative overflow-hidden rounded-2xl border border-envrt-charcoal/5 bg-white p-8 transition-all duration-300 hover:border-envrt-teal/20 hover:shadow-lg hover:shadow-envrt-teal/5 sm:p-10">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-envrt-green/5 text-xl font-semibold text-envrt-green transition-colors group-hover:bg-envrt-teal/10 group-hover:text-envrt-teal">
                  {card.icon}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-envrt-charcoal">
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
