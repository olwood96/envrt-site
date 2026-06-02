"use client";

import { Container } from "../../ui/Container";
import { FadeUp, StaggerChildren, StaggerItem } from "../../ui/Motion";

type Point = {
  id: number;
  heading: string;
  body: string;
};

const points: Point[] = [
  {
    id: 1,
    heading: "The mandate is dated.",
    body: "EU ESPR textile delegated acts enforce from 2027. Textiles is among the first product categories named under the regulation.",
  },
  {
    id: 2,
    heading: "France is already live.",
    body: "AGEC environmental display rules already require fashion brands to publish per-product environmental data. Scaling each year through 2030.",
  },
  {
    id: 3,
    heading: "Retailers move first.",
    body: "Major EU retailers and platforms are asking for product-level impact data ahead of the mandate. Late movers pay a premium when demand surges in 2026 to 2027.",
  },
];

export function WhyNowV2() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24" id="why-now">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <FadeUp>
            <div className="lg:sticky lg:top-24">
              <p className="text-xs font-medium uppercase tracking-widest text-envrt-teal">
                Why now
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-envrt-charcoal sm:text-4xl">
                Three reasons brands are moving on DPPs this year, not next.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-envrt-muted sm:text-lg">
                The regulation arrives in 2027, but the buying window is already open. Early movers lock in suppliers, methodology and audit trails while late movers pay catch-up.
              </p>
            </div>
          </FadeUp>

          <StaggerChildren className="space-y-10" staggerDelay={0.12}>
            {points.map((p) => (
              <StaggerItem key={p.id}>
                <div className="flex gap-5">
                  <span className="text-2xl font-bold leading-none text-envrt-teal sm:text-3xl">
                    {String(p.id).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-envrt-charcoal sm:text-xl">
                      {p.heading}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-envrt-muted sm:text-base">
                      {p.body}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </Container>
    </section>
  );
}
