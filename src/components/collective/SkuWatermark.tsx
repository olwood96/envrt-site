import { formatSkuForDisplay } from "@/lib/collective/format-sku";

interface SkuWatermarkProps {
  sku: string;
}

/**
 * Large faint SKU sitting behind the product image. Hidden by default
 * and fades in on hover of the closest ancestor with class `group`, so
 * it reads as a hidden archival mark rewarded by interaction rather
 * than a permanent piece of decoration cropping around the product.
 *
 * Single line only — long SKUs are clipped at the container edge with
 * overflow:hidden so the watermark never wraps onto multiple lines.
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
      className="pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden whitespace-nowrap font-n27 tracking-[-0.02em] text-envrt-charcoal opacity-0 transition-opacity duration-[400ms] ease-out group-hover:opacity-[0.10]"
      style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)" }}
    >
      {display}
    </span>
  );
}
