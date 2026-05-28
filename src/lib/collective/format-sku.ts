/**
 * Normalises a brand-supplied SKU string for display in the card watermark.
 * Brands store SKUs in inconsistent shapes (lowercase, with spaces). This
 * gives the watermark a consistent visual rhythm without changing the
 * underlying data.
 */
export function formatSkuForDisplay(sku: string): string {
  if (!sku) return "";
  return sku.trim().toUpperCase().replace(/\s+/g, "-");
}
