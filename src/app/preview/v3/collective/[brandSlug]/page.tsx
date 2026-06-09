import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  Eyebrow,
  SectionCorners,
  DotGridBackground,
} from "@/components/sections/v3/_shared";
import { FadeUp } from "@/components/ui/Motion";
import { ButtonV3 } from "@/components/v3";
import { FinalCtaV3 } from "@/components/sections/v3/FinalCtaV3";
import { CollectiveBrandGridV3 } from "@/components/v3/collective/CollectiveBrandGridV3";
import CollectiveBeacon from "@/components/CollectiveBeacon";
import {
  getFeaturedDppsByBrand,
  getBrandEngagement,
} from "@/lib/collective/fetch";
import type {
  CollectiveBrand,
  CollectiveCardData,
} from "@/lib/collective/types";

export const revalidate = 300;

interface PageProps {
  params: { brandSlug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { brandSlug } = params;
  const result = await getFeaturedDppsByBrand(brandSlug);
  if (!result) return { title: "Brand not found | v3 preview" };

  return {
    title: `${result.brand.name} | Collective v3 preview`,
    description: `${result.cards.length} Digital Product Passport${
      result.cards.length !== 1 ? "s" : ""
    } from ${result.brand.name}.`,
    robots: { index: false, follow: false },
  };
}

export default async function BrandProfileV3Page({ params }: PageProps) {
  const { brandSlug } = params;
  const result = await getFeaturedDppsByBrand(brandSlug);
  if (!result) notFound();

  const { cards, brand } = result;
  const engagement = await getBrandEngagement(brand.id);

  return (
    <main>
      <CollectiveBeacon brandId={brand.id} brandSlug={brandSlug} />

      <BrandHero brand={brand} cards={cards} />
      <StatsSection
        cards={cards}
        engagement={engagement}
      />
      <ProductsSection cards={cards} brand={brand} />

      <FinalCtaV3 />
    </main>
  );
}

function BrandHero({
  brand,
  cards,
}: {
  brand: CollectiveBrand;
  cards: CollectiveCardData[];
}) {
  const brandLogoUrl = cards[0]?.brandLogoUrl;
  const cleanWebsite = brand.website_url
    ?.replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  return (
    <section className="relative overflow-hidden bg-envrt-brand-vista py-20 sm:py-28 lg:py-32">
      <DotGridBackground opacity={0.04} size={22} />
      <SectionCorners left="ENVRT/01" right={brand.name} />

      <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-16">
        <FadeUp>
          <Link
            href="/preview/v3/collective"
            className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55 transition-colors duration-200 hover:text-envrt-brand-ultramarine sm:text-[11px]"
          >
            <span aria-hidden>←</span>
            All brands
          </Link>
        </FadeUp>

        <div className="mt-8 grid gap-8 lg:grid-cols-[auto,1fr] lg:items-center lg:gap-12">
          {brandLogoUrl && (
            <FadeUp delay={0.04}>
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-envrt-brand-black/10 bg-white p-4 shadow-[0_18px_40px_-22px_rgba(14,14,14,0.18)] sm:h-28 sm:w-28">
                <div className="relative h-full w-full">
                  <Image
                    src={brandLogoUrl}
                    alt={brand.name}
                    fill
                    sizes="112px"
                    className="object-contain"
                  />
                </div>
              </div>
            </FadeUp>
          )}

          <div className="max-w-3xl">
            <FadeUp delay={0.08}>
              <Eyebrow>{`${cards.length} featured ${
                cards.length === 1 ? "product" : "products"
              }`}</Eyebrow>
            </FadeUp>
            <FadeUp delay={0.12}>
              <h1 className="mt-5 font-display text-4xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-5xl lg:text-[3.5rem]">
                {brand.name}
              </h1>
            </FadeUp>
            {brand.description && (
              <FadeUp delay={0.2}>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-envrt-brand-black/70 sm:text-lg">
                  {brand.description}
                </p>
              </FadeUp>
            )}

            <FadeUp delay={0.28}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {cleanWebsite && brand.website_url && (
                  <a
                    href={brand.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-envrt-brand-ultramarine px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_-14px_rgba(62,0,255,0.7)] transition-all duration-200 hover:bg-envrt-brand-ultramarine/90 sm:px-6 sm:py-3 sm:text-base"
                  >
                    {cleanWebsite}<span aria-hidden>↗</span>
                  </a>
                )}
                <ButtonV3
                  href="/preview/v3/collective"
                  variant="ghost"
                >
                  Browse all brands<span aria-hidden>→</span>
                </ButtonV3>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection({
  cards,
  engagement,
}: {
  cards: CollectiveCardData[];
  engagement: { totalViews: number; monthlyViews: number };
}) {
  const withEmissions = cards.filter((c) => c.dpp.total_emissions != null);
  const withWater = cards.filter((c) => c.dpp.total_water != null);
  const withTrace = cards.filter((c) => c.dpp.transparency_score != null);

  const stats: { label: string; value: string; hint: string }[] = [];

  if (withEmissions.length > 0) {
    const avg =
      withEmissions.reduce((sum, c) => sum + c.dpp.total_emissions!, 0) /
      withEmissions.length;
    stats.push({
      label: "Avg CO₂e",
      value: `${avg.toFixed(1)} kg`,
      hint: `${withEmissions.length} ${
        withEmissions.length === 1 ? "product" : "products"
      } measured`,
    });
  }
  if (withWater.length > 0) {
    const avg =
      withWater.reduce((sum, c) => sum + c.dpp.total_water!, 0) /
      withWater.length;
    stats.push({
      label: "Avg water",
      value: `${avg.toFixed(1)} L`,
      hint: `${withWater.length} ${
        withWater.length === 1 ? "product" : "products"
      } measured`,
    });
  }
  if (withTrace.length > 0) {
    const avg =
      withTrace.reduce((sum, c) => sum + c.dpp.transparency_score!, 0) /
      withTrace.length;
    stats.push({
      label: "Avg traceable",
      value: `${Math.round(avg)}%`,
      hint: `${withTrace.length} ${
        withTrace.length === 1 ? "product" : "products"
      } scored`,
    });
  }
  if (engagement.totalViews > 0) {
    stats.push({
      label: "Total DPP views",
      value: engagement.totalViews.toLocaleString(),
      hint: "All time",
    });
  }
  if (engagement.monthlyViews > 0) {
    stats.push({
      label: "This month",
      value: engagement.monthlyViews.toLocaleString(),
      hint: "DPP views",
    });
  }

  if (stats.length === 0) return null;

  return (
    <section className="relative bg-envrt-brand-vista pb-20 sm:pb-24">
      <SectionCorners left="ENVRT/02" right="Aggregate stats" />
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-16">
        <div className="border-t border-envrt-brand-black/8 pt-12 sm:pt-16">
          <FadeUp>
            <Eyebrow>02 · Brand at a glance</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="mt-4 max-w-2xl font-display text-2xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-3xl lg:text-4xl">
              The numbers across every featured product.
            </h2>
          </FadeUp>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {stats.map((stat, i) => (
              <FadeUp key={stat.label} delay={Math.min(0.16 + i * 0.05, 0.4)}>
                <div className="flex h-full flex-col rounded-2xl border border-envrt-brand-black/10 bg-white p-5 sm:p-6">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine sm:text-[11px]">
                    {stat.label}
                  </p>
                  <p className="mt-3 font-display text-2xl font-medium leading-none tracking-tight text-envrt-brand-black sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-envrt-brand-black/55">
                    {stat.hint}
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

function ProductsSection({
  cards,
  brand,
}: {
  cards: CollectiveCardData[];
  brand: CollectiveBrand;
}) {
  return (
    <section className="relative bg-envrt-brand-vista pb-20 sm:pb-24 lg:pb-32">
      <SectionCorners
        left="ENVRT/03"
        right={`${cards.length} ${cards.length === 1 ? "product" : "products"}`}
      />
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-16">
        <div className="border-t border-envrt-brand-black/8 pt-12 sm:pt-16">
          <FadeUp>
            <Eyebrow>03 · Featured products</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="mt-4 max-w-2xl font-display text-2xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-3xl lg:text-4xl">
              {`Every ${brand.name} DPP, in one place.`}
            </h2>
          </FadeUp>

          <FadeUp delay={0.16}>
            <div className="mt-10">
              <CollectiveBrandGridV3 cards={cards} />
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
