import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { getFeaturedDppsByBrand } from "@/lib/collective/fetch";

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

  const withEmissions = cards.filter((c) => c.dpp.total_emissions != null);
  const withWater = cards.filter((c) => c.dpp.total_water != null);
  const withTrace = cards.filter((c) => c.dpp.traceability_score != null);

  return (
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
            <h1 className="text-3xl font-bold tracking-tight text-envrt-charcoal sm:text-4xl">
              {brand.name}
            </h1>
            <p className="mt-1 text-sm text-envrt-muted">
              {cards.length} featured product{cards.length !== 1 ? "s" : ""} on
              ENVRT
            </p>
          </div>
        </div>

        {/* Aggregate stats */}
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
                Avg Traceability
              </p>
              <p className="mt-1 text-lg font-semibold text-envrt-teal">
                {Math.round(
                  withTrace.reduce(
                    (sum, c) => sum + c.dpp.traceability_score!,
                    0
                  ) / withTrace.length
                )}
                %
              </p>
            </div>
          )}
        </div>

        {/* Product grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.dpp.id}
              href={card.detailUrl}
              className="group overflow-hidden rounded-2xl border border-envrt-charcoal/5 bg-white transition-all duration-300 hover:border-envrt-teal/20 hover:shadow-lg hover:shadow-envrt-teal/5"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-envrt-cream/40">
                {card.productImageUrl ? (
                  <Image
                    src={card.productImageUrl}
                    alt={card.dpp.garment_name}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-envrt-muted/40">
                    <svg
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="truncate text-sm font-semibold text-envrt-charcoal group-hover:text-envrt-green">
                  {card.dpp.garment_name}
                </h3>
                <p className="mt-0.5 text-xs text-envrt-muted">
                  {card.dpp.collection_name}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {card.dpp.total_emissions != null && (
                    <span className="rounded-full bg-envrt-green/5 px-2 py-0.5 text-[10px] font-medium text-envrt-green">
                      {card.dpp.total_emissions.toFixed(1)} kg CO₂e
                    </span>
                  )}
                  {card.dpp.total_water != null && (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                      {card.dpp.total_water.toFixed(1)} L H₂O
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
