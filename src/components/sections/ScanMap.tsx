"use client";

import { useEffect, useRef } from "react";
import type { CountryScanData } from "@/lib/impact-tracker";
import { ISO_COORDS } from "@/lib/iso-country-coords";

interface ScanMapProps {
  data: CountryScanData[];
}

export function ScanMap({ data }: ScanMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) return;

    let cancelled = false;

    (async () => {
      const L = await import("leaflet");
      if (cancelled || !mapRef.current) return;
      if (
        (mapRef.current as HTMLElement & { _leaflet_id?: number })._leaflet_id
      )
        return;

      const map = L.map(mapRef.current, {
        scrollWheelZoom: false,
        zoomControl: false,
        attributionControl: false,
        dragging: window.innerWidth >= 1024,
        doubleClickZoom: false,
        touchZoom: false,
      }).setView([25, 10], 2);

      mapInstanceRef.current = map;

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { maxZoom: 10 }
      ).addTo(map);

      // Find max count for scaling dot sizes
      const maxCount = Math.max(...data.map((d) => d.count), 1);

      for (const { countryCode, count } of data) {
        const coords = ISO_COORDS[countryCode];
        if (!coords) continue;

        // Scale dot size between 8px and 24px based on scan count
        const size = Math.round(8 + (count / maxCount) * 16);
        const half = size / 2;

        const icon = L.divIcon({
          html: `<div style="position:relative;width:${size}px;height:${size}px;">
            <div style="
              width:${size}px;height:${size}px;border-radius:50%;
              background:#2aa198;opacity:0.85;
            "></div>
            <div class="scan-pulse-ring" style="
              position:absolute;top:0;left:0;
              width:${size}px;height:${size}px;border-radius:50%;
              border:2px solid #2aa198;
              animation:scan-pulse 2.5s ease-out infinite;
            "></div>
          </div>`,
          className: "",
          iconSize: [size, size],
          iconAnchor: [half, half],
        });

        L.marker([coords.lat, coords.lng], {
          icon,
          interactive: false,
        }).addTo(map);
      }
    })();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [data]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />
      <div
        ref={mapRef}
        role="img"
        aria-label="Map showing DPP scan locations around the world"
        className="h-[250px] w-full overflow-hidden rounded-xl lg:h-[400px]"
        style={{ background: "#1a1a2e" }}
      />
    </>
  );
}