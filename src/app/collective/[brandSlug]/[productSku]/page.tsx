import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { getFeaturedDpp } from "@/lib/collective/fetch";
import { CollectiveDppEmbed } from "@/components/collective/CollectiveDppEmbed";
import { CollectiveShareModal } from "@/components/collective/CollectiveShareModal";
import { CollectiveProductJsonLd } from "@/components/collective/CollectiveProductJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

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
  const widgetUrl = `https://envrt.com/collective/${brandSlug}/${productSku}/widget`;
  const embedSnippet = `<iframe src="${widgetUrl}" width="300" height="400" frameborder="0" style="border:none;border-radius:16px;"></iframe>`;
  const badgeSnippet = `<a href="${shareUrl}?utm_source=badge&utm_medium=referral" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:10px;border:1px solid rgba(27,58,45,0.1);background:#fff;color:#1b3a2d;font-size:12px;font-weight:500;text-decoration:none;font-family:system-ui,sans-serif;">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a7a6d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M8 12h8M12 8v8"/></svg>
  View Digital Product Passport
</a>`;

  return (
    <>
      <CollectiveProductJsonLd card={card} url={shareUrl} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://envrt.com" },
          { name: "The Collective", url: "https://envrt.com/collective" },
          { name: brand.name, url: `https://envrt.com/collective/${brandSlug}` },
          { name: dpp.garment_name, url: shareUrl },
        ]}
      />
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
                  className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-widest text-envrt-teal transition-colors hover:text-envrt-green"
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
              <div className="flex items-center gap-2">
                {dpp.purchase_url && (
                  <a
                    href={dpp.purchase_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-envrt-green px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-envrt-green/90"
                    data-cta="shop-product"
                  >
                    Shop this product
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                )}
                <CollectiveShareModal
                  url={shareUrl}
                  title={`${dpp.garment_name} by ${brand.name}`}
                  productName={dpp.garment_name}
                  embedSnippet={embedSnippet}
                  badgeSnippet={badgeSnippet}
                />
              </div>
            </div>

            {/* Metrics strip */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {dpp.total_emissions != null && (
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center rounded-full bg-envrt-green/5 px-3 py-1.5 text-xs font-medium text-envrt-green">
                    {dpp.total_emissions.toFixed(1)} kg CO₂e
                  </span>
                  {dpp.total_emissions_reduction_pct != null && dpp.total_emissions_reduction_pct > 0 && (
                    <span className="text-[10px] font-medium text-envrt-green">
                      ↓ {Math.round(dpp.total_emissions_reduction_pct)}% vs avg
                    </span>
                  )}
                </div>
              )}
              {dpp.total_water != null && (
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                    {dpp.total_water.toFixed(1)} L H₂O
                  </span>
                  {dpp.total_water_reduction_pct != null && dpp.total_water_reduction_pct > 0 && (
                    <span className="text-[10px] font-medium text-blue-600">
                      ↓ {Math.round(dpp.total_water_reduction_pct)}% vs avg
                    </span>
                  )}
                </div>
              )}
              {dpp.transparency_score != null && (
                <span className="inline-flex items-center rounded-full bg-envrt-teal/5 px-3 py-1.5 text-xs font-medium text-envrt-teal">
                  {Math.round(dpp.transparency_score)}% transparency
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
    </>
  );
}
