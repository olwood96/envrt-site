"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";

// ── Country centroids (ISO alpha-2 → [lng, lat]) ──
const CENTROIDS: Record<string, [number, number]> = {
  AF: [67.7, 33.9], AL: [20.2, 41.2], DZ: [3.0, 28.0], AD: [1.5, 42.5],
  AO: [17.9, -11.2], AG: [-61.8, 17.1], AR: [-63.6, -38.4], AM: [45.0, 40.1],
  AU: [133.8, -25.3], AT: [14.6, 47.5], AZ: [47.6, 40.1], BS: [-77.4, 25.0],
  BH: [50.6, 26.0], BD: [90.4, 23.7], BB: [-59.5, 13.2], BY: [27.9, 53.7],
  BE: [4.5, 50.5], BZ: [-88.5, 17.2], BJ: [2.3, 9.3], BT: [90.4, 27.5],
  BO: [-63.6, -16.3], BA: [17.7, 43.9], BW: [24.7, -22.3], BR: [-51.9, -14.2],
  BN: [114.7, 4.5], BG: [25.5, 42.7], BF: [-1.6, 12.2], BI: [29.9, -3.4],
  KH: [105.0, 12.6], CM: [12.4, 7.4], CA: [-106.3, 56.1], CV: [-24.0, 16.0],
  CF: [20.9, 6.6], TD: [18.7, 15.5], CL: [-71.5, -35.7], CN: [104.2, 35.9],
  CO: [-74.3, 4.6], KM: [43.9, -11.9], CD: [21.8, -4.0], CG: [15.8, -0.2],
  CR: [-84.0, 9.7], CI: [-5.5, 7.5], HR: [15.2, 45.1], CU: [-77.8, 21.5],
  CY: [33.4, 35.1], CZ: [15.5, 49.8], DK: [9.5, 56.3], DJ: [43.1, 11.8],
  DM: [-61.4, 15.4], DO: [-70.2, 18.7], EC: [-78.2, -1.8], EG: [30.8, 26.8],
  SV: [-88.9, 13.8], GQ: [10.3, 1.6], ER: [39.8, 15.2], EE: [25.0, 58.6],
  SZ: [31.5, -26.5], ET: [40.5, 9.1], FJ: [178.0, -17.7], FI: [25.7, 61.9],
  FR: [2.2, 46.2], GA: [11.6, -0.8], GM: [-15.3, 13.4], GE: [43.4, 42.3],
  DE: [10.5, 51.2], GH: [-1.0, 7.9], GR: [21.8, 39.1], GD: [-61.7, 12.1],
  GT: [-90.2, 15.8], GN: [-9.7, 9.9], GW: [-15.2, 12.0], GY: [-58.9, 5.0],
  HT: [-72.3, 19.0], HN: [-86.2, 15.2], HU: [19.5, 47.2], IS: [-19.0, 64.9],
  IN: [78.9, 20.6], ID: [113.9, -0.8], IR: [53.7, 32.4], IQ: [43.7, 33.2],
  IE: [-8.2, 53.4], IL: [34.9, 31.0], IT: [12.6, 41.9], JM: [-77.3, 18.1],
  JP: [138.3, 36.2], JO: [36.2, 30.6], KZ: [66.9, 48.0], KE: [37.9, -0.0],
  KR: [127.8, 35.9], KW: [47.5, 29.3], KG: [74.8, 41.2], LA: [102.5, 19.9],
  LV: [24.6, 56.9], LB: [35.9, 33.9], LS: [28.2, -29.6], LR: [-9.4, 6.4],
  LY: [17.2, 26.3], LT: [23.9, 55.2], LU: [6.1, 49.8], MG: [46.9, -18.8],
  MW: [34.3, -13.3], MY: [101.9, 4.2], ML: [-4.0, 17.6], MT: [14.4, 35.9],
  MR: [-10.9, 21.0], MU: [57.6, -20.3], MX: [-102.5, 23.6], MD: [28.4, 47.4],
  MN: [103.8, 46.9], ME: [19.4, 42.7], MA: [-7.1, 31.8], MZ: [35.5, -18.7],
  MM: [96.0, 21.9], NA: [18.5, -22.0], NP: [84.1, 28.4], NL: [5.3, 52.1],
  NZ: [174.9, -40.9], NI: [-85.2, 12.9], NE: [8.1, 17.6], NG: [8.7, 9.1],
  MK: [21.7, 41.5], NO: [8.5, 60.5], OM: [55.9, 21.5], PK: [69.3, 30.4],
  PA: [-80.8, 8.5], PG: [143.9, -6.5], PY: [-58.4, -23.4], PE: [-77.0, -9.2],
  PH: [121.8, 12.9], PL: [19.1, 51.9], PT: [-8.2, 39.4], QA: [51.2, 25.4],
  RO: [24.9, 45.9], RU: [105.3, 61.5], RW: [29.9, -1.9], SA: [45.1, 23.9],
  SN: [-14.5, 14.5], RS: [21.0, 44.0], SG: [103.8, 1.4], SK: [19.7, 48.7],
  SI: [15.0, 46.2], SO: [46.2, 5.2], ZA: [22.9, -30.6], SS: [31.3, 6.9],
  ES: [-3.7, 40.5], LK: [80.8, 7.9], SD: [30.2, 12.9], SE: [18.6, 60.1],
  CH: [8.2, 46.8], TW: [121.0, 23.7], TJ: [71.3, 38.9], TZ: [34.9, -6.4],
  TH: [100.5, 15.9], TG: [1.2, 8.6], TN: [9.5, 33.9], TR: [35.2, 38.9],
  TM: [59.6, 38.9], UG: [32.3, 1.4], UA: [31.2, 48.4], AE: [53.8, 23.4],
  GB: [-3.4, 55.4], US: [-95.7, 37.1], UY: [-55.8, -32.5], UZ: [64.6, 41.4],
  VE: [-66.6, 6.4], VN: [108.3, 14.1], YE: [48.5, 15.6], ZM: [27.8, -13.1],
  ZW: [29.2, -19.0], PS: [35.2, 31.9], XK: [21.0, 42.6], HK: [114.2, 22.3],
  PR: [-66.6, 18.2],
};

const WIDTH = 960;
const HEIGHT = 480;
const TOPO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
// How long each dot's glow lasts (ms) and gap between dots
const GLOW_DURATION = 600;
const GLOW_GAP = 200;

interface DotData {
  cx: number;
  cy: number;
  r: number;
}

interface DppWorldMapProps {
  onStatsLoaded?: (stats: { totalDurationSeconds: number; countryCount: number }) => void;
}

export function DppWorldMap({ onStatsLoaded }: DppWorldMapProps) {
  const [countries, setCountries] = useState<string | null>(null);
  const [dots, setDots] = useState<DotData[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const fetched = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load TopoJSON country shapes
  useEffect(() => {
    fetch(TOPO_URL)
      .then((r) => r.json())
      .then((topo: Topology) => {
        const geo = feature(
          topo,
          topo.objects.countries
        ) as unknown as FeatureCollection<Geometry>;

        const projection = geoMercator()
          .scale(140)
          .center([10, 18])
          .translate([WIDTH / 2, HEIGHT / 2]);

        const pathGen = geoPath().projection(projection);
        const paths = geo.features.map((f) => pathGen(f) ?? "").filter(Boolean);
        setCountries(paths.join(" "));
      })
      .catch(() => {});
  }, []);

  // Fetch platform stats (country data + engagement time) via local API
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const projection = geoMercator()
      .scale(140)
      .center([10, 18])
      .translate([WIDTH / 2, HEIGHT / 2]);

    fetch("/api/impact-stats")
      .then((r) => r.json())
      .then(async (data) => {
        // Surface stats to parent for caption
        if (onStatsLoaded && data.totalDurationSeconds != null) {
          onStatsLoaded({
            totalDurationSeconds: data.totalDurationSeconds,
            countryCount: data.countryCount,
          });
        }

        let byCountry: { country: string; views: number }[] = data.byCountry ?? [];

        // Fallback: if platform_stats isn't seeded yet, try the old endpoint
        if (byCountry.length === 0) {
          try {
            const fallback = await fetch("https://dashboard.envrt.com/api/public/dpp-map");
            if (fallback.ok) {
              const fallbackData = await fallback.json();
              if (Array.isArray(fallbackData)) byCountry = fallbackData;
            }
          } catch { /* silent */ }
        }

        if (byCountry.length === 0) return;

        const maxViews = Math.max(...byCountry.map((d) => d.views));

        const projected = byCountry
          .map((d) => {
            const coords = CENTROIDS[d.country];
            if (!coords) return null;
            const [cx, cy] = projection(coords) ?? [0, 0];
            const t = Math.log(d.views + 1) / Math.log(maxViews + 1);
            const r = 3 + t * 7;
            return { cx, cy, r };
          })
          .filter(Boolean) as DotData[];

        // Sort left to right for the sweep effect
        projected.sort((a, b) => a.cx - b.cx);
        setDots(projected);
      })
      .catch(() => {});
  }, [onStatsLoaded]);

  // Cyclical glow sweep: left to right, one dot at a time
  const advance = useCallback(() => {
    setActiveIndex((prev) => {
      if (dots.length === 0) return -1;
      const next = prev + 1;
      return next >= dots.length ? 0 : next;
    });
  }, [dots.length]);

  useEffect(() => {
    if (dots.length === 0) return;

    // Start the first glow
    setActiveIndex(0);

    const tick = () => {
      advance();
      timerRef.current = setTimeout(tick, GLOW_DURATION + GLOW_GAP);
    };
    timerRef.current = setTimeout(tick, GLOW_DURATION + GLOW_GAP);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dots.length, advance]);

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="dot-glow">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Country outlines */}
      {countries && (
        <path
          d={countries}
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={0.5}
        />
      )}

      {/* Dots with sequential glow */}
      {dots.map((dot, i) => {
        const isActive = i === activeIndex;
        const scale = isActive ? 1.4 : 1;
        const glowScale = isActive ? 3 : 2;
        return (
          <g key={i}>
            {/* Glow halo — only visible on active dot */}
            <circle
              cx={dot.cx}
              cy={dot.cy}
              r={dot.r}
              fill="url(#dot-glow)"
              opacity={isActive ? 0.6 : 0}
              style={{
                transition: "opacity 0.3s ease, transform 0.3s ease",
                transform: `scale(${glowScale})`,
                transformOrigin: `${dot.cx}px ${dot.cy}px`,
              }}
            />
            {/* Solid dot */}
            <circle
              cx={dot.cx}
              cy={dot.cy}
              r={dot.r}
              fill="#34d399"
              opacity={isActive ? 0.95 : 0.55}
              style={{
                transition: "opacity 0.3s ease, transform 0.3s ease",
                transform: `scale(${scale})`,
                transformOrigin: `${dot.cx}px ${dot.cy}px`,
              }}
            />
          </g>
        );
      })}
    </svg>
  );
}
