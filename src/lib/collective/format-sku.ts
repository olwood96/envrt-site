const MAX_DISPLAY_LENGTH = 14;

/**
 * Normalises a brand-supplied SKU string for display in the card watermark.
 * Brands store SKUs in inconsistent shapes (lowercase, with spaces, long
 * verbal codes). This gives the watermark a consistent visual rhythm
 * without changing the underlying data.
 *
 * SKUs longer than {@link MAX_DISPLAY_LENGTH} characters are cleanly cut
 * (no ellipsis). The watermark is decorative, so losing the tail costs
 * nothing real and a clean cut reads as a deliberate ink stamp rather
 * than a glitchy truncation.
 */
export function formatSkuForDisplay(sku: string): string {
  if (!sku) return "";
  const cleaned = sku.trim().toUpperCase().replace(/\s+/g, "-");
  return cleaned.slice(0, MAX_DISPLAY_LENGTH);
}
