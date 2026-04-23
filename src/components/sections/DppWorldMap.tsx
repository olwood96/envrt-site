"use client";

import { useEffect, useRef, useState } from "react";
import { geoMercator, geoPath, geoCentroid } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import type { FeatureCollection, Feature, Geometry } from "geojson";

// ── ISO 3166-1 numeric → alpha-2 mapping ──
// world-atlas uses numeric IDs, our view data uses alpha-2
const NUM_TO_ALPHA2: Record<string, string> = {
  "4": "AF", "8": "AL", "12": "DZ", "20": "AD", "24": "AO", "28": "AG",
  "32": "AR", "51": "AM", "36": "AU", "40": "AT", "31": "AZ", "44": "BS",
  "48": "BH", "50": "BD", "52": "BB", "112": "BY", "56": "BE", "84": "BZ",
  "204": "BJ", "64": "BT", "68": "BO", "70": "BA", "72": "BW", "76": "BR",
  "96": "BN", "100": "BG", "854": "BF", "108": "BI", "116": "KH", "120": "CM",
  "124": "CA", "132": "CV", "140": "CF", "148": "TD", "152": "CL", "156": "CN",
  "170": "CO", "174": "KM", "180": "CD", "178": "CG", "188": "CR", "384": "CI",
  "191": "HR", "192": "CU", "196": "CY", "203": "CZ", "208": "DK", "262": "DJ",
  "212": "DM", "214": "DO", "218": "EC", "818": "EG", "222": "SV", "226": "GQ",
  "232": "ER", "233": "EE", "748": "SZ", "231": "ET", "242": "FJ", "246": "FI",
  "250": "FR", "266": "GA", "270": "GM", "268": "GE", "276": "DE", "288": "GH",
  "300": "GR", "308": "GD", "320": "GT", "324": "GN", "624": "GW", "328": "GY",
  "332": "HT", "340": "HN", "348": "HU", "352": "IS", "356": "IN", "360": "ID",
  "364": "IR", "368": "IQ", "372": "IE", "376": "IL", "380": "IT", "388": "JM",
  "392": "JP", "400": "JO", "398": "KZ", "404": "KE", "408": "KP", "410": "KR",
  "414": "KW", "417": "KG", "418": "LA", "428": "LV", "422": "LB", "426": "LS",
  "430": "LR", "434": "LY", "440": "LT", "442": "LU", "450": "MG", "454": "MW",
  "458": "MY", "466": "ML", "470": "MT", "478": "MR", "480": "MU", "484": "MX",
  "498": "MD", "496": "MN", "499": "ME", "504": "MA", "508": "MZ", "104": "MM",
  "516": "NA", "524": "NP", "528": "NL", "554": "NZ", "558": "NI", "562": "NE",
  "566": "NG", "807": "MK", "578": "NO", "512": "OM", "586": "PK", "591": "PA",
  "598": "PG", "600": "PY", "604": "PE", "608": "PH", "616": "PL", "620": "PT",
  "634": "QA", "642": "RO", "643": "RU", "646": "RW", "682": "SA", "686": "SN",
  "688": "RS", "702": "SG", "703": "SK", "705": "SI", "706": "SO", "710": "ZA",
  "728": "SS", "724": "ES", "144": "LK", "736": "SD", "740": "SR", "752": "SE",
  "756": "CH", "760": "SY", "158": "TW", "762": "TJ", "834": "TZ", "764": "TH",
  "626": "TL", "768": "TG", "780": "TT", "788": "TN", "792": "TR", "795": "TM",
  "800": "UG", "804": "UA", "784": "AE", "826": "GB", "840": "US", "858": "UY",
  "860": "UZ", "862": "VE", "704": "VN", "887": "YE", "894": "ZM", "716": "ZW",
  "275": "PS", "-99": "XK", "344": "HK",
};

const WIDTH = 960;
const HEIGHT = 480;
const TOPO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const CYCLE_MS = 3000;
const TOP_N = 12;

interface CountryPath {
  code: string;
  path: string;
  views: number;
  cx: number;
  cy: number;
}

export interface ActiveCountry {
  code: string;
  name: string;
  views: number;
}

interface DppWorldMapProps {
  onStatsLoaded?: (stats: { totalDurationSeconds: number; countryCount: number }) => void;
  onCountryActive?: (country: ActiveCountry | null) => void;
}

const countryNames = (() => {
  try { return new Intl.DisplayNames(["en"], { type: "region" }); } catch { return null; }
})();

function getCountryName(code: string): string {
  try { return countryNames?.of(code) ?? code; } catch { return code; }
}

export function DppWorldMap({ onStatsLoaded, onCountryActive }: DppWorldMapProps) {
  const [countryPaths, setCountryPaths] = useState<CountryPath[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [topCodes, setTopCodes] = useState<string[]>([]);
  const fetched = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Stable projection
  const projectionRef = useRef(
    geoMercator().scale(140).center([10, 18]).translate([WIDTH / 2, HEIGHT / 2])
  );

  // Load TopoJSON + view data together
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const projection = projectionRef.current;
    const pathGen = geoPath().projection(projection);

    Promise.all([
      fetch(TOPO_URL).then((r) => r.json()),
      fetch("/api/impact-stats").then((r) => r.json()).catch(() => null),
    ]).then(async ([topo, statsData]: [Topology, Record<string, unknown> | null]) => {
      // Parse view data
      let byCountry: { country: string; views: number }[] =
        (statsData as Record<string, unknown>)?.byCountry as { country: string; views: number }[] ?? [];

      // Fallback
      if (byCountry.length === 0) {
        try {
          const fb = await fetch("https://dashboard.envrt.com/api/public/dpp-map");
          if (fb.ok) {
            const d = await fb.json();
            if (Array.isArray(d)) byCountry = d;
          }
        } catch { /* silent */ }
      }

      // Surface aggregate stats
      if (onStatsLoaded && statsData) {
        const sd = statsData as Record<string, number>;
        if (sd.totalDurationSeconds != null) {
          onStatsLoaded({
            totalDurationSeconds: sd.totalDurationSeconds,
            countryCount: sd.countryCount,
          });
        }
      }

      const viewMap = new Map(byCountry.map((d) => [d.country, d.views]));

      // Build individual country paths
      const geo = feature(
        topo,
        topo.objects.countries
      ) as unknown as FeatureCollection<Geometry>;

      const paths: CountryPath[] = [];

      for (const f of geo.features) {
        const numericId = String((f as Feature & { id?: string | number }).id ?? "");
        const alpha2 = NUM_TO_ALPHA2[numericId];
        if (!alpha2) continue;

        const d = pathGen(f);
        if (!d) continue;

        // Get projected centroid for transform-origin
        const centroid = geoCentroid(f);
        const [cx, cy] = projection(centroid) ?? [0, 0];

        paths.push({
          code: alpha2,
          path: d,
          views: viewMap.get(alpha2) ?? 0,
          cx,
          cy,
        });
      }

      setCountryPaths(paths);

      // Top N countries by views for the cycle
      const top = byCountry
        .sort((a, b) => b.views - a.views)
        .slice(0, TOP_N)
        .map((d) => d.country);
      setTopCodes(top);
    }).catch(() => {});
  }, [onStatsLoaded]);

  // Cycle through top countries
  useEffect(() => {
    if (topCodes.length === 0) return;

    setActiveIdx(0);

    timerRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % topCodes.length);
    }, CYCLE_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [topCodes.length]);

  // Notify parent of active country
  useEffect(() => {
    if (activeIdx < 0 || topCodes.length === 0) return;
    const code = topCodes[activeIdx];
    const views = countryPaths.find((c) => c.code === code)?.views ?? 0;
    onCountryActive?.({
      code,
      name: getCountryName(code),
      views,
    });
  }, [activeIdx, topCodes, countryPaths, onCountryActive]);

  const activeCode = topCodes[activeIdx] ?? null;

  return (
    <svg
      viewBox={`0 -40 ${WIDTH} ${HEIGHT + 40}`}
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {countryPaths.map((c) => {
        const isActive = c.code === activeCode;
        const hasViews = c.views > 0;

        return (
          <path
            key={c.code}
            d={c.path}
            fill={
              isActive
                ? "rgba(52, 211, 153, 0.5)"
                : hasViews
                ? "rgba(52, 211, 153, 0.15)"
                : "rgba(255, 255, 255, 0.04)"
            }
            stroke={hasViews ? "rgba(52, 211, 153, 0.3)" : "rgba(255, 255, 255, 0.08)"}
            strokeWidth={0.5}
            style={{
              transition: "fill 0.5s ease, transform 0.5s ease",
              transform: isActive ? "scale(1.12)" : "scale(1)",
              transformOrigin: `${c.cx}px ${c.cy}px`,
            }}
          />
        );
      })}
    </svg>
  );
}
