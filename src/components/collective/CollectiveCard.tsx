"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CollectiveCardData } from "@/lib/collective/types";
import { DppPopup } from "./DppPopup";
import { CompositionTag } from "./CompositionTag";
import { SkuWatermark } from "./SkuWatermark";
import {
  deriveOrigin,
  derivePrimaryMaterial,
  deriveYear,
} from "@/lib/collective/card-derived";

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
  /** Controlled production-journey state. If omitted, falls back to internal state (default open). */
  mapOpen?: boolean;
  onToggleMap?: () => void;
}

function buildImpactSummary(dpp: CollectiveCardData["dpp"]): string {
  const parts: string[] = [];
  if (dpp.total_emissions != null) {
    parts.push(`${dpp.total_emissions.toFixed(1)} kg CO₂e`);
  }
  if (dpp.total_water != null) {
    parts.push(`${dpp.total_water.toFixed(1)} L water`);
  }
  if (dpp.transparency_score != null) {
    parts.push(`${Math.round(dpp.transparency_score)}% traceable`);
  }
  return parts.join(" · ");
}

function brandSlugFor(brand: CollectiveCardData["brand"]): string {
  return (
    brand.slug ||
    brand.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  );
}

export function CollectiveCard({
  card,
  isSelected,
  onToggleCompare,
  compareDisabled,
  crossBrandDisabled = false,
  mapOpen: controlledMapOpen,
  onToggleMap,
}: Props) {
  const { dpp, brand, productImageUrl, detailUrl, embedUrl } = card;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  // Default the production journey OPEN. The map is the unique feature of an
  // ENVRT card — surfacing it by default beats hiding it behind a toggle.
  const [internalMapOpen, setInternalMapOpen] = useState(true);
  const mapOpen = controlledMapOpen ?? internalMapOpen;
  const toggleMap = onToggleMap ?? (() => setInternalMapOpen((prev) => !prev));
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  useEffect(() => {
    if (!activeTooltip) return;
    const closeTooltip = () => setActiveTooltip(null);
    const t = window.setTimeout(() => {
      document.addEventListener("click", closeTooltip);
    }, 0);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("click", closeTooltip);
    };
  }, [activeTooltip]);

  const openPopup = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    e.stopPropagation();
    setPopupOpen(true);
  };

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

  const tagMaterial = derivePrimaryMaterial(dpp);
  const tagOrigin = deriveOrigin(dpp);
  const tagYear = deriveYear(dpp);
  const impactSummary = buildImpactSummary(dpp);
  const brandHref = `/collective/${brandSlugFor(brand)}`;

  return (
    <>
      <div
        className={`group relative flex h-full flex-col rounded-2xl border border-envrt-charcoal/5 bg-white ${
          crossBrandDisabled ? "opacity-40 grayscale pointer-events-auto" : ""
        }`}
      >
        {/* Composition tag — top-left of the card */}
        <CompositionTag
          material={tagMaterial}
          origin={tagOrigin}
          year={tagYear}
          animateOnMount
        />

        {/* Image */}
        <a
          href={detailUrl}
          data-testid="dpp-link-image"
          onClick={openPopup}
          className="block"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-envrt-cream/40">
            {/* SKU watermark — large faint serial behind the product image */}
            <SkuWatermark sku={dpp.product_sku} />

            {productImageUrl ? (
              <div className="absolute inset-3 z-10">
                <div className="relative h-full w-full">
                  <Image
                    src={productImageUrl}
                    alt={dpp.garment_name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 z-10 flex items-center justify-center text-envrt-muted/40">
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

            {/* Lightbox expand button — flat, no glass */}
            {productImageUrl && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setLightboxOpen(true);
                }}
                className="absolute bottom-2 right-2 z-20 flex h-7 w-7 items-center justify-center rounded-md bg-white text-envrt-muted shadow-sm transition-opacity hover:text-envrt-charcoal sm:opacity-0 sm:group-hover:opacity-100"
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
        </a>

        {/* Content */}
        <div className="flex flex-1 flex-col px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
          <Link
            href={brandHref}
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] font-medium uppercase tracking-widest text-envrt-teal hover:underline"
          >
            {brand.name}
          </Link>
          <a
            href={detailUrl}
            data-testid="dpp-link-name"
            onClick={openPopup}
          >
            <h3 className="mt-1 text-[15px] font-semibold leading-snug text-envrt-charcoal group-hover:text-envrt-green">
              {dpp.garment_name}
            </h3>
          </a>
          <p className="mt-0.5 text-xs text-envrt-muted">
            {dpp.collection_name}
          </p>

          {/* Impact summary — one quiet line of body text */}
          {impactSummary && (
            <p className="mt-3 text-xs text-envrt-muted" data-testid="impact-summary">
              {impactSummary}
            </p>
          )}

          {/* Production journey map — open by default */}
          {hasJourney && (
            <div className="mt-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleMap();
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

          {/* Spacer */}
          <div className="flex-1" />

          {/* Footer: compare + view CTA */}
          <div className="mt-4 flex items-center justify-between border-t border-envrt-charcoal/5 pt-3">
            <div
              className="group/compare relative"
              onClick={(e) => {
                if (!crossBrandDisabled) return;
                e.stopPropagation();
                setActiveTooltip(
                  activeTooltip === "compare-blocked" ? null : "compare-blocked"
                );
              }}
            >
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
                <span
                  className={`pointer-events-none absolute bottom-full left-0 z-30 mb-2 w-52 rounded-lg border border-envrt-charcoal/10 bg-white px-3 py-2 text-[10px] leading-relaxed text-envrt-charcoal shadow-lg ${
                    activeTooltip === "compare-blocked"
                      ? "block"
                      : "hidden group-hover/compare:block"
                  }`}
                >
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
                  className="inline-flex items-center gap-1 text-xs font-medium text-envrt-green transition-colors hover:underline"
                  data-cta="shop-product"
                >
                  Shop this product
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              )}
              <a
                href={detailUrl}
                data-testid="dpp-link-cta"
                onClick={openPopup}
                className="inline-flex items-center gap-1 text-xs font-medium text-envrt-muted transition-colors group-hover:text-envrt-teal"
                data-cta="view-dpp"
              >
                View DPP
                <svg className="h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* DPP popup */}
      <DppPopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        embedUrl={embedUrl}
        fallbackUrl={detailUrl}
        garmentName={dpp.garment_name}
      />

      {/* Lightbox */}
      {lightboxOpen && productImageUrl && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70"
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
