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
    <div className="mt-6 rounded-2xl border border-envrt-mist bg-white p-5">
      <div className="flex flex-col sm:flex-row sm:items-start gap-5">
        {selected.imageUrl && (
          <img
            src={selected.imageUrl}
            alt={`${parentGarmentName}, ${selected.variantName}`}
            className="h-48 w-48 rounded-xl object-cover border border-envrt-mist"
          />
        )}

        <div className="flex-1">
          <div className="text-xs font-medium uppercase tracking-widest text-envrt-muted">
            Colourway
          </div>
          <div className="mt-1 text-lg font-semibold text-envrt-charcoal">
            {selected.variantName}
          </div>
          <div className="text-xs text-envrt-muted">
            SKU {selected.variantSku}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {variants.map((v) => {
              const isActive = v.variantSku === selected.variantSku;
              return (
                <button
                  key={v.id}
                  onClick={() => handleSelect(v.variantSku)}
                  className={`flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                    isActive
                      ? "border-envrt-charcoal bg-envrt-charcoal text-white"
                      : "border-envrt-mist bg-white text-envrt-charcoal hover:border-envrt-charcoal"
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

          <p className="mt-4 text-xs text-envrt-muted">
            Footprint calculated at model level per the ESPR three-tier framework
            (Model, Batch, Item) and applies to all colourways of this garment.{" "}
            <a
              href="/methodology"
              className="underline hover:text-envrt-charcoal"
            >
              How we calculate
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
