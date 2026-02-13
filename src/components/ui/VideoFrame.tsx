"use client";

import { useState } from "react";

interface VideoFrameProps {
  src: string;
  label?: string;
  className?: string;
}

export function VideoFrame({ src, label, className = "" }: VideoFrameProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <div className="mb-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-envrt-teal" />
          <span className="text-[11px] font-medium tracking-[0.15em] text-envrt-muted uppercase">
            {label}
          </span>
        </div>
      )}

      {/* Phone shell */}
      <div className="relative mx-auto w-full max-w-[280px]">
        <div className="relative overflow-hidden rounded-[2.5rem] border-[6px] border-envrt-charcoal/90 bg-white shadow-2xl shadow-envrt-green/10">
          {/* Status bar */}
          <div className="flex items-center justify-between bg-white px-5 pt-2.5 pb-1">
            <span className="text-[10px] font-semibold text-envrt-charcoal">15:45</span>
            <div className="h-[18px] w-[72px] rounded-full bg-envrt-charcoal/90" />
            <div className="flex items-center gap-0.5">
              <svg className="h-2.5 w-2.5 text-envrt-charcoal" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
              </svg>
              <svg className="h-3 w-3 text-envrt-charcoal" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>
              </svg>
            </div>
          </div>

          {/* Screen content */}
          <div className="relative aspect-[9/17] w-full bg-white">
            {!hasError ? (
              <video
                src={src}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
                onError={() => setHasError(true)}
              />
            ) : (
              <div className="flex h-full w-full flex-col px-4 pt-2">
                <div className="flex items-center justify-between pb-2 border-b border-envrt-charcoal/5">
                  <span className="text-[10px] font-semibold text-envrt-charcoal tracking-tight">Angry Pablo.</span>
                  <div className="flex gap-2">
                    <span className="h-3 w-3 rounded-sm bg-envrt-charcoal/10" />
                    <span className="h-3 w-3 rounded-sm bg-envrt-charcoal/10" />
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {[
                    { icon: "🌿", label: "Fibre Production", loc: "China, Vietnam, Côte d'Ivoire" },
                    { icon: "🧵", label: "Yarn Spinning", loc: "China, Vietnam, China" },
                    { icon: "🏭", label: "Fabric Weaving", loc: "Italy (Bergamo)" },
                    { icon: "🎨", label: "Dyeing", loc: "Italy (Bergamo)" },
                    { icon: "✂️", label: "Manufacturing", loc: "China (Dongguan)" },
                  ].map((step) => (
                    <div key={step.label} className="flex items-center gap-2 rounded-lg border border-envrt-charcoal/5 bg-envrt-cream/40 px-2.5 py-2">
                      <span className="text-xs">{step.icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-semibold text-envrt-charcoal leading-tight truncate">{step.label}</p>
                        <p className="text-[8px] text-envrt-muted leading-tight truncate">{step.loc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-lg border border-envrt-charcoal/5 bg-envrt-cream/30 p-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px]">🌍</span>
                    <span className="text-[9px] font-bold text-envrt-charcoal">Environmental Impact</span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <div className="flex-1 rounded-md bg-white p-1.5">
                      <p className="text-[7px] text-envrt-muted">Carbon Footprint</p>
                      <p className="text-[10px] font-bold text-envrt-charcoal">6.1kg CO₂-eq</p>
                      <p className="text-[7px] text-envrt-teal">75% improvement</p>
                    </div>
                    <div className="flex-1 rounded-md bg-white p-1.5">
                      <p className="text-[7px] text-envrt-muted">Water Scarcity</p>
                      <p className="text-[10px] font-bold text-envrt-charcoal">2.3m³</p>
                      <p className="text-[7px] text-envrt-teal">62% improvement</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1" />
                <p className="pb-2 text-center text-[7px] text-envrt-muted/50">
                  Replace: /public/videos/dpp-demo.mp4
                </p>
              </div>
            )}
          </div>

          {/* Home indicator */}
          <div className="flex justify-center bg-white pb-2.5 pt-1">
            <div className="h-1 w-24 rounded-full bg-envrt-charcoal/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
