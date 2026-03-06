"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CollectiveCardData } from "@/lib/collective/types";

interface Props {
  card: CollectiveCardData;
  isSelected: boolean;
  onToggleCompare: (id: string) => void;
  compareDisabled: boolean;
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
}: Props) {
  const { dpp, brand, productImageUrl, brandLogoUrl, detailUrl } = card;
  const [lightboxOpen, setLightboxOpen] = useState(false);

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
      <div className="group relative overflow-hidden rounded-2xl border border-envrt-charcoal/5 bg-white transition-all duration-300 hover:border-envrt-teal/20 hover:shadow-lg hover:shadow-envrt-teal/5">
        {/* New badge */}
        {isNew(dpp.featured_at) && (
          <div className="absolute right-3 top-3 z-10 rounded-full bg-envrt-teal px-2 py-0.5 text-[10px] font-semibold text-white">
            New
          </div>
        )}

        {/* Image */}
        <Link href={detailUrl} className="block">
          <div className="relative aspect-[4/3] overflow-hidden bg-envrt-cream/40">
            {productImageUrl ? (
              <Image
                src={productImageUrl}
                alt={dpp.garment_name}
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

            {/* Brand logo overlay */}
            {brandLogoUrl && (
              <div className="absolute left-3 top-3 rounded-lg bg-white/90 p-1.5 shadow-sm backdrop-blur">
                <Image
                  src={brandLogoUrl}
                  alt={brand.name}
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain"
                />
              </div>
            )}

            {/* Expand button for lightbox */}
            {productImageUrl && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setLightboxOpen(true);
                }}
                className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-envrt-muted opacity-0 shadow-sm backdrop-blur transition-opacity group-hover:opacity-100 hover:text-envrt-charcoal"
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
        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-widest text-envrt-teal">
                {brand.name}
              </p>
              <Link href={detailUrl}>
                <h3 className="mt-1 truncate text-sm font-semibold text-envrt-charcoal group-hover:text-envrt-green">
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
              <span className="inline-flex items-center gap-1 rounded-full bg-envrt-green/5 px-2.5 py-1 text-[11px] font-medium text-envrt-green">
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <circle cx="8" cy="8" r="3" />
                </svg>
                {dpp.total_emissions.toFixed(1)} kg CO₂e
              </span>
            )}
            {dpp.total_water != null && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700">
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <circle cx="8" cy="8" r="3" />
                </svg>
                {dpp.total_water.toFixed(1)} L H₂O
              </span>
            )}
            {dpp.traceability_score != null && (
              <span className="inline-flex items-center gap-1 rounded-full bg-envrt-teal/5 px-2.5 py-1 text-[11px] font-medium text-envrt-teal">
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <circle cx="8" cy="8" r="3" />
                </svg>
                {Math.round(dpp.traceability_score)}% trace
              </span>
            )}
          </div>

          {/* Material tags */}
          {dpp.constituents.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {dpp.constituents.slice(0, 3).map((c) => (
                <span
                  key={c.material}
                  className="rounded-full bg-envrt-teal/5 px-2 py-0.5 text-[10px] font-medium text-envrt-teal"
                >
                  {c.material} {c.pct}%
                </span>
              ))}
              {dpp.constituents.length > 3 && (
                <span className="rounded-full bg-envrt-charcoal/5 px-2 py-0.5 text-[10px] font-medium text-envrt-muted">
                  +{dpp.constituents.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Compare checkbox */}
          <div className="mt-4 border-t border-envrt-charcoal/5 pt-3">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-envrt-muted">
              <input
                type="checkbox"
                checked={isSelected}
                disabled={compareDisabled && !isSelected}
                onChange={() => onToggleCompare(dpp.id)}
                className="rounded border-envrt-charcoal/20 text-envrt-teal focus:ring-envrt-teal/30"
              />
              Compare
            </label>
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
