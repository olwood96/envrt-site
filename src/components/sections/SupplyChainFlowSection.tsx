"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ─── Editable final metric values ─── */
const FINAL_CO2 = 6.3; // kg CO₂-eq
const FINAL_WATER = 12450; // L eq AWARE
const FINAL_TRACEABILITY = 69; // %

/* ─── Animation timing ─── */
const CYCLE_DURATION = 8;
const DRAIN_DURATION = 800;
const PAUSE_BEFORE_RESTART = 1200;

function useIntersectionOnce(ref: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

export function SupplyChainFlowSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const visible = useIntersectionOnce(sectionRef);
  const [animKey, setAnimKey] = useState(0);
  const [glowing, setGlowing] = useState(false);

  const [co2, setCo2] = useState(0);
  const [water, setWater] = useState(0);
  const [trace, setTrace] = useState(0);
  const [phase, setPhase] = useState<"counting" | "holding" | "draining" | "paused">("paused");
  const rafRef = useRef<number>(0);

  const countUp = useCallback(() => {
    const start = performance.now();
    const duration = CYCLE_DURATION * 1000;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setCo2(Number((FINAL_CO2 * ease).toFixed(1)));
      setWater(Math.round(FINAL_WATER * ease));
      setTrace(Math.round(FINAL_TRACEABILITY * ease));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPhase("holding");
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const drainDown = useCallback(() => {
    const start = performance.now();
    const startCo2 = FINAL_CO2;
    const startWater = FINAL_WATER;
    const startTrace = FINAL_TRACEABILITY;
    const tick = (now: number) => {
      const t = Math.min((now - start) / DRAIN_DURATION, 1);
      const ease = 1 - t * t;
      setCo2(Number((startCo2 * ease).toFixed(1)));
      setWater(Math.round(startWater * ease));
      setTrace(Math.round(startTrace * ease));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCo2(0);
        setWater(0);
        setTrace(0);
        setAnimKey(k => k + 1);
        setGlowing(false);
        setPhase("counting");
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (!visible) return;
    if (phase === "paused") { setPhase("counting"); return; }
    if (phase === "counting") { countUp(); return () => cancelAnimationFrame(rafRef.current); }
    if (phase === "holding") {
      const timeout = setTimeout(() => { setGlowing(true); setPhase("draining"); }, PAUSE_BEFORE_RESTART);
      return () => clearTimeout(timeout);
    }
    if (phase === "draining") { drainDown(); return () => cancelAnimationFrame(rafRef.current); }
  }, [visible, phase, countUp, drainDown]);

  /*
    Layout — labels above, lines below labels:
    
    FIBRE (y=12)     YARN (y=12)        FABRIC (y=12)     DYEING (y=12)     ASSEMBLY (y=12)
      ○ (y=28)         ○ (y=28) ────────┐
                                         ● (y=55) ──────── ○ (y=55) ──────── ○ (y=55)
      ○ (y=82)         ○ (y=82) ────────┘
    FIBRE (y=98)     YARN (y=98)
  */

  const upperPath = "M60 28 L180 28 L300 28 L300 55";
  const lowerPath = "M60 82 L180 82 L300 82 L300 55";
  const mainPath = "M300 55 L420 55 L540 55";
  const fullUpperPath = "M60 28 L180 28 L300 28 L300 55 L420 55 L540 55";
  const fullLowerPath = "M60 82 L180 82 L300 82 L300 55 L420 55 L540 55";
  const dur = `${CYCLE_DURATION}s`;

  return (
    <div ref={sectionRef} className="py-10 sm:py-12">
      <div className="mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:gap-10">
          {/* ─── Supply chain flow ─── */}
          <div className="relative flex-1 w-full overflow-hidden">
            <svg
              key={animKey}
              viewBox="0 0 600 110"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
              style={{ minHeight: 80 }}
            >
              {/* ─── Glow filter for travelling dots ─── */}
              <defs>
                <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* ─── Background paths (grey) ─── */}
              <path d={upperPath} stroke="#d1d5db" strokeWidth="1" fill="none" />
              <path d={lowerPath} stroke="#d1d5db" strokeWidth="1" fill="none" />
              <path d={mainPath} stroke="#d1d5db" strokeWidth="1" fill="none" />

              {/* ─── Animated green paths ─── */}
              {visible && (
                <>
                  <path d={upperPath} stroke="#2d6a4f" strokeWidth="1.3" fill="none" strokeDasharray="500" strokeDashoffset="500">
                    <animate attributeName="stroke-dashoffset" from="500" to="0" dur={`${CYCLE_DURATION * 0.5}s`} fill="freeze" />
                  </path>
                  <path d={lowerPath} stroke="#2d6a4f" strokeWidth="1.3" fill="none" strokeDasharray="500" strokeDashoffset="500">
                    <animate attributeName="stroke-dashoffset" from="500" to="0" dur={`${CYCLE_DURATION * 0.5}s`} fill="freeze" />
                  </path>
                  <path d={mainPath} stroke="#2d6a4f" strokeWidth="1.3" fill="none" strokeDasharray="300" strokeDashoffset="300">
                    <animate attributeName="stroke-dashoffset" from="300" to="0" dur={`${CYCLE_DURATION * 0.4}s`} begin={`${CYCLE_DURATION * 0.45}s`} fill="freeze" />
                  </path>
                </>
              )}

              {/* ─── Stage nodes ─── */}
              <circle cx="60" cy="28" r="3.5" fill="#f3f1ed" stroke="#2d6a4f" strokeWidth="1" />
              <circle cx="60" cy="82" r="3.5" fill="#f3f1ed" stroke="#2d6a4f" strokeWidth="1" />
              <circle cx="180" cy="28" r="3.5" fill="#f3f1ed" stroke="#2d6a4f" strokeWidth="1" />
              <circle cx="180" cy="82" r="3.5" fill="#f3f1ed" stroke="#2d6a4f" strokeWidth="1" />
              <circle cx="300" cy="55" r="4.5" fill="#2d6a4f" stroke="none" />
              <circle cx="420" cy="55" r="3.5" fill="#f3f1ed" stroke="#2d6a4f" strokeWidth="1" />
              <circle cx="540" cy="55" r="3.5" fill="#f3f1ed" stroke="#2d6a4f" strokeWidth="1" />

              {/* ─── Glow on restart ─── */}
              {glowing && (
                <>
                  <circle cx="60" cy="28" r="4" fill="#2d6a4f">
                    <animate attributeName="opacity" values="0.4;0" dur="0.8s" fill="freeze" />
                    <animate attributeName="r" values="4;14" dur="0.8s" fill="freeze" />
                  </circle>
                  <circle cx="60" cy="82" r="4" fill="#2d6a4f">
                    <animate attributeName="opacity" values="0.4;0" dur="0.8s" fill="freeze" />
                    <animate attributeName="r" values="4;14" dur="0.8s" fill="freeze" />
                  </circle>
                </>
              )}

              {/* ─── Stage labels ─── */}
              {/* Upper row */}
              <text x="60" y="16" textAnchor="middle" fontSize="7" fontWeight="500" fill="#1a1a1a" opacity="0.4">FIBRE</text>
              <text x="180" y="16" textAnchor="middle" fontSize="7" fontWeight="500" fill="#1a1a1a" opacity="0.4">YARN</text>
              {/* Main row — offset left so fabric label doesn't sit on the vertical lines */}
              <text x="288" y="57" textAnchor="end" fontSize="7" fontWeight="500" fill="#1a1a1a" opacity="0.4">FABRIC</text>
              <text x="420" y="47" textAnchor="middle" fontSize="7" fontWeight="500" fill="#1a1a1a" opacity="0.4">DYEING</text>
              <text x="540" y="47" textAnchor="middle" fontSize="7" fontWeight="500" fill="#1a1a1a" opacity="0.4">ASSEMBLY</text>
              {/* Lower row */}
              <text x="60" y="98" textAnchor="middle" fontSize="7" fontWeight="500" fill="#1a1a1a" opacity="0.3">FIBRE</text>
              <text x="180" y="98" textAnchor="middle" fontSize="7" fontWeight="500" fill="#1a1a1a" opacity="0.3">YARN</text>

              {/* ─── Travelling glowing dots ─── */}
              {visible && (
                <>
                  {/* Upper path */}
                  <circle r="3" fill="#2d6a4f" opacity="0.8" filter="url(#dotGlow)">
                    <animateMotion dur={dur} fill="freeze" path={fullUpperPath} />
                  </circle>
                  {/* Lower path — same speed */}
                  <circle r="3" fill="#2d6a4f" opacity="0.5" filter="url(#dotGlow)">
                    <animateMotion dur={dur} fill="freeze" path={fullLowerPath} />
                  </circle>
                </>
              )}
            </svg>
          </div>

          {/* ─── Metrics widgets ─── */}
          <div className="flex flex-shrink-0 items-center gap-3 sm:gap-4">
            <div className="flex w-[88px] flex-col items-center rounded-lg border border-envrt-charcoal/[0.06] bg-white/60 px-3 py-3 backdrop-blur-sm">
              <span className="text-[10px] font-medium uppercase tracking-wider text-envrt-muted/50">CO₂e</span>
              <span className="mt-0.5 text-lg font-semibold tabular-nums text-envrt-charcoal">{co2.toFixed(1)}</span>
              <span className="text-[9px] text-envrt-muted/40">kg</span>
            </div>
            <div className="flex w-[96px] flex-col items-center rounded-lg border border-envrt-charcoal/[0.06] bg-white/60 px-3 py-3 backdrop-blur-sm">
              <span className="text-[9px] font-medium uppercase tracking-wider text-envrt-muted/50">H₂O Scarcity</span>
              <span className="mt-0.5 text-lg font-semibold tabular-nums text-envrt-charcoal">{water.toLocaleString()}</span>
              <span className="text-[9px] text-envrt-muted/40">L eq</span>
            </div>
            <div className="flex w-[96px] flex-col items-center rounded-lg border border-envrt-charcoal/[0.06] bg-white/60 px-3 py-3 backdrop-blur-sm">
              <span className="text-[10px] font-medium uppercase tracking-wider text-envrt-muted/50">Traceability</span>
              <span className="mt-0.5 text-lg font-semibold tabular-nums text-envrt-charcoal">{trace}</span>
              <span className="text-[9px] text-envrt-muted/40">%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
