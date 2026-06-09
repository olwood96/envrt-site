"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CollectiveCardData } from "@/lib/collective/types";
import { DppPopup } from "@/components/collective/DppPopup";
import { CompositionTag } from "@/components/collective/CompositionTag";
import { StitchingLoader } from "@/components/ui/StitchingLoader";
import {
  deriveOrigin,
  derivePrimaryMaterial,
  deriveYear,
} from "@/lib/collective/card-derived";

const CollectiveProductionMap = lazy(() =>
  import("@/components/collective/CollectiveProductionMap").then((m) => ({
    default: m.CollectiveProductionMap,
  })),
);

interface Props {
  card: CollectiveCardData;
  isSelected: boolean;
  onToggleCompare: (id: string) => void;
  compareDisabled: boolean;
  crossBrandDisabled?: boolean;
  mapOpen?: boolean;
  onToggleMap?: () => void;
}

function brandSlugFor(brand: CollectiveCardData["brand"]): string {
  return (
    brand.slug ||
    brand.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  );
}

type Metric = { label: string; value: string };

function buildMetrics(dpp: CollectiveCardData["dpp"]): Metric[] {
  const metrics: Metric[] = [];
  if (dpp.total_emissions != null) {
    metrics.push({
      label: "CO₂e",
      value: `${dpp.total_emissions.toFixed(1)} kg`,
    });
  }
  if (dpp.total_water != null) {
    metrics.push({
      label: "Water",
      value: `${dpp.total_water.toFixed(1)} L`,
    });
  }
  if (dpp.transparency_score != null) {
    metrics.push({
      label: "Traceable",
      value: `${Math.round(dpp.transparency_score)}%`,
    });
  }
  return metrics;
}

export function CollectiveCardV3({
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
  const [internalMapOpen, setInternalMapOpen] = useState(true);
  const mapOpen = controlledMapOpen ?? internalMapOpen;
  const toggleMap = onToggleMap ?? (() => setInternalMapOpen((p) => !p));
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    if (!tooltipOpen) return;
    const close = () => setTooltipOpen(false);
    const t = window.setTimeout(() => document.addEventListener("click", close), 0);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("click", close);
    };
  }, [tooltipOpen]);

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

  const material = derivePrimaryMaterial(dpp);
  const origin = deriveOrigin(dpp);
  const year = deriveYear(dpp);
  const metrics = buildMetrics(dpp);
  const brandHref = `/preview/v3/collective/${brandSlugFor(brand)}`;

  return (
    <>
      <article
        className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-envrt-brand-black/10 bg-white transition-colors duration-300 hover:border-envrt-brand-ultramarine/25 ${
          crossBrandDisabled ? "pointer-events-auto opacity-40 grayscale" : ""
        }`}
      >
        <a
          href={detailUrl}
          data-testid="dpp-link-image"
          onClick={openPopup}
          className="relative block"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-envrt-brand-vista/70">
            <CompositionTag
              material={material}
              origin={origin}
              year={year}
            />

            {productImageUrl ? (
              <div className="absolute inset-4">
                <div className="relative h-full w-full">
                  <Image
                    src={productImageUrl}
                    alt={dpp.garment_name}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-envrt-brand-black/30">
                <svg
                  className="h-14 w-14"
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

            {productImageUrl && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setLightboxOpen(true);
                }}
                className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-envrt-brand-black/65 backdrop-blur transition-colors hover:text-envrt-brand-ultramarine sm:opacity-0 sm:group-hover:opacity-100"
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

        <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
          <Link
            href={brandHref}
            onClick={(e) => e.stopPropagation()}
            className="group/brand inline-flex items-center gap-2 self-start font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine transition-colors duration-200 hover:text-envrt-brand-black sm:text-[11px]"
          >
            {card.brandLogoUrl && (
              <span className="relative inline-flex h-5 w-5 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-envrt-brand-black/10 bg-white">
                <Image
                  src={card.brandLogoUrl}
                  alt=""
                  fill
                  sizes="20px"
                  className="object-contain p-0.5"
                />
              </span>
            )}
            <span>{brand.name}</span>
          </Link>

          <a href={detailUrl} data-testid="dpp-link-name" onClick={openPopup}>
            <h3 className="mt-2 font-display text-lg font-medium leading-tight tracking-tight text-envrt-brand-black transition-colors duration-200 group-hover:text-envrt-brand-ultramarine sm:text-xl">
              {dpp.garment_name}
            </h3>
          </a>
          <p className="mt-1 text-sm text-envrt-brand-black/55">
            {dpp.collection_name}
          </p>

          {metrics.length > 0 && (
            <dl
              className="mt-5 grid grid-cols-3 gap-3 border-t border-envrt-brand-black/8 pt-5"
              data-testid="impact-summary"
            >
              {metrics.map((m) => (
                <div key={m.label}>
                  <dt className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/50 sm:text-[10px]">
                    {m.label}
                  </dt>
                  <dd className="mt-1 font-display text-sm font-medium tracking-tight text-envrt-brand-black sm:text-base">
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {hasJourney && (
            <div className="mt-5 border-t border-envrt-brand-black/8 pt-5">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleMap();
                }}
                className="flex w-full items-center gap-3 text-left transition-colors duration-200 hover:text-envrt-brand-ultramarine"
                aria-expanded={mapOpen}
              >
                <svg
                  className="h-4 w-4 flex-shrink-0 text-envrt-brand-ultramarine"
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
                <span className="flex-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/75 sm:text-[11px]">
                  Production journey
                </span>
                <svg
                  aria-hidden
                  className={`h-4 w-4 flex-shrink-0 text-envrt-brand-black/55 transition-transform duration-300 ${
                    mapOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              {mapOpen && (
                <div className="mt-3 overflow-hidden rounded-2xl border border-envrt-brand-black/8 bg-envrt-brand-vista/40">
                  <Suspense
                    fallback={
                      <div className="flex h-[140px] items-center justify-center">
                        <StitchingLoader label="Loading journey" className="py-0" />
                      </div>
                    }
                  >
                    <CollectiveProductionMap stages={dpp.production_stages!} />
                  </Suspense>
                </div>
              )}
            </div>
          )}

          <div className="flex-1" />

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-envrt-brand-black/8 pt-5">
            <div
              className="group/compare relative"
              onClick={(e) => {
                if (!crossBrandDisabled) return;
                e.stopPropagation();
                setTooltipOpen((v) => !v);
              }}
            >
              <label
                className={`inline-flex items-center gap-2 ${
                  crossBrandDisabled
                    ? "cursor-not-allowed text-envrt-brand-black/35"
                    : "cursor-pointer text-envrt-brand-black/65 hover:text-envrt-brand-ultramarine"
                }`}
                aria-label="Add to compare"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  disabled={(compareDisabled && !isSelected) || crossBrandDisabled}
                  onChange={() => onToggleCompare(dpp.id)}
                  className="h-4 w-4 rounded border-envrt-brand-black/25 text-envrt-brand-ultramarine focus:ring-envrt-brand-ultramarine/30 disabled:opacity-40"
                />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-[11px]">
                  Compare
                </span>
              </label>
              {crossBrandDisabled && (
                <span
                  className={`pointer-events-none absolute bottom-full left-0 z-30 mb-2 w-56 rounded-xl border border-envrt-brand-black/10 bg-white px-3 py-2 text-[11px] leading-relaxed text-envrt-brand-black/80 shadow-lg ${
                    tooltipOpen ? "block" : "hidden group-hover/compare:block"
                  }`}
                >
                  Cross-brand comparisons are not available yet. You can
                  compare products from the same brand only.
                  <span
                    aria-hidden
                    className="absolute left-4 top-full border-4 border-transparent border-t-white"
                  />
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
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55 transition-colors duration-200 hover:text-envrt-brand-ultramarine sm:text-[11px]"
                  data-cta="shop-product"
                  aria-label="Shop this product"
                >
                  Shop
                  <svg
                    aria-hidden
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                </a>
              )}
              <a
                href={detailUrl}
                data-testid="dpp-link-cta"
                onClick={openPopup}
                className="inline-flex items-center gap-1.5 rounded-full bg-envrt-brand-ultramarine px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_8px_18px_-10px_rgba(46,21,148,0.7)] transition-all duration-200 hover:translate-y-[-1px] hover:shadow-[0_14px_24px_-12px_rgba(46,21,148,0.7)] sm:text-[11px]"
                data-cta="view-dpp"
              >
                View DPP
                <span
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </a>
            </div>
          </div>
        </div>
      </article>

      <DppPopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        embedUrl={embedUrl}
        fallbackUrl={detailUrl}
        garmentName={dpp.garment_name}
      />

      {lightboxOpen && productImageUrl && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-envrt-brand-black/75 backdrop-blur"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-h-[85vh] max-w-[85vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute -right-3 -top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-envrt-brand-black shadow-lg transition-colors hover:bg-envrt-brand-vista"
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
              width={1200}
              height={1200}
              className="max-h-[85vh] w-auto rounded-2xl object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
