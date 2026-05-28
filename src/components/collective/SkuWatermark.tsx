import { formatSkuForDisplay } from "@/lib/collective/format-sku";

interface SkuWatermarkProps {
  sku: string;
  /**
   * When true, opacity lifts from base to a slightly stronger value on
   * the closest ancestor with class `group`. Defaults to false.
   */
  hoverLift?: boolean;
}

/**
 * Large faint SKU sitting behind the product image. Reads like an
 * auction-catalogue lot number or museum collection plate.
 *
 * Renders as a decorative absolute layer inside the image container.
 * Hidden from screen readers since the same SKU is available in the
 * URL and on the DPP detail page.
 */
export function SkuWatermark({ sku, hoverLift = false }: SkuWatermarkProps) {
  const display = formatSkuForDisplay(sku);
  const hoverClass = hoverLift
    ? "transition-opacity duration-200 group-hover:opacity-[0.18]"
    : "";

  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 flex select-none items-center justify-center font-serif tracking-[-0.02em] text-envrt-charcoal opacity-[0.07] ${hoverClass}`}
      style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)" }}
    >
      {display}
    </span>
  );
}
