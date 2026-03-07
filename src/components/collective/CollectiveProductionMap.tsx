"use client";

import { useEffect, useRef } from "react";
import type { CollectiveProductionStage } from "@/lib/collective/types";
import { getLocationInfo } from "@/lib/collective/country-geocode";

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

      // Build points from stages
      const points: [number, number][] = [];
      const stagePoints: { key: string; label: string; lat: number; lng: number }[] = [];

      for (const stage of stages) {
        if (!stage.country) continue;
        const coords = getLocationInfo(stage.country, stage.regional);
        if (!coords) continue;
        points.push([coords.lat, coords.lng]);
        stagePoints.push({
          key: stage.key,
          label: stage.label,
          lat: coords.lat,
          lng: coords.lng,
        });
      }

      // Add markers
      for (const sp of stagePoints) {
        const dotSize = 14;
        const icon = L.divIcon({
          html: `<div style="
            width:${dotSize}px;height:${dotSize}px;border-radius:50%;
            background:#1a3a2a;border:2px solid #fff;
            box-shadow:0 1px 3px rgba(0,0,0,0.3);
          "></div>`,
          className: "",
          iconSize: [dotSize, dotSize],
          iconAnchor: [dotSize / 2, dotSize / 2],
        });

        L.marker([sp.lat, sp.lng], { icon, interactive: false }).addTo(map);
      }

      // Draw route lines between consecutive stages
      const drawnSegments = new Set<string>();
      for (let i = 0; i < stagePoints.length - 1; i++) {
        const from = stagePoints[i];
        const to = stagePoints[i + 1];
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

        // Direction arrow at midpoint
        const midLat = from.lat + (to.lat - from.lat) * 0.5;
        const midLng = from.lng + (to.lng - from.lng) * 0.5;
        const dy = to.lat - from.lat;
        const dx = (to.lng - from.lng) * Math.cos((from.lat * Math.PI) / 180);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

        const arrowIcon = L.divIcon({
          html: `<svg width="10" height="10" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 6L9 6M9 6L6 3M9 6L6 9"
              stroke="#64748B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
              fill="none" transform="rotate(${-angle}, 6, 6)"/>
          </svg>`,
          className: "",
          iconSize: [10, 10],
          iconAnchor: [5, 5],
        });

        L.marker([midLat, midLng], { icon: arrowIcon, interactive: false }).addTo(map);
      }

      // Fit bounds
      if (points.length > 1) {
        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds, { padding: [20, 20], maxZoom: 5 });
      } else if (points.length === 1) {
        map.setView(points[0], 4);
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
