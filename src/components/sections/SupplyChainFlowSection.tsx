"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ——— Editable final metric values ——— */
const FINAL_CO2 = 6.3; // kg CO₂-eq
const FINAL_WATER = 12450; // L eq AWARE
const FINAL_TRACEABILITY = 69; // %

/* ——— Animation timing ——— */
const CYCLE_DURATION = 8;
const DRAIN_DURATION = 800;
const PAUSE_BEFORE_RESTART = 1200;

/* ——— Path data ——— */
const UPPER_PATH = "M60 28 L180 28 L300 28 L300 55";
const LOWER_PATH = "M60 82 L180 82 L300 82 L300 55";
const MAIN_PATH = "M300 55 L420 55 L540 55";
const FULL_UPPER_PATH = "M60 28 L180 28 L300 28 L300 55 L420 55 L540 55";
const FULL_LOWER_PATH = "M60 82 L180 82 L300 82 L300 55 L420 55 L540 55";

/* ——— Path lengths (pre-measured) ——— */
const UPPER_LEN = 500;
const LOWER_LEN = 500;
const MAIN_LEN = 300;

function useIntersectionOnce(ref: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

/* Helper: get point at fractional length along an SVG path */
function getPointAtFraction(
  pathEl: SVGPathElement | null,
  fraction: number
): { x: number; y: number } {
  if (!pathEl) return { x: 0, y: 0 };
  const totalLen = pathEl.getTotalLength();
  const pt = pathEl.getPointAtLength(fraction * totalLen);
  return { x: pt.x, y: pt.y };
}

export function SupplyChainFlowSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const visible = useIntersectionOnce(sectionRef);

  const [started, setStarted] = useState(false);
  const [glowing, setGlowing] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const [co2, setCo2] = useState(0);
  const [water, setWater] = useState(0);
  const [trace, setTrace] = useState(0);
  const [phase, setPhase] = useState<
    "idle" | "counting" | "holding" | "draining"
  >("idle");
  const rafRef = useRef<number>(0);

  /* Refs to SVG elements we drive imperatively */
  const upperGreenRef = useRef<SVGPathElement>(null);
  const lowerGreenRef = useRef<SVGPathElement>(null);
  const mainGreenRef = useRef<SVGPathElement>(null);
  const dotUpperRef = useRef<SVGCircleElement>(null);
  const dotLowerRef = useRef<SVGCircleElement>(null);
  const fullUpperPathRef = useRef<SVGPathElement>(null);
  const fullLowerPathRef = useRef<SVGPathElement>(null);

  /* Kick off the very first cycle once visible */
  useEffect(() => {
    if (visible && !started) {
      setStarted(true);
      setPhase("counting");
    }
  }, [visible, started]);

  /* ——— Forward animation (count up + draw paths + move dots) ——— */
  const countUp = useCallback(() => {
    const start = performance.now();
    const duration = CYCLE_DURATION * 1000;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);

      /* Counters */
      setCo2(Number((FINAL_CO2 * ease).toFixed(1)));
      setWater(Math.round(FINAL_WATER * ease));
      setTrace(Math.round(FINAL_TRACEABILITY * ease));

      /* Branch paths: draw over first 50% */
      const branchT = Math.min(t / 0.5, 1);
      const branchOffset = UPPER_LEN * (1 - branchT);
      if (upperGreenRef.current) {
        upperGreenRef.current.style.strokeDashoffset = `${branchOffset}`;
      }
      if (lowerGreenRef.current) {
        lowerGreenRef.current.style.strokeDashoffset = `${branchOffset}`;
      }

      /* Main path: draw from 45% to 85% */
      const mainT = Math.max(0, Math.min((t - 0.45) / 0.4, 1));
      const mainOffset = MAIN_LEN * (1 - mainT);
      if (mainGreenRef.current) {
        mainGreenRef.current.style.strokeDashoffset = `${mainOffset}`;
      }

      /* Travelling dots: move along full path over full duration */
      const upperPt = getPointAtFraction(fullUpperPathRef.current, t);
      const lowerPt = getPointAtFraction(fullLowerPathRef.current, t);
      if (dotUpperRef.current) {
        dotUpperRef.current.setAttribute("cx", `${upperPt.x}`);
        dotUpperRef.current.setAttribute("cy", `${upperPt.y}`);
      }
      if (dotLowerRef.current) {
        dotLowerRef.current.setAttribute("cx", `${lowerPt.x}`);
        dotLowerRef.current.setAttribute("cy", `${lowerPt.y}`);
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPhase("holding");
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  /* ——— Reverse animation (drain numbers + retract paths + reverse dots) ——— */
  const drainDown = useCallback(() => {
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / DRAIN_DURATION, 1);
      const remaining = 1 - t; // goes from 1 → 0

      /* Counters drain */
      setCo2(Number((FINAL_CO2 * remaining).toFixed(1)));
      setWater(Math.round(FINAL_WATER * remaining));
      setTrace(Math.round(FINAL_TRACEABILITY * remaining));

      /* Reverse path drawing:
         Main path retracts first (0%–40% of drain),
         branch paths retract second (35%–100% of drain).
         Mirrors the forward order where branches drew first. */

      const mainRetractT = Math.min(t / 0.4, 1);
      const mainOffset = MAIN_LEN * mainRetractT;
      if (mainGreenRef.current) {
        mainGreenRef.current.style.strokeDashoffset = `${mainOffset}`;
      }

      const branchRetractT = Math.max(0, Math.min((t - 0.35) / 0.65, 1));
      const branchOffset = UPPER_LEN * branchRetractT;
      if (upperGreenRef.current) {
        upperGreenRef.current.style.strokeDashoffset = `${branchOffset}`;
      }
      if (lowerGreenRef.current) {
        lowerGreenRef.current.style.strokeDashoffset = `${branchOffset}`;
      }

      /* Dots reverse along path: from end back to start */
      const upperPt = getPointAtFraction(
        fullUpperPathRef.current,
        remaining
      );
      const lowerPt = getPointAtFraction(
        fullLowerPathRef.current,
        remaining
      );
      if (dotUpperRef.current) {
        dotUpperRef.current.setAttribute("cx", `${upperPt.x}`);
        dotUpperRef.current.setAttribute("cy", `${upperPt.y}`);
      }
      if (dotLowerRef.current) {
        dotLowerRef.current.setAttribute("cx", `${lowerPt.x}`);
        dotLowerRef.current.setAttribute("cy", `${lowerPt.y}`);
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCo2(0);
        setWater(0);
        setTrace(0);
        setGlowing(false);
        setAnimKey((k) => k + 1);
        setPhase("counting");
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (phase === "idle") return;

    if (phase === "counting") {
      countUp();
      return () => cancelAnimationFrame(rafRef.current);
    }
    if (phase === "holding") {
      const timeout = setTimeout(() => {
        setGlowing(true);
        setPhase("draining");
      }, PAUSE_BEFORE_RESTART);
      return () => clearTimeout(timeout);
    }
    if (phase === "draining") {
      drainDown();
      return () => cancelAnimationFrame(rafRef.current);
    }
  }, [phase, countUp, drainDown]);

  const showAnimations = started;

  return (
    <div ref={sectionRef} className="py-10 sm:py-12">
      <div className="mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:gap-10">
          {/* ——— Supply chain flow ——— */}
          <div className="relative flex-1 w-full overflow-hidden">
            <svg
              key={animKey}
              viewBox="0 0 600 110"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
              style={{ minHeight: 80 }}
            >
              <defs>
                <filter
                  id="dotGlow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Hidden reference paths for getPointAtLength */}
              <path
                ref={fullUpperPathRef}
                d={FULL_UPPER_PATH}
                fill="none"
                stroke="none"
              />
              <path
                ref={fullLowerPathRef}
                d={FULL_LOWER_PATH}
                fill="none"
                stroke="none"
              />

              {/* ——— Background paths (grey) ——— */}
              <path d={UPPER_PATH} stroke="#d1d5db" strokeWidth="1" fill="none" />
              <path d={LOWER_PATH} stroke="#d1d5db" strokeWidth="1" fill="none" />
              <path d={MAIN_PATH} stroke="#d1d5db" strokeWidth="1" fill="none" />

              {/* ——— Animated green paths (imperative via refs) ——— */}
              {showAnimations && (
                <>
                  <path
                    ref={upperGreenRef}
                    d={UPPER_PATH}
                    stroke="#2d6a4f"
                    strokeWidth="1.3"
                    fill="none"
                    strokeDasharray={UPPER_LEN}
                    strokeDashoffset={UPPER_LEN}
                  />
                  <path
                    ref={lowerGreenRef}
                    d={LOWER_PATH}
                    stroke="#2d6a4f"
                    strokeWidth="1.3"
                    fill="none"
                    strokeDasharray={LOWER_LEN}
                    strokeDashoffset={LOWER_LEN}
                  />
                  <path
                    ref={mainGreenRef}
                    d={MAIN_PATH}
                    stroke="#2d6a4f"
                    strokeWidth="1.3"
                    fill="none"
                    strokeDasharray={MAIN_LEN}
                    strokeDashoffset={MAIN_LEN}
                  />
                </>
              )}

              {/* ——— Stage nodes ——— */}
              <circle cx="60" cy="28" r="3.5" fill="#f3f1ed" stroke="#2d6a4f" strokeWidth="1" />
              <circle cx="60" cy="82" r="3.5" fill="#f3f1ed" stroke="#2d6a4f" strokeWidth="1" />
              <circle cx="180" cy="28" r="3.5" fill="#f3f1ed" stroke="#2d6a4f" strokeWidth="1" />
              <circle cx="180" cy="82" r="3.5" fill="#f3f1ed" stroke="#2d6a4f" strokeWidth="1" />
              <circle cx="300" cy="55" r="4.5" fill="#2d6a4f" stroke="none" />
              <circle cx="420" cy="55" r="3.5" fill="#f3f1ed" stroke="#2d6a4f" strokeWidth="1" />
              <circle cx="540" cy="55" r="3.5" fill="#f3f1ed" stroke="#2d6a4f" strokeWidth="1" />

              {/* ——— Glow on restart ——— */}
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

              {/* ——— Stage labels ——— */}
              <text x="60" y="16" textAnchor="middle" fontSize="7" fontWeight="500" fill="#1a1a1a" opacity="0.4">FIBRE</text>
              <text x="180" y="16" textAnchor="middle" fontSize="7" fontWeight="500" fill="#1a1a1a" opacity="0.4">YARN</text>
              <text x="288" y="57" textAnchor="end" fontSize="7" fontWeight="500" fill="#1a1a1a" opacity="0.4">FABRIC</text>
              <text x="420" y="47" textAnchor="middle" fontSize="7" fontWeight="500" fill="#1a1a1a" opacity="0.4">DYEING</text>
              <text x="540" y="47" textAnchor="middle" fontSize="7" fontWeight="500" fill="#1a1a1a" opacity="0.4">ASSEMBLY</text>
              <text x="60" y="98" textAnchor="middle" fontSize="7" fontWeight="500" fill="#1a1a1a" opacity="0.3">FIBRE</text>
              <text x="180" y="98" textAnchor="middle" fontSize="7" fontWeight="500" fill="#1a1a1a" opacity="0.3">YARN</text>

              {/* ——— Travelling glowing dots (imperative via refs) ——— */}
              {showAnimations && (
                <>
                  <circle
                    ref={dotUpperRef}
                    r="3"
                    cx="60"
                    cy="28"
                    fill="#2d6a4f"
                    opacity="0.8"
                    filter="url(#dotGlow)"
                  />
                  <circle
                    ref={dotLowerRef}
                    r="3"
                    cx="60"
                    cy="82"
                    fill="#2d6a4f"
                    opacity="0.5"
                    filter="url(#dotGlow)"
                  />
                </>
              )}
            </svg>
          </div>

          {/* ——— Metrics widgets ——— */}
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
