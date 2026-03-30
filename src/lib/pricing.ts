import { GBP_TO_EUR, ANNUAL_DISCOUNT } from "./constants";

/* ── Price formatting ──────────────────────────────────────────────────── */

export type Currency = "GBP" | "EUR";
export type Interval = "monthly" | "annual";

export function formatPrice(amount: number, currency: Currency): string {
  const symbol = currency === "GBP" ? "\u00A3" : "\u20AC";
  return `${symbol}${Math.round(amount).toLocaleString("en-GB")}`;
}

export function computePrice(
  priceGBP: number,
  currency: Currency,
  interval: Interval,
): number {
  let price = priceGBP;
  if (currency === "EUR") price = price * GBP_TO_EUR;
  if (interval === "annual") price = price * (1 - ANNUAL_DISCOUNT);
  return price;
}
