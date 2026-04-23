/* eslint-disable @next/next/no-img-element */

interface DppCarouselCardProps {
  productImageUrl: string | null;
  brandLogoUrl: string | null;
  garmentName: string;
  brandName: string;
  transparencyScore: number | null;
  totalEmissions: number | null;
  totalWater: number | null;
}

export function DppCarouselCard({
  productImageUrl,
  brandLogoUrl,
  garmentName,
  brandName,
  transparencyScore,
  totalEmissions,
  totalWater,
}: DppCarouselCardProps) {
  return (
    <div className="flex h-full flex-col bg-white px-4 pb-4 pt-2">
      {/* Brand header */}
      <div className="flex items-center gap-2 mb-3">
        {brandLogoUrl && (
          <img
            src={brandLogoUrl}
            alt={brandName}
            className="h-4 w-auto object-contain"
          />
        )}
        <span className="text-[9px] font-medium uppercase tracking-wider text-envrt-muted">
          {brandName}
        </span>
      </div>

      {/* Product image */}
      <div className="flex flex-1 items-center justify-center mb-3">
        {productImageUrl ? (
          <img
            src={productImageUrl}
            alt={garmentName}
            className="max-h-full w-auto object-contain"
          />
        ) : (
          <div className="h-20 w-20 rounded-lg bg-envrt-cream" />
        )}
      </div>

      {/* Garment name */}
      <p className="text-[11px] font-medium text-envrt-charcoal leading-tight truncate">
        {garmentName}
      </p>

      {/* Key metrics */}
      <div className="mt-2 flex items-center gap-3 border-t border-envrt-charcoal/6 pt-2">
        {transparencyScore != null && (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-envrt-teal">
              {transparencyScore}%
            </span>
            <span className="text-[7px] uppercase tracking-wider text-envrt-muted">
              Transparency
            </span>
          </div>
        )}
        {totalEmissions != null && (
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-envrt-charcoal">
              {totalEmissions.toFixed(1)}
            </span>
            <span className="text-[7px] uppercase tracking-wider text-envrt-muted">
              kg CO₂e
            </span>
          </div>
        )}
        {totalWater != null && (
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-envrt-charcoal">
              {totalWater.toFixed(0)}
            </span>
            <span className="text-[7px] uppercase tracking-wider text-envrt-muted">
              L water
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
