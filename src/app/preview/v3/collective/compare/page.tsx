import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Eyebrow,
  SectionCorners,
  DotGridBackground,
} from "@/components/sections/v3/_shared";
import { FadeUp } from "@/components/ui/Motion";
import { ButtonV3 } from "@/components/v3";
import { FinalCtaV3 } from "@/components/sections/v3/FinalCtaV3";
import {
  CollectiveComparisonViewV3,
  ComparisonShareButtonV3,
} from "@/components/v3/collective/CollectiveComparisonViewV3";
import { getFeaturedDpp } from "@/lib/collective/fetch";
import type { CollectiveCardData } from "@/lib/collective/types";

export const metadata: Metadata = {
  title: "Compare v3 preview",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: { products?: string };
}

export default async function CompareV3Page({ searchParams }: PageProps) {
  const { products } = searchParams;
  if (!products) notFound();

  const entries = products.split(",").filter(Boolean);
  if (entries.length < 2 || entries.length > 3) notFound();

  const cards: (CollectiveCardData | null)[] = await Promise.all(
    entries.map(async (entry) => {
      const parts = entry.split("/");
      if (parts.length < 3) return null;
      const brandSlug = parts[0];
      const productSku = decodeURIComponent(parts[parts.length - 1]);
      const brandSlugDecoded = decodeURIComponent(brandSlug);
      return getFeaturedDpp(brandSlugDecoded, productSku);
    }),
  );

  const validCards = cards.filter(
    (c): c is CollectiveCardData => c != null,
  );
  if (validCards.length < 2) notFound();

  const brandIds = new Set(validCards.map((c) => c.brand.id));
  if (brandIds.size > 1) notFound();

  const brand = validCards[0].brand;

  return (
    <main>
      <CompareHero brandName={brand.name} count={validCards.length} />
      <ComparisonSection cards={validCards} />
      <FinalCtaV3 />
    </main>
  );
}

function CompareHero({
  brandName,
  count,
}: {
  brandName: string;
  count: number;
}) {
  return (
    <section className="relative overflow-hidden bg-envrt-brand-vista py-20 sm:py-24 lg:py-28">
      <DotGridBackground opacity={0.04} size={22} />
      <SectionCorners left="ENVRT/01" right="Compare" />

      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-16">
        <FadeUp>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <Link
              href="/preview/v3/collective"
              className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55 transition-colors duration-200 hover:text-envrt-brand-ultramarine sm:text-[11px]"
            >
              <span aria-hidden>←</span>
              Back to The Collective
            </Link>
            <ComparisonShareButtonV3 />
          </div>
        </FadeUp>

        <div className="mt-8 max-w-3xl">
          <FadeUp delay={0.04}>
            <Eyebrow>{brandName}</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h1 className="mt-5 font-display text-4xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-5xl lg:text-[3.25rem]">
              Side by side.{" "}
              <span className="text-envrt-brand-black/40">
                Same brand, same scale.
              </span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.16}>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-envrt-brand-black/70 sm:text-lg">
              Comparing {count} products head to head. Lower-is-better metrics
              are marked when one product wins. Hover any metric label for a
              plain explanation of what it covers.
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function ComparisonSection({ cards }: { cards: CollectiveCardData[] }) {
  return (
    <section className="relative bg-envrt-brand-vista pb-20 sm:pb-28">
      <SectionCorners left="ENVRT/02" right="Comparison" />
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-16">
        <div className="border-t border-envrt-brand-black/8 pt-12 sm:pt-16">
          <FadeUp>
            <Eyebrow>02 · Head to head</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="mt-4 max-w-2xl font-display text-2xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-3xl lg:text-4xl">
              {`Same metrics, same scope, no spin.`}
            </h2>
          </FadeUp>

          <FadeUp delay={0.16}>
            <div className="mt-10">
              <CollectiveComparisonViewV3 cards={cards} />
            </div>
          </FadeUp>

          <FadeUp delay={0.24}>
            <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <ButtonV3 href="/preview/v3/collective" variant="primary">
                Browse the Collective<span aria-hidden>→</span>
              </ButtonV3>
              <ButtonV3 href="/preview/v3/free-dpp" variant="ghost">
                Get your brand featured<span aria-hidden>→</span>
              </ButtonV3>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
