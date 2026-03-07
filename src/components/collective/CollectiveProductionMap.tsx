"use client";

import { useEffect, useRef } from "react";
import type { CollectiveProductionStage, CollectiveVerification } from "@/lib/collective/types";
import { getLocationInfo } from "@/lib/collective/country-geocode";

// ── Verification colours (matching dashboard ProductionJourney) ──

const MARKER_COLORS: Record<string, string> = {
  declared: "#111827",
  modelled: "#EAB308",
  validated: "#22C55E",
  verified: "#22C55E",
  mixed: "#9CA3AF",
};

const DEFAULT_MARKER_COLOR = "#1a3a2a";

function aggregateVerification(
  levels: (CollectiveVerification | null)[]
): CollectiveVerification | "mixed" | null {
  const valid = levels.filter(Boolean) as CollectiveVerification[];
  if (valid.length === 0) return null;
  const unique = new Set(valid);
  if (unique.size === 1) return valid[0];
  return "mixed";
}

// ── Types ──

interface LocationGroup {
  lat: number;
  lng: number;
  stageCount: number;
  verification: CollectiveVerification | "mixed" | null;
}

interface Props {
  stages: CollectiveProductionStage[];
}

export function CollectiveProductionMap({ stages }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) return;

    let cancelled = false;

    (async () => {
      const L = await import("leaflet");
      if (cancelled || !mapRef.current) return;
      if ((mapRef.current as HTMLElement & { _leaflet_id?: number })._leaflet_id) return;

      const map = L.map(mapRef.current, {
        scrollWheelZoom: false,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        doubleClickZoom: false,
        touchZoom: false,
      }).setView([25, 50], 2);

      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 10,
      }).addTo(map);

      // ── Group stages by location ──
      const locationMap = new Map<string, {
        lat: number;
        lng: number;
        verifications: (CollectiveVerification | null)[];
      }>();

      const orderedPoints: { key: string; lat: number; lng: number }[] = [];

      for (const stage of stages) {
        if (!stage.country) continue;
        const coords = getLocationInfo(stage.country, stage.regional);
        if (!coords) continue;

        const locKey = `${coords.lat},${coords.lng}`;
        orderedPoints.push({ key: stage.key, lat: coords.lat, lng: coords.lng });

        const existing = locationMap.get(locKey);
        if (existing) {
          existing.verifications.push(stage.verification);
        } else {
          locationMap.set(locKey, {
            lat: coords.lat,
            lng: coords.lng,
            verifications: [stage.verification],
          });
        }
      }

      // ── Build location groups ──
      const locations: LocationGroup[] = [];
      const allPoints: [number, number][] = [];

      locationMap.forEach((loc) => {
        const aggVerification = aggregateVerification(loc.verifications);
        locations.push({
          lat: loc.lat,
          lng: loc.lng,
          stageCount: loc.verifications.length,
          verification: aggVerification,
        });
        allPoints.push([loc.lat, loc.lng]);
      });

      // ── Add markers with verification colours + count badges ──
      for (const loc of locations) {
        const fillColor = loc.verification
          ? (MARKER_COLORS[loc.verification] ?? DEFAULT_MARKER_COLOR)
          : DEFAULT_MARKER_COLOR;

        const dotSize = 18;
        const borderW = 2;
        const wrapSize = dotSize + 4;
        const showBadge = loc.stageCount > 1;

        const badgeHtml = showBadge
          ? `<div style="
              position:absolute;top:-7px;right:-10px;
              min-width:16px;height:16px;
              display:flex;align-items:center;justify-content:center;
              background:#111827;color:#FFFFFF;
              font-size:9px;font-weight:700;
              border-radius:9999px;
              padding:0 4px;
              border:1.5px solid #FFFFFF;
              box-shadow:0 1px 2px rgba(0,0,0,0.15);
              font-family:system-ui,sans-serif;
              line-height:1;
            ">${loc.stageCount}</div>`
          : "";

        const icon = L.divIcon({
          html: `<div style="position:relative;width:${wrapSize}px;height:${wrapSize}px;">
            <div style="
              width:${dotSize}px;height:${dotSize}px;border-radius:50%;
              background:${fillColor};
              border:${borderW}px solid #FFFFFF;
              box-shadow:0 1px 3px rgba(0,0,0,0.2);
            "></div>
            ${badgeHtml}
          </div>`,
          className: "",
          iconSize: [wrapSize, wrapSize],
          iconAnchor: [wrapSize / 2, wrapSize / 2],
        });

        L.marker([loc.lat, loc.lng], { icon, interactive: false }).addTo(map);
      }

      // ── Draw route lines between consecutive stages ──
      const drawnSegments = new Set<string>();

      for (let i = 0; i < orderedPoints.length - 1; i++) {
        const from = orderedPoints[i];
        const to = orderedPoints[i + 1];
        if (from.lat === to.lat && from.lng === to.lng) continue;

        const segKey = `${from.lat},${from.lng}->${to.lat},${to.lng}`;
        if (drawnSegments.has(segKey)) continue;
        drawnSegments.add(segKey);

        L.polyline(
          [
            [from.lat, from.lng],
            [to.lat, to.lng],
          ],
          {
            color: "#94A3B8",
            weight: 1.5,
            dashArray: "6, 4",
            opacity: 0.6,
            className: "collective-route-line",
          }
        ).addTo(map);

        // Direction arrows — 1 for short segments, 2 for long
        const dy = to.lat - from.lat;
        const dx = (to.lng - from.lng) * Math.cos((from.lat * Math.PI) / 180);
        const dist = Math.sqrt(dy * dy + dx * dx);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

        const positions = dist > 15 ? [0.33, 0.66] : [0.5];

        for (const t of positions) {
          const midLat = from.lat + (to.lat - from.lat) * t;
          const midLng = from.lng + (to.lng - from.lng) * t;

          const arrowIcon = L.divIcon({
            html: `<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 6L9 6M9 6L6 3M9 6L6 9"
                stroke="#64748B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
                fill="none" transform="rotate(${-angle}, 6, 6)"/>
            </svg>`,
            className: "",
            iconSize: [12, 12],
            iconAnchor: [6, 6],
          });

          L.marker([midLat, midLng], { icon: arrowIcon, interactive: false }).addTo(map);
        }
      }

      // ── Fit bounds ──
      if (allPoints.length > 1) {
        const bounds = L.latLngBounds(allPoints);
        map.fitBounds(bounds, { padding: [20, 20], maxZoom: 5 });
      } else if (allPoints.length === 1) {
        map.setView(allPoints[0], 4);
      }
    })();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [stages]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />
      <style jsx>{`
        .collective-route-line {
          animation: collective-dash-flow 1.5s linear infinite;
        }
        @keyframes collective-dash-flow {
          to {
            stroke-dashoffset: -20;
          }
        }
      `}</style>
      <div
        ref={mapRef}
        className="h-[140px] w-full overflow-hidden rounded-lg"
        style={{ background: "#E2E8F0" }}
      />
    </>
  );
}
