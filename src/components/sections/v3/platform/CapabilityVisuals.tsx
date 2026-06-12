"use client";

// Per-capability visuals for the platform page. One component per capability,
// dispatched via VisualFor by capability index. Each visual fills its canvas
// directly (no tinted backdrop).
//
// For capabilities that map to a real dashboard surface (map, scan chart,
// compliance hub), these visuals mirror the dashboard look 1:1 so they act
// as marketing-ready snapshots of the live product. Self-contained: no
// imports from envrt-dashboard, no recharts dependency. SVG + brand tokens
// only.

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { geoMercator, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
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
// Snapshot of the dashboard SupplierMap. World mercator from d3-geo +
// topojson fetched at mount. Same dot styling (radial gradient fill, white
// border, glow halo, ping ring, count badge) as the live component.

const MAP_W = 960;
const MAP_H = 480;
// Same-origin so it leans on our CDN cache and avoids a DNS lookup +
// TLS handshake to jsdelivr on every /platform visit. Sourced from
// world-atlas v2 at build time.
const GEO_URL = "/v3-assets/data/countries-110m.json";

const SUPPLIERS = [
  { name: "Viana do Castelo · Assembly", tier: "T1", lng: -8.83, lat: 41.70, color: "#3E00FF", count: 1 },
  { name: "Prato · Fabric mill", tier: "T2", lng: 11.10, lat: 43.88, color: "#00DAFF", count: 1 },
  { name: "Bursa · Fabric", tier: "T2", lng: 29.06, lat: 40.18, color: "#00DAFF", count: 2 },
  { name: "Adana · Yarn spinning", tier: "T3", lng: 35.32, lat: 37.00, color: "#00B92C", count: 1 },
  { name: "Aydın · Fibre", tier: "T4", lng: 27.84, lat: 37.85, color: "#FFBF00", count: 1 },
];

// Process-order legend at the bottom of the map. Reads left-to-right as
// the lifecycle flow (raw fibre → assembled garment), no "All Stages"
// filter chip since this visual is a static snapshot of the dashboard.
const PROCESS_LEGEND = [
  { label: "Fibre", color: "#FFBF00" },
  { label: "Yarn", color: "#00B92C" },
  { label: "Fabric", color: "#00DAFF" },
  { label: "Dyeing", color: "#DF5FFF" },
  { label: "Assembly", color: "#3E00FF" },
];

function VisualSupplyChainMap() {
  const [geoFeatures, setGeoFeatures] = useState<GeoPermissibleObjects[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch(GEO_URL)
      .then((r) => r.json())
      .then((topo: Topology) => {
        if (cancelled) return;
        const countries = feature(
          topo,
          topo.objects.countries as GeometryCollection,
        );
        setGeoFeatures(countries.features as GeoPermissibleObjects[]);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Frame on Europe + western Asia — wider than the dashboard's world view
  // so the hoodie's supplier dots aren't dwarfed by ocean.
  const projection = geoMercator()
    .scale(580)
    .center([14, 42])
    .translate([MAP_W / 2, MAP_H / 2]);
  const pathGenerator = geoPath().projection(projection);

  return (
    <Card title="Supply Chain Locations">
      <div className="relative w-full overflow-hidden rounded-xl">
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="block h-full w-full">
          <defs>
            {SUPPLIERS.map((s, i) => (
              <radialGradient key={i} id={`map-grad-${i}`}>
                <stop offset="0%" stopColor={s.color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0.7" />
              </radialGradient>
            ))}
            <filter id="map-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Country shapes — matches the dashboard's GRAY_100/GRAY_200 tone. */}
          {geoFeatures.map((geo, i) => (
            <path
              key={i}
              d={pathGenerator(geo) || ""}
              fill="#F3F4F6"
              stroke="#E5E7EB"
              strokeWidth={0.6}
            />
          ))}

          {/* Supplier dots — same chrome as dashboard SupplierMap. */}
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
                    <circle cx={r * 0.85} cy={-r * 0.85} r={14} fill="white" stroke={s.color} strokeWidth={1.8} />
                    <text x={r * 0.85} y={-r * 0.85} textAnchor="middle" dominantBaseline="central" fill={s.color} fontSize="16" fontWeight="700">
                      {s.count}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Process-order legend. Reads left to right as the lifecycle flow:
          raw fibre on the left through to final assembly on the right.
          Static snapshot of the dashboard PillToggle styling, no
          interactive filtering. */}
      <div className="mt-3 flex items-center justify-center gap-1 rounded-full bg-gray-100 p-1">
        {PROCESS_LEGEND.map((t) => (
          <PillTab key={t.label} label={t.label} dot={t.color} />
        ))}
      </div>
    </Card>
  );
}

function PillTab({ label, dot }: { label: string; dot?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium text-gray-700">
      {dot && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: dot }} />}
      {label}
    </span>
  );
}

// ─── 02 · In-house LCA ────────────────────────────────────────────────────
// Per-stage emissions breakdown, same shape as the dashboard's per-garment
// impact card. Stage label, horizontal bar with gradient fill, kg CO₂e on
// the right, AWARE water micro-column. EU PEF / ISO 14040 / AWARE chips at
// the bottom mirror the dashboard's standards stamps.

const LCA_STAGES = [
  { stage: "Fibre production", co2: 2.84, water: 4.1 },
  { stage: "Yarn production", co2: 0.71, water: 0.6 },
  { stage: "Fabric production", co2: 1.92, water: 0.9 },
  { stage: "Dyeing", co2: 0.96, water: 0.7 },
  { stage: "Assembly", co2: 0.58, water: 0.1 },
  { stage: "Transport", co2: 0.44, water: 0.0 },
];

function VisualLcaStages() {
  const maxCo2 = Math.max(...LCA_STAGES.map((s) => s.co2));
  const totalCo2 = LCA_STAGES.reduce((s, x) => s + x.co2, 0);
  const totalWater = LCA_STAGES.reduce((s, x) => s + x.water, 0);

  return (
    <Card title="Per-garment lifecycle impact">
      <div className="flex items-baseline justify-between">
        <p className="text-xs text-gray-500">Hoodie 0509-1882</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-gray-400">6 stages</p>
      </div>

      {/* Stage rows. One row per stage: label + kg / m³ values on the
          top line, single green pill bar below. AWARE water is shown
          inline as a small aqua text value, not a second bar — a
          stacked dual-bar reads as cluttered at this canvas size. */}
      <div className="mt-4 flex flex-1 flex-col justify-between gap-2">
        {LCA_STAGES.map((s) => {
          const co2Width = (s.co2 / maxCo2) * 100;
          return (
            <div key={s.stage}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[11px] font-semibold text-envrt-brand-black">
                  {s.stage}
                </span>
                <span className="font-mono text-[10px] font-semibold tracking-tight text-envrt-brand-black">
                  {s.co2.toFixed(2)}
                  <span className="ml-0.5 text-gray-400">kg</span>
                  <span className="mx-1.5 text-gray-300">·</span>
                  <span className="text-envrt-brand-aqua/80">
                    {s.water.toFixed(1)}
                    <span className="ml-0.5">m³</span>
                  </span>
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-green-100">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{ width: `${co2Width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2.5">
        <div className="flex items-center gap-1">
          <Chip label="EU PEF" />
          <Chip label="ISO 14040" />
          <Chip label="AWARE" tone="aqua" />
        </div>
        <p className="font-mono text-[10px] font-semibold tracking-tight text-envrt-brand-black">
          {totalCo2.toFixed(2)} kg <span className="text-gray-400">CO₂e</span>
          <span className="ml-1.5 text-gray-300">·</span>
          <span className="ml-1.5 text-envrt-brand-aqua">{totalWater.toFixed(1)} m³</span>
        </p>
      </div>
    </Card>
  );
}

// ─── 03 · French Eco-Score ────────────────────────────────────────────────
// Official Coût Environnemental label sits unadorned on the section's vista
// background. No gimmicky backdrop. Below it, a small dashboard-style row
// shows the score breakdown — points total + per-100g + methodology stamp.

function VisualEcoScore() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <div className="rounded-xl bg-white p-3 shadow-[0_18px_40px_-18px_rgba(14,14,14,0.18)] ring-1 ring-envrt-brand-black/8">
        <Image
          src="/v3-assets/angry-pablo-ecoscore.svg"
          alt="Coût environnemental: 1573 points d'impact, 449 pour 100g"
          width={240}
          height={120}
          className="block h-auto w-[220px] sm:w-[260px]"
          unoptimized
        />
      </div>

      {/* Compact breakdown row — same shape as a dashboard stat strip. */}
      <div className="grid w-full max-w-[320px] grid-cols-3 gap-2">
        <Stat label="Points" value="1,573" />
        <Stat label="Per 100g" value="449" />
        <Stat label="Grade" value="C" tone="ultramarine" />
      </div>

      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-envrt-brand-black/55">
        République Française · Ecobalyse
      </p>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "ultramarine" }) {
  return (
    <div className="rounded-lg bg-white px-2 py-2 text-center ring-1 ring-envrt-brand-black/8">
      <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-envrt-brand-black/55">
        {label}
      </p>
      <p className={`mt-0.5 font-display text-base font-semibold tracking-tight ${tone === "ultramarine" ? "text-envrt-brand-ultramarine" : "text-envrt-brand-black"}`}>
        {value}
      </p>
    </div>
  );
}

// ─── 04 · DPP production ──────────────────────────────────────────────────
// Real phone shell with the live DPP loaded inside a scrollable iframe.
// Mirrors the v1 hero-phone implementation: notch + status bar, sandboxed
// iframe, pointer-events-auto so users can scroll within the phone itself.

const DPP_URL = "https://dpp.envrt.com/envrt/demo-garments/hoodie-0509-1882";
const PHONE_VIEWPORT_WIDTH = 375;
const PHONE_VIEWPORT_HEIGHT = 812;

function VisualDppPhone() {
  const screenRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    const update = () => {
      if (screenRef.current) {
        setScale(screenRef.current.offsetWidth / PHONE_VIEWPORT_WIDTH);
      }
    };
    update();
    const observer = new ResizeObserver(update);
    if (screenRef.current) observer.observe(screenRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative w-full max-w-[200px]">
        <div className="relative overflow-hidden rounded-[2rem] border-[5px] border-envrt-brand-black bg-envrt-brand-black shadow-[0_24px_50px_-18px_rgba(14,14,14,0.45)]">
          {/* Status bar */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between rounded-t-[1.6rem] bg-white px-4" style={{ height: 18 }}>
            <span className="text-[8px] font-semibold leading-none text-envrt-brand-black">9:41</span>
            <div className="w-[56px]" />
            <div className="flex items-center gap-[3px]">
              <svg width="9" height="7" viewBox="0 0 14 10" fill="none" className="text-envrt-brand-black">
                <rect x="0" y="7" width="2.5" height="3" rx="0.5" fill="currentColor" />
                <rect x="3.5" y="5" width="2.5" height="5" rx="0.5" fill="currentColor" />
                <rect x="7" y="2.5" width="2.5" height="7.5" rx="0.5" fill="currentColor" />
                <rect x="10.5" y="0" width="2.5" height="10" rx="0.5" fill="currentColor" />
              </svg>
              <div className="relative h-[6px] w-[12px] rounded-[1.5px] border border-envrt-brand-black/80">
                <div className="absolute inset-[1px] rounded-[0.5px] bg-envrt-brand-black" style={{ width: "75%" }} />
              </div>
            </div>
          </div>

          {/* Notch */}
          <div className="absolute left-1/2 top-[3px] z-30 h-[12px] w-[56px] -translate-x-1/2 rounded-full bg-envrt-brand-black" />

          {/* Screen — 9:19.5 portrait aspect, iframe scaled to fit. */}
          <div
            ref={screenRef}
            className="relative w-full overflow-hidden rounded-[1.6rem] bg-white"
            style={{ aspectRatio: "9 / 19" }}
          >
            <div className="absolute inset-0 overflow-hidden">
              <iframe
                src={DPP_URL}
                title="Live ENVRT Digital Product Passport"
                loading="eager"
                className="absolute border-0"
                style={{
                  top: 0,
                  left: 0,
                  width: `${PHONE_VIEWPORT_WIDTH}px`,
                  height: `${PHONE_VIEWPORT_HEIGHT}px`,
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  overflow: "auto",
                  WebkitOverflowScrolling: "touch",
                  paddingTop: "18px",
                }}
                sandbox="allow-scripts allow-same-origin"
                onLoad={() => setIframeLoaded(true)}
              />
            </div>

            {/* Loading skeleton */}
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${iframeLoaded ? "opacity-0" : "opacity-100"}`}
            >
              <div className="flex h-full flex-col gap-3 p-3 pt-7">
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
          </div>
        </div>

        <div className="mt-3 flex flex-col items-center gap-1.5">
          <LivePill label="dpp.envrt.com · live" />
          <a
            href={DPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-envrt-brand-ultramarine hover:underline"
          >
            Open passport <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── 05 · Evidence vault ──────────────────────────────────────────────────
// Dashboard-style evidence table snapshot. Same column shape as the live
// EvidenceList: file name + size, category, SKU, review status, date.

type VaultRow = { name: string; size: string; category: string; sku: string; status: "Approved" | "Pending"; date: string; icon: "pdf" | "xlsx" | "csv" | "email" };

const VAULT_ROWS: VaultRow[] = [
  { name: "REACH_declaration_2026.pdf", size: "412 KB", category: "Certifications", sku: "HOODIE-0509", status: "Approved", date: "2026-04-12", icon: "pdf" },
  { name: "SGS_test_report_FW26.xlsx", size: "1.1 MB", category: "Testing", sku: "HOODIE-0509", status: "Approved", date: "2026-03-30", icon: "xlsx" },
  { name: "CoC_supplier_042.pdf", size: "318 KB", category: "Certifications", sku: "HOODIE-0509", status: "Approved", date: "2026-03-18", icon: "pdf" },
  { name: "BoM_FW26.csv", size: "26 KB", category: "Materials", sku: "HOODIE-0509", status: "Approved", date: "2026-04-02", icon: "csv" },
  { name: "GOTS_certificate.pdf", size: "284 KB", category: "Certifications", sku: "HOODIE-0509", status: "Approved", date: "2026-03-04", icon: "pdf" },
  { name: "audit_log_export.eml", size: "9 KB", category: "Other", sku: "—", status: "Pending", date: "2026-04-15", icon: "email" },
];

function VisualEvidenceVault() {
  return (
    <Card title="Evidence & Documentation">
      <div className="flex flex-1 flex-col overflow-hidden rounded-lg ring-1 ring-gray-200">
        <table className="w-full flex-1 text-left">
          <thead className="bg-gray-50 text-[9px] font-semibold uppercase tracking-[0.08em] text-gray-500">
            <tr>
              <th className="px-2.5 py-2">File</th>
              <th className="px-2 py-2">Category</th>
              <th className="px-2 py-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-[10px]">
            {VAULT_ROWS.map((r) => (
              <tr key={r.name}>
                <td className="px-2.5 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex-shrink-0 text-gray-400">
                      <AssetIcon type={r.icon} size={14} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-mono text-[10px] font-medium text-gray-900">
                        {r.name}
                      </p>
                      <p className="font-mono text-[9px] text-gray-400">
                        {r.size} · {r.date}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-2.5">
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[9px] font-medium text-gray-700">
                    {r.category}
                  </span>
                </td>
                <td className="px-2 py-2.5 text-right">
                  <StatusPill status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-[10px] text-gray-400">
        {VAULT_ROWS.length} files · versioned and signed
      </p>
    </Card>
  );
}

function StatusPill({ status }: { status: "Approved" | "Pending" }) {
  if (status === "Approved") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-1.5 py-0.5 text-[9px] font-medium text-green-700">
        <span className="h-1 w-1 rounded-full bg-green-500" /> {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-1.5 py-0.5 text-[9px] font-medium text-amber-700">
      <span className="h-1 w-1 rounded-full bg-amber-500" /> {status}
    </span>
  );
}

// ─── 06 · Audit-ready reports ─────────────────────────────────────────────
// PDF + JSON side by side. Both kept narrow with bounded text so nothing
// overflows the canvas.

function VisualAuditPack() {
  return (
    <div className="grid h-full w-full grid-cols-[1fr_1fr] gap-3">
      {/* PDF mock — narrow, all values short and right-aligned. */}
      <div className="flex flex-col overflow-hidden rounded-2xl bg-white p-3 ring-1 ring-envrt-brand-black/10 shadow-[0_18px_40px_-22px_rgba(14,14,14,0.18)]">
        <div className="flex items-center justify-between">
          <span className="rounded bg-envrt-brand-crimson/15 px-1.5 py-0.5 font-mono text-[8px] font-semibold uppercase tracking-[0.14em] text-envrt-brand-crimson">
            PDF
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-envrt-brand-black/45">
            v3.1
          </span>
        </div>
        <p className="mt-2.5 font-mono text-[8px] uppercase tracking-[0.14em] text-envrt-brand-black/55">
          Proof Pack
        </p>
        <p className="mt-0.5 truncate font-display text-xs font-semibold tracking-tight text-envrt-brand-black">
          Hoodie 0509-1882
        </p>

        <div className="mt-3 space-y-1.5 border-t border-envrt-brand-black/10 pt-2.5">
          {[
            ["Inputs", "12"],
            ["Factors", "v3.1"],
            ["Suppliers", "5"],
            ["Trail", "44"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between">
              <span className="font-mono text-[8px] font-semibold uppercase tracking-[0.12em] text-envrt-brand-black/60">{k}</span>
              <span className="font-mono text-[8.5px] tracking-tight text-envrt-brand-black">{v}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-envrt-brand-black/10 pt-2.5">
          <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-envrt-brand-black/45">
            04-12
          </span>
          <span className="rounded-full bg-envrt-brand-vibrant/18 px-1.5 py-0.5 font-mono text-[8px] font-semibold uppercase tracking-[0.12em] text-envrt-brand-vibrant">
            Signed
          </span>
        </div>
      </div>

      {/* JSON mock — bounded width, no horizontal scroll, tight tokens. */}
      <div className="flex flex-col overflow-hidden rounded-2xl bg-envrt-brand-black p-3 text-white ring-1 ring-envrt-brand-black/40">
        <div className="flex items-center justify-between">
          <span className="rounded bg-envrt-brand-neon/20 px-1.5 py-0.5 font-mono text-[8px] font-semibold uppercase tracking-[0.14em] text-envrt-brand-neon">
            JSON
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/45">
            v3.1
          </span>
        </div>
        <pre className="mt-2.5 flex-1 overflow-hidden whitespace-pre-wrap break-all font-mono text-[8px] leading-relaxed text-white/90">
{`{
  "id": "0509-1882",
  "co2e_kg": 7.45,
  "water_m3": 6.48,
  "method": "PEF_v3.1",
  "tiers": 4,
  "suppliers": 5,
  "trail": 44,
  "signed": true
}`}
        </pre>
      </div>
    </div>
  );
}

// ─── 07 · Compliance monitoring ───────────────────────────────────────────
// Mirrors the dashboard compliance hub: a grid of regime tiles, each with
// label, blurb and status. Plus a small "watching" pill at top.

// Mirrors what the site copy actually claims we track. The platform body
// names "EU PEF updates, ISO revisions, French AGEC and emerging US
// state-level acts"; the FAQ names "EU ESPR for textile DPPs, French
// Coût Environnemental, UK DMCCA-aligned green-claims hygiene and the
// EU Green Claims Directive". Every tile here ties back to one of those.
const REGIMES = [
  { label: "France · Coût Environnemental", blurb: "AGEC, Décret 2025-957", status: "live" as const },
  { label: "EU · ESPR DPP", blurb: "Regulation 2024/1781", status: "watching" as const },
  { label: "EU · PEF v3.1", blurb: "Product Environmental Footprint", status: "live" as const },
  { label: "ISO 14040", blurb: "LCA standards revision", status: "live" as const },
  { label: "CA SB-707", blurb: "EPR for textile producers", status: "scope" as const },
  { label: "NY S-4859", blurb: "Disclosure draft tracked", status: "watching" as const },
];

const REGIME_STATUS: Record<"live" | "watching" | "scope", { bg: string; text: string; dot: string; label: string }> = {
  live: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500", label: "Live" },
  watching: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", label: "Watching" },
  scope: { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500", label: "In scope" },
};

function VisualComplianceTimeline() {
  return (
    <Card title="Compliance">
      <p className="text-xs text-gray-500">Six regimes monitored. New ones picked up automatically.</p>

      <div className="mt-3 grid flex-1 grid-cols-2 gap-2">
        {REGIMES.map((r) => {
          const s = REGIME_STATUS[r.status];
          return (
            <div key={r.label} className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-2.5">
              <div className="flex items-start justify-between gap-1.5">
                <p className="text-[10px] font-semibold leading-tight text-gray-900">
                  {r.label}
                </p>
                <span className={`flex-shrink-0 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[8px] font-medium ${s.bg} ${s.text}`}>
                  <span className={`h-1 w-1 rounded-full ${s.dot}`} />
                  {s.label}
                </span>
              </div>
              <p className="mt-1.5 text-[9px] leading-snug text-gray-500">
                {r.blurb}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── 08 · QR scan analytics ───────────────────────────────────────────────
// Hand-tuned area chart in raw SVG matching the dashboard DailyScansChart
// look: 3-3 dashed grid, dual line (views + visitors dashed), green primary,
// ultramarine secondary, soft gradient area fills, axis labels in gray-500.

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
  // viewBox aspect chosen to match the chart container's rendered aspect
  // inside the 5:4 canvas (card padding + title + header strip taken into
  // account). Lets the default preserveAspectRatio="xMidYMid meet" scale
  // the chart uniformly without stretching axis text or distorting the
  // area fill the way preserveAspectRatio="none" did.
  const W = 480;
  const H = 300;
  const PAD_L = 38;
  const PAD_R = 14;
  const PAD_T = 12;
  const PAD_B = 34;

  const maxY = Math.max(...SCAN_DATA.map((d) => d.views));
  const xStep = (W - PAD_L - PAD_R) / (SCAN_DATA.length - 1);
  const yScale = (v: number) => PAD_T + (H - PAD_T - PAD_B) * (1 - v / maxY);

  const pointsViews = SCAN_DATA.map((d, i) => [PAD_L + i * xStep, yScale(d.views)] as [number, number]);
  const pointsVisitors = SCAN_DATA.map((d, i) => [PAD_L + i * xStep, yScale(d.visitors)] as [number, number]);

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

  const formatCompact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    y: PAD_T + (H - PAD_T - PAD_B) * (1 - t),
    label: formatCompact(Math.round(maxY * t)),
  }));

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  const xLabels = SCAN_DATA.map((d, i) => ({
    x: PAD_L + i * xStep,
    label: formatDate(d.date),
    // Every 4th tick plus the last. Skip the i%4 tick if it lands next
    // to the last-index tick to avoid the labels colliding visually.
    show:
      (i === 0 || i % 4 === 0 || i === SCAN_DATA.length - 1) &&
      !(i % 4 === 0 && i === SCAN_DATA.length - 2),
  }));

  const totalScans = SCAN_DATA.reduce((sum, d) => sum + d.views, 0);

  return (
    <Card title="Daily scans">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-display text-xl font-semibold tracking-tight text-gray-900">
            {totalScans.toLocaleString()}
          </p>
          <p className="text-[10px] uppercase tracking-[0.12em] text-gray-500">last 6 weeks</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Legend color="#20E036" label="Views" />
          <Legend color="#3E00FF" label="Visitors" dashed />
        </div>
      </div>

      <div className="relative mt-2 flex-1">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-full w-full">
          <defs>
            <linearGradient id="scans-grad-views" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#20E036" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#20E036" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="scans-grad-visitors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3E00FF" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#3E00FF" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {yTicks.map((t, i) => (
            <g key={i}>
              <line
                x1={PAD_L}
                y1={t.y}
                x2={W - PAD_R}
                y2={t.y}
                stroke="#E5E7EB"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <text
                x={PAD_L - 6}
                y={t.y + 4}
                textAnchor="end"
                fontSize="11"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
                fill="#9CA3AF"
              >
                {t.label}
              </text>
            </g>
          ))}

          <path d={areaFor(pointsVisitors)} fill="url(#scans-grad-visitors)" />
          <path d={lineFor(pointsVisitors)} fill="none" stroke="#3E00FF" strokeWidth={2} strokeDasharray="5 3" />

          <path d={areaFor(pointsViews)} fill="url(#scans-grad-views)" />
          <path d={lineFor(pointsViews)} fill="none" stroke="#20E036" strokeWidth={2.5} />

          {(() => {
            const peakIdx = SCAN_DATA.reduce((max, d, i) => (d.views > SCAN_DATA[max].views ? i : max), 0);
            const [px, py] = pointsViews[peakIdx];
            return (
              <g>
                <circle cx={px} cy={py} r={5} fill="#fff" stroke="#20E036" strokeWidth={2.5} />
              </g>
            );
          })()}

          {xLabels.map((l, i) => l.show && (
            <text
              key={i}
              x={l.x}
              y={H - PAD_B + 18}
              textAnchor="middle"
              fontSize="11"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fill="#9CA3AF"
            >
              {l.label}
            </text>
          ))}
        </svg>
      </div>
    </Card>
  );
}

function Legend({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[9px] font-medium text-gray-600">
      <svg width="14" height="2">
        <line x1="0" y1="1" x2="14" y2="1" stroke={color} strokeWidth="2" strokeDasharray={dashed ? "3 2" : "0"} />
      </svg>
      {label}
    </span>
  );
}

// ─── 09 · Green-claims audit ──────────────────────────────────────────────
// Claim card + three evidence rows + flag summary. Tidy, bounded, fits the
// canvas without overflow.

const CLAIM_EVIDENCE = [
  { label: "Material composition", source: "BoM_FW26.csv", status: "verified" as const, hint: "80% organic cotton (GOTS)" },
  { label: "Supplier CoC", source: "CoC_supplier_042.pdf", status: "verified" as const, hint: "Signed 2026-03-18" },
  { label: "REACH declaration", source: "REACH_2026.pdf", status: "pending" as const, hint: "Supplier response overdue" },
];

const CLAIM_PILL: Record<"verified" | "pending", { bg: string; text: string; label: string; dot: string }> = {
  verified: { bg: "bg-green-50", text: "text-green-700", label: "Verified", dot: "bg-green-500" },
  pending: { bg: "bg-red-50", text: "text-red-700", label: "Pending", dot: "bg-red-500" },
};

function VisualGreenClaims() {
  return (
    <Card title="Marketing claim · pre-publish">
      {/* Quoted claim */}
      <div className="rounded-lg bg-gray-50 p-3">
        <p className="text-[11px] font-medium italic text-gray-700">
          &ldquo;Made with 80% organic cotton.&rdquo;
        </p>
        <p className="mt-1 font-mono text-[9px] tracking-tight text-gray-400">
          Hoodie 0509-1882 · product description
        </p>
      </div>

      {/* Evidence rows. flex-1 + gap so they grow with the canvas and
          distribute evenly down the card. */}
      <div className="mt-3 flex flex-1 flex-col justify-between gap-2">
        {CLAIM_EVIDENCE.map((e) => {
          const p = CLAIM_PILL[e.status];
          return (
            <div key={e.label} className="flex-1 rounded-lg border border-gray-200 bg-white p-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-gray-900">
                    {e.label}
                  </p>
                  <p className="truncate font-mono text-[9px] text-gray-400">
                    {e.source}
                  </p>
                  <p className="mt-0.5 text-[10px] leading-snug text-gray-500">
                    {e.hint}
                  </p>
                </div>
                <span className={`flex-shrink-0 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[8.5px] font-medium ${p.bg} ${p.text}`}>
                  <span className={`h-1 w-1 rounded-full ${p.dot}`} />
                  {p.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer summary */}
      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2.5">
        <span className="text-[10px] text-gray-500">Pre-publish check</span>
        <span className="rounded bg-red-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-red-700">
          1 flag · cannot ship
        </span>
      </div>
    </Card>
  );
}

// ─── Shared dashboard-style chrome ────────────────────────────────────────
// Mirrors the dashboard Card: rounded-2xl, soft shadow, gray border, padded
// body, small bolded title. Every dashboard-feature visual sits in this
// chrome so the marketing page reads as a set of real dashboard snapshots.

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col rounded-2xl bg-white p-4 shadow-[0_18px_40px_-22px_rgba(14,14,14,0.18)] ring-1 ring-gray-200">
      <h3 className="text-[11px] font-semibold text-gray-900">
        {title}
      </h3>
      <div className="mt-2 flex flex-1 flex-col">
        {children}
      </div>
    </div>
  );
}

function Chip({ label, tone }: { label: string; tone?: "aqua" }) {
  return (
    <span className={`rounded px-1.5 py-0.5 font-mono text-[8px] font-semibold uppercase tracking-[0.12em] ${
      tone === "aqua" ? "bg-envrt-brand-aqua/15 text-envrt-brand-aqua" : "bg-gray-100 text-gray-600"
    }`}>
      {label}
    </span>
  );
}
