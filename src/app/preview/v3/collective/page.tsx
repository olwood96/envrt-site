import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero, ButtonV3 } from "@/components/v3";
import {
  Eyebrow,
  SectionCorners,
} from "@/components/sections/v3/_shared";
import { FadeUp } from "@/components/ui/Motion";
import { FinalCtaV3 } from "@/components/sections/v3/FinalCtaV3";
import { CollectiveGridV3 } from "@/components/v3/collective/CollectiveGridV3";
import { CollectiveSubscribeV3 } from "@/components/v3/collective/CollectiveSubscribeV3";
import { getFeaturedDpps } from "@/lib/collective/fetch";

export const metadata: Metadata = {
  title: "Collective v3 preview",
  robots: { index: false, follow: false },
};

export const revalidate = 300;

export default async function CollectiveV3Page() {
  const { cards, filters } = await getFeaturedDpps();

  return (
    <main>
      <PageHero
        eyebrow="The Collective"
        heading={
          <>
            Transparency, in product form.{" "}
            <span className="text-envrt-brand-black/40">
              Real DPPs from real brands.
            </span>
          </>
        }
        body="Every product here ships with a Digital Product Passport. Click any card to open the full passport in place, or compare products from the same brand side by side."
        actions={
          <>
            <ButtonV3 href="/preview/v3/free-dpp" variant="primary">
              Get your brand featured<span>→</span>
            </ButtonV3>
            <ButtonV3 href="/preview/v3/about" variant="ghost">
              How the Collective works<span>→</span>
            </ButtonV3>
          </>
        }
        cornerLeft="ENVRT/01"
        cornerRight="Collective"
      />

      <GridSection cards={cards} filters={filters} />

      <SubscribeCtaSection />

      <FinalCtaV3 />
    </main>
  );
}

function GridSection({
  cards,
  filters,
}: {
  cards: Awaited<ReturnType<typeof getFeaturedDpps>>["cards"];
  filters: Awaited<ReturnType<typeof getFeaturedDpps>>["filters"];
}) {
  return (
    <section className="relative bg-envrt-brand-vista pb-20 sm:pb-24 lg:pb-32">
      <SectionCorners left="ENVRT/02" right="Featured DPPs" />
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-16">
        <div className="border-t border-envrt-brand-black/8 pt-12 sm:pt-16">
          <FadeUp>
            <Eyebrow>02 · Browse</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="mt-4 max-w-2xl font-display text-2xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-3xl lg:text-4xl">
              Featured products from every brand using ENVRT.
            </h2>
          </FadeUp>

          {cards.length === 0 ? (
            <FadeUp delay={0.16}>
              <div className="mt-14 rounded-3xl border border-dashed border-envrt-brand-black/12 bg-white py-20 text-center">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55 sm:text-[11px]">
                  Coming soon
                </p>
                <p className="mt-3 max-w-md mx-auto px-6 text-base text-envrt-brand-black/65">
                  No featured products yet. Check back soon, or get your brand
                  featured.
                </p>
                <div className="mt-6">
                  <ButtonV3 href="/preview/v3/free-dpp" variant="primary">
                    Get featured<span>→</span>
                  </ButtonV3>
                </div>
              </div>
            </FadeUp>
          ) : (
            <FadeUp delay={0.16}>
              <div className="mt-10">
                <Suspense>
                  <CollectiveGridV3 cards={cards} filters={filters} />
                </Suspense>
              </div>
            </FadeUp>
          )}
        </div>
      </div>
    </section>
  );
}

function SubscribeCtaSection() {
  return (
    <section className="relative bg-envrt-brand-vista pb-20 sm:pb-24 lg:pb-32">
      <SectionCorners left="ENVRT/03" right="Newsletter" />
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-16">
        <div className="border-t border-envrt-brand-black/8 pt-14 sm:pt-16">
          <FadeUp>
            <Eyebrow>03 · Updates</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <div className="mt-8">
              <Suspense>
                <CollectiveSubscribeV3 variant="cta" />
              </Suspense>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
