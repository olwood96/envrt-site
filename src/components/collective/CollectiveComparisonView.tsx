"use client";

import { useState, useRef, useCallback, useEffect, lazy, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { toPng } from "html-to-image";
import type { CollectiveCardData } from "@/lib/collective/types";

const CollectiveProductionMap = lazy(() =>
  import("./CollectiveProductionMap").then((m) => ({
    default: m.CollectiveProductionMap,
  }))
);

/* ── Constants ── */

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

function titleCase(s: string): string {
  return s
    .split(/(\s+|-)/g)
    .map((part) =>
      /\s|-/.test(part) ? part : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    )
    .join("");
}

/* ── Sub-components ── */

function RadarChart({ cards }: { cards: CollectiveCardData[] }) {
  const radius = 110;
  const cx = 200;
  const cy = 170;
  const vbW = 400;
  const vbH = 320;
  const levels = 4;
  const n = RADAR_METRICS.length;
  const angleStep = (2 * Math.PI) / n;
  const pt = (i: number, r: number) => ({
    x: cx + r * Math.sin(i * angleStep),
    y: cy - r * Math.cos(i * angleStep),
  });

  return (
    <div className="flex flex-col items-center">
      <div className="mb-1 flex flex-wrap justify-center gap-4">
        {cards.map((card, ci) => {
          const color = RADAR_COLORS[ci % RADAR_COLORS.length];
          return (
            <div key={card.dpp.id} className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color.stroke }} />
              <span className="text-xs font-medium text-envrt-charcoal">{card.dpp.garment_name}</span>
            </div>
          );
        })}
      </div>
      <svg viewBox={`0 0 ${vbW} ${vbH}`} className="w-full">
        {Array.from({ length: levels }, (_, l) => {
          const r = (radius / levels) * (l + 1);
          const pts = Array.from({ length: n }, (_, i) => pt(i, r)).map((p) => `${p.x},${p.y}`).join(" ");
          return <polygon key={l} points={pts} fill="none" stroke="#e5e7eb" strokeWidth={0.5} />;
        })}
        {Array.from({ length: n }, (_, i) => {
          const p = pt(i, radius);
          return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#e5e7eb" strokeWidth={0.5} />;
        })}
        {cards.map((card, ci) => {
          const color = RADAR_COLORS[ci % RADAR_COLORS.length];
          const pts = RADAR_METRICS.map((m, mi) => {
            const score = m.score(card);
            const norm = score != null ? Math.max(0.08, Math.min(1, score / 100)) : 0.08;
            return pt(mi, radius * norm);
          }).map((p) => `${p.x},${p.y}`).join(" ");
          return <polygon key={card.dpp.id} points={pts} fill={color.fill} stroke={color.stroke} strokeWidth={1.5} />;
        })}
        {cards.map((card, ci) => {
          const color = RADAR_COLORS[ci % RADAR_COLORS.length];
          return RADAR_METRICS.map((m, mi) => {
            const score = m.score(card);
            const norm = score != null ? Math.max(0.08, Math.min(1, score / 100)) : 0.08;
            const p = pt(mi, radius * norm);
            return <circle key={`${card.dpp.id}-${m.key}`} cx={p.x} cy={p.y} r={3} fill={color.stroke} />;
          });
        })}
        {RADAR_METRICS.map((m, i) => {
          const p = pt(i, radius + 28);
          return (
            <text key={m.key} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="fill-envrt-muted" style={{ fontSize: 13 }}>
              {m.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function WinnerBadge() {
  return (
    <span className="ml-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-envrt-teal/10 text-envrt-teal" title="Best in this comparison">
      <svg className="h-2 w-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
      </svg>
    </span>
  );
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="group/info relative ml-1 inline-flex cursor-help">
      <svg className="h-3.5 w-3.5 text-envrt-muted/40 transition-colors group-hover/info:text-envrt-teal" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
      </svg>
      <span className="pointer-events-none absolute bottom-full left-0 z-30 mb-2 hidden w-52 rounded-lg border border-envrt-charcoal/10 bg-white px-3 py-2 text-[10px] font-normal leading-relaxed text-envrt-charcoal shadow-lg group-hover/info:block">
        {text}
        <span className="absolute left-3 top-full border-4 border-transparent border-t-white" />
      </span>
    </span>
  );
}

/* ── Main component ── */

interface Props {
  cards: CollectiveCardData[];
}

const EXPORT_ID = "comparison-export";

export function ComparisonShareButton() {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => { setCopied(false); setShareOpen(false); }, 1500);
    } catch {
      const input = document.createElement("input");
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => { setCopied(false); setShareOpen(false); }, 1500);
    }
  }, []);

  const handleExport = useCallback(async () => {
    const el = document.getElementById(EXPORT_ID);
    if (!el || exporting) return;
    setShareOpen(false);
    setExporting(true);
    try {
      const dataUrl = await toPng(el, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        width: el.scrollWidth,
        height: el.scrollHeight,
        style: { padding: "32px", borderRadius: "16px" },
      });
      const link = document.createElement("a");
      link.download = `envrt-comparison-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      /* silently fail */
    } finally {
      setExporting(false);
    }
  }, [exporting]);

  // Close dropdown on click outside
  useEffect(() => {
    if (!shareOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShareOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [shareOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShareOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-envrt-charcoal/8 px-3.5 py-2 text-xs font-medium text-envrt-muted transition-colors hover:border-envrt-teal/20 hover:text-envrt-teal"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" /></svg>
        Share
        <svg className={`h-3 w-3 transition-transform ${shareOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
      </button>
      {shareOpen && (
        <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-lg border border-envrt-charcoal/8 bg-white shadow-lg">
          <button
            onClick={handleCopyLink}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-xs font-medium text-envrt-charcoal transition-colors hover:bg-envrt-cream/40"
          >
            {copied ? (
              <>
                <svg className="h-3.5 w-3.5 text-envrt-teal" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" /></svg>
                Link copied!
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5 text-envrt-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
                Copy link
              </>
            )}
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex w-full items-center gap-2 border-t border-envrt-charcoal/5 px-3 py-2.5 text-xs font-medium text-envrt-charcoal transition-colors hover:bg-envrt-cream/40 disabled:opacity-50"
          >
            <svg className="h-3.5 w-3.5 text-envrt-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            {exporting ? "Exporting..." : "Save as image"}
          </button>
        </div>
      )}
    </div>
  );
}

export function CollectiveComparisonView({ cards }: Props) {

  /* ── Derived data ── */

  const metrics: MetricRow[] = [
    { label: "CO₂e emissions", values: cards.map((c) => c.dpp.total_emissions), unit: "kg", lowerIsBetter: true },
    { label: "Emissions / kg", values: cards.map((c) => c.dpp.total_emissions != null ? c.dpp.total_emissions / (c.dpp.garment_mass_g / 1000) : null), unit: "kg CO₂e/kg", lowerIsBetter: true, format: (v) => v.toFixed(2) },
    { label: "Water usage", values: cards.map((c) => c.dpp.total_water), unit: "L", lowerIsBetter: true },
    { label: "Water / kg", values: cards.map((c) => c.dpp.total_water != null ? c.dpp.total_water / (c.dpp.garment_mass_g / 1000) : null), unit: "L/kg", lowerIsBetter: true, format: (v) => v.toFixed(1) },
    { label: "Traceability", values: cards.map((c) => c.dpp.traceability_score), unit: "%", lowerIsBetter: false },
    { label: "Mass", values: cards.map((c) => c.dpp.garment_mass_g), unit: "g", lowerIsBetter: false },
  ];

  const hasAnyReduction = cards.some(
    (c) =>
      (c.dpp.total_emissions_reduction_pct != null && c.dpp.total_emissions_reduction_pct > 0) ||
      (c.dpp.total_water_reduction_pct != null && c.dpp.total_water_reduction_pct > 0)
  );

  const hasAnyJourney = cards.some((c) => c.dpp.production_stages?.some((s) => s.country));

  // Collect unique journey stage labels across all products
  const journeyLabels: string[] = [];
  if (hasAnyJourney) {
    cards.forEach((card) => {
      card.dpp.production_stages?.filter((s) => s.country).forEach((s) => {
        if (!journeyLabels.includes(s.label)) journeyLabels.push(s.label);
      });
    });
  }

  /*
   * ONE grid for the entire layout.
   * Col 1: label column (radar chart in header, metric labels below)
   * Col 2+: one per product (images in header, values below, maps below that)
   *
   * The label column is wide enough to hold the radar (~30% of width).
   * Product columns share remaining space equally.
   */
  const gridClass =
    cards.length === 2
      ? "grid-cols-[35%_1fr_1fr]"
      : "grid-cols-[28%_1fr_1fr_1fr]";

  const colSpanFull =
    cards.length === 2 ? "col-span-3" : "col-span-4";

  function formatValue(value: number | null, metric: MetricRow): string | null {
    if (value == null) return null;
    if (metric.format) return metric.format(value);
    if (metric.unit === "%") return `${Math.round(value)}${metric.unit}`;
    return `${value.toFixed(1)} ${metric.unit}`;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-envrt-charcoal/5 bg-white">
      <div id={EXPORT_ID} className={`grid ${gridClass} min-w-[600px] p-6 sm:p-8`}>

        {/* ====== ROW: Header (radar + product cards) ====== */}
        <div className="p-2 self-center">
          <RadarChart cards={cards} />
        </div>
        {cards.map((card) => (
          <Link
            key={card.dpp.id}
            href={card.detailUrl}
            className="group flex flex-col items-center px-2 py-4 text-center self-center"
          >
            <div className="mb-3 aspect-square w-full max-w-[180px] overflow-hidden rounded-xl border border-envrt-charcoal/5 bg-envrt-cream/40">
              {card.productImageUrl ? (
                <Image src={card.productImageUrl} alt={card.dpp.garment_name} width={180} height={180} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-envrt-muted/30">DPP</div>
              )}
            </div>
            <p className="text-sm font-semibold text-envrt-charcoal group-hover:text-envrt-green">{card.dpp.garment_name}</p>
            <p className="text-xs text-envrt-muted">{card.dpp.collection_name}</p>
          </Link>
        ))}

        {/* ====== Divider ====== */}
        <div className={`${colSpanFull} border-t border-envrt-charcoal/5`} />

        {/* ====== ROW: Materials ====== */}
        <div className="flex items-center py-3 px-2 text-sm font-medium text-envrt-muted">Materials</div>
        {cards.map((card) => {
          const sorted = [...card.dpp.constituents].sort((a, b) => b.pct - a.pct);
          return (
            <div key={card.dpp.id} className="flex items-center justify-center py-3 px-2 text-center text-xs font-medium text-envrt-teal">
              {sorted.length > 0 ? sorted.map((c) => `${c.material} ${c.pct}%`).join(", ") : <span className="text-envrt-muted">—</span>}
            </div>
          );
        })}

        {/* ====== ROWS: Metrics ====== */}
        {metrics.map((metric) => {
          const validValues = metric.values.filter((v): v is number => v != null);
          const best = bestValue(metric.values, metric.lowerIsBetter);

          return (
            <div key={metric.label} className={`${colSpanFull} contents`}>
              <div className={`${colSpanFull} border-t border-envrt-charcoal/5`} />

              <div className="flex items-center py-3 px-2 pr-4">
                <span className="inline-flex items-center text-sm font-medium text-envrt-muted">
                  {metric.label}
                  {METRIC_EXPLAINERS[metric.label] && <InfoTooltip text={METRIC_EXPLAINERS[metric.label]} />}
                </span>
              </div>

              {metric.values.map((value, i) => {
                const isBest = value != null && best != null && value === best && validValues.length > 1;
                const formatted = formatValue(value, metric);
                return (
                  <div key={cards[i].dpp.id} className="flex items-center justify-center py-3 px-2">
                    {formatted != null ? (
                      <span className={`inline-flex items-center text-base font-semibold ${isBest ? "text-envrt-teal" : "text-envrt-charcoal"}`}>
                        {formatted}
                        {isBest && <WinnerBadge />}
                      </span>
                    ) : (
                      <span className="text-sm text-envrt-muted">—</span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* ====== ROWS: Reduction vs avg ====== */}
        {hasAnyReduction && (
          <>
            <div className={`${colSpanFull} border-t border-envrt-charcoal/5`} />
            <div className="flex items-center py-3 px-2 pr-4">
              <span className="inline-flex items-center text-sm font-medium text-envrt-muted">
                Emissions vs avg
                <InfoTooltip text="Percentage reduction in emissions compared to the industry average for this garment type." />
              </span>
            </div>
            {cards.map((card) => {
              const pct = card.dpp.total_emissions_reduction_pct;
              return (
                <div key={card.dpp.id} className="flex items-center justify-center py-3 px-2">
                  {pct != null && pct > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-envrt-green/8 px-3 py-1 text-xs font-semibold text-envrt-green">
                      ↓ {Math.round(pct)}%
                    </span>
                  ) : (
                    <span className="text-sm text-envrt-muted">—</span>
                  )}
                </div>
              );
            })}

            <div className={`${colSpanFull} border-t border-envrt-charcoal/5`} />
            <div className="flex items-center py-3 px-2 pr-4">
              <span className="inline-flex items-center text-sm font-medium text-envrt-muted">
                Water vs avg
                <InfoTooltip text="Percentage reduction in water usage compared to the industry average for this garment type." />
              </span>
            </div>
            {cards.map((card) => {
              const pct = card.dpp.total_water_reduction_pct;
              return (
                <div key={card.dpp.id} className="flex items-center justify-center py-3 px-2">
                  {pct != null && pct > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      ↓ {Math.round(pct)}%
                    </span>
                  ) : (
                    <span className="text-sm text-envrt-muted">—</span>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* ====== Production journeys ====== */}
        {hasAnyJourney && (
          <>
            <div className={`${colSpanFull} mt-4 border-t border-envrt-charcoal/5 pt-4`}>
              <h3 className="flex items-center gap-1.5 text-sm font-semibold text-envrt-charcoal">
                <svg className="h-4 w-4 text-envrt-teal" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                </svg>
                Production journeys
              </h3>
            </div>

            {/* Maps row */}
            <div /> {/* empty label cell */}
            {cards.map((card) => {
              const hasStages = card.dpp.production_stages?.some((s) => s.country);
              return (
                <div key={card.dpp.id} className="px-2 pt-3">
                  {hasStages ? (
                    <Suspense
                      fallback={
                        <div className="flex h-[140px] items-center justify-center rounded-lg bg-envrt-cream/40">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-envrt-teal border-t-transparent" />
                        </div>
                      }
                    >
                      <CollectiveProductionMap stages={card.dpp.production_stages!} />
                    </Suspense>
                  ) : (
                    <div className="flex h-[140px] items-center justify-center rounded-lg bg-envrt-cream/20 text-xs text-envrt-muted">
                      No journey data
                    </div>
                  )}
                </div>
              );
            })}

            {/* Stage rows */}
            {journeyLabels.map((label) => (
              <div key={label} className={`${colSpanFull} contents`}>
                <div className={`${colSpanFull} border-t border-envrt-charcoal/5`} />
                <div className="flex items-center py-2 px-2 text-xs text-envrt-muted">{label}</div>
                {cards.map((card) => {
                  const stages = card.dpp.production_stages?.filter((s) => s.country && s.label === label) ?? [];
                  const locations = Array.from(
                    new Set(
                      stages.map((s) =>
                        s.regional ? `${titleCase(s.regional)}, ${titleCase(s.country!)}` : titleCase(s.country!)
                      )
                    )
                  );
                  return (
                    <div key={card.dpp.id} className="flex flex-col items-center justify-center py-2 px-2 text-center text-xs font-medium text-envrt-charcoal">
                      {locations.length > 0 ? locations.map((loc) => <div key={loc}>{loc}</div>) : "—"}
                    </div>
                  );
                })}
              </div>
            ))}
          </>
        )}

        {/* ====== Watermark ====== */}
        <div className={`${colSpanFull} mt-6 text-center text-[10px] text-envrt-muted/40`}>
          Compared on envrt.com/collective
        </div>
      </div>
    </div>
  );
}
