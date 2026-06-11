import type { Metadata } from "next";
import Image from "next/image";
import { PageHero, ButtonV3 } from "@/components/v3";
import {
  Eyebrow,
  SectionCorners,
} from "@/components/sections/v3/_shared";
import { FadeUp } from "@/components/ui/Motion";
import { FinalCtaV3 } from "@/components/sections/v3/FinalCtaV3";

export const metadata: Metadata = {
  title: "About v3 preview",
  robots: { index: false, follow: false },
};

export default function AboutV3Page() {
  return (
    <main className="theme-lilac">
      <PageHero
        tone="lilac"
        eyebrow="About"
        heading={
          <>
            Fashion&apos;s environmental work deserves better tools.{" "}
            <span className="text-envrt-brand-black/40">
              So we built them.
            </span>
          </>
        }
        body="ENVRT is an environmental platform for fashion. We measure what brands make, prove what they claim and publish what they can show. One product, end to end."
        actions={
          <>
            <ButtonV3 href="/preview/v3/free-dpp" variant="primary">
              Try ENVRT on one garment<span>→</span>
            </ButtonV3>
            <ButtonV3 href="/preview/v3/team" variant="ghost">
              Meet the team<span>→</span>
            </ButtonV3>
          </>
        }
        cornerLeft="ENVRT/01"
        cornerRight="About"
      >
        {/* Editorial header strip — sits between the hero copy and the
            manifesto body. Establishes the "real product, real materials"
            mood before we start talking about the platform. */}
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl ring-1 ring-envrt-brand-black/10">
          <Image
            src="/v3-assets/folded-clothes.jpg"
            alt="Folded knitwear, editorial"
            fill
            sizes="(min-width: 1024px) 1200px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      </PageHero>

      <ManifestoSection />
      <ProblemSection />
      <ApproachSection />
      <StorySection />
      <PrinciplesSection />

      <FinalCtaV3 />
    </main>
  );
}

function ManifestoSection() {
  return (
    <section className="relative bg-envrt-brand-vista pb-20 sm:pb-24 lg:pb-32">
      <SectionCorners left="ENVRT/02" right="Manifesto" />
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-16">
        <div className="border-t border-envrt-brand-black/8 pt-14 sm:pt-16">
          <FadeUp>
            <Eyebrow>02 · Manifesto</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <p className="mt-6 max-w-3xl font-display text-2xl font-medium leading-[1.25] tracking-[-0.02em] text-envrt-brand-black sm:text-3xl lg:text-[2.25rem]">
              Most sustainability software for fashion is built to generate
              the report at the end.{" "}
              <span className="text-envrt-brand-black/45">
                We build for the work that happens before the report.
              </span>
            </p>
          </FadeUp>
          <FadeUp delay={0.16}>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-envrt-brand-black/70 sm:text-lg">
              The receipt is the easy part. The hard part is the supply chain
              mapping, the data collection, the calculation, the reconciliation
              with what marketing wants to say. ENVRT does that work alongside
              the people doing it, then publishes the result.
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const items = [
    {
      title: "Consultants are slow and expensive.",
      body: "A single LCA report from a consultancy is expensive and slow. Brands need product-level data across an entire collection, not one report a year.",
    },
    {
      title: "Most software stops at the dashboard.",
      body: "Carbon accounting tools tell you your footprint. They do not help you build a public-facing DPP that holds up under the Green Claims Directive.",
    },
    {
      title: "Marketing moves before the data lands.",
      body: "Claims like “eco-friendly” get written before the sustainability team has confirmed what is provable. The fix is to put both teams on the same numbers.",
    },
  ];

  return (
    <section className="relative bg-[rgba(223,95,255,0.08)] pb-20 sm:pb-24 lg:pb-32">
      <SectionCorners left="ENVRT/03" right="Problem" />
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-16">
        <div className="border-t border-envrt-brand-black/8 pt-14 sm:pt-16">
          <FadeUp>
            <Eyebrow>03 · What is broken</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="mt-4 max-w-2xl font-display text-2xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-3xl lg:text-4xl">
              Three things keep brands stuck in last year&apos;s data.
            </h2>
          </FadeUp>

          <div className="mt-12 grid gap-6 sm:grid-cols-3 sm:gap-8">
            {items.map((item, i) => (
              <FadeUp key={item.title} delay={0.16 + i * 0.06}>
                <div className="flex h-full flex-col rounded-3xl border border-envrt-brand-black/10 bg-white p-7 sm:p-8">
                  <span
                    aria-hidden
                    className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine sm:text-[11px]"
                  >
                    {`0${i + 1}`}
                  </span>
                  <h3 className="mt-5 font-display text-lg font-medium leading-tight tracking-tight text-envrt-brand-black sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-envrt-brand-black/70 sm:text-[15px]">
                    {item.body}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ApproachSection() {
  return (
    <section className="relative bg-envrt-brand-vista pb-20 sm:pb-24 lg:pb-32">
      <SectionCorners left="ENVRT/04" right="Approach" />
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-16">
        <div className="border-t border-envrt-brand-black/8 pt-14 sm:pt-16">
          <FadeUp>
            <Eyebrow>04 · How we work</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="mt-4 max-w-2xl font-display text-2xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-3xl lg:text-4xl">
              One platform, from supply chain map to public DPP.
            </h2>
          </FadeUp>

          <FadeUp delay={0.16}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-envrt-brand-black/70 sm:text-lg">
              We do not stop at carbon and we do not stop at the dashboard. The
              same product that calculates a garment&apos;s footprint also publishes
              the consumer-facing passport, with the data, the methodology and
              the sources visible in one place.
            </p>
          </FadeUp>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {[
              {
                index: "01",
                title: "Methodology first",
                body: "Aligned with PEFCR for apparel and footwear, ISO 14040 and the French Eco-Score. Sources are documented at the factor level.",
              },
              {
                index: "02",
                title: "Built for product teams",
                body: "Brands map suppliers, upload collection data and review results in the same tool. No consultant intermediary, no offline spreadsheets.",
              },
              {
                index: "03",
                title: "Outputs that read like records",
                body: "Every DPP shows the data behind the number. Every comparison shows the boundary. Marketing and sustainability work from one source.",
              },
              {
                index: "04",
                title: "Priced to scale with collections",
                body: "From a single garment up to full collections, the platform charges by what is published, not by how many reports get printed.",
              },
            ].map((item, i) => (
              <FadeUp key={item.index} delay={0.2 + i * 0.05}>
                <div className="flex h-full gap-5 rounded-2xl border border-envrt-brand-black/8 bg-white p-6 sm:p-7">
                  <span
                    aria-hidden
                    className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine sm:text-[11px]"
                  >
                    {item.index}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-medium leading-tight tracking-tight text-envrt-brand-black sm:text-xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-envrt-brand-black/70 sm:text-[15px]">
                      {item.body}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StorySection() {
  return (
    <section className="relative bg-[rgba(223,95,255,0.08)] pb-20 sm:pb-24 lg:pb-32">
      <SectionCorners left="ENVRT/05" right="Founding story" />
      <div className="mx-auto max-w-[900px] px-5 sm:px-8 lg:px-16">
        <div className="border-t border-envrt-brand-black/8 pt-14 sm:pt-16">
          <FadeUp>
            <Eyebrow>05 · Founding story</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="mt-4 font-display text-2xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-3xl lg:text-4xl">
              Started by an environmental engineer and an astrophysicist.
              Built for fashion teams who want to stop guessing.
            </h2>
          </FadeUp>

          <div className="mt-10 space-y-6 text-base leading-relaxed text-envrt-brand-black/75 sm:text-lg">
            <FadeUp delay={0.16}>
              <p>
                Charlie spent years leading sustainability strategy on complex
                infrastructure projects. The numbers were detailed, the
                workflow was structured and the audit trail was complete.
                When he looked at fashion, none of that existed.
              </p>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p>
                Oliver came at it from the data side. After years building
                computational pipelines for scientific research, the gap was
                obvious. Fashion&apos;s environmental data was either too coarse
                to act on or too expensive to produce at collection scale.
              </p>
            </FadeUp>
            <FadeUp delay={0.24}>
              <p>
                ENVRT exists to close that gap. The same calculation engine
                that handles a single trial garment scales to a full
                collection, and the same passport that shows a consumer the
                story shows a regulator the methodology.
              </p>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

function PrinciplesSection() {
  const items = [
    {
      heading: "Show the working",
      body: "Every figure on a DPP links back to the factor, the method and the source. No black boxes.",
    },
    {
      heading: "Defensible by default",
      body: "We use descriptive verbs not endorsement verbs. We follow PEFCR. We do not invent claims to make a brand look better.",
    },
    {
      heading: "Affordable at scale",
      body: "A single LCA at consultant rates buys a year of full-collection ENVRT. The maths only works for brands if the tool does too.",
    },
    {
      heading: "Built with sustainability teams",
      body: "Every workflow gets pressure-tested with the people who will live in the tool. We ship what gets used, not what looks good in a deck.",
    },
  ];

  return (
    <section className="relative bg-envrt-brand-vista pb-20 sm:pb-24 lg:pb-32">
      <SectionCorners left="ENVRT/06" right="Principles" />
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-16">
        <div className="border-t border-envrt-brand-black/8 pt-14 sm:pt-16">
          <FadeUp>
            <Eyebrow>06 · Principles</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="mt-4 max-w-2xl font-display text-2xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-3xl lg:text-4xl">
              Four rules that shape every decision.
            </h2>
          </FadeUp>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {items.map((item, i) => (
              <FadeUp key={item.heading} delay={0.16 + i * 0.05}>
                <div className="rounded-2xl border border-envrt-brand-black/10 bg-white p-7 sm:p-8">
                  <h3 className="font-display text-lg font-medium leading-tight tracking-tight text-envrt-brand-black sm:text-xl">
                    {item.heading}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-envrt-brand-black/70 sm:text-[15px]">
                    {item.body}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
