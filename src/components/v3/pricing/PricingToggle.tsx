"use client";

import { usePricing } from "./PricingContext";
import type { BillingPeriod, Currency } from "@/lib/config";

// Two stacked tab groups: currency (EUR/GBP/USD) + billing (monthly/
// annual). Compact, mono-uppercase styling matches the v3 chip
// vocabulary used elsewhere on the pricing page.

const CURRENCIES: { value: Currency; label: string }[] = [
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "USD", label: "USD" },
];

const BILLINGS: { value: BillingPeriod; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "annual", label: "Annual · save 15%" },
];

export function PricingToggle() {
  const { currency, billing, setCurrency, setBilling } = usePricing();

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4">
      <TabGroup
        ariaLabel="Currency"
        options={CURRENCIES}
        active={currency}
        onChange={setCurrency}
      />
      <TabGroup
        ariaLabel="Billing period"
        options={BILLINGS}
        active={billing}
        onChange={setBilling}
      />
    </div>
  );
}

function TabGroup<T extends string>({
  ariaLabel,
  options,
  active,
  onChange,
}: {
  ariaLabel: string;
  options: { value: T; label: string }[];
  active: T;
  onChange: (v: T) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex rounded-full border border-envrt-brand-black/12 bg-white p-1 shadow-[0_4px_12px_-6px_rgba(14,14,14,0.08)]"
    >
      {options.map((o) => {
        const isActive = active === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(o.value)}
            className={`relative rounded-full px-3.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200 sm:px-4 sm:py-2 sm:text-[11px] ${
              isActive
                ? "bg-envrt-brand-ultramarine text-white"
                : "text-envrt-brand-black/60 hover:text-envrt-brand-ultramarine"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
