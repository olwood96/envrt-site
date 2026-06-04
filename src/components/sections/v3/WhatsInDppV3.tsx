"use client";

import Image from "next/image";
import { FadeUp } from "@/components/ui/Motion";

// Apple-style bento: each tile a clean, confident module. System font
// throughout. Slight hover-lift on each card for tactility.

function TileLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-envrt-charcoal/55">
      {children}
    </p>
  );
}

function TileBase({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex h-full flex-col rounded-3xl p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-20px_rgba(14,14,14,0.18)] sm:p-9 ${className}`}
    >
      {children}
    </div>
  );
}

export function WhatsInDppV3() {
  return (
    <section className="bg-envrt-offwhite py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1320px] px-6 sm:px-10 lg:px-16">
        {/* Section header */}
        <div className="mb-12 grid gap-8 sm:mb-16 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <FadeUp>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-envrt-teal">
              The passport
            </p>
            <h2 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-envrt-ink sm:text-4xl lg:text-[2.75rem]">
              What lives on a DPP.
            </h2>
          </FadeUp>
          <FadeUp delay={0.08}>
            <p className="text-base leading-relaxed text-envrt-charcoal/70 sm:text-lg">
              Every passport pairs regulation-grade impact data with the
              story the customer cares about. Same page. One scan. No
              jargon they can&apos;t translate.
            </p>
          </FadeUp>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-6 sm:gap-5 lg:grid-cols-12 lg:gap-6">
          {/* 1. Headline impact — wide hero tile */}
          <FadeUp className="sm:col-span-6 lg:col-span-7">
            <TileBase className="justify-between bg-envrt-ink text-envrt-offwhite">
              <TileLabel>
                <span className="text-envrt-teal-light">Headline impact</span>
              </TileLabel>
              <div className="mt-8 grid grid-cols-3 gap-6">
                <div>
                  <p className="text-4xl font-semibold leading-none tracking-[-0.02em] sm:text-5xl">
                    6.3
                    <span className="ml-1 text-base font-medium text-envrt-offwhite/55">
                      kg
                    </span>
                  </p>
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-offwhite/60">
                    CO₂e
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-semibold leading-none tracking-[-0.02em] sm:text-5xl">
                    12.4k
                    <span className="ml-1 text-base font-medium text-envrt-offwhite/55">
                      L
                    </span>
                  </p>
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-offwhite/60">
                    Water scarcity
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-semibold leading-none tracking-[-0.02em] sm:text-5xl">
                    69
                    <span className="ml-1 text-base font-medium text-envrt-offwhite/55">
                      %
                    </span>
                  </p>
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-offwhite/60">
                    Data depth
                  </p>
                </div>
              </div>
              <p className="mt-8 max-w-md text-sm leading-relaxed text-envrt-offwhite/65">
                Numbers calculated per garment, peer-reviewed methods, ready
                to drop into an audit pack.
              </p>
            </TileBase>
          </FadeUp>

          {/* 2. Eco-Score — narrow tile */}
          <FadeUp delay={0.06} className="sm:col-span-3 lg:col-span-5">
            <TileBase className="justify-between bg-envrt-stone">
              <TileLabel>French Eco-Score</TileLabel>
              <div className="mt-6 flex items-center justify-center">
                <div className="relative h-28 w-full max-w-[220px]">
                  <Image
                    src="/screenshots/dpp/sections/eco-score.png"
                    alt="Coût Environnemental label, 1573 points"
                    fill
                    sizes="220px"
                    className="object-contain"
                  />
                </div>
              </div>
              <p className="mt-6 text-sm leading-relaxed text-envrt-charcoal/75">
                Government-recognised in France. Same methodology ENVRT runs
                by default.
              </p>
            </TileBase>
          </FadeUp>

          {/* 3. Provenance map */}
          <FadeUp delay={0.12} className="sm:col-span-3 lg:col-span-5">
            <TileBase className="bg-white ring-1 ring-envrt-ink/5">
              <TileLabel>Provenance</TileLabel>
              <p className="mt-3 text-xl font-semibold leading-snug tracking-[-0.01em] text-envrt-ink">
                Fibre to finished garment.
              </p>
              <div className="relative mt-5 aspect-[5/3] w-full overflow-hidden rounded-2xl bg-envrt-stone/60">
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-50"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, rgba(14,14,14,0.15) 1px, transparent 1px)",
                    backgroundSize: "14px 14px",
                  }}
                />
                <svg
                  viewBox="0 0 100 60"
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 18 38 Q 34 18 50 30 T 82 44"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.6"
                    strokeDasharray="2 2"
                    vectorEffect="non-scaling-stroke"
                    className="text-envrt-teal/60"
                  />
                  {[
                    { x: 18, y: 38 },
                    { x: 50, y: 30 },
                    { x: 82, y: 44 },
                  ].map((d, i) => (
                    <g key={i}>
                      <circle cx={d.x} cy={d.y} r={3} className="fill-envrt-teal/25" />
                      <circle cx={d.x} cy={d.y} r={1.5} className="fill-envrt-teal" />
                    </g>
                  ))}
                </svg>
                <div className="absolute inset-x-0 bottom-2 flex items-end justify-between px-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-envrt-ink/70">
                  <span>IN · Cotton</span>
                  <span>TR · Fabric</span>
                  <span>PT · Assembly</span>
                </div>
              </div>
            </TileBase>
          </FadeUp>

          {/* 4. Verified standards */}
          <FadeUp delay={0.18} className="sm:col-span-3 lg:col-span-4">
            <TileBase className="bg-envrt-green text-envrt-offwhite">
              <TileLabel>
                <span className="text-envrt-teal-light">Verified against</span>
              </TileLabel>
              <ul className="mt-6 space-y-3">
                {["EU PEF", "ISO 14040 / 14067", "AWARE water stress"].map(
                  (label) => (
                    <li
                      key={label}
                      className="flex items-center gap-3 text-base font-medium"
                    >
                      <svg
                        className="h-3 w-3 flex-shrink-0 text-envrt-teal-light"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M14 4L6 12L2 8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {label}
                    </li>
                  ),
                )}
              </ul>
              <p className="mt-auto pt-8 text-sm leading-relaxed text-envrt-offwhite/70">
                Methodology that survives a regulator&apos;s PDF.
              </p>
            </TileBase>
          </FadeUp>

          {/* 5. Brand story */}
          <FadeUp delay={0.24} className="sm:col-span-3 lg:col-span-4">
            <TileBase className="bg-envrt-stone">
              <TileLabel>Your story</TileLabel>
              <p className="mt-6 text-xl font-semibold leading-snug tracking-[-0.01em] text-envrt-ink">
                Photography, provenance, repair guidance — your editorial
                voice, your assets, your control.
              </p>
              <p className="mt-auto pt-8 text-sm leading-relaxed text-envrt-charcoal/65">
                The numbers earn the trust. The story earns the loyalty.
              </p>
            </TileBase>
          </FadeUp>

          {/* 6. Scan-ready */}
          <FadeUp delay={0.3} className="sm:col-span-6 lg:col-span-4">
            <TileBase className="justify-between bg-white ring-1 ring-envrt-ink/5">
              <TileLabel>Scan-ready</TileLabel>
              <div className="my-5 flex items-center gap-5">
                <div className="relative h-16 w-16 flex-shrink-0">
                  <Image
                    src="/qr-code.png"
                    alt="DPP QR"
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                </div>
                <p className="text-lg font-semibold leading-snug tracking-[-0.01em] text-envrt-ink">
                  One QR. One scan. The full passport.
                </p>
              </div>
              <p className="text-sm leading-relaxed text-envrt-charcoal/65">
                Sized for care labels, hangtags, packaging. Resolves to a
                hosted page or your own domain.
              </p>
            </TileBase>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
