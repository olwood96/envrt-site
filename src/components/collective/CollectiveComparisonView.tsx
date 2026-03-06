"use client";

import Image from "next/image";
import Link from "next/link";
import type { CollectiveCardData } from "@/lib/collective/types";

interface Props {
  cards: CollectiveCardData[];
}

interface MetricRow {
  label: string;
  values: (number | null)[];
  unit: string;
  lowerIsBetter: boolean;
}

export function CollectiveComparisonView({ cards }: Props) {
  const metrics: MetricRow[] = [
    {
      label: "CO₂e emissions",
      values: cards.map((c) => c.dpp.total_emissions),
      unit: "kg",
      lowerIsBetter: true,
    },
    {
      label: "Water scarcity",
      values: cards.map((c) => c.dpp.total_water),
      unit: "L",
      lowerIsBetter: true,
    },
    {
      label: "Traceability",
      values: cards.map((c) => c.dpp.traceability_score),
      unit: "%",
      lowerIsBetter: false,
    },
    {
      label: "Mass",
      values: cards.map((c) => c.dpp.garment_mass_g),
      unit: "g",
      lowerIsBetter: false,
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        {/* Product headers */}
        <thead>
          <tr>
            <th className="w-40 pb-6 text-left text-xs font-medium text-envrt-muted" />
            {cards.map((card) => (
              <th key={card.dpp.id} className="pb-6 text-center">
                <Link
                  href={card.detailUrl}
                  className="group inline-block"
                >
                  <div className="mx-auto mb-3 h-20 w-20 overflow-hidden rounded-xl border border-envrt-charcoal/5 bg-envrt-cream/40">
                    {card.productImageUrl ? (
                      <Image
                        src={card.productImageUrl}
                        alt={card.dpp.garment_name}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-envrt-muted/40">
                        DPP
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-envrt-charcoal group-hover:text-envrt-green">
                    {card.dpp.garment_name}
                  </p>
                  <p className="mt-0.5 text-[10px] text-envrt-muted">
                    {card.dpp.collection_name}
                  </p>
                </Link>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* Primary material */}
          <tr className="border-t border-envrt-charcoal/5">
            <td className="py-4 text-xs font-medium text-envrt-muted">
              Primary material
            </td>
            {cards.map((card) => {
              const primary = card.dpp.constituents.length > 0
                ? card.dpp.constituents.reduce((a, b) =>
                    a.pct >= b.pct ? a : b
                  )
                : null;
              return (
                <td key={card.dpp.id} className="py-4 text-center">
                  {primary ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-envrt-teal/5 px-2.5 py-1 text-xs font-medium text-envrt-teal">
                      {primary.material} ({primary.pct}%)
                    </span>
                  ) : (
                    <span className="text-xs text-envrt-muted">—</span>
                  )}
                </td>
              );
            })}
          </tr>

          {/* Metric rows with bars */}
          {metrics.map((metric) => {
            const validValues = metric.values.filter(
              (v): v is number => v != null
            );
            const max = validValues.length > 0 ? Math.max(...validValues) : 1;
            const best = metric.lowerIsBetter
              ? Math.min(...validValues)
              : Math.max(...validValues);

            return (
              <tr
                key={metric.label}
                className="border-t border-envrt-charcoal/5"
              >
                <td className="py-4 text-xs font-medium text-envrt-muted">
                  {metric.label}
                </td>
                {metric.values.map((value, i) => {
                  const isBest = value != null && value === best && validValues.length > 1;
                  const barWidth =
                    value != null && max > 0
                      ? Math.max((value / max) * 100, 4)
                      : 0;

                  return (
                    <td key={cards[i].dpp.id} className="px-3 py-4">
                      {value != null ? (
                        <div className="flex flex-col items-center gap-1.5">
                          <span
                            className={`text-sm font-semibold ${
                              isBest
                                ? "text-envrt-teal"
                                : "text-envrt-charcoal"
                            }`}
                          >
                            {metric.unit === "%"
                              ? `${Math.round(value)}${metric.unit}`
                              : `${value.toFixed(1)} ${metric.unit}`}
                          </span>
                          <div className="h-2 w-full max-w-[120px] overflow-hidden rounded-full bg-envrt-charcoal/5">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isBest
                                  ? "bg-envrt-teal"
                                  : "bg-envrt-charcoal/20"
                              }`}
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-envrt-muted">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
