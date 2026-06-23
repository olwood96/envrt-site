"use client";

import { useEffect, useState } from "react";
import { geoMercator, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";

const MAP_W = 960;
const MAP_H = 480;
const GEO_URL = "/v3-assets/data/countries-110m.json";

const SUPPLIERS = [
  { name: "Viana do Castelo · Assembly", lng: -8.83, lat: 41.70, color: "#3E00FF", count: 1 },
  { name: "Prato · Fabric mill",         lng: 11.10, lat: 43.88, color: "#00DAFF", count: 1 },
  { name: "Bursa · Fabric",              lng: 29.06, lat: 40.18, color: "#00DAFF", count: 2 },
  { name: "Adana · Yarn spinning",       lng: 35.32, lat: 37.00, color: "#00B92C", count: 1 },
  { name: "Aydın · Fibre",              lng: 27.84, lat: 37.85, color: "#FFBF00", count: 1 },
];

const STAGES = [
  { label: "Fibre",    color: "#FFBF00" },
  { label: "Yarn",     color: "#00B92C" },
  { label: "Fabric",   color: "#00DAFF" },
  { label: "Dyeing",   color: "#DF5FFF" },
  { label: "Assembly", color: "#3E00FF" },
];

export function HeroSupplyChainPreview() {
  const [geoFeatures, setGeoFeatures] = useState<GeoPermissibleObjects[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch(GEO_URL)
      .then((r) => r.json())
      .then((topo: Topology) => {
        if (cancelled) return;
        const countries = feature(topo, topo.objects.countries as GeometryCollection);
        setGeoFeatures(countries.features as GeoPermissibleObjects[]);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Scale 750 gives ~200px margin around the outermost supplier dots (Portugal, Adana).
  const projection = geoMercator()
    .scale(750)
    .center([13, 40])
    .translate([MAP_W / 2, MAP_H / 2]);
  const pathGenerator = geoPath().projection(projection);

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white ring-1 ring-envrt-brand-black/8 shadow-[0_12px_28px_-12px_rgba(14,14,14,0.13)]">
      <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
        <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-envrt-brand-black/50">
          Supplier Network
        </p>
        <p className="font-mono text-[9px] text-envrt-brand-black/30">Hoodie 0509-1882</p>
      </div>

      <div className="relative aspect-[2/1] w-full">
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="block h-full w-full">
          <defs>
            {SUPPLIERS.map((s, i) => (
              <radialGradient key={i} id={`hsc-grad-${i}`}>
                <stop offset="0%" stopColor={s.color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0.7" />
              </radialGradient>
            ))}
            <filter id="hsc-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {geoFeatures.map((geo, i) => (
            <path key={i} d={pathGenerator(geo) || ""} fill="#F3F4F6" stroke="#E5E7EB" strokeWidth={0.6} />
          ))}

          {SUPPLIERS.map((s, i) => {
            const projected = projection([s.lng, s.lat]);
            if (!projected) return null;
            const [px, py] = projected;
            const r = 15 + Math.log(s.count + 1) * 7;
            return (
              <g key={s.name} transform={`translate(${px}, ${py})`}>
                <circle r={r + 6} fill={s.color} opacity={0.15} filter="url(#hsc-glow)" />
                <circle r={r + 10} fill="none" stroke={s.color} strokeWidth={1.2} opacity={0.35}>
                  <animate attributeName="r" from={r + 4} to={r + 18} dur="1.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.4" to="0" dur="1.6s" repeatCount="indefinite" />
                </circle>
                <circle r={r} fill={`url(#hsc-grad-${i})`} stroke="#fff" strokeWidth={1.6} />
                {s.count > 1 && (
                  <>
                    <circle cx={r * 0.85} cy={-r * 0.85} r={14} fill="white" stroke={s.color} strokeWidth={1.8} />
                    <text x={r * 0.85} y={-r * 0.85} textAnchor="middle" dominantBaseline="central" fill={s.color} fontSize="16" fontWeight="700">{s.count}</text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="px-3 pb-3 pt-1">
        <div className="flex flex-wrap items-center justify-center gap-x-1 rounded-full bg-gray-100 p-1">
          {STAGES.map((t) => (
            <span key={t.label} className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium text-gray-700">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: t.color }} />
              {t.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
