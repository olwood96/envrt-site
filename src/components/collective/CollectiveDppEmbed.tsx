"use client";

import { useState } from "react";

interface Props {
  embedUrl: string;
  garmentName: string;
}

export function CollectiveDppEmbed({ embedUrl, garmentName }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-envrt-charcoal/5 bg-white">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-envrt-cream/60">
          <div className="flex items-center gap-2 text-sm text-envrt-muted">
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Loading DPP...
          </div>
        </div>
      )}
      <iframe
        src={embedUrl}
        title={`Digital Product Passport — ${garmentName}`}
        className="h-[800px] w-full border-0 sm:h-[1000px]"
        sandbox="allow-scripts allow-same-origin allow-popups"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
