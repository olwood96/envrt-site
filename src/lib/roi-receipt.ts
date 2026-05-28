/**
 * Helpers for the till-receipt rendering on the ROI results page.
 */

/**
 * Formats a date as "28 May 2026" using en-GB locale. Uses UTC fields so
 * the output is stable regardless of the viewer's local timezone.
 */
export function formatReceiptDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/**
 * Generates a deterministic reference for a ROI calculation, eg
 * "ROI-2026-A3B7". Same inputs always produce the same reference so
 * the receipt reads as a real document rather than a randomised mock.
 */
export function generateReference(date: Date, ...inputs: number[]): string {
  const year = date.getUTCFullYear();
  const hash = hashNumbers(inputs).toString(36).toUpperCase().slice(0, 4).padStart(4, "0");
  return `ROI-${year}-${hash}`;
}

/**
 * djb2-style hash over a list of numbers. Not cryptographic. Used only
 * to derive a short stable identifier from the cost inputs.
 */
function hashNumbers(inputs: number[]): number {
  let h = 5381;
  const s = inputs.join("-");
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) + h + s.charCodeAt(i);
    h = h & h; // force 32-bit
  }
  return Math.abs(h);
}
