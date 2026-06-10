"use client";

import { useState } from "react";
import { pricingPlans, pricingComparison } from "@/lib/config";
import { AssetIcon } from "@/components/sections/v3/AssetIcon";

// Two-layout pricing comparison.
//   < sm: a plan-picker (Starter / Growth / Pro tabs) with a single-column
//         feature list grouped by category. No horizontal scrolling needed.
//   >= sm: the canonical four-column table with the Feature column pinned
//         sticky-left so it stays visible when the table is wider than the
//         viewport (and stays put on the rare tablet breakpoint between
//         640px and 800px where horizontal scroll actually kicks in).

type PlanSlug = (typeof pricingPlans)[number]["slug"];

export function ComparisonMatrix() {
  const [activePlan, setActivePlan] = useState<PlanSlug>("growth");

  return (
    <>
      <div className="sm:hidden">
        <PlanTabs activePlan={activePlan} onChange={setActivePlan} />
        <PlanFeatureList plan={activePlan} />
      </div>

      <div className="hidden overflow-hidden rounded-3xl border border-envrt-brand-black/12 bg-white sm:block">
        <StickyTable />
      </div>
    </>
  );
}

// ─── Mobile: plan picker tabs ─────────────────────────────────────────────

function PlanTabs({
  activePlan,
  onChange,
}: {
  activePlan: PlanSlug;
  onChange: (slug: PlanSlug) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Select plan to view features"
      className="flex gap-1 rounded-2xl border border-envrt-brand-black/10 bg-white p-1"
    >
      {pricingPlans.map((plan) => {
        const active = activePlan === plan.slug;
        return (
          <button
            key={plan.slug}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(plan.slug)}
            className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-3 transition-colors duration-200 ${
              active
                ? "bg-envrt-brand-ultramarine text-white"
                : "text-envrt-brand-black/65 hover:bg-envrt-brand-vista/60"
            }`}
          >
            <span className="font-display text-sm font-semibold tracking-tight">
              {plan.name}
            </span>
            <span
              className={`font-mono text-[9px] font-semibold uppercase tracking-[0.18em] ${
                active ? "text-white/75" : "text-envrt-brand-black/45"
              }`}
            >
              {plan.customPricing ? "Custom" : `£${plan.priceGBP}/mo`}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Mobile: per-plan feature list ────────────────────────────────────────

function PlanFeatureList({ plan }: { plan: PlanSlug }) {
  return (
    <div className="mt-5 overflow-hidden rounded-3xl border border-envrt-brand-black/12 bg-white">
      {pricingComparison.categories.map((cat, ci) => (
        <div
          key={cat.name}
          className={ci > 0 ? "border-t border-envrt-brand-black/8" : ""}
        >
          <div className="bg-envrt-brand-vista/50 px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine">
            {cat.name}
          </div>
          {cat.features.map((feat, fi) => {
            const value = (
              feat as Record<string, boolean | string | undefined>
            )[plan];
            return (
              <div
                key={feat.name}
                className={`flex items-start justify-between gap-4 px-5 py-3.5 ${
                  fi > 0 ? "border-t border-envrt-brand-black/8" : ""
                }`}
              >
                <span className="text-sm leading-snug text-envrt-brand-black/80">
                  {feat.name}
                </span>
                <PlanValue value={value} />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function PlanValue({ value }: { value: boolean | string | undefined }) {
  if (typeof value === "boolean") {
    return value ? (
      <span className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-envrt-brand-ultramarine/10 text-envrt-brand-ultramarine">
        <AssetIcon type="audit" size={12} />
      </span>
    ) : (
      <span aria-hidden className="flex-shrink-0 text-envrt-brand-black/30">
        —
      </span>
    );
  }
  return (
    <span className="flex-shrink-0 text-right text-sm font-medium text-envrt-brand-black">
      {value ?? "—"}
    </span>
  );
}

// ─── Tablet+: sticky table ────────────────────────────────────────────────

function StickyTable() {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full min-w-[640px] table-fixed">
        <colgroup>
          <col className="w-[40%]" />
          <col className="w-[20%]" />
          <col className="w-[20%]" />
          <col className="w-[20%]" />
        </colgroup>
        <thead className="sticky top-0 z-10 bg-envrt-brand-vista">
          <tr>
            <th className="sticky left-0 z-20 bg-envrt-brand-vista px-4 py-4 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55 sm:px-6">
              Feature
            </th>
            {pricingPlans.map((plan) => (
              <th
                key={plan.slug}
                className="bg-envrt-brand-vista px-3 py-4 text-center font-display text-sm font-semibold tracking-tight text-envrt-brand-black sm:px-6 sm:text-base"
              >
                {plan.name}
              </th>
            ))}
          </tr>
        </thead>
        {pricingComparison.categories.map((cat) => (
          <tbody key={cat.name}>
            <tr>
              <td
                colSpan={4}
                className="bg-envrt-brand-vista/50 px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine sm:px-6"
              >
                {cat.name}
              </td>
            </tr>
            {cat.features.map((feat) => (
              <tr key={feat.name} className="border-t border-envrt-brand-black/8">
                <td className="sticky left-0 z-[1] bg-white px-4 py-3 text-sm text-envrt-brand-black/75 sm:px-6">
                  {feat.name}
                </td>
                <td className="px-3 py-3 text-center text-sm sm:px-6">
                  <Cell value={feat.starter} />
                </td>
                <td className="px-3 py-3 text-center text-sm sm:px-6">
                  <Cell value={feat.growth} />
                </td>
                <td className="px-3 py-3 text-center text-sm sm:px-6">
                  <Cell value={feat.pro} />
                </td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === "boolean") {
    return value ? (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-envrt-brand-ultramarine/10 text-envrt-brand-ultramarine">
        <AssetIcon type="audit" size={12} />
      </span>
    ) : (
      <span aria-hidden className="text-envrt-brand-black/25">
        —
      </span>
    );
  }
  return (
    <span className="text-xs text-envrt-brand-black/75 sm:text-sm">{value}</span>
  );
}
