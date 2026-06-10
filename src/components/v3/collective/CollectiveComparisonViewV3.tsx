"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  lazy,
  Suspense,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { toPng } from "html-to-image";
import type { CollectiveCardData } from "@/lib/collective/types";
import {
  deduplicateConstituents,
  showReductionFor,
} from "@/lib/collective/utils";
import { StitchingLoader } from "@/components/ui/StitchingLoader";

const CollectiveProductionMap = lazy(() =>
  import("@/components/collective/CollectiveProductionMap").then((m) => ({
    default: m.CollectiveProductionMap,
  })),
);

const METRIC_EXPLAINERS: Record<string, string> = {
  "CO₂e emissions":
    "Total greenhouse gas emissions across the product lifecycle, measured in kilograms of carbon dioxide equivalent.",
  "Emissions / kg":
    "Emissions normalised by product weight, enables fair comparison between lightweight and heavy garments.",
  "Water usage":
    "Total freshwater consumed across the product lifecycle, weighted by local water scarcity.",
  "Water / kg":
    "Water usage normalised by product weight, enables fair comparison regardless of garment size.",
  Transparency:
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
      return c.dpp.total_emissions != null
        ? Math.max(0, 100 - c.dpp.total_emissions * 5)
        : null;
    },
  },
  {
    key: "water",
    label: "Low water",
    score: (c: CollectiveCardData) => {
      if (c.dpp.total_water_reduction_pct != null)
        return Math.min(100, Math.max(0, c.dpp.total_water_reduction_pct));
      return c.dpp.total_water != null
        ? Math.max(0, 100 - c.dpp.total_water * 0.5)
        : null;
    },
  },
  {
    key: "transparency",
    label: "Transparency",
    score: (c: CollectiveCardData) => c.dpp.transparency_score,
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
  { stroke: "#2e1594", fill: "rgba(46, 21, 148, 0.14)" },
  { stroke: "#6366f1", fill: "rgba(99, 102, 241, 0.10)" },
  { stroke: "#9333ea", fill: "rgba(147, 51, 234, 0.10)" },
];

interface MetricRow {
  label: string;
  values: (number | null)[];
  unit: string;
  lowerIsBetter: boolean;
  format?: (v: number) => string;
}

function bestValue(
  values: (number | null)[],
  lowerIsBetter: boolean,
): number | null {
  const valid = values.filter((v): v is number => v != null);
  if (valid.length === 0) return null;
  return lowerIsBetter ? Math.min(...valid) : Math.max(...valid);
}

function titleCase(s: string): string {
  return s
    .split(/(\s+|-)/g)
    .map((part) =>
      /\s|-/.test(part)
        ? part
        : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
    )
    .join("");
}

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
      <div className="mb-3 flex flex-wrap justify-center gap-4">
        {cards.map((card, ci) => {
          const color = RADAR_COLORS[ci % RADAR_COLORS.length];
          return (
            <div key={card.dpp.id} className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: color.stroke }}
              />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/70 sm:text-[11px]">
                {card.dpp.garment_name}
              </span>
            </div>
          );
        })}
      </div>
      <svg viewBox={`0 0 ${vbW} ${vbH}`} className="w-full">
        {Array.from({ length: levels }, (_, l) => {
          const r = (radius / levels) * (l + 1);
          const pts = Array.from({ length: n }, (_, i) => pt(i, r))
            .map((p) => `${p.x},${p.y}`)
            .join(" ");
          return (
            <polygon
              key={l}
              points={pts}
              fill="none"
              stroke="rgba(14,14,14,0.08)"
              strokeWidth={0.6}
            />
          );
        })}
        {Array.from({ length: n }, (_, i) => {
          const p = pt(i, radius);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke="rgba(14,14,14,0.08)"
              strokeWidth={0.6}
            />
          );
        })}
        {cards.map((card, ci) => {
          const color = RADAR_COLORS[ci % RADAR_COLORS.length];
          const pts = RADAR_METRICS.map((m, mi) => {
            const score = m.score(card);
            const norm =
              score != null ? Math.max(0.08, Math.min(1, score / 100)) : 0.08;
            return pt(mi, radius * norm);
          })
            .map((p) => `${p.x},${p.y}`)
            .join(" ");
          return (
            <polygon
              key={card.dpp.id}
              points={pts}
              fill={color.fill}
              stroke={color.stroke}
              strokeWidth={1.5}
            />
          );
        })}
        {cards.map((card, ci) => {
          const color = RADAR_COLORS[ci % RADAR_COLORS.length];
          return RADAR_METRICS.map((m, mi) => {
            const score = m.score(card);
            const norm =
              score != null ? Math.max(0.08, Math.min(1, score / 100)) : 0.08;
            const p = pt(mi, radius * norm);
            return (
              <circle
                key={`${card.dpp.id}-${m.key}`}
                cx={p.x}
                cy={p.y}
                r={3}
                fill={color.stroke}
              />
            );
          });
        })}
        {RADAR_METRICS.map((m, i) => {
          const p = pt(i, radius + 28);
          return (
            <text
              key={m.key}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-envrt-brand-black/55"
              style={{ fontSize: 12, fontWeight: 600 }}
            >
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
    <span
      className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-envrt-brand-black text-envrt-brand-neon"
      title="Best in this comparison"
    >
      <svg className="h-2.5 w-2.5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  );
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="group/info relative ml-1 inline-flex cursor-help">
      <svg
        className="h-3.5 w-3.5 text-envrt-brand-black/35 transition-colors group-hover/info:text-envrt-brand-ultramarine"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
        />
      </svg>
      <span className="pointer-events-none absolute bottom-full left-0 z-30 mb-2 hidden w-60 rounded-xl border border-envrt-brand-black/10 bg-white px-3 py-2 text-[11px] font-normal leading-relaxed text-envrt-brand-black/80 shadow-lg group-hover/info:block">
        {text}
        <span
          aria-hidden
          className="absolute left-3 top-full border-4 border-transparent border-t-white"
        />
      </span>
    </span>
  );
}

interface Props {
  cards: CollectiveCardData[];
}

const EXPORT_ID = "comparison-export-v3";

export function ComparisonShareButtonV3() {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShareOpen(false);
      }, 1500);
    } catch {
      const input = document.createElement("input");
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShareOpen(false);
      }, 1500);
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
        style: { padding: "32px", borderRadius: "24px" },
      });
      const link = document.createElement("a");
      link.download = `envrt-comparison-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // silently fail
    } finally {
      setExporting(false);
    }
  }, [exporting]);

  useEffect(() => {
    if (!shareOpen) return;
    const onClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShareOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [shareOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setShareOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-full border border-envrt-brand-black/12 bg-white px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/75 transition-colors duration-200 hover:border-envrt-brand-ultramarine/30 hover:text-envrt-brand-ultramarine sm:text-[11px]"
        aria-expanded={shareOpen}
      >
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
          />
        </svg>
        Share
        <svg
          aria-hidden
          className={`h-3 w-3 transition-transform duration-200 ${
            shareOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      {shareOpen && (
        <div className="absolute right-0 top-full z-20 mt-2 w-52 overflow-hidden rounded-2xl border border-envrt-brand-black/12 bg-white p-1 shadow-[0_24px_50px_-22px_rgba(14,14,14,0.18)]">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-envrt-brand-black/80 transition-colors hover:bg-envrt-brand-black/4"
          >
            {copied ? (
              <>
                <svg
                  className="h-3.5 w-3.5 text-envrt-brand-ultramarine"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                    clipRule="evenodd"
                  />
                </svg>
                Link copied
              </>
            ) : (
              <>
                <svg
                  className="h-3.5 w-3.5 text-envrt-brand-black/55"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                  />
                </svg>
                Copy link
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-envrt-brand-black/80 transition-colors hover:bg-envrt-brand-black/4 disabled:opacity-50"
          >
            <svg
              className="h-3.5 w-3.5 text-envrt-brand-black/55"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            {exporting ? "Exporting…" : "Save as image"}
          </button>
        </div>
      )}
    </div>
  );
}

export function CollectiveComparisonViewV3({ cards }: Props) {
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
        c.dpp.total_emissions != null
          ? c.dpp.total_emissions / (c.dpp.garment_mass_g / 1000)
          : null,
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
        c.dpp.total_water != null
          ? c.dpp.total_water / (c.dpp.garment_mass_g / 1000)
          : null,
      ),
      unit: "L/kg",
      lowerIsBetter: true,
      format: (v) => v.toFixed(1),
    },
    {
      label: "Transparency",
      values: cards.map((c) => c.dpp.transparency_score),
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
      showReductionFor(c.dpp) &&
      ((c.dpp.total_emissions_reduction_pct != null &&
        c.dpp.total_emissions_reduction_pct > 0) ||
        (c.dpp.total_water_reduction_pct != null &&
          c.dpp.total_water_reduction_pct > 0)),
  );

  const hasAnyJourney = cards.some((c) =>
    c.dpp.production_stages?.some((s) => s.country),
  );

  const journeyLabels: string[] = [];
  if (hasAnyJourney) {
    cards.forEach((card) => {
      card.dpp.production_stages
        ?.filter((s) => s.country)
        .forEach((s) => {
          if (!journeyLabels.includes(s.label)) journeyLabels.push(s.label);
        });
    });
  }

  const gridClass =
    cards.length === 2
      ? "grid-cols-[32%_1fr_1fr]"
      : "grid-cols-[26%_1fr_1fr_1fr]";

  const colSpanFull = cards.length === 2 ? "col-span-3" : "col-span-4";

  function formatValue(value: number | null, metric: MetricRow): string | null {
    if (value == null) return null;
    if (metric.format) return metric.format(value);
    if (metric.unit === "%") return `${Math.round(value)}${metric.unit}`;
    return `${value.toFixed(1)} ${metric.unit}`;
  }

  return (
    <div className="rounded-3xl border border-envrt-brand-black/10 bg-white">
      <div className="block sm:hidden p-6 pb-4">
        <RadarChart cards={cards} />
        <div className="mt-4 border-b border-envrt-brand-black/8" />
      </div>

      <div className="scrollbar-subtle overflow-x-auto">
        <div
          id={EXPORT_ID}
          className={`grid ${gridClass} min-w-[640px] p-6 sm:p-10`}
        >
          <div className="self-center p-2">
            <div className="hidden sm:block">
              <RadarChart cards={cards} />
            </div>
          </div>
          {cards.map((card) => (
            <Link
              key={card.dpp.id}
              href={card.detailUrl}
              className="group flex flex-col items-center self-start px-2 py-4 text-center"
            >
              <div className="mb-4 aspect-square w-full max-w-[200px] overflow-hidden rounded-2xl border border-envrt-brand-black/8 bg-envrt-brand-vista/40">
                {card.productImageUrl ? (
                  <Image
                    src={card.productImageUrl}
                    alt={card.dpp.garment_name}
                    width={200}
                    height={200}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/35">
                    DPP
                  </div>
                )}
              </div>
              <p className="font-display text-base font-medium leading-tight tracking-tight text-envrt-brand-black transition-colors duration-200 group-hover:text-envrt-brand-ultramarine sm:text-lg">
                {card.dpp.garment_name}
              </p>
              <p className="mt-1 text-xs text-envrt-brand-black/55">
                {card.dpp.collection_name}
              </p>
            </Link>
          ))}

          <div
            className={`${colSpanFull} border-t border-envrt-brand-black/8`}
          />

          <div className="flex items-center px-2 py-4">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/65 sm:text-[11px]">
              Materials
            </span>
          </div>
          {cards.map((card) => {
            const sorted = deduplicateConstituents(card.dpp.constituents);
            return (
              <div
                key={card.dpp.id}
                className="flex items-center justify-center px-2 py-4 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine sm:text-[11px]"
              >
                {sorted.length > 0 ? (
                  sorted.map((c) => `${c.material} ${c.pct}%`).join(", ")
                ) : (
                  <span className="text-envrt-brand-black/40">—</span>
                )}
              </div>
            );
          })}

          {metrics.map((metric) => {
            const validValues = metric.values.filter(
              (v): v is number => v != null,
            );
            const best = bestValue(metric.values, metric.lowerIsBetter);

            return (
              <div key={metric.label} className={`${colSpanFull} contents`}>
                <div
                  className={`${colSpanFull} border-t border-envrt-brand-black/8`}
                />

                <div className="flex items-center px-2 py-4 pr-4">
                  <span className="inline-flex items-center font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/65 sm:text-[11px]">
                    {metric.label}
                    {METRIC_EXPLAINERS[metric.label] && (
                      <InfoTooltip text={METRIC_EXPLAINERS[metric.label]} />
                    )}
                  </span>
                </div>

                {metric.values.map((value, i) => {
                  const isBest =
                    value != null &&
                    best != null &&
                    value === best &&
                    validValues.length > 1;
                  const formatted = formatValue(value, metric);
                  return (
                    <div
                      key={cards[i].dpp.id}
                      className="flex items-center justify-center px-2 py-4"
                    >
                      {formatted != null ? (
                        <span
                          className={`inline-flex items-center font-display text-lg font-medium tracking-tight sm:text-xl ${
                            isBest
                              ? "text-envrt-brand-ultramarine"
                              : "text-envrt-brand-black"
                          }`}
                        >
                          {formatted}
                          {isBest && <WinnerBadge />}
                        </span>
                      ) : (
                        <span className="text-sm text-envrt-brand-black/40">
                          —
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}

          {hasAnyReduction && (
            <>
              <div
                className={`${colSpanFull} border-t border-envrt-brand-black/8`}
              />
              <div className="flex items-center px-2 py-4 pr-4">
                <span className="inline-flex items-center font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/65 sm:text-[11px]">
                  Emissions vs avg
                  <InfoTooltip text="Percentage reduction in emissions compared to the industry average for this garment type." />
                </span>
              </div>
              {cards.map((card) => {
                const allowed = showReductionFor(card.dpp);
                const pct = card.dpp.total_emissions_reduction_pct;
                return (
                  <div
                    key={card.dpp.id}
                    className="flex items-center justify-center px-2 py-4"
                  >
                    {allowed && pct != null && pct > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-envrt-brand-black px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-neon sm:text-[11px]">
                        ↓ {Math.round(pct)}%
                      </span>
                    ) : (
                      <span className="text-sm text-envrt-brand-black/40">—</span>
                    )}
                  </div>
                );
              })}

              <div
                className={`${colSpanFull} border-t border-envrt-brand-black/8`}
              />
              <div className="flex items-center px-2 py-4 pr-4">
                <span className="inline-flex items-center font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/65 sm:text-[11px]">
                  Water vs avg
                  <InfoTooltip text="Percentage reduction in water usage compared to the industry average for this garment type." />
                </span>
              </div>
              {cards.map((card) => {
                const allowed = showReductionFor(card.dpp);
                const pct = card.dpp.total_water_reduction_pct;
                return (
                  <div
                    key={card.dpp.id}
                    className="flex items-center justify-center px-2 py-4"
                  >
                    {allowed && pct != null && pct > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-envrt-brand-black px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-neon sm:text-[11px]">
                        ↓ {Math.round(pct)}%
                      </span>
                    ) : (
                      <span className="text-sm text-envrt-brand-black/40">—</span>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {hasAnyJourney && (
            <>
              <div
                className={`${colSpanFull} mt-6 border-t border-envrt-brand-black/8 pt-6`}
              >
                <h3 className="flex items-center gap-2 font-display text-base font-medium leading-tight tracking-tight text-envrt-brand-black sm:text-lg">
                  <svg
                    className="h-4 w-4 text-envrt-brand-ultramarine"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
                    />
                  </svg>
                  Production journeys
                </h3>
              </div>

              <div className="hidden sm:block" />
              {cards.map((card) => {
                const hasStages = card.dpp.production_stages?.some(
                  (s) => s.country,
                );
                return (
                  <div
                    key={card.dpp.id}
                    className="hidden px-2 pt-4 sm:block"
                  >
                    {hasStages ? (
                      <Suspense
                        fallback={
                          <div className="flex h-[140px] items-center justify-center rounded-2xl bg-envrt-brand-vista/40">
                            <StitchingLoader
                              label="Loading journey"
                              className="py-0"
                            />
                          </div>
                        }
                      >
                        <CollectiveProductionMap
                          stages={card.dpp.production_stages!}
                        />
                      </Suspense>
                    ) : (
                      <div className="flex h-[140px] items-center justify-center rounded-2xl bg-envrt-brand-vista/30 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/40">
                        No journey data
                      </div>
                    )}
                  </div>
                );
              })}

              {journeyLabels.map((label) => (
                <div key={label} className={`${colSpanFull} contents`}>
                  <div
                    className={`${colSpanFull} border-t border-envrt-brand-black/8`}
                  />
                  <div className="flex items-center px-2 py-4 pr-4">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/65 sm:text-[11px]">
                      {label}
                    </span>
                  </div>
                  {cards.map((card) => {
                    const stages =
                      card.dpp.production_stages?.filter(
                        (s) => s.country && s.label === label,
                      ) ?? [];
                    const locations = Array.from(
                      new Set(
                        stages.map((s) =>
                          s.regional
                            ? `${titleCase(s.regional)}, ${titleCase(s.country!)}`
                            : titleCase(s.country!),
                        ),
                      ),
                    );
                    return (
                      <div
                        key={card.dpp.id}
                        className="flex flex-col items-center justify-center px-2 py-4 text-center font-display text-sm font-medium tracking-tight text-envrt-brand-black sm:text-base"
                      >
                        {locations.length > 0 ? (
                          locations.map((loc) => <div key={loc}>{loc}</div>)
                        ) : (
                          <span className="text-sm text-envrt-brand-black/40">
                            —
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </>
          )}

          <div
            className={`${colSpanFull} mt-8 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/35`}
          >
            Compared on envrt.com/collective
          </div>
        </div>
      </div>
    </div>
  );
}
