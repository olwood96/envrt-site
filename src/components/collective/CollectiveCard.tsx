"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CollectiveCardData } from "@/lib/collective/types";
import { getMaterialDescription } from "@/lib/collective/material-info";

const CollectiveProductionMap = lazy(() =>
  import("./CollectiveProductionMap").then((m) => ({
    default: m.CollectiveProductionMap,
  }))
);

interface Props {
  card: CollectiveCardData;
  isSelected: boolean;
  onToggleCompare: (id: string) => void;
  compareDisabled: boolean;
  /** True when this card is from a different brand than the first selected compare item */
  crossBrandDisabled?: boolean;
  mapOpen?: boolean;
  onToggleMap?: () => void;
}

function isNew(featuredAt: string | null): boolean {
  if (!featuredAt) return false;
  const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;
  return Date.now() - new Date(featuredAt).getTime() < fourteenDaysMs;
}

export function CollectiveCard({
  card,
  isSelected,
  onToggleCompare,
  compareDisabled,
  crossBrandDisabled = false,
  mapOpen: externalMapOpen,
  onToggleMap,
}: Props) {
  const { dpp, brand, productImageUrl, brandLogoUrl, detailUrl } = card;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const mapOpen = externalMapOpen ?? false;
  const hasJourney =
    dpp.production_stages &&
    dpp.production_stages.length > 0 &&
    dpp.production_stages.some((s) => s.country);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  return (
    <>
      <div className={`group relative flex h-full flex-col rounded-2xl border border-envrt-charcoal/5 bg-white transition-all duration-300 ${crossBrandDisabled ? "opacity-40 grayscale pointer-events-auto" : "hover:-translate-y-1 hover:border-envrt-teal/20 hover:shadow-xl hover:shadow-envrt-teal/8"}`}>
        {/* New badge */}
        {isNew(dpp.featured_at) && (
          <div className="absolute right-3 top-3 z-20 rounded-full bg-envrt-teal px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-white shadow-sm">
            New
          </div>
        )}

        {/* Image */}
        <Link href={detailUrl} className="block">
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-envrt-cream/40">
            {productImageUrl ? (
              <>
                {/* Blurred background fill */}
                <Image
                  src={productImageUrl}
                  alt=""
                  fill
                  className="scale-150 object-cover blur-2xl opacity-30"
                  sizes="128px"
                  aria-hidden="true"
                />
                {/* Main contained image */}
                <div className="absolute inset-3 z-10">
                  <div className="relative h-full w-full">
                    <Image
                      src={productImageUrl}
                      alt={dpp.garment_name}
                      fill
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                </div>
              </>
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

            {/* Gradient blend into content */}
            <div className="absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-white to-transparent" />

            {/* Brand logo overlay — clickable to brand page */}
            {brandLogoUrl && (
              <Link
                href={`/collective/${brand.slug || brand.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`}
                onClick={(e) => e.stopPropagation()}
                className="absolute left-3 top-3 z-20 rounded-lg bg-white/90 p-1.5 shadow-sm backdrop-blur transition-transform duration-300 hover:scale-110"
              >
                <Image
                  src={brandLogoUrl}
                  alt={brand.name}
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain"
                />
              </Link>
            )}

            {/* Expand button for lightbox */}
            {productImageUrl && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setLightboxOpen(true);
                }}
                className="absolute bottom-2 right-2 z-20 flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-envrt-muted opacity-0 shadow-sm backdrop-blur transition-opacity group-hover:opacity-100 hover:text-envrt-charcoal"
                aria-label="View full image"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9m11.25-5.25v4.5m0-4.5h-4.5m4.5 0L15 9m-11.25 11.25v-4.5m0 4.5h4.5m-4.5 0L9 15m11.25 5.25v-4.5m0 4.5h-4.5m4.5 0L15 15"
                  />
                </svg>
              </button>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex flex-1 flex-col px-5 pb-5 pt-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-widest text-envrt-teal">
                {brand.name}
              </p>
              <Link href={detailUrl}>
                <h3 className="mt-1 text-[15px] font-semibold leading-snug text-envrt-charcoal group-hover:text-envrt-green">
                  {dpp.garment_name}
                </h3>
              </Link>
              <p className="mt-0.5 text-xs text-envrt-muted">
                {dpp.collection_name}
              </p>
            </div>
          </div>

          {/* Metrics */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {dpp.total_emissions != null && (
              <div className="flex flex-col">
                <span className="inline-flex items-center rounded-full bg-envrt-green/5 px-2.5 py-1 text-[11px] font-medium text-envrt-green">
                  {dpp.total_emissions.toFixed(1)} kg CO₂e
                </span>
                {dpp.total_emissions_reduction_pct != null && dpp.total_emissions_reduction_pct > 0 && (
                  <span className="mt-0.5 text-center text-[9px] font-medium text-envrt-green">
                    ↓ {Math.round(dpp.total_emissions_reduction_pct)}% vs avg
                  </span>
                )}
              </div>
            )}
            {dpp.total_water != null && (
              <div className="flex flex-col">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700">
                  {dpp.total_water.toFixed(1)} L H₂O
                </span>
                {dpp.total_water_reduction_pct != null && dpp.total_water_reduction_pct > 0 && (
                  <span className="mt-0.5 text-center text-[9px] font-medium text-blue-600">
                    ↓ {Math.round(dpp.total_water_reduction_pct)}% vs avg
                  </span>
                )}
              </div>
            )}
            {dpp.transparency_score != null && (
              <span className="inline-flex items-center rounded-full bg-envrt-teal/5 px-2.5 py-1 text-[11px] font-medium text-envrt-teal">
                {Math.round(dpp.transparency_score)}% transparency
              </span>
            )}
          </div>

          {/* Material tags with tooltips */}
          {dpp.constituents.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {dpp.constituents.slice(0, 3).map((c) => {
                const desc = getMaterialDescription(c.material);
                return (
                  <span
                    key={c.material}
                    className="group/tip relative cursor-default rounded-full border border-envrt-teal/10 bg-envrt-teal/5 px-2 py-0.5 text-[10px] font-medium text-envrt-teal"
                  >
                    {c.material} {c.pct}%
                    {desc && (
                      <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden w-48 -translate-x-1/2 rounded-lg border border-envrt-charcoal/10 bg-white px-3 py-2 text-[10px] font-normal leading-relaxed text-envrt-charcoal shadow-lg group-hover/tip:block">
                        {desc}
                        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-white" />
                      </span>
                    )}
                  </span>
                );
              })}
              {dpp.constituents.length > 3 && (
                <span className="rounded-full border border-envrt-charcoal/5 bg-envrt-charcoal/5 px-2 py-0.5 text-[10px] font-medium text-envrt-muted">
                  +{dpp.constituents.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Production journey map (collapsible) */}
          {hasJourney && (
            <div className="mt-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleMap?.();
                }}
                className="flex w-full items-center gap-1.5 text-[10px] font-medium text-envrt-muted transition-colors hover:text-envrt-teal"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
                  />
                </svg>
                Production journey
                <svg
                  className={`ml-auto h-3 w-3 transition-transform ${mapOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {mapOpen && (
                <div className="mt-2">
                  <Suspense
                    fallback={
                      <div className="flex h-[140px] items-center justify-center rounded-lg bg-envrt-cream/40">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-envrt-teal border-t-transparent" />
                      </div>
                    }
                  >
                    <CollectiveProductionMap stages={dpp.production_stages!} />
                  </Suspense>
                </div>
              )}
            </div>
          )}

          {/* Spacer pushes footer to bottom */}
          <div className="flex-1" />

          {/* Footer: compare + view CTA */}
          <div className="mt-4 flex items-center justify-between border-t border-envrt-charcoal/5 pt-3">
            <div className="group/compare relative">
              <label className={`flex items-center gap-2 text-xs ${crossBrandDisabled ? "cursor-not-allowed text-envrt-muted/50" : "cursor-pointer text-envrt-muted"}`}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  disabled={(compareDisabled && !isSelected) || crossBrandDisabled}
                  onChange={() => onToggleCompare(dpp.id)}
                  className="rounded border-envrt-charcoal/20 text-envrt-teal focus:ring-envrt-teal/30 disabled:opacity-40"
                />
                Compare
              </label>
              {crossBrandDisabled && (
                <span className="pointer-events-none absolute bottom-full left-0 z-30 mb-2 hidden w-52 rounded-lg border border-envrt-charcoal/10 bg-white px-3 py-2 text-[10px] leading-relaxed text-envrt-charcoal shadow-lg group-hover/compare:block">
                  Cross-brand comparisons aren&apos;t available yet — you can compare products from the same brand only.
                  <span className="absolute left-4 top-full border-4 border-transparent border-t-white" />
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {dpp.purchase_url && (
                <a
                  href={dpp.purchase_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 rounded-full bg-envrt-green/5 px-2.5 py-1 text-[11px] font-medium text-envrt-green transition-colors hover:bg-envrt-green/10"
                  data-cta="shop-product"
                >
                  Shop this product
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              )}
              <Link
                href={detailUrl}
                className="inline-flex items-center gap-1 text-xs font-medium text-envrt-muted transition-colors group-hover:text-envrt-teal"
                data-cta="view-dpp"
              >
                View DPP
                <svg className="h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && productImageUrl && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-h-[85vh] max-w-[85vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute -right-3 -top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-envrt-charcoal shadow-lg transition-colors hover:bg-envrt-cream"
              aria-label="Close lightbox"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
            <Image
              src={productImageUrl}
              alt={dpp.garment_name}
              width={800}
              height={800}
              className="max-h-[85vh] w-auto rounded-2xl object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
