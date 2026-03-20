import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { getFeaturedDppsByBrand, getBrandEngagement } from "@/lib/collective/fetch";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { CollectiveBrandGrid } from "@/components/collective/CollectiveBrandGrid";

export const revalidate = 300;

interface PageProps {
  params: { brandSlug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { brandSlug } = params;
  const result = await getFeaturedDppsByBrand(brandSlug);

  if (!result) return { title: "Brand Not Found | ENVRT" };

  const title = `${result.brand.name} | ENVRT Collective`;
  const description = `Explore ${result.cards.length} Digital Product Passport${result.cards.length !== 1 ? "s" : ""} from ${result.brand.name} on ENVRT.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://envrt.com/collective/${brandSlug}`,
      type: "website",
    },
    alternates: {
      canonical: `https://envrt.com/collective/${brandSlug}`,
    },
  };
}

export default async function BrandProfilePage({ params }: PageProps) {
  const { brandSlug } = params;
  const result = await getFeaturedDppsByBrand(brandSlug);

  if (!result) notFound();

  const { cards, brand } = result;
  const brandLogoUrl = cards[0]?.brandLogoUrl;

  const [engagement] = await Promise.all([
    getBrandEngagement(brand.id),
  ]);

  const withEmissions = cards.filter((c) => c.dpp.total_emissions != null);
  const withWater = cards.filter((c) => c.dpp.total_water != null);
  const withTrace = cards.filter((c) => c.dpp.transparency_score != null);

  return (
    <>
    <BreadcrumbJsonLd
      items={[
        { name: "Home", url: "https://envrt.com" },
        { name: "The Collective", url: "https://envrt.com/collective" },
        { name: brand.name, url: `https://envrt.com/collective/${brandSlug}` },
      ]}
    />
    <div className="pt-28 pb-16">
      <Container>
        <Link
          href="/collective"
          className="inline-flex items-center gap-1 text-sm text-envrt-muted transition-colors hover:text-envrt-charcoal"
        >
          <span>&larr;</span>
          Back to The Collective
        </Link>

        {/* Brand header */}
        <div className="mt-8 flex items-center gap-5">
          {brandLogoUrl && (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-envrt-charcoal/5 bg-white p-2">
              <Image
                src={brandLogoUrl}
                alt={brand.name}
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-envrt-charcoal sm:text-4xl">
                {brand.name}
              </h1>
            </div>
            <p className="mt-1 text-sm text-envrt-muted">
              {cards.length} featured product{cards.length !== 1 ? "s" : ""} on ENVRT
            </p>
          </div>
        </div>

        {/* Brand description + website */}
        {(brand.description || brand.website_url) && (
          <div className="mt-4">
            {brand.description && (
              <p className="max-w-2xl text-sm leading-relaxed text-envrt-muted">
                {brand.description}
              </p>
            )}
            {brand.website_url && (
              <a
                href={brand.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-envrt-teal transition-colors hover:text-envrt-green"
              >
                {brand.website_url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            )}
          </div>
        )}

        {/* Aggregate stats + engagement */}
        <div className="mt-6 flex flex-wrap gap-3">
          {withEmissions.length > 0 && (
            <div className="rounded-xl border border-envrt-charcoal/5 bg-white px-4 py-3">
              <p className="text-[10px] font-medium uppercase tracking-widest text-envrt-muted">
                Avg CO₂e
              </p>
              <p className="mt-1 text-lg font-semibold text-envrt-green">
                {(
                  withEmissions.reduce(
                    (sum, c) => sum + c.dpp.total_emissions!,
                    0
                  ) / withEmissions.length
                ).toFixed(1)}{" "}
                kg
              </p>
            </div>
          )}
          {withWater.length > 0 && (
            <div className="rounded-xl border border-envrt-charcoal/5 bg-white px-4 py-3">
              <p className="text-[10px] font-medium uppercase tracking-widest text-envrt-muted">
                Avg Water
              </p>
              <p className="mt-1 text-lg font-semibold text-blue-700">
                {(
                  withWater.reduce((sum, c) => sum + c.dpp.total_water!, 0) /
                  withWater.length
                ).toFixed(1)}{" "}
                L
              </p>
            </div>
          )}
          {withTrace.length > 0 && (
            <div className="rounded-xl border border-envrt-charcoal/5 bg-white px-4 py-3">
              <p className="text-[10px] font-medium uppercase tracking-widest text-envrt-muted">
                Avg Transparency
              </p>
              <p className="mt-1 text-lg font-semibold text-envrt-teal">
                {Math.round(
                  withTrace.reduce(
                    (sum, c) => sum + c.dpp.transparency_score!,
                    0
                  ) / withTrace.length
                )}
                %
              </p>
            </div>
          )}
          {engagement.totalViews > 0 && (
            <div className="rounded-xl border border-envrt-charcoal/5 bg-white px-4 py-3">
              <p className="text-[10px] font-medium uppercase tracking-widest text-envrt-muted">
                DPP Views
              </p>
              <p className="mt-1 text-lg font-semibold text-envrt-charcoal">
                {engagement.totalViews.toLocaleString()}
              </p>
            </div>
          )}
          {engagement.monthlyViews > 0 && (
            <div className="rounded-xl border border-envrt-charcoal/5 bg-white px-4 py-3">
              <p className="text-[10px] font-medium uppercase tracking-widest text-envrt-muted">
                This Month
              </p>
              <p className="mt-1 text-lg font-semibold text-envrt-charcoal">
                {engagement.monthlyViews.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Product grid — reuses the same CollectiveCard from the main page */}
        <div className="mt-10">
          <CollectiveBrandGrid cards={cards} />
        </div>
      </Container>
    </div>
    </>
  );
}
