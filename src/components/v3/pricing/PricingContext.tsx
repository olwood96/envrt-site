"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CURRENCY_SYMBOL,
  DEFAULT_BILLING,
  DEFAULT_CURRENCY,
  type BillingPeriod,
  type Currency,
} from "@/lib/config";

// Site-wide currency + billing period state. Default EUR + monthly.
// Choice persists in localStorage so the next page load remembers it.
// Wrapping at the V3 layout level means every page that consumes
// pricing (homepage NumbersSection, /pricing, /platform, /roi, etc.)
// stays in sync without prop drilling.

type PricingContextValue = {
  currency: Currency;
  billing: BillingPeriod;
  setCurrency: (c: Currency) => void;
  setBilling: (p: BillingPeriod) => void;
  symbol: string;
};

const PricingContext = createContext<PricingContextValue | null>(null);

const LS_CURRENCY = "envrt:v3:pricing:currency";
const LS_BILLING = "envrt:v3:pricing:billing";

function readLocal<T extends string>(key: string, fallback: T, allowed: readonly T[]): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = window.localStorage.getItem(key) as T | null;
    if (v && allowed.includes(v)) return v;
  } catch {
    /* localStorage blocked */
  }
  return fallback;
}

export function PricingProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);
  const [billing, setBillingState] = useState<BillingPeriod>(DEFAULT_BILLING);

  // Hydrate from localStorage after mount so SSR markup stays
  // deterministic. Brief flash on first paint is unavoidable without
  // a flicker-prevention script; acceptable for v3 preview.
  useEffect(() => {
    setCurrencyState(
      readLocal<Currency>(LS_CURRENCY, DEFAULT_CURRENCY, ["EUR", "GBP", "USD"]),
    );
    setBillingState(
      readLocal<BillingPeriod>(LS_BILLING, DEFAULT_BILLING, [
        "monthly",
        "annual",
      ]),
    );
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    try {
      window.localStorage.setItem(LS_CURRENCY, c);
    } catch {
      /* ignore */
    }
  }, []);

  const setBilling = useCallback((p: BillingPeriod) => {
    setBillingState(p);
    try {
      window.localStorage.setItem(LS_BILLING, p);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<PricingContextValue>(
    () => ({
      currency,
      billing,
      setCurrency,
      setBilling,
      symbol: CURRENCY_SYMBOL[currency],
    }),
    [currency, billing, setCurrency, setBilling],
  );

  return (
    <PricingContext.Provider value={value}>{children}</PricingContext.Provider>
  );
}

export function usePricing(): PricingContextValue {
  const ctx = useContext(PricingContext);
  if (!ctx) {
    // Fallback to defaults if a consumer renders outside the provider
    // (e.g. SSR snapshot, isolated tests). Stable for tree consistency.
    return {
      currency: DEFAULT_CURRENCY,
      billing: DEFAULT_BILLING,
      setCurrency: () => {},
      setBilling: () => {},
      symbol: CURRENCY_SYMBOL[DEFAULT_CURRENCY],
    };
  }
  return ctx;
}

// ─── Helpers ─────────────────────────────────────────────────────────────

import type { PricingPlan } from "@/lib/config";

export function planPrice(
  plan: PricingPlan,
  currency: Currency,
  billing: BillingPeriod,
): number | null {
  if (!plan.prices) return null;
  return plan.prices[currency][billing];
}

export function formatPrice(
  value: number,
  currency: Currency,
): string {
  return `${CURRENCY_SYMBOL[currency]}${value.toLocaleString()}`;
}

// Approximate FX rates from GBP — used to convert legacy GBP-anchored
// figures (e.g. ROI calculator consultant + in-house costs) into the
// user's chosen currency. Marketing approximation, not live FX. Same
// rates that the pricingPlans price matrix was rounded against.
export const GBP_TO: Record<Currency, number> = {
  GBP: 1,
  EUR: 1.17,
  USD: 1.27,
};

export function convertFromGBP(gbp: number, currency: Currency): number {
  return Math.round(gbp * GBP_TO[currency]);
}

export function formatFromGBP(gbp: number, currency: Currency): string {
  return formatPrice(convertFromGBP(gbp, currency), currency);
}
