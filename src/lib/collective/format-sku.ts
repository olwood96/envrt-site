const MAX_DISPLAY_LENGTH = 12;

/**
 * Normalises a brand-supplied SKU string for display in the card watermark.
 * Brands store SKUs in inconsistent shapes (lowercase, with spaces, very
 * long verbal codes). This gives the watermark a consistent visual rhythm
 * without changing the underlying data.
 *
 * SKUs longer than {@link MAX_DISPLAY_LENGTH} characters are truncated and
 * suffixed with an ellipsis. The watermark is decorative, so losing the
 * tail of the SKU costs nothing real and the ellipsis signals "shortened".
 */
export function formatSkuForDisplay(sku: string): string {
  if (!sku) return "";
  const cleaned = sku.trim().toUpperCase().replace(/\s+/g, "-");
  if (cleaned.length <= MAX_DISPLAY_LENGTH) return cleaned;
  return cleaned.slice(0, MAX_DISPLAY_LENGTH - 1) + "…";
}
