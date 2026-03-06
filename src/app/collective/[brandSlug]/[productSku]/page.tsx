import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { getFeaturedDpp } from "@/lib/collective/fetch";
import { CollectiveDppEmbed } from "@/components/collective/CollectiveDppEmbed";
import { CollectiveShareButton } from "@/components/collective/CollectiveShareButton";

export const revalidate = 300;

interface PageProps {
  params: { brandSlug: string; productSku: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { brandSlug, productSku } = params;
  const card = await getFeaturedDpp(brandSlug, productSku);

  if (!card) {
    return { title: "Product Not Found | ENVRT" };
  }

  const { dpp, brand } = card;
  const title = `${dpp.garment_name} by ${brand.name} | ENVRT Collective`;
  const description = `Explore the Digital Product Passport for ${dpp.garment_name} by ${brand.name}.${
    dpp.total_emissions != null
      ? ` CO₂e: ${dpp.total_emissions.toFixed(1)} kg.`
      : ""
  }${
    dpp.total_water != null
      ? ` Water: ${dpp.total_water.toFixed(1)} L.`
      : ""
  }`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://envrt.com/collective/${brandSlug}/${productSku}`,
      type: "website",
    },
    alternates: {
      canonical: `https://envrt.com/collective/${brandSlug}/${productSku}`,
    },
  };
}

export default async function CollectiveDetailPage({ params }: PageProps) {
  const { brandSlug, productSku } = params;
  const card = await getFeaturedDpp(brandSlug, productSku);

  if (!card) notFound();

  const { dpp, brand, embedUrl } = card;
  const shareUrl = `https://envrt.com/collective/${brandSlug}/${productSku}`;

  return (
    <div className="pt-28 pb-16">
      <Container>
        {/* Back link */}
        <Link
          href="/collective"
          className="inline-flex items-center gap-1 text-sm text-envrt-muted transition-colors hover:text-envrt-charcoal"
        >
          <span>←</span>
          Back to The Collective
        </Link>

        {/* Header */}
        <div className="mt-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link
                href={`/collective/${brandSlug}`}
                className="text-xs font-medium uppercase tracking-widest text-envrt-teal transition-colors hover:text-envrt-green"
              >
                {brand.name}
              </Link>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-envrt-charcoal sm:text-4xl">
                {dpp.garment_name}
              </h1>
              <p className="mt-1 text-sm text-envrt-muted">
                {dpp.collection_name}
              </p>
            </div>
            <CollectiveShareButton
              url={shareUrl}
              title={`${dpp.garment_name} by ${brand.name}`}
            />
          </div>

          {/* Metrics strip */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {dpp.total_emissions != null && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-envrt-green/5 px-3 py-1.5 text-xs font-medium text-envrt-green">
                {dpp.total_emissions.toFixed(1)} kg CO₂e
              </span>
            )}
            {dpp.total_water != null && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                {dpp.total_water.toFixed(1)} L H₂O
              </span>
            )}
            {dpp.traceability_score != null && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-envrt-teal/5 px-3 py-1.5 text-xs font-medium text-envrt-teal">
                {Math.round(dpp.traceability_score)}% traceability
              </span>
            )}
          </div>
        </div>

        {/* Iframe embed */}
        <div className="mt-8">
          <CollectiveDppEmbed
            embedUrl={embedUrl}
            garmentName={dpp.garment_name}
          />
        </div>
      </Container>
    </div>
  );
}
