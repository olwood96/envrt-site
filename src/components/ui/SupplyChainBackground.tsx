"use client";

import { useEffect, useState, useMemo } from "react";

function makeRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface Line { d: string; sw: number; color: "t" | "g" }
interface Node { cx: number; cy: number; r: number; filled: boolean; color: "t" | "g" }
interface Shape { cx: number; cy: number; r: number; type: "hex" | "diamond" | "plus" | "dot"; color: "t" | "g" }

function generatePattern(w: number, h: number) {
  const rng = makeRng(7919);
  const lines: Line[] = [];
  const nodes: Node[] = [];
  const shapes: Shape[] = [];
  const c = (): "t" | "g" => rng() > 0.4 ? "t" : "g";

  // ── HORIZONTAL PATHS — dense, every ~120-220px ──
  for (let y = 60; y < h; y += 100 + rng() * 140) {
    // 1-2 paths per row at different x ranges
    const count = rng() > 0.5 ? 2 : 1;
    for (let p = 0; p < count; p++) {
      const x0 = p === 0 ? (rng() < 0.5 ? 0 : rng() * w * 0.2) : w * 0.4 + rng() * w * 0.2;
      const x1 = p === 0 ? (w * 0.3 + rng() * w * 0.35) : (rng() < 0.5 ? w : w * 0.7 + rng() * w * 0.3);
      const elbows = 1 + Math.floor(rng() * 3);
      let d = `M${x0} ${y}`;
      let cx = x0;
      const col = c();

      for (let e = 0; e < elbows; e++) {
        const seg = (x1 - x0) / (elbows + 1);
        const nx = cx + seg * (0.5 + rng() * 0.8);
        const dir = rng() > 0.5 ? -1 : 1;
        const ey = y + dir * (15 + rng() * 35);
        const gap = 25 + rng() * 40;
        d += ` H${nx} L${nx + gap * 0.4} ${ey} H${nx + gap}`;
        nodes.push({ cx: nx + gap * 0.2, cy: (y + ey) / 2, r: 2.5 + rng() * 2, filled: rng() > 0.5, color: col });
        cx = nx + gap;
      }
      d += ` H${Math.min(x1, w)}`;
      lines.push({ d, sw: 0.6 + rng() * 0.5, color: col });
      nodes.push({ cx: Math.min(x1, w), cy: y, r: 2 + rng() * 1.5, filled: rng() > 0.6, color: col });
    }
  }

  // ── VERTICAL PATHS — dense, every ~150-250px ──
  for (let x = 80; x < w; x += 120 + rng() * 160) {
    const count = rng() > 0.6 ? 2 : 1;
    for (let p = 0; p < count; p++) {
      const y0 = p === 0 ? rng() * 300 : h * 0.3 + rng() * h * 0.2;
      const len = 200 + rng() * 500;
      const elbows = 1 + Math.floor(rng() * 2);
      let d = `M${x} ${y0}`;
      let cy = y0;
      const col = c();

      for (let e = 0; e < elbows; e++) {
        const seg = len / (elbows + 1);
        const ny = cy + seg * (0.5 + rng() * 0.6);
        const dir = rng() > 0.5 ? -1 : 1;
        const ex = x + dir * (15 + rng() * 30);
        const gap = 25 + rng() * 35;
        d += ` V${ny} L${ex} ${ny + gap * 0.4} V${ny + gap}`;
        nodes.push({ cx: (x + ex) / 2, cy: ny + gap * 0.2, r: 2.5 + rng() * 2, filled: rng() > 0.5, color: col });
        cy = ny + gap;
      }
      d += ` V${Math.min(y0 + len, h)}`;
      lines.push({ d, sw: 0.6 + rng() * 0.5, color: col });
      nodes.push({ cx: x, cy: Math.min(y0 + len, h), r: 2 + rng() * 1.5, filled: rng() > 0.5, color: col });
    }
  }

  // ── ADDITIONAL long vertical runs spanning large sections ──
  for (let i = 0; i < 8; i++) {
    const x = 100 + rng() * (w - 200);
    const y0 = rng() * h * 0.3;
    const y1 = y0 + h * 0.3 + rng() * h * 0.4;
    const mid = y0 + (y1 - y0) * (0.3 + rng() * 0.4);
    const ex = x + (rng() > 0.5 ? 1 : -1) * (20 + rng() * 40);
    const col = c();
    lines.push({ d: `M${x} ${y0} V${mid} L${ex} ${mid + 40} V${y1}`, sw: 0.7 + rng() * 0.4, color: col });
    nodes.push({ cx: ex, cy: mid + 20, r: 3 + rng() * 2, filled: rng() > 0.4, color: col });
    nodes.push({ cx: x, cy: y0, r: 2 + rng(), filled: true, color: col });
    nodes.push({ cx: ex, cy: y1, r: 2 + rng(), filled: true, color: col });
  }

  // ── ADDITIONAL long horizontal runs ──
  for (let i = 0; i < 6; i++) {
    const y = 200 + rng() * (h - 400);
    const x0 = rng() * w * 0.15;
    const x1 = w * 0.85 + rng() * w * 0.15;
    const mid = x0 + (x1 - x0) * (0.3 + rng() * 0.4);
    const ey = y + (rng() > 0.5 ? 1 : -1) * (20 + rng() * 35);
    const col = c();
    lines.push({ d: `M${x0} ${y} H${mid} L${mid + 40} ${ey} H${x1}`, sw: 0.7 + rng() * 0.4, color: col });
    nodes.push({ cx: mid + 20, cy: (y + ey) / 2, r: 3 + rng() * 2, filled: rng() > 0.4, color: col });
  }

  // ── SHAPES scattered across page ──
  const shapeCount = Math.max(25, Math.floor(h / 200));
  for (let i = 0; i < shapeCount; i++) {
    const types: Shape["type"][] = ["hex", "diamond", "plus", "dot", "dot", "dot"];
    shapes.push({
      cx: rng() * w,
      cy: rng() * h,
      r: types[i % types.length] === "dot" ? 0.8 + rng() * 1.5 : 7 + rng() * 6,
      type: types[i % types.length],
      color: c(),
    });
  }

  // Extra scatter dots
  for (let i = 0; i < Math.max(50, h / 80); i++) {
    shapes.push({ cx: rng() * w, cy: rng() * h, r: 0.6 + rng() * 1.2, type: "dot", color: c() });
  }

  return { lines, nodes, shapes };
}

function hexPts(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, j) => {
    const a = (Math.PI / 3) * j - Math.PI / 6;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");
}

export function SupplyChainBackground({ children }: { children: React.ReactNode }) {
  const [dims, setDims] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const measure = () => setDims({ w: window.innerWidth, h: document.documentElement.scrollHeight });
    measure();
    window.addEventListener("resize", measure);
    const mo = new MutationObserver(measure);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { window.removeEventListener("resize", measure); mo.disconnect(); };
  }, []);

  const pattern = useMemo(() => {
    if (!dims.w || !dims.h) return null;
    return generatePattern(dims.w, dims.h);
  }, [dims.w, dims.h]);

  if (!pattern) return <div className="relative">{children}</div>;

  const T = "var(--envrt-teal, #1a7a6d)";
  const G = "var(--envrt-green, #1b3a2d)";
  const col = (c: "t" | "g") => c === "t" ? T : G;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Dot grid */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.05]">
          <defs>
            <pattern id="sc-bg-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.5" fill="currentColor" className="text-envrt-charcoal" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sc-bg-dots)" />
        </svg>

        {/* Circuit pattern — scrolls with page */}
        <svg
          className="absolute left-0 top-0 opacity-[0.09]"
          style={{
            width: dims.w,
            height: dims.h,
          }}
          viewBox={`0 0 ${dims.w} ${dims.h}`}
          fill="none"
        >
          {pattern.lines.map((l, i) => (
            <path key={`l${i}`} d={l.d} stroke={col(l.color)} strokeWidth={l.sw} />
          ))}

          {pattern.nodes.map((n, i) =>
            n.filled
              ? <circle key={`n${i}`} cx={n.cx} cy={n.cy} r={n.r} fill={col(n.color)} />
              : <circle key={`n${i}`} cx={n.cx} cy={n.cy} r={n.r} stroke={col(n.color)} strokeWidth="0.7" fill="none" />
          )}

          {pattern.shapes.map((s, i) => {
            if (s.type === "hex") return <polygon key={`s${i}`} points={hexPts(s.cx, s.cy, s.r)} stroke={col(s.color)} strokeWidth="0.7" fill="none" />;
            if (s.type === "diamond") return <rect key={`s${i}`} x={s.cx - 4} y={s.cy - 4} width="8" height="8" transform={`rotate(45 ${s.cx} ${s.cy})`} stroke={col(s.color)} strokeWidth="0.7" fill="none" />;
            if (s.type === "plus") return (
              <g key={`s${i}`}>
                <line x1={s.cx - 5} y1={s.cy} x2={s.cx + 5} y2={s.cy} stroke={col(s.color)} strokeWidth="0.7" />
                <line x1={s.cx} y1={s.cy - 5} x2={s.cx} y2={s.cy + 5} stroke={col(s.color)} strokeWidth="0.7" />
              </g>
            );
            return <circle key={`s${i}`} cx={s.cx} cy={s.cy} r={s.r} fill={col(s.color)} />;
          })}
        </svg>
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
