"use client";

import { useState, useRef, useCallback, lazy, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { toPng } from "html-to-image";
import type { CollectiveCardData } from "@/lib/collective/types";
import { getMaterialDescription } from "@/lib/collective/material-info";

const CollectiveProductionMap = lazy(() =>
  import("./CollectiveProductionMap").then((m) => ({
    default: m.CollectiveProductionMap,
  }))
);

/* ── Metric explainers ── */

const METRIC_EXPLAINERS: Record<string, string> = {
  "CO₂e emissions":
    "Total greenhouse gas emissions across the product lifecycle, measured in kilograms of carbon dioxide equivalent.",
  "Emissions / kg":
    "Emissions normalised by product weight — enables fair comparison between lightweight and heavy garments.",
  "Water usage":
    "Total freshwater consumed across the product lifecycle, weighted by local water scarcity.",
  "Water / kg":
    "Water usage normalised by product weight — enables fair comparison regardless of garment size.",
  Traceability:
    "Percentage of the supply chain that can be traced back to source. Higher is better.",
  Mass: "The total weight of the finished garment in grams.",
};

/* ── Types ── */

interface MetricRow {
  label: string;
  values: (number | null)[];
  unit: string;
  lowerIsBetter: boolean;
  format?: (v: number) => string;
}

/* ── Helpers ── */

function bestValue(values: (number | null)[], lowerIsBetter: boolean): number | null {
  const valid = values.filter((v): v is number => v != null);
  if (valid.length === 0) return null;
  return lowerIsBetter ? Math.min(...valid) : Math.max(...valid);
}

/** Title-case a place name: "turkey" → "Turkey", "AYDIN" → "Aydin" */
function titleCase(s: string): string {
  return s
    .split(/(\s+|-)/g)
    .map((part) =>
      /\s|-/.test(part) ? part : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    )
    .join("");
}

/* ── Radar chart (SVG) ── */

interface RadarProps {
  cards: CollectiveCardData[];
}

/**
 * Radar uses percentage-based scoring (0–100) per axis:
 * - Traceability: raw score (already 0-100)
 * - Emissions/water: scored as reduction percentage vs avg (if available),
 *   otherwise uses a proportional score where lower = better
 * This avoids the relative-normalization problem with only 2 products.
 */
const RADAR_METRICS = [
  {
    key: "emissions",
    label: "Low emissions",
    score: (c: CollectiveCardData) => {
      if (c.dpp.total_emissions_reduction_pct != null)
        return Math.min(100, Math.max(0, c.dpp.total_emissions_reduction_pct));
      return c.dpp.total_emissions != null ? Math.max(0, 100 - c.dpp.total_emissions * 5) : null;
    },
  },
  {
    key: "water",
    label: "Low water",
    score: (c: CollectiveCardData) => {
      if (c.dpp.total_water_reduction_pct != null)
        return Math.min(100, Math.max(0, c.dpp.total_water_reduction_pct));
      return c.dpp.total_water != null ? Math.max(0, 100 - c.dpp.total_water * 0.5) : null;
    },
  },
  {
    key: "traceability",
    label: "Traceability",
    score: (c: CollectiveCardData) => c.dpp.traceability_score,
  },
  {
    key: "emissionsPerKg",
    label: "Emissions / kg",
    score: (c: CollectiveCardData) => {
      if (c.dpp.total_emissions == null) return null;
      const perKg = c.dpp.total_emissions / (c.dpp.garment_mass_g / 1000);
      return Math.max(0, 100 - perKg * 2);
    },
  },
  {
    key: "waterPerKg",
    label: "Water / kg",
    score: (c: CollectiveCardData) => {
      if (c.dpp.total_water == null) return null;
      const perKg = c.dpp.total_water / (c.dpp.garment_mass_g / 1000);
      return Math.max(0, 100 - perKg * 0.003);
    },
  },
];

const RADAR_COLORS = [
  { stroke: "#1a3a2a", fill: "rgba(26, 58, 42, 0.12)" },
  { stroke: "#0d9488", fill: "rgba(13, 148, 136, 0.10)" },
  { stroke: "#3b82f6", fill: "rgba(59, 130, 246, 0.10)" },
];

function RadarChart({ cards }: RadarProps) {
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 90;
  const levels = 4;
  const n = RADAR_METRICS.length;

  const angleStep = (2 * Math.PI) / n;
  const getPoint = (i: number, r: number) => ({
    x: cx + r * Math.sin(i * angleStep),
    y: cy - r * Math.cos(i * angleStep),
  });

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Background grid */}
        {Array.from({ length: levels }, (_, l) => {
          const r = (radius / levels) * (l + 1);
          const points = Array.from({ length: n }, (_, i) => getPoint(i, r))
            .map((p) => `${p.x},${p.y}`)
            .join(" ");
          return <polygon key={`grid-${l}`} points={points} fill="none" stroke="#e5e7eb" strokeWidth={0.5} />;
        })}

        {/* Axis lines */}
        {Array.from({ length: n }, (_, i) => {
          const p = getPoint(i, radius);
          return <line key={`axis-${i}`} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#e5e7eb" strokeWidth={0.5} />;
        })}

        {/* Data polygons */}
        {cards.map((card, ci) => {
          const color = RADAR_COLORS[ci % RADAR_COLORS.length];
          const points = RADAR_METRICS.map((m, mi) => {
            const score = m.score(card);
            const norm = score != null ? Math.max(0.08, Math.min(1, score / 100)) : 0.08;
            return getPoint(mi, radius * norm);
          })
            .map((p) => `${p.x},${p.y}`)
            .join(" ");
          return <polygon key={card.dpp.id} points={points} fill={color.fill} stroke={color.stroke} strokeWidth={1.5} />;
        })}

        {/* Data points */}
        {cards.map((card, ci) => {
          const color = RADAR_COLORS[ci % RADAR_COLORS.length];
          return RADAR_METRICS.map((m, mi) => {
            const score = m.score(card);
            const norm = score != null ? Math.max(0.08, Math.min(1, score / 100)) : 0.08;
            const p = getPoint(mi, radius * norm);
            return <circle key={`${card.dpp.id}-${m.key}`} cx={p.x} cy={p.y} r={2.5} fill={color.stroke} />;
          });
        })}

        {/* Axis labels */}
        {RADAR_METRICS.map((m, i) => {
          const p = getPoint(i, radius + 20);
          return (
            <text key={m.key} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="fill-envrt-muted text-[9px]">
              {m.label}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap justify-center gap-4">
        {cards.map((card, ci) => {
          const color = RADAR_COLORS[ci % RADAR_COLORS.length];
          return (
            <div key={card.dpp.id} className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color.stroke }} />
              <span className="text-[10px] font-medium text-envrt-charcoal">{card.dpp.garment_name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Winner badge ── */

function WinnerBadge() {
  return (
    <span className="ml-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-envrt-teal/10 text-envrt-teal" title="Best in this comparison">
      <svg className="h-2 w-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
      </svg>
    </span>
  );
}

/* ── Info tooltip ── */

function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="group/info relative ml-1 inline-flex cursor-help">
      <svg className="h-3 w-3 text-envrt-muted/40 transition-colors group-hover/info:text-envrt-teal" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
      </svg>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden w-52 -translate-x-1/2 rounded-lg border border-envrt-charcoal/10 bg-white px-3 py-2 text-[10px] font-normal leading-relaxed text-envrt-charcoal shadow-lg group-hover/info:block">
        {text}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-white" />
      </span>
    </span>
  );
}

/* ── Main component ── */

interface Props {
  cards: CollectiveCardData[];
}

export function CollectiveComparisonView({ cards }: Props) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  const handleExport = useCallback(async () => {
    if (!exportRef.current || exporting) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(exportRef.current, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        width: exportRef.current.scrollWidth,
        height: exportRef.current.scrollHeight,
        style: {
          padding: "32px",
          borderRadius: "16px",
        },
      });
      const link = document.createElement("a");
      link.download = `envrt-comparison-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // Silently fail
    } finally {
      setExporting(false);
    }
  }, [exporting]);

  /* ── Metrics ── */

  const metrics: MetricRow[] = [
    {
      label: "CO₂e emissions",
      values: cards.map((c) => c.dpp.total_emissions),
      unit: "kg",
      lowerIsBetter: true,
    },
    {
      label: "Emissions / kg",
      values: cards.map((c) =>
        c.dpp.total_emissions != null ? c.dpp.total_emissions / (c.dpp.garment_mass_g / 1000) : null
      ),
      unit: "kg CO₂e/kg",
      lowerIsBetter: true,
      format: (v) => v.toFixed(2),
    },
    {
      label: "Water usage",
      values: cards.map((c) => c.dpp.total_water),
      unit: "L",
      lowerIsBetter: true,
    },
    {
      label: "Water / kg",
      values: cards.map((c) =>
        c.dpp.total_water != null ? c.dpp.total_water / (c.dpp.garment_mass_g / 1000) : null
      ),
      unit: "L/kg",
      lowerIsBetter: true,
      format: (v) => v.toFixed(1),
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

  const hasAnyReduction = cards.some(
    (c) =>
      (c.dpp.total_emissions_reduction_pct != null && c.dpp.total_emissions_reduction_pct > 0) ||
      (c.dpp.total_water_reduction_pct != null && c.dpp.total_water_reduction_pct > 0)
  );

  const hasAnyJourney = cards.some(
    (c) => c.dpp.production_stages?.some((s) => s.country)
  );

  /* ── Column width helper ── */
  const colClass = cards.length === 2 ? "w-1/3" : "w-1/4";

  return (
    <div>
      {/* Action bar */}
      <div className="mb-5 flex items-center justify-end gap-2">
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-lg border border-envrt-charcoal/8 px-3 py-1.5 text-[11px] font-medium text-envrt-muted transition-colors hover:border-envrt-teal/20 hover:text-envrt-teal"
        >
          {copied ? (
            <>
              <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
              </svg>
              Share
            </>
          )}
        </button>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="inline-flex items-center gap-1.5 rounded-lg border border-envrt-charcoal/8 px-3 py-1.5 text-[11px] font-medium text-envrt-muted transition-colors hover:border-envrt-teal/20 hover:text-envrt-teal disabled:opacity-50"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          {exporting ? "Exporting..." : "Save as image"}
        </button>
      </div>

      {/* Exportable area */}
      <div ref={exportRef}>
        {/* Product headers + radar side by side */}
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
          {/* Product cards */}
          <div className="flex flex-1 justify-center gap-6">
            {cards.map((card) => (
              <Link key={card.dpp.id} href={card.detailUrl} className="group flex flex-col items-center text-center">
                <div className="mb-2 h-24 w-24 overflow-hidden rounded-xl border border-envrt-charcoal/5 bg-envrt-cream/40">
                  {card.productImageUrl ? (
                    <Image src={card.productImageUrl} alt={card.dpp.garment_name} width={96} height={96} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-envrt-muted/30">DPP</div>
                  )}
                </div>
                <p className="text-sm font-semibold text-envrt-charcoal group-hover:text-envrt-green">{card.dpp.garment_name}</p>
                <p className="text-[10px] text-envrt-muted">{card.dpp.collection_name}</p>
              </Link>
            ))}
          </div>

          {/* Radar chart */}
          <div className="shrink-0">
            <RadarChart cards={cards} />
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-envrt-charcoal/5" />

        {/* Metrics table */}
        <div className="overflow-x-auto -mx-2">
          <table className="w-full min-w-[520px]">
            <thead className="sr-only">
              <tr>
                <th>Metric</th>
                {cards.map((c) => (
                  <th key={c.dpp.id}>{c.dpp.garment_name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Materials */}
              <tr>
                <td className="py-3 pl-2 text-[11px] font-medium text-envrt-muted align-top">Materials</td>
                {cards.map((card) => (
                  <td key={card.dpp.id} className={`px-2 py-3 ${colClass}`}>
                    <div className="flex flex-wrap justify-center gap-1">
                      {card.dpp.constituents.length > 0 ? (
                        card.dpp.constituents.map((c) => {
                          const desc = getMaterialDescription(c.material);
                          return (
                            <span key={c.material} className="group/mattip relative inline-flex rounded-full bg-envrt-teal/5 px-2 py-0.5 text-[10px] font-medium text-envrt-teal">
                              {c.material} {c.pct}%
                              {desc && (
                                <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden w-44 -translate-x-1/2 rounded-lg border border-envrt-charcoal/10 bg-white px-2.5 py-1.5 text-[9px] font-normal leading-relaxed text-envrt-charcoal shadow-lg group-hover/mattip:block">
                                  {desc}
                                  <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-white" />
                                </span>
                              )}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-[10px] text-envrt-muted">—</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Metric rows */}
              {metrics.map((metric) => {
                const validValues = metric.values.filter((v): v is number => v != null);
                const max = validValues.length > 0 ? Math.max(...validValues) : 1;
                const best = bestValue(metric.values, metric.lowerIsBetter);

                return (
                  <tr key={metric.label} className="border-t border-envrt-charcoal/5">
                    <td className="py-3 pl-2 text-[11px] font-medium text-envrt-muted align-middle">
                      <span className="inline-flex items-center">
                        {metric.label}
                        {METRIC_EXPLAINERS[metric.label] && <InfoTooltip text={METRIC_EXPLAINERS[metric.label]} />}
                      </span>
                    </td>
                    {metric.values.map((value, i) => {
                      const isBest = value != null && best != null && value === best && validValues.length > 1;
                      const barWidth = value != null && max > 0 ? Math.max((value / max) * 100, 4) : 0;
                      const formatted = value != null
                        ? metric.format
                          ? metric.format(value)
                          : metric.unit === "%" ? `${Math.round(value)}${metric.unit}` : `${value.toFixed(1)} ${metric.unit}`
                        : null;

                      return (
                        <td key={cards[i].dpp.id} className={`px-2 py-3 ${colClass}`}>
                          {formatted != null ? (
                            <div className="flex flex-col items-center gap-1">
                              <span className={`inline-flex items-center text-[13px] font-semibold ${isBest ? "text-envrt-teal" : "text-envrt-charcoal"}`}>
                                {formatted}
                                {isBest && <WinnerBadge />}
                              </span>
                              <div className="h-1.5 w-full max-w-[100px] overflow-hidden rounded-full bg-envrt-charcoal/5">
                                <div
                                  className={`h-full rounded-full ${isBest ? "bg-envrt-teal" : "bg-envrt-charcoal/15"}`}
                                  style={{ width: `${barWidth}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="block text-center text-[10px] text-envrt-muted">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* Reduction vs avg */}
              {hasAnyReduction && (
                <>
                  <tr className="border-t border-envrt-charcoal/5">
                    <td className="py-3 pl-2 text-[11px] font-medium text-envrt-muted align-middle">
                      <span className="inline-flex items-center">
                        Emissions vs avg
                        <InfoTooltip text="Percentage reduction in emissions compared to the industry average for this garment type." />
                      </span>
                    </td>
                    {cards.map((card) => {
                      const pct = card.dpp.total_emissions_reduction_pct;
                      return (
                        <td key={card.dpp.id} className={`px-2 py-3 text-center ${colClass}`}>
                          {pct != null && pct > 0 ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-envrt-green/8 px-2 py-0.5 text-[10px] font-semibold text-envrt-green">
                              ↓ {Math.round(pct)}% below avg
                            </span>
                          ) : (
                            <span className="text-[10px] text-envrt-muted">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="border-t border-envrt-charcoal/5">
                    <td className="py-3 pl-2 text-[11px] font-medium text-envrt-muted align-middle">
                      <span className="inline-flex items-center">
                        Water vs avg
                        <InfoTooltip text="Percentage reduction in water usage compared to the industry average for this garment type." />
                      </span>
                    </td>
                    {cards.map((card) => {
                      const pct = card.dpp.total_water_reduction_pct;
                      return (
                        <td key={card.dpp.id} className={`px-2 py-3 text-center ${colClass}`}>
                          {pct != null && pct > 0 ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                              ↓ {Math.round(pct)}% below avg
                            </span>
                          ) : (
                            <span className="text-[10px] text-envrt-muted">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Production journeys */}
        {hasAnyJourney && (
          <div className="mt-6 border-t border-envrt-charcoal/5 pt-5">
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-envrt-charcoal">
              <svg className="h-3.5 w-3.5 text-envrt-teal" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
              </svg>
              Production journeys
            </h3>
            <div className={`grid gap-4 ${cards.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
              {cards.map((card) => {
                const hasStages = card.dpp.production_stages?.some((s) => s.country);
                return (
                  <div key={card.dpp.id}>
                    <p className="mb-1.5 text-center text-[10px] font-semibold text-envrt-charcoal">{card.dpp.garment_name}</p>
                    {hasStages ? (
                      <Suspense
                        fallback={
                          <div className="flex h-[120px] items-center justify-center rounded-lg bg-envrt-cream/40">
                            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-envrt-teal border-t-transparent" />
                          </div>
                        }
                      >
                        <CollectiveProductionMap stages={card.dpp.production_stages!} />
                      </Suspense>
                    ) : (
                      <div className="flex h-[120px] items-center justify-center rounded-lg bg-envrt-cream/20 text-[10px] text-envrt-muted">
                        No journey data
                      </div>
                    )}
                    {hasStages && (
                      <div className="mt-1.5 space-y-px">
                        {card.dpp.production_stages!
                          .filter((s) => s.country)
                          .map((stage, idx) => (
                            <div key={`${stage.key}-${idx}`} className="flex items-center justify-between text-[9px]">
                              <span className="text-envrt-muted">{stage.label}</span>
                              <span className="font-medium text-envrt-charcoal">
                                {stage.regional ? `${titleCase(stage.regional)}, ${titleCase(stage.country!)}` : titleCase(stage.country!)}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ENVRT branding for export */}
        <div className="mt-6 text-center text-[9px] text-envrt-muted/40">
          Compared on envrt.com/collective
        </div>
      </div>
    </div>
  );
}
