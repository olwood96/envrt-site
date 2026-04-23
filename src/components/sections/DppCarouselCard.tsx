/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";

interface DppCarouselCardProps {
  productImageUrl: string | null;
  brandLogoUrl: string | null;
  garmentName: string;
  productSku: string;
  totalEmissions: number | null;
  totalWater: number | null;
  totalEmissionsReductionPct: number | null;
  totalWaterReductionPct: number | null;
}

/**
 * Exact snapshot of the top of a real DPP page.
 * Layout: brand logo (left) + language switcher (right),
 * product image with wobble animation, product name + SKU,
 * and the two headline KPI metric cards.
 * Designed to fit inside a PhoneFrame screen without scrolling.
 */
export function DppCarouselCard({
  productImageUrl,
  brandLogoUrl,
  garmentName,
  productSku,
  totalEmissions,
  totalWater,
  totalEmissionsReductionPct,
  totalWaterReductionPct,
}: DppCarouselCardProps) {
  // Trigger wobble on mount (each slide)
  const [wobble, setWobble] = useState(false);
  useEffect(() => {
    setWobble(true);
  }, []);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        background: "#FAF9F6",
        display: "flex",
        flexDirection: "column",
        padding: "8px 8px 6px",
        overflow: "hidden",
      }}
    >
      {/* ── Header: logo left, language switcher right ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 2px 6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {brandLogoUrl ? (
            <img
              src={brandLogoUrl}
              alt=""
              style={{ height: 12, width: "auto", objectFit: "contain", maxWidth: 60 }}
            />
          ) : (
            <div style={{ height: 12 }} />
          )}
        </div>
        {/* Language switcher replica */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: 10,
            padding: "2px 5px",
            fontSize: 6,
            color: "#374151",
            fontWeight: 500,
          }}
        >
          <svg width="7" height="7" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="8" r="6.5" />
            <path d="M1.5 8h13M8 1.5c-2 2.5-2 9.5 0 13M8 1.5c2 2.5 2 9.5 0 13" />
          </svg>
          English
        </div>
      </div>

      {/* ── Product image with wobble ── */}
      <div
        style={{
          flex: "1 1 0%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          perspective: 800,
          minHeight: 0,
        }}
      >
        {productImageUrl ? (
          <img
            src={productImageUrl}
            alt={garmentName}
            style={{
              maxHeight: "100%",
              maxWidth: "75%",
              objectFit: "contain",
              borderRadius: 10,
              animation: wobble ? "dpp-snapshot-wobble 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both" : "none",
            }}
          />
        ) : (
          <div style={{ height: 40, width: 40, borderRadius: 8, background: "#F3F4F6" }} />
        )}
      </div>

      {/* ── Product name + SKU ── */}
      <div style={{ textAlign: "center", padding: "4px 2px 2px" }}>
        <p
          style={{
            fontSize: 10,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            lineHeight: 1.15,
            color: "#111827",
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {garmentName}
        </p>
        <p
          style={{
            fontSize: 5,
            fontFamily: '"SF Mono", "Fira Code", monospace',
            color: "#9CA3AF",
            letterSpacing: "0.04em",
            margin: "1px 0 0",
          }}
        >
          {productSku}
        </p>
      </div>

      {/* ── Headline KPI metrics (2-col) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginTop: 4 }}>
        {totalEmissions != null && (
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(0,0,0,0.06)",
              borderRadius: 8,
              padding: "6px 6px",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              boxShadow: "0 1px 2px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.03)",
            }}
          >
            <span style={{ fontSize: 5, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Emissions Footprint
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#111827", lineHeight: 1.15, letterSpacing: "-0.03em" }}>
              {totalEmissions.toFixed(1)}
            </span>
            <span style={{ fontSize: 5, fontWeight: 500, color: "#9CA3AF" }}>
              kg CO₂-eq
            </span>
            {totalEmissionsReductionPct != null && totalEmissionsReductionPct !== 0 && (
              <span
                style={{
                  display: "inline-block",
                  fontSize: 5,
                  fontWeight: 600,
                  padding: "1px 4px",
                  borderRadius: 4,
                  marginTop: 2,
                  width: "fit-content",
                  background: totalEmissionsReductionPct > 0 ? "#DCFCE7" : "#FEE2E2",
                  color: totalEmissionsReductionPct > 0 ? "#166534" : "#991B1B",
                }}
              >
                {totalEmissionsReductionPct > 0 ? "↓" : "↑"} {Math.abs(totalEmissionsReductionPct).toFixed(0)}% vs avg
              </span>
            )}
          </div>
        )}

        {totalWater != null && (
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(0,0,0,0.06)",
              borderRadius: 8,
              padding: "6px 6px",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              boxShadow: "0 1px 2px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.03)",
            }}
          >
            <span style={{ fontSize: 5, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Water Scarcity Impact
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#111827", lineHeight: 1.15, letterSpacing: "-0.03em" }}>
              {totalWater.toFixed(0)}
            </span>
            <span style={{ fontSize: 5, fontWeight: 500, color: "#9CA3AF" }}>
              L AWARE
            </span>
            {totalWaterReductionPct != null && totalWaterReductionPct !== 0 && (
              <span
                style={{
                  display: "inline-block",
                  fontSize: 5,
                  fontWeight: 600,
                  padding: "1px 4px",
                  borderRadius: 4,
                  marginTop: 2,
                  width: "fit-content",
                  background: totalWaterReductionPct > 0 ? "#DCFCE7" : "#FEE2E2",
                  color: totalWaterReductionPct > 0 ? "#166534" : "#991B1B",
                }}
              >
                {totalWaterReductionPct > 0 ? "↓" : "↑"} {Math.abs(totalWaterReductionPct).toFixed(0)}% vs avg
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
