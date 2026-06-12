"use client";

// Per-capability visuals for the platform page. One component per capability,
// dispatched via VisualFor by capability index. Wrapper chrome (aspect ratio,
// brand-tinted wash, index chip) lives on platform/page.tsx; these visuals
// fill the inner canvas only.

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { geoMercator, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import { AssetIcon } from "../AssetIcon";
import { LivePill } from "../_shared";

// ─── Router ───────────────────────────────────────────────────────────────

export function VisualFor({ id }: { id: string }) {
  switch (id) {
    case "01": return <VisualSupplyChainMap />;
    case "02": return <VisualLcaStages />;
    case "03": return <VisualEcoScore />;
    case "04": return <VisualDppPhone />;
    case "05": return <VisualEvidenceVault />;
    case "06": return <VisualAuditPack />;
    case "07": return <VisualComplianceTimeline />;
    case "08": return <VisualScanAnalytics />;
    case "09": return <VisualGreenClaims />;
    default: return null;
  }
}

// ─── 01 · Supply chain mapping ────────────────────────────────────────────
// Lightweight static port of the dashboard SupplierMap. World mercator from
// d3-geo + topojson, fetched once at mount. No interactions, no popup, no
// zoom. Five seeded suppliers covering the four tiers of the hoodie supply
// chain, glow + count badges identical in spirit to the dashboard.

const MAP_W = 960;
const MAP_H = 480;
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const SUPPLIERS = [
  { name: "Viana do Castelo · Assembly", tier: "T1", lng: -8.83, lat: 41.70, color: "#3E00FF", count: 1 },
  { name: "Prato · Fabric mill", tier: "T2", lng: 11.10, lat: 43.88, color: "#00DAFF", count: 1 },
  { name: "Bursa · Fabric", tier: "T2", lng: 29.06, lat: 40.18, color: "#00DAFF", count: 2 },
  { name: "Adana · Yarn spinning", tier: "T3", lng: 35.32, lat: 37.00, color: "#00B92C", count: 1 },
  { name: "Aydın · Fibre", tier: "T4", lng: 27.84, lat: 37.85, color: "#FFBF00", count: 1 },
];

const TIER_LEGEND = [
  { label: "T1 · Assembly", color: "#3E00FF" },
  { label: "T2 · Fabric", color: "#00DAFF" },
  { label: "T3 · Yarn", color: "#00B92C" },
  { label: "T4 · Fibre", color: "#FFBF00" },
];

function VisualSupplyChainMap() {
  const [geoFeatures, setGeoFeatures] = useState<GeoPermissibleObjects[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch(GEO_URL)
      .then((r) => r.json())
      .then((topo: Topology) => {
        if (cancelled) return;
        const countries = feature(topo, topo.objects.countries as any);
        setGeoFeatures((countries as any).features);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Frame on Europe + western Asia, where the hoodie's suppliers sit. Wider
  // crop than the dashboard's world view so dots aren't dwarfed by ocean.
  const projection = geoMercator()
    .scale(620)
    .center([14, 42])
    .translate([MAP_W / 2, MAP_H / 2]);
  const pathGenerator = geoPath().projection(projection);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative w-full flex-1 overflow-hidden rounded-2xl bg-white ring-1 ring-envrt-brand-black/10">
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="block h-full w-full">
          <defs>
            {SUPPLIERS.map((s, i) => (
              <radialGradient key={i} id={`map-grad-${i}`}>
                <stop offset="0%" stopColor={s.color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0.7" />
              </radialGradient>
            ))}
            <filter id="map-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Country shapes — tinted to match the dashboard's stone-grey
              treatment, plus a subtle stroke. */}
          {geoFeatures.map((geo, i) => (
            <path
              key={i}
              d={pathGenerator(geo) || ""}
              fill="#F1EFE6"
              stroke="#E2DECD"
              strokeWidth={0.6}
            />
          ))}

          {/* Supplier dots */}
          {SUPPLIERS.map((s, i) => {
            const projected = projection([s.lng, s.lat]);
            if (!projected) return null;
            const [px, py] = projected;
            const r = 9 + Math.log(s.count + 1) * 5;
            return (
              <g key={s.name} transform={`translate(${px}, ${py})`}>
                <circle r={r + 6} fill={s.color} opacity={0.15} filter="url(#map-glow)" />
                <circle r={r + 10} fill="none" stroke={s.color} strokeWidth={1.2} opacity={0.35}>
                  <animate attributeName="r" from={r + 4} to={r + 18} dur="1.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.4" to="0" dur="1.6s" repeatCount="indefinite" />
                </circle>
                <circle
                  r={r}
                  fill={`url(#map-grad-${i})`}
                  stroke="#fff"
                  strokeWidth={1.6}
                />
                {s.count > 1 && (
                  <>
                    <circle cx={r * 0.7} cy={-r * 0.7} r={9} fill="white" stroke={s.color} strokeWidth={1.4} />
                    <text x={r * 0.7} y={-r * 0.7} textAnchor="middle" dominantBaseline="central" fill={s.color} fontSize="11" fontWeight="700">
                      {s.count}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* Heading chip */}
        <div className="absolute left-3 top-3">
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55">
            Supply chain · 4 tiers
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5 px-1">
        {TIER_LEGEND.map((t) => (
          <span key={t.label} className="inline-flex items-center gap-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-envrt-brand-black/70">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color }} />
            {t.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── 02 · In-house LCA ────────────────────────────────────────────────────
// Six stage rows. Each row: stage label, horizontal bar with kg CO₂e, and a
// micro AWARE water column on the right. ISO 14040 + EU PEF stamp below.

const LCA_STAGES = [
  { stage: "Fibre", co2: 2.84, water: 4.1 },
  { stage: "Yarn", co2: 0.71, water: 0.6 },
  { stage: "Fabric", co2: 1.92, water: 0.9 },
  { stage: "Dye", co2: 0.96, water: 0.7 },
  { stage: "Assembly", co2: 0.58, water: 0.1 },
  { stage: "Transport", co2: 0.44, water: 0.0 },
];

function VisualLcaStages() {
  const maxCo2 = Math.max(...LCA_STAGES.map((s) => s.co2));
  const maxWater = Math.max(...LCA_STAGES.map((s) => s.water));

  return (
    <div className="flex h-full w-full flex-col rounded-2xl bg-white p-5 ring-1 ring-envrt-brand-black/10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55">
          Hoodie 0509-1882 · per garment
        </p>
        <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine">
          6 stages
        </p>
      </div>

      {/* Stage bars */}
      <div className="mt-4 flex-1 space-y-2.5">
        {LCA_STAGES.map((s) => {
          const co2Width = (s.co2 / maxCo2) * 100;
          const waterFill = maxWater > 0 ? s.water / maxWater : 0;
          return (
            <div key={s.stage} className="grid grid-cols-[60px_1fr_36px] items-center gap-2.5">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-envrt-brand-black/75">
                {s.stage}
              </span>
              <div className="relative h-4 overflow-hidden rounded-md bg-envrt-brand-ultramarine/8">
                <div
                  className="absolute inset-y-0 left-0 rounded-md bg-gradient-to-r from-envrt-brand-ultramarine to-envrt-brand-royal"
                  style={{ width: `${co2Width}%` }}
                />
                <span className="absolute inset-y-0 right-1.5 flex items-center font-mono text-[9px] font-semibold tracking-tight text-envrt-brand-black">
                  {s.co2.toFixed(2)} kg
                </span>
              </div>
              {/* AWARE water mini-column */}
              <div className="relative h-4 overflow-hidden rounded-md bg-envrt-brand-aqua/12" title={`AWARE ${s.water.toFixed(1)} m³`}>
                <div
                  className="absolute inset-x-0 bottom-0 rounded-md bg-envrt-brand-aqua/70"
                  style={{ height: `${Math.max(waterFill * 100, s.water > 0 ? 12 : 0)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer stamp */}
      <div className="mt-3 flex items-center justify-between border-t border-envrt-brand-black/10 pt-3">
        <div className="flex items-center gap-1.5 font-mono text-[8.5px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55">
          <span className="rounded bg-envrt-brand-black/8 px-1.5 py-0.5">EU PEF</span>
          <span className="rounded bg-envrt-brand-black/8 px-1.5 py-0.5">ISO 14040</span>
          <span className="rounded bg-envrt-brand-aqua/15 px-1.5 py-0.5 text-envrt-brand-aqua">AWARE</span>
        </div>
        <p className="font-mono text-[8.5px] font-semibold tracking-tight text-envrt-brand-black">
          7.45 kg CO₂e
        </p>
      </div>
    </div>
  );
}

// ─── 03 · French Eco-Score ────────────────────────────────────────────────
// Coût Environnemental SVG as the centrepiece. 4×4 grid of 16 data-block
// tiles behind it. "Coût Environnemental" wordmark on top, score caption
// below.

function VisualEcoScore() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-envrt-brand-black/10">
      {/* 4x4 data-block grid backdrop */}
      <div
        aria-hidden
        className="absolute inset-x-8 inset-y-12 grid grid-cols-4 grid-rows-4 gap-2 opacity-[0.18]"
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="rounded-md bg-envrt-brand-ultramarine" />
        ))}
      </div>

      {/* Header */}
      <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55">
        Coût Environnemental · Ecobalyse
      </p>

      {/* Official label */}
      <div className="relative z-10 mt-3 rounded-lg bg-white p-3 shadow-[0_10px_30px_-12px_rgba(14,14,14,0.18)] ring-1 ring-envrt-brand-black/8">
        <Image
          src="/v3-assets/angry-pablo-ecoscore.svg"
          alt="Coût environnemental: 1573 points d'impact, 449 pour 100g"
          width={180}
          height={90}
          className="block h-auto w-[200px]"
          unoptimized
        />
      </div>

      {/* Footer captions */}
      <div className="relative z-10 mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/70">
          16 data blocks · per product
        </span>
        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine">
          République Française
        </span>
      </div>
    </div>
  );
}

// ─── 04 · DPP production ──────────────────────────────────────────────────
// Static phone shell with the live DPP iframe inside. Cribbed from
// ScrollTourSection but without the scroll pin: the iframe just shows the
// top of the DPP and the user can click through to open it.

const DPP_URL = "https://dpp.envrt.com/envrt/demo-garments/hoodie-0509-1882";

function VisualDppPhone() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="relative w-[60%] max-w-[220px]">
        <div className="relative overflow-hidden rounded-[2rem] border-[5px] border-envrt-brand-black bg-envrt-brand-black shadow-[0_24px_50px_-18px_rgba(14,14,14,0.45)]">
          <div className="relative h-[340px] overflow-hidden bg-white">
            {/* Skeleton behind iframe */}
            <div
              aria-hidden
              className={`absolute inset-0 transition-opacity duration-500 ${loaded ? "pointer-events-none opacity-0" : "opacity-100"}`}
            >
              <div className="flex h-full flex-col gap-3 p-3">
                <div className="h-[40%] animate-pulse rounded-md bg-envrt-brand-black/8" />
                <div className="flex gap-2">
                  <div className="h-9 flex-1 animate-pulse rounded bg-envrt-brand-black/6" />
                  <div className="h-9 flex-1 animate-pulse rounded bg-envrt-brand-black/6" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-2.5 w-3/4 animate-pulse rounded bg-envrt-brand-black/6" />
                  <div className="h-2.5 w-1/2 animate-pulse rounded bg-envrt-brand-black/6" />
                  <div className="h-2.5 w-2/3 animate-pulse rounded bg-envrt-brand-black/6" />
                </div>
              </div>
            </div>

            {/* Scale wrapper — iframe rendered at 414px native viewport, scaled
                down to fit the small phone frame. Scale = (220 - 10) / 414 ≈ 0.507. */}
            <div className="origin-top-left scale-[0.507]" style={{ width: "414px" }}>
              <iframe
                src={DPP_URL}
                title="Live ENVRT Digital Product Passport"
                style={{ width: "414px", height: "670px" }}
                className={`pointer-events-none block border-0 transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
                loading="lazy"
                onLoad={() => setLoaded(true)}
              />
            </div>

            {/* Bottom fade */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent" />
          </div>
        </div>

        <div className="mt-3 flex flex-col items-center gap-2">
          <LivePill label="dpp.envrt.com · live" />
          <a
            href={DPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine hover:underline"
          >
            Open passport <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── 05 · Evidence vault ──────────────────────────────────────────────────
// Vertical stack of versioned, dated, signed documents. Each row: file icon,
// filename, tier badge, signed pill, version. A faint left rail ties them
// together as an audit trail.

const VAULT_DOCS = [
  { icon: "pdf" as const, filename: "REACH_declaration_2026.pdf", tier: "T1", version: "v3", signed: true, date: "2026-04-12" },
  { icon: "xlsx" as const, filename: "SGS_test_report_FW26.xlsx", tier: "T2", version: "v2", signed: true, date: "2026-03-30" },
  { icon: "pdf" as const, filename: "CoC_supplier_042.pdf", tier: "T3", version: "v1", signed: true, date: "2026-03-18" },
  { icon: "csv" as const, filename: "BoM_FW26.csv", tier: "T4", version: "v4", signed: true, date: "2026-04-02" },
  { icon: "email" as const, filename: "audit_log_export.eml", tier: "—", version: "v1", signed: true, date: "2026-04-15" },
];

function VisualEvidenceVault() {
  return (
    <div className="flex h-full w-full flex-col rounded-2xl bg-white p-5 ring-1 ring-envrt-brand-black/10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55">
          Evidence vault · audit trail
        </p>
        <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine">
          {VAULT_DOCS.length} docs
        </p>
      </div>

      {/* Rail + docs */}
      <div className="relative mt-4 flex-1">
        <div aria-hidden className="absolute bottom-2 left-3 top-2 w-px bg-envrt-brand-ultramarine/25" />
        <div className="relative space-y-2.5">
          {VAULT_DOCS.map((d) => (
            <div
              key={d.filename}
              className="relative ml-7 flex items-center gap-2.5 rounded-xl bg-envrt-brand-vista p-2.5 ring-1 ring-envrt-brand-black/8"
            >
              {/* Rail dot */}
              <span aria-hidden className="absolute -left-[1.05rem] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-envrt-brand-ultramarine ring-2 ring-white" />

              <span className="flex-shrink-0 text-envrt-brand-black/65">
                <AssetIcon type={d.icon} size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-[10px] font-semibold text-envrt-brand-black">
                  {d.filename}
                </p>
                <p className="mt-0.5 font-mono text-[9px] text-envrt-brand-black/55">
                  {d.date}
                </p>
              </div>
              <span className="rounded bg-envrt-brand-black/8 px-1.5 py-0.5 font-mono text-[8.5px] font-semibold uppercase tracking-[0.14em] text-envrt-brand-black/65">
                {d.tier}
              </span>
              <span className="rounded bg-envrt-brand-ultramarine/12 px-1.5 py-0.5 font-mono text-[8.5px] font-semibold uppercase tracking-[0.14em] text-envrt-brand-ultramarine">
                {d.version}
              </span>
              {d.signed && (
                <span className="rounded-full bg-envrt-brand-vibrant/18 px-1.5 py-0.5 font-mono text-[8.5px] font-semibold uppercase tracking-[0.14em] text-envrt-brand-vibrant" title="Signed">
                  ✓
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 06 · Audit-ready reports ─────────────────────────────────────────────
// PDF cover-sheet mock + JSON snippet, side by side. The contrast itself
// makes the point: same data, two formats.

function VisualAuditPack() {
  return (
    <div className="grid h-full w-full grid-cols-[1fr_1fr] gap-3">
      {/* PDF mock */}
      <div className="relative flex flex-col overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-envrt-brand-black/10 shadow-[0_18px_40px_-22px_rgba(14,14,14,0.18)]">
        <div className="flex items-center justify-between">
          <span className="rounded bg-envrt-brand-crimson/15 px-1.5 py-0.5 font-mono text-[8px] font-semibold uppercase tracking-[0.16em] text-envrt-brand-crimson">
            PDF
          </span>
          <span className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-envrt-brand-black/45">
            v3.1
          </span>
        </div>
        <p className="mt-3 font-mono text-[8.5px] uppercase tracking-[0.16em] text-envrt-brand-black/55">
          Garment Proof Pack
        </p>
        <p className="mt-1 font-display text-sm font-semibold leading-tight tracking-tight text-envrt-brand-black">
          Hoodie 0509-1882
        </p>

        <div className="mt-3 space-y-1.5 border-t border-envrt-brand-black/10 pt-3">
          {[
            ["Inputs", "12 fields"],
            ["Factors", "EU PEF v3.1"],
            ["Suppliers", "5 verified"],
            ["Audit trail", "44 events"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between">
              <span className="font-mono text-[8.5px] font-semibold uppercase tracking-[0.14em] text-envrt-brand-black/60">{k}</span>
              <span className="font-mono text-[8.5px] tracking-tight text-envrt-brand-black">{v}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-envrt-brand-black/10 pt-3">
          <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-envrt-brand-black/45">
            2026-04-12
          </span>
          <span className="rounded-full bg-envrt-brand-vibrant/18 px-1.5 py-0.5 font-mono text-[8px] font-semibold uppercase tracking-[0.14em] text-envrt-brand-vibrant">
            ✓ Signed
          </span>
        </div>
      </div>

      {/* JSON mock */}
      <div className="relative flex flex-col overflow-hidden rounded-2xl bg-envrt-brand-black p-4 text-white ring-1 ring-envrt-brand-black/40">
        <div className="flex items-center justify-between">
          <span className="rounded bg-envrt-brand-neon/20 px-1.5 py-0.5 font-mono text-[8px] font-semibold uppercase tracking-[0.16em] text-envrt-brand-neon">
            JSON
          </span>
          <span className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-white/45">
            v3.1
          </span>
        </div>
        <pre className="mt-3 flex-1 overflow-hidden font-mono text-[8.5px] leading-relaxed text-white/90">
{`{
  "garment": "hoodie-0509-1882",
  "co2e_kg": 7.45,
  "water_m3": 6.477,
  "methodology": "EU_PEF_v3.1",
  "suppliers": [
    { "tier": 1, "country": "PT" },
    { "tier": 2, "country": "TR" },
    { "tier": 4, "country": "TR" }
  ],
  "audit_trail": 44,
  "signed": true
}`}
        </pre>
      </div>
    </div>
  );
}

// ─── 07 · Compliance monitoring ───────────────────────────────────────────
// Vertical timeline of recent regulatory events. Each row has a status pill
// (applied / monitoring / in-scope) and a date.

const REG_EVENTS = [
  { reg: "EU PEF", note: "Update v3.1 applied to all DPPs", date: "2026-04-12", status: "applied" as const },
  { reg: "ISO 14040", note: "2026 revision reviewed", date: "2026-03-22", status: "applied" as const },
  { reg: "AGEC (France)", note: "Article 13 schema watching", date: "2026-04-02", status: "monitoring" as const },
  { reg: "CA SB-707", note: "Producer responsibility — in scope", date: "2026-02-15", status: "scope" as const },
  { reg: "NY S-4859", note: "Disclosure draft tracked", date: "2026-01-30", status: "monitoring" as const },
];

const STATUS_STYLE: Record<"applied" | "monitoring" | "scope", { bg: string; text: string; label: string; dot: string }> = {
  applied: { bg: "bg-envrt-brand-vibrant/18", text: "text-envrt-brand-vibrant", label: "Applied", dot: "bg-envrt-brand-vibrant" },
  monitoring: { bg: "bg-envrt-brand-golden/22", text: "text-envrt-brand-black", label: "Monitoring", dot: "bg-envrt-brand-golden" },
  scope: { bg: "bg-envrt-brand-ultramarine/15", text: "text-envrt-brand-ultramarine", label: "In scope", dot: "bg-envrt-brand-ultramarine" },
};

function VisualComplianceTimeline() {
  return (
    <div className="flex h-full w-full flex-col rounded-2xl bg-white p-5 ring-1 ring-envrt-brand-black/10">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55">
          Compliance · 90-day window
        </p>
        <LivePill label="Watching" />
      </div>

      <div className="relative mt-4 flex-1">
        <div aria-hidden className="absolute bottom-2 left-2 top-2 w-px bg-envrt-brand-black/10" />
        <ul className="relative space-y-2.5">
          {REG_EVENTS.map((e) => {
            const s = STATUS_STYLE[e.status];
            return (
              <li key={e.reg} className="relative ml-6">
                <span aria-hidden className={`absolute -left-[1.15rem] top-1.5 h-2 w-2 rounded-full ${s.dot} ring-2 ring-white`} />
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display text-xs font-semibold tracking-tight text-envrt-brand-black">
                      {e.reg}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-snug text-envrt-brand-black/65">
                      {e.note}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 flex-col items-end gap-1">
                    <span className={`rounded-full px-1.5 py-0.5 font-mono text-[8px] font-semibold uppercase tracking-[0.14em] ${s.bg} ${s.text}`}>
                      {s.label}
                    </span>
                    <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-envrt-brand-black/45">
                      {e.date}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// ─── 08 · QR scan analytics ───────────────────────────────────────────────
// Static SVG area chart that mimics the dashboard DailyScansChart. Soft
// gradient fill, 3-3 dashed grid, seeded fake data with a campaign spike.

const SCAN_DATA: { date: string; views: number; visitors: number }[] = [
  { date: "2026-03-16", views: 142, visitors: 118 },
  { date: "2026-03-19", views: 168, visitors: 134 },
  { date: "2026-03-22", views: 191, visitors: 156 },
  { date: "2026-03-25", views: 220, visitors: 178 },
  { date: "2026-03-28", views: 252, visitors: 202 },
  { date: "2026-03-31", views: 286, visitors: 229 },
  { date: "2026-04-03", views: 318, visitors: 256 },
  { date: "2026-04-06", views: 410, visitors: 332 },
  { date: "2026-04-09", views: 728, visitors: 588 },
  { date: "2026-04-12", views: 942, visitors: 764 },
  { date: "2026-04-15", views: 612, visitors: 498 },
  { date: "2026-04-18", views: 482, visitors: 391 },
  { date: "2026-04-21", views: 520, visitors: 422 },
  { date: "2026-04-24", views: 564, visitors: 458 },
];

function VisualScanAnalytics() {
  const W = 460;
  const H = 250;
  const PAD_L = 30;
  const PAD_R = 12;
  const PAD_T = 12;
  const PAD_B = 26;

  const maxY = Math.max(...SCAN_DATA.map((d) => d.views));
  const xStep = (W - PAD_L - PAD_R) / (SCAN_DATA.length - 1);
  const yScale = (v: number) => PAD_T + (H - PAD_T - PAD_B) * (1 - v / maxY);

  const pointsViews = SCAN_DATA.map((d, i) => [PAD_L + i * xStep, yScale(d.views)] as [number, number]);
  const pointsVisitors = SCAN_DATA.map((d, i) => [PAD_L + i * xStep, yScale(d.visitors)] as [number, number]);

  // Smooth path via Catmull-Rom-like bezier for the area + line
  const lineFor = (pts: [number, number][]) => {
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      const cx = (x0 + x1) / 2;
      d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
    }
    return d;
  };
  const areaFor = (pts: [number, number][]) => {
    const line = lineFor(pts);
    const lastX = pts[pts.length - 1][0];
    const firstX = pts[0][0];
    const baseY = H - PAD_B;
    return `${line} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
  };

  // Y-axis ticks (4 levels)
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    y: PAD_T + (H - PAD_T - PAD_B) * (1 - t),
    label: Math.round(maxY * t),
  }));

  // Inline date format: "DD MMM"
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  // Show every 3rd date label
  const xLabels = SCAN_DATA.map((d, i) => ({ x: PAD_L + i * xStep, label: formatDate(d.date), show: i % 3 === 0 || i === SCAN_DATA.length - 1 }));

  const totalScans = SCAN_DATA.reduce((sum, d) => sum + d.views, 0);

  return (
    <div className="flex h-full w-full flex-col rounded-2xl bg-white p-5 ring-1 ring-envrt-brand-black/10">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55">
            Daily scans · last 6 weeks
          </p>
          <p className="mt-1 font-display text-xl font-semibold tracking-tight text-envrt-brand-black">
            {totalScans.toLocaleString()} <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-envrt-brand-black/45">views</span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="inline-flex items-center gap-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-envrt-brand-vibrant">
            <span className="h-2 w-2 rounded-full bg-envrt-brand-vibrant" />
            Views
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-envrt-brand-ultramarine">
            <span className="h-2 w-2 rounded-full bg-envrt-brand-ultramarine" />
            Visitors
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative mt-3 flex-1">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-full w-full">
          <defs>
            <linearGradient id="scans-grad-views" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#20E036" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#20E036" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="scans-grad-visitors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3E00FF" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#3E00FF" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Y-grid + labels */}
          {yTicks.map((t, i) => (
            <g key={i}>
              <line
                x1={PAD_L}
                y1={t.y}
                x2={W - PAD_R}
                y2={t.y}
                stroke="#E5E1D2"
                strokeWidth={0.8}
                strokeDasharray="3 3"
              />
              <text
                x={PAD_L - 6}
                y={t.y + 3}
                textAnchor="end"
                fontSize="9"
                fontFamily="ui-monospace, SFMono-Regular, monospace"
                fill="#1A1A1A"
                opacity={0.45}
              >
                {t.label}
              </text>
            </g>
          ))}

          {/* Visitors (behind) */}
          <path d={areaFor(pointsVisitors)} fill="url(#scans-grad-visitors)" />
          <path d={lineFor(pointsVisitors)} fill="none" stroke="#3E00FF" strokeWidth={1.5} strokeDasharray="4 2" />

          {/* Views (front) */}
          <path d={areaFor(pointsViews)} fill="url(#scans-grad-views)" />
          <path d={lineFor(pointsViews)} fill="none" stroke="#20E036" strokeWidth={2} />

          {/* Spike marker on the campaign peak */}
          {(() => {
            const peakIdx = SCAN_DATA.reduce((max, d, i) => (d.views > SCAN_DATA[max].views ? i : max), 0);
            const [px, py] = pointsViews[peakIdx];
            return (
              <g>
                <circle cx={px} cy={py} r={4} fill="#fff" stroke="#20E036" strokeWidth={2} />
                <text x={px} y={py - 10} textAnchor="middle" fontSize="9" fontFamily="ui-monospace, SFMono-Regular, monospace" fill="#1A1A1A" fontWeight="600">
                  {SCAN_DATA[peakIdx].views}
                </text>
              </g>
            );
          })()}

          {/* X labels */}
          {xLabels.map((l, i) => l.show && (
            <text
              key={i}
              x={l.x}
              y={H - PAD_B + 14}
              textAnchor="middle"
              fontSize="9"
              fontFamily="ui-monospace, SFMono-Regular, monospace"
              fill="#1A1A1A"
              opacity={0.45}
            >
              {l.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

// ─── 09 · Green-claims audit ──────────────────────────────────────────────
// One claim card with the marketing line at top and three evidence rows
// underneath, each with verify/flag pills.

const CLAIM_EVIDENCE = [
  { label: "Material composition", source: "BoM_FW26.csv", status: "verified" as const, hint: "80% organic cotton (GOTS)" },
  { label: "Supplier CoC", source: "CoC_supplier_042.pdf", status: "verified" as const, hint: "Signed 2026-03-18" },
  { label: "REACH declaration", source: "REACH_2026.pdf", status: "pending" as const, hint: "Supplier response overdue" },
];

const CLAIM_PILL: Record<"verified" | "pending", { bg: string; text: string; label: string }> = {
  verified: { bg: "bg-envrt-brand-vibrant/18", text: "text-envrt-brand-vibrant", label: "Verified" },
  pending: { bg: "bg-envrt-brand-crimson/15", text: "text-envrt-brand-crimson", label: "Pending" },
};

function VisualGreenClaims() {
  return (
    <div className="flex h-full w-full flex-col rounded-2xl bg-white p-5 ring-1 ring-envrt-brand-black/10">
      {/* Header */}
      <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55">
        Marketing claim · pre-publish
      </p>

      {/* Quoted claim */}
      <div className="mt-3 rounded-xl bg-envrt-brand-vista p-3">
        <p className="font-mono text-[8.5px] font-semibold uppercase tracking-[0.16em] text-envrt-brand-black/55">
          “Made with 80% organic cotton.”
        </p>
        <p className="mt-1 font-mono text-[8.5px] tracking-tight text-envrt-brand-black/55">
          Hoodie 0509-1882 · product description
        </p>
      </div>

      {/* Evidence rows */}
      <div className="mt-4 flex-1 space-y-2.5">
        {CLAIM_EVIDENCE.map((e) => {
          const p = CLAIM_PILL[e.status];
          return (
            <div key={e.label} className="rounded-xl border border-envrt-brand-black/10 p-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-display text-xs font-semibold tracking-tight text-envrt-brand-black">
                    {e.label}
                  </p>
                  <p className="mt-0.5 font-mono text-[9px] tracking-tight text-envrt-brand-black/55">
                    {e.source}
                  </p>
                  <p className="mt-1 text-[10px] leading-snug text-envrt-brand-black/65">
                    {e.hint}
                  </p>
                </div>
                <span className={`flex-shrink-0 rounded-full px-2 py-0.5 font-mono text-[8px] font-semibold uppercase tracking-[0.14em] ${p.bg} ${p.text}`}>
                  {p.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer summary */}
      <div className="mt-3 flex items-center justify-between border-t border-envrt-brand-black/10 pt-3">
        <span className="font-mono text-[8.5px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55">
          Pre-publish check
        </span>
        <span className="rounded bg-envrt-brand-crimson/15 px-1.5 py-0.5 font-mono text-[8.5px] font-semibold uppercase tracking-[0.14em] text-envrt-brand-crimson">
          1 flag · cannot ship
        </span>
      </div>
    </div>
  );
}
