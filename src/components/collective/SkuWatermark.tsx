import { formatSkuForDisplay } from "@/lib/collective/format-sku";

interface SkuWatermarkProps {
  sku: string;
}

/**
 * Large faint SKU sitting ON TOP of the product image, using
 * `mix-blend-multiply` so it overprints like ink on a photograph
 * (subtle on white card background, deeper where the garment is darker).
 *
 * Hidden by default, fades to ~18% opacity on hover of the closest
 * `.group` ancestor. Single line only — long SKUs are truncated by
 * `formatSkuForDisplay` and clipped at the edge as a final safety net.
 *
 * Sits at z-15: above the product image (z-10), below the lightbox
 * expand button (z-20).
 *
 * Hidden from assistive tech since the same SKU is in the URL and on
 * the DPP detail page.
 */
export function SkuWatermark({ sku }: SkuWatermarkProps) {
  const display = formatSkuForDisplay(sku);

  return (
    <span
      aria-hidden="true"
      data-testid="sku-watermark"
      className="pointer-events-none absolute inset-0 z-[15] flex select-none items-center justify-center overflow-hidden whitespace-nowrap font-n27 tracking-[-0.02em] text-envrt-charcoal opacity-0 mix-blend-multiply transition-opacity duration-[400ms] ease-out group-hover:opacity-[0.18]"
      style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)" }}
    >
      {display}
    </span>
  );
}
