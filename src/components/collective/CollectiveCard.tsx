"use client";

import Image from "next/image";
import Link from "next/link";
import type { CollectiveCardData } from "@/lib/collective/types";

interface Props {
  card: CollectiveCardData;
  isSelected: boolean;
  onToggleCompare: (id: string) => void;
  compareDisabled: boolean;
}

export function CollectiveCard({
  card,
  isSelected,
  onToggleCompare,
  compareDisabled,
}: Props) {
  const { dpp, brand, productImageUrl, brandLogoUrl, detailUrl } = card;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-envrt-charcoal/5 bg-white transition-all duration-300 hover:border-envrt-teal/20 hover:shadow-lg hover:shadow-envrt-teal/5">
      {/* Image */}
      <Link href={detailUrl} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-envrt-cream/40">
          {productImageUrl ? (
            <Image
              src={productImageUrl}
              alt={dpp.garment_name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
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
        <div className="mt-4 flex items-center gap-3">
          {dpp.total_emissions != null && (
            <span className="inline-flex items-center gap-1 rounded-full bg-envrt-green/5 px-2.5 py-1 text-[11px] font-medium text-envrt-green">
              <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="8" r="3" />
              </svg>
              {dpp.total_emissions.toFixed(1)} kg CO₂e
            </span>
          )}
          {dpp.total_water != null && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700">
              <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="8" r="3" />
              </svg>
              {dpp.total_water.toFixed(1)} L H₂O
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
  );
}
