"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface VariantData {
  id: string;
  variantSku: string;
  variantName: string;
  colourName: string | null;
  colourHex: string | null;
  imageUrl: string | null;
}

interface Props {
  brandSlug: string;
  productSku: string;
  parentGarmentName: string;
}

export default function VariantPicker({
  brandSlug,
  productSku,
  parentGarmentName,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSku = searchParams.get("variant");

  const [variants, setVariants] = useState<VariantData[] | null>(null);
  const [selectedSku, setSelectedSku] = useState<string | null>(initialSku);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "https://dashboard.envrt.com";
    fetch(
      `${dashboardUrl}/api/dpp-variants?brandSlug=${encodeURIComponent(
        brandSlug
      )}&productSku=${encodeURIComponent(productSku)}`
    )
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: { variants: VariantData[] }) => {
        setVariants(data.variants);
        if (!selectedSku && data.variants.length > 0) {
          setSelectedSku(data.variants[0].variantSku);
        }
      })
      .catch((err) => setError(err.message));
  }, [brandSlug, productSku]);

  if (error) return null;
  if (!variants || variants.length === 0) return null;

  const selected =
    variants.find((v) => v.variantSku === selectedSku) ?? variants[0];

  const handleSelect = (sku: string) => {
    setSelectedSku(sku);
    const params = new URLSearchParams(searchParams.toString());
    params.set("variant", sku);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mt-8 rounded-3xl border border-envrt-brand-black/12 bg-white p-6 sm:p-8 shadow-[0_18px_40px_-18px_rgba(14,14,14,0.12)]">
      <div className="flex flex-col sm:flex-row sm:items-start gap-6">
        {selected.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={selected.imageUrl}
            alt={`${parentGarmentName}, ${selected.variantName}`}
            className="h-48 w-48 rounded-2xl object-cover border border-envrt-brand-black/12"
          />
        )}

        <div className="flex-1">
          <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine">
            Colourway
          </div>
          <div className="mt-2 text-lg font-semibold leading-tight tracking-[-0.01em] text-envrt-brand-black">
            {selected.variantName}
          </div>
          <div className="text-xs leading-snug text-envrt-brand-black/55">
            SKU {selected.variantSku}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {variants.map((v) => {
              const isActive = v.variantSku === selected.variantSku;
              return (
                <button
                  key={v.id}
                  onClick={() => handleSelect(v.variantSku)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? "border-envrt-brand-ultramarine bg-envrt-brand-ultramarine text-white"
                      : "border-envrt-brand-black/12 bg-white text-envrt-brand-black hover:border-envrt-brand-ultramarine hover:text-envrt-brand-ultramarine"
                  }`}
                  aria-pressed={isActive}
                  title={v.variantName}
                >
                  <span
                    className="h-3 w-3 rounded-full border border-white/40"
                    style={{ background: v.colourHex ?? "#f4f4f5" }}
                  />
                  {v.colourName ?? v.variantName}
                </button>
              );
            })}
          </div>

          <p className="mt-5 text-xs leading-snug text-envrt-brand-black/65">
            Footprint calculated at model level per the ESPR three-tier framework
            (Model, Batch, Item) and applies to all colourways of this garment.{" "}
            <a
              href="/methodology"
              className="text-envrt-brand-ultramarine hover:opacity-80 transition-opacity"
            >
              How we calculate
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
