/* eslint-disable @next/next/no-img-element */

interface DppCarouselCardProps {
  productImageUrl: string | null;
  brandLogoUrl: string | null;
  garmentName: string;
  brandName: string;
  productSku: string;
  totalEmissions: number | null;
  totalWater: number | null;
  totalEmissionsReductionPct: number | null;
  totalWaterReductionPct: number | null;
}

function ReductionBadge({ pct }: { pct: number }) {
  const isPositive = pct > 0;
  return (
    <span
      className="mt-1 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5"
      style={{
        fontSize: 7,
        fontWeight: 600,
        background: isPositive ? "#DCFCE7" : "#FEE2E2",
        color: isPositive ? "#166534" : "#991B1B",
      }}
    >
      {isPositive ? "↓" : "↑"} {Math.abs(pct).toFixed(0)}% vs avg
    </span>
  );
}

/**
 * Exact replica of the top portion of a DPP page:
 * brand logo header, product image hero, garment name, and headline KPI metrics.
 * Styled to match dpp-styles.css from the dashboard.
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
  return (
    <div
      className="h-full w-full overflow-y-auto"
      style={{
        background: "#FAF9F6",
        padding: "12px 10px 20px",
      }}
    >
      {/* ── Header: brand logo ── */}
      {brandLogoUrl && (
        <div className="flex items-center justify-center py-2">
          <img
            src={brandLogoUrl}
            alt=""
            className="h-5 w-auto object-contain"
            style={{ maxWidth: "60%" }}
          />
        </div>
      )}

      {/* ── Hero: product image ── */}
      <div className="flex justify-center py-3">
        {productImageUrl ? (
          <img
            src={productImageUrl}
            alt={garmentName}
            className="w-[75%] rounded-[12px] object-contain"
            style={{ maxHeight: 180 }}
          />
        ) : (
          <div className="h-24 w-24 rounded-xl bg-gray-100" />
        )}
      </div>

      {/* ── Product name + SKU ── */}
      <div className="text-center px-2">
        <h2
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#111827",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
          }}
        >
          {garmentName}
        </h2>
        <p
          style={{
            fontSize: 8,
            fontFamily: "monospace",
            color: "#9CA3AF",
            marginTop: 2,
            letterSpacing: "0.05em",
          }}
        >
          {productSku}
        </p>
      </div>

      {/* ── Headline metrics (2-col grid) ── */}
      <div
        className="mt-3 grid gap-[6px]"
        style={{ gridTemplateColumns: "1fr 1fr" }}
      >
        {/* Emissions card */}
        {totalEmissions != null && (
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(0,0,0,0.06)",
              borderRadius: 10,
              padding: "10px 10px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              boxShadow: "0 1px 2px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.03)",
            }}
          >
            <span style={{ fontSize: 7, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Emissions Footprint
            </span>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#111827", lineHeight: 1.15, letterSpacing: "-0.03em" }}>
              {totalEmissions.toFixed(1)}
            </span>
            <span style={{ fontSize: 8, color: "#9CA3AF" }}>
              kg CO₂-eq
            </span>
            {totalEmissionsReductionPct != null && totalEmissionsReductionPct !== 0 && (
              <ReductionBadge pct={totalEmissionsReductionPct} />
            )}
          </div>
        )}

        {/* Water card */}
        {totalWater != null && (
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(0,0,0,0.06)",
              borderRadius: 10,
              padding: "10px 10px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              boxShadow: "0 1px 2px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.03)",
            }}
          >
            <span style={{ fontSize: 7, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Water Scarcity Impact
            </span>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#111827", lineHeight: 1.15, letterSpacing: "-0.03em" }}>
              {totalWater.toFixed(0)}
            </span>
            <span style={{ fontSize: 8, color: "#9CA3AF" }}>
              L AWARE
            </span>
            {totalWaterReductionPct != null && totalWaterReductionPct !== 0 && (
              <ReductionBadge pct={totalWaterReductionPct} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
