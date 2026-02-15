"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "../ui/Container";
import { SectionCard } from "../ui/SectionCard";
import { FadeUp } from "../ui/Motion";
import { howItWorksSteps } from "@/lib/config";

const SCREEN_Z = 30;
const ANIM_DURATION = 1200; // ms — unified runtime for all verb animations
const DESKTOP_PIECE_COUNT = 69;
const MOBILE_PIECE_COUNT = 20;
const DESKTOP_COLS = 9;
const MOBILE_COLS = 5;
const NAV_H = 72;
const EXPAND_PAD = 24;

function usePreloadMedia() {
  useEffect(() => {
    howItWorksSteps.forEach(({ mockImage }) => {
      if (/\.(mp4|mov|webm|m4v)$/i.test(mockImage)) {
        const v = document.createElement("video");
        v.preload = "auto";
        v.src = mockImage;
      } else {
        const i = new Image();
        i.src = mockImage;
      }
    });
  }, []);
}

function buildCrumbleCSS(pieceCount: number, cols: number, prefix: string) {
  const rows = Math.ceil(pieceCount / cols);
  let css = "";
  for (let i = 0; i < pieceCount; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const x1 = (c / cols) * 100;
    const y1 = (r / rows) * 100;
    const x2 = Math.min(((c + 1) / cols) * 100, 100);
    const y2 = Math.min(((r + 1) / rows) * 100, 100);
    const cx = (c + 0.5) / cols - 0.5;
    const xD = Math.round(cx * 350 + (Math.random() - 0.5) * 120);
    const yD = Math.round(700 + Math.random() * 700);
    const rot = Math.round((Math.random() - 0.5) * 140);
    const sc = (0.04 + Math.random() * 0.25).toFixed(2);
    const del = (r * 0.02 + c * 0.005 + Math.random() * 0.025).toFixed(3);
    css += `.crumble-go .${prefix}-${i}{clip-path:polygon(${x1}% ${y1}%,${x2}% ${y1}%,${x2}% ${y2}%,${x1}% ${y2}%);animation:${prefix}f-${i} 1.15s ${del}s cubic-bezier(0.35,0,1,0.4) forwards}`;
    css += `@keyframes ${prefix}f-${i}{0%{transform:translate(0,0) rotate(0) scale(1);opacity:1}8%{opacity:1}100%{transform:translate(${xD}px,${yD}px) rotate(${rot}deg) scale(${sc});opacity:0}}`;
  }
  return css;
}

function useInjectCrumbleCSS() {
  useEffect(() => {
    if (document.getElementById("crumble-all")) return;
    const el = document.createElement("style");
    el.id = "crumble-all";
    el.textContent = buildCrumbleCSS(DESKTOP_PIECE_COUNT, DESKTOP_COLS, "cp") + buildCrumbleCSS(MOBILE_PIECE_COUNT, MOBILE_COLS, "mp");
    document.head.appendChild(el);
  }, []);
}

function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}

/* =====================================================
   VERB BUTTON ANIMATIONS
   ===================================================== */

// --- COLLECT: fragments scatter then reassemble ---
function CollectAnimation({ btnRect, onDone }: { btnRect: DOMRect; onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d")!;
    const cx = btnRect.left + btnRect.width / 2;
    const cy = btnRect.top + btnRect.height / 2;

    // Create fragments that start at screen edges and fly inward
    const FRAG_COUNT = 28;
    const W = canvas.width;
    const H = canvas.height;
    const frags = Array.from({ length: FRAG_COUNT }, () => {
      // Pick a random screen edge: 0=top, 1=right, 2=bottom, 3=left
      const edge = Math.floor(Math.random() * 4);
      let startX: number, startY: number;
      switch (edge) {
        case 0: startX = Math.random() * W; startY = -10; break;       // top
        case 1: startX = W + 10; startY = Math.random() * H; break;    // right
        case 2: startX = Math.random() * W; startY = H + 10; break;    // bottom
        default: startX = -10; startY = Math.random() * H; break;      // left
      }
      return {
        startX,
        startY,
        endX: cx + (Math.random() - 0.5) * btnRect.width * 0.6,
        endY: cy + (Math.random() - 0.5) * btnRect.height * 0.6,
        size: 3 + Math.random() * 6,
        delay: Math.random() * 0.3,
        hue: 150 + Math.random() * 30, // envrt green-teal range
      };
    });

    const start = performance.now();
    let raf: number;
    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / ANIM_DURATION, 1);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      frags.forEach((f) => {
        const ft = Math.max(0, Math.min((t - f.delay) / (1 - f.delay), 1));
        // Ease in with overshoot at end
        const ease = ft < 0.7
          ? Math.pow(ft / 0.7, 0.4)
          : 1 + Math.sin((ft - 0.7) / 0.3 * Math.PI) * 0.08;
        const x = f.startX + (f.endX - f.startX) * ease;
        const y = f.startY + (f.endY - f.startY) * ease;
        const alpha = ft < 0.1 ? ft / 0.1 : ft > 0.85 ? Math.max(0, (1 - ft) / 0.15) : 1;
        const scale = ft > 0.8 ? 1 - (ft - 0.8) / 0.2 * 0.5 : 1;

        ctx.save();
        ctx.globalAlpha = alpha * 0.9;
        ctx.translate(x, y);
        ctx.rotate((1 - ft) * (f.delay > 0.15 ? 2 : -2));
        // Draw rounded rect fragment
        const s = f.size * scale;
        ctx.beginPath();
        ctx.roundRect(-s / 2, -s / 2, s, s, 1.5);
        ctx.fillStyle = `hsla(${f.hue}, 60%, 50%, 1)`;
        ctx.fill();
        // Glow trail
        ctx.shadowBlur = 12;
        ctx.shadowColor = `hsla(${f.hue}, 70%, 60%, 0.5)`;
        ctx.fill();
        ctx.restore();
      });

      // Flash at end when all pieces "click" together
      if (t > 0.7 && t < 0.85) {
        const flashT = (t - 0.7) / 0.15;
        ctx.save();
        ctx.globalAlpha = (1 - flashT) * 0.25;
        ctx.beginPath();
        ctx.arc(cx, cy, btnRect.width * 0.6 * flashT + 10, 0, Math.PI * 2);
        ctx.fillStyle = "#2dd4a0";
        ctx.fill();
        ctx.restore();
      }

      if (t < 1) raf = requestAnimationFrame(animate);
      else onDone();
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [btnRect, onDone]);

  return createPortal(
    <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }} />,
    document.body
  );
}

// --- ASSESS: magnifying glass scans over the button ---
function AssessAnimation({ btnRect, onDone }: { btnRect: DOMRect; onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d")!;
    const cx = btnRect.left + btnRect.width / 2;
    const cy = btnRect.top + btnRect.height / 2;
    const glassRadius = Math.max(btnRect.width, btnRect.height) * 0.7;

    const start = performance.now();
    let raf: number;
    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / ANIM_DURATION, 1);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Glass enters from left, sweeps across, exits right
      const enterExit = t < 0.15 ? t / 0.15 : t > 0.85 ? (1 - t) / 0.15 : 1;
      const sweepX = cx + (t - 0.5) * btnRect.width * 0.5;
      const sweepY = cy + Math.sin(t * Math.PI * 2) * 4;
      const alpha = Math.min(enterExit, 1);
      const pulse = 1 + Math.sin(t * Math.PI * 4) * 0.06;

      ctx.save();
      ctx.globalAlpha = alpha;

      // Magnified distortion ring
      const r = glassRadius * pulse;
      ctx.beginPath();
      ctx.arc(sweepX, sweepY, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(45, 212, 160, 0.35)";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Inner lens
      ctx.beginPath();
      ctx.arc(sweepX, sweepY, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(45, 212, 160, 0.06)";
      ctx.fill();

      // Glass rim with shine
      ctx.beginPath();
      ctx.arc(sweepX, sweepY, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Handle
      const handleAngle = Math.PI * 0.25;
      const hx1 = sweepX + Math.cos(handleAngle) * r;
      const hy1 = sweepY + Math.sin(handleAngle) * r;
      const hx2 = hx1 + Math.cos(handleAngle) * (r * 0.6);
      const hy2 = hy1 + Math.sin(handleAngle) * (r * 0.6);
      ctx.beginPath();
      ctx.moveTo(hx1, hy1);
      ctx.lineTo(hx2, hy2);
      ctx.strokeStyle = "rgba(45, 212, 160, 0.6)";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.stroke();

      // Scanning grid lines inside lens
      const gridCount = 5;
      ctx.globalAlpha = alpha * 0.2;
      for (let i = 0; i < gridCount; i++) {
        const offset = ((t * 200 + i * (r * 2 / gridCount)) % (r * 2)) - r;
        ctx.beginPath();
        ctx.moveTo(sweepX - r, sweepY + offset);
        ctx.lineTo(sweepX + r, sweepY + offset);
        ctx.strokeStyle = "#2dd4a0";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Pulse rings
      ctx.globalAlpha = alpha;
      for (let p = 0; p < 3; p++) {
        const pt = (t * 3 + p * 0.33) % 1;
        const pr = r * (1 + pt * 0.4);
        ctx.beginPath();
        ctx.arc(sweepX, sweepY, pr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(45, 212, 160, ${(1 - pt) * 0.15})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      ctx.restore();

      if (t < 1) raf = requestAnimationFrame(animate);
      else onDone();
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [btnRect, onDone]);

  return createPortal(
    <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }} />,
    document.body
  );
}

// --- CALCULATE: Matrix-style number rain ---
function CalculateAnimation({ onDone }: { btnRect: DOMRect; onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const W = window.innerWidth;
    const H = window.innerHeight;
    const fontSize = 14;
    const cols = Math.ceil(W / fontSize);
    const chars = "01234567890ABCDEFΣΔπ∫∂√±×÷=≈≠∞%#{}[];".split("");
    const drops = Array.from({ length: cols }, () => -Math.random() * 30);
    const speeds = Array.from({ length: cols }, () => 0.3 + Math.random() * 0.7);

    const start = performance.now();
    let raf: number;
    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / ANIM_DURATION, 1);

      // Fade in/out
      const fadeAlpha = t < 0.1 ? t / 0.1 : t > 0.75 ? (1 - t) / 0.25 : 1;

      // Clear fully each frame for transparency
      ctx.clearRect(0, 0, W, H);

      ctx.font = `bold ${fontSize}px monospace`;
      for (let i = 0; i < cols; i++) {
        const x = i * fontSize;

        // Draw a fading trail of characters above the head
        const trailLen = 12;
        for (let tr = trailLen; tr >= 0; tr--) {
          const trY = (drops[i] - tr) * fontSize;
          if (trY < 0 || trY > H) continue;
          const trailChar = chars[Math.floor(Math.random() * chars.length)];
          const trAlpha = fadeAlpha * ((trailLen - tr) / trailLen) * (tr === 0 ? 0.95 : 0.35);
          ctx.fillStyle = tr === 0
            ? `rgba(45, 212, 160, ${trAlpha})`
            : `rgba(20, 140, 100, ${trAlpha})`;
          ctx.fillText(trailChar, x, trY);
        }

        drops[i] += speeds[i];
        if (drops[i] * fontSize > H && Math.random() > 0.98) {
          drops[i] = 0;
        }
      }

      if (t < 1) raf = requestAnimationFrame(animate);
      else onDone();
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return createPortal(
    <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }} />,
    document.body
  );
}

// --- PUBLISH: button becomes a send icon and flies up ---
function PublishAnimation({ btnRect, onDone }: { btnRect: DOMRect; onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d")!;
    const cx = btnRect.left + btnRect.width / 2;
    const startY = btnRect.top + btnRect.height / 2;
    const endY = -80;

    const start = performance.now();
    let raf: number;

    // Particle trail buffer
    const particles: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number }[] = [];

    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / ANIM_DURATION, 1);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Phase 1 (0-0.2): morph pulse at button position
      // Phase 2 (0.2-0.65): fly upward with trail
      // Phase 3 (0.65-1.0): fade & sparkle

      let iconY: number;
      let iconAlpha: number;
      let iconScale: number;

      if (t < 0.2) {
        // Pulse/morph phase
        const pt = t / 0.2;
        iconY = startY;
        iconAlpha = 1;
        iconScale = 1 + Math.sin(pt * Math.PI) * 0.15;
      } else if (t < 0.65) {
        // Fly phase
        const ft = (t - 0.2) / 0.45;
        const ease = 1 - Math.pow(1 - ft, 3); // ease-out cubic
        iconY = startY + (endY - startY) * ease;
        iconAlpha = 1;
        iconScale = 1 + ft * 0.2;

        // Emit trail particles
        if (Math.random() > 0.3) {
          particles.push({
            x: cx + (Math.random() - 0.5) * 10,
            y: iconY + 15,
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * 3 + 1,
            life: 1,
            maxLife: 0.4 + Math.random() * 0.3,
            size: 2 + Math.random() * 3,
          });
        }
      } else {
        iconY = endY;
        iconAlpha = 0;
        iconScale = 1.2;
      }

      // Update & draw trail particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        if (p.life <= 0) return;
        ctx.save();
        ctx.globalAlpha = p.life * 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${155 + Math.random() * 20}, 60%, 60%, 1)`;
        ctx.fill();
        ctx.restore();
      });

      // Draw paper plane / send icon
      if (iconAlpha > 0) {
        ctx.save();
        ctx.translate(cx, iconY);
        ctx.scale(iconScale, iconScale);
        ctx.globalAlpha = iconAlpha;

        // Paper plane shape
        const s = 18;
        ctx.beginPath();
        ctx.moveTo(0, -s);        // tip (top)
        ctx.lineTo(s * 0.8, s * 0.3);   // right wing
        ctx.lineTo(0, s * 0.05);         // center notch
        ctx.lineTo(-s * 0.8, s * 0.3);  // left wing
        ctx.closePath();
        ctx.fillStyle = "#2dd4a0";
        ctx.fill();

        // Wing fold line
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(0, s * 0.3);
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = "rgba(45, 212, 160, 0.6)";
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(45, 212, 160, 0.3)";
        ctx.fill();

        ctx.restore();
      }

      // Sparkle phase at end
      if (t > 0.65) {
        const sp = (t - 0.65) / 0.35;
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2 + sp * 2;
          const dist = 30 * sp;
          const sx = cx + Math.cos(angle) * dist;
          const sy = btnRect.top - 20 + Math.sin(angle) * dist;
          ctx.save();
          ctx.globalAlpha = (1 - sp) * 0.6;
          ctx.beginPath();
          ctx.arc(sx, sy, 2, 0, Math.PI * 2);
          ctx.fillStyle = "#2dd4a0";
          ctx.fill();
          ctx.restore();
        }
      }

      if (t < 1) raf = requestAnimationFrame(animate);
      else onDone();
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [btnRect, onDone]);

  return createPortal(
    <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }} />,
    document.body
  );
}

type VerbAnimation = { verb: string; rect: DOMRect } | null;

function ScreenContent({ src, verb }: { src: string; verb: string }) {
  const isVideoExt = /\.(mp4|mov|webm|m4v)$/i.test(src);
  const [mode, setMode] = useState<"video" | "image" | "fallback">(isVideoExt ? "video" : "image");
  useEffect(() => { setMode(isVideoExt ? "video" : "image"); }, [src, isVideoExt]);

  if (mode === "video") {
    return <video key={src + "-v"} src={src} autoPlay muted loop playsInline className="h-full w-full object-contain" onError={() => setMode("image")} />;
  }
  if (mode === "image") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img key={src + "-i"} src={src} alt={`${verb} step`} className="h-full w-full object-contain" onError={() => setMode("fallback")} />;
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-envrt-green/[0.02] to-envrt-teal/[0.06]">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-envrt-teal/10 text-2xl font-bold text-envrt-teal">{verb[0]}</div>
      <p className="text-sm font-medium text-envrt-charcoal/40">{verb}</p>
    </div>
  );
}

type Edge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

function FloatingScreen({ src, verb, anchorRef }: { src: string; verb: string; anchorRef: React.RefObject<HTMLDivElement | null> }) {
  const [basePos, setBasePos] = useState<{ top: number; left: number; width: number } | null>(null);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ dw: 0, dh: 0, dx: 0, dy: 0 });
  const [ready, setReady] = useState(false);
  const [crumbling, setCrumbling] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const dragLive = useRef({ active: false, startX: 0, startY: 0, origX: 0, origY: 0, curX: 0, curY: 0 });
  const resizeLive = useRef({ active: false, edge: null as Edge | null, startX: 0, startY: 0, origSize: { dw: 0, dh: 0, dx: 0, dy: 0 } });
  const preExpand = useRef({ drag: { x: 0, y: 0 }, size: { dw: 0, dh: 0, dx: 0, dy: 0 } });

  // Lock scroll when expanded (but not when crumbling from expanded — let it unlock after crumble finishes)
  useScrollLock(expanded && !crumbling);

  const syncBase = useCallback(() => {
    if (!anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    setBasePos({ top: r.top + window.scrollY, left: r.left + window.scrollX, width: r.width });
  }, [anchorRef]);

  useEffect(() => {
    syncBase();
    setDrag({ x: 0, y: 0 });
    setSize({ dw: 0, dh: 0, dx: 0, dy: 0 });
    setCrumbling(false);
    setExpanded(false);
    setSnapshotUrl(null);
    setReady(false);
    const t = setTimeout(() => setReady(true), 50);
    window.addEventListener("resize", syncBase);
    return () => { window.removeEventListener("resize", syncBase); clearTimeout(t); };
  }, [src, syncBase]);

  useEffect(() => {
    window.addEventListener("scroll", syncBase, { passive: true });
    return () => window.removeEventListener("scroll", syncBase);
  }, [syncBase]);

  /* ---- DRAG ---- */
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragLive.current.active || !basePos) return;
      const newX = dragLive.current.origX + (e.clientX - dragLive.current.startX);
      let newY = dragLive.current.origY + (e.clientY - dragLive.current.startY);
      const viewportTop = (basePos.top - window.scrollY) + newY + size.dy;
      if (viewportTop < NAV_H) newY = NAV_H - (basePos.top - window.scrollY) - size.dy;
      dragLive.current.curX = newX;
      dragLive.current.curY = newY;
      if (containerRef.current) {
        const tx = newX - drag.x;
        const ty = newY - drag.y;
        containerRef.current.style.transform = `translate(${tx}px, ${ty}px)`;
      }
    };
    const onUp = () => {
      if (!dragLive.current.active) return;
      dragLive.current.active = false;
      if (containerRef.current) {
        containerRef.current.style.transform = "";
        containerRef.current.style.transition = "";
      }
      setDrag({ x: dragLive.current.curX, y: dragLive.current.curY });
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  }, [basePos, drag, size.dy]);

  const barDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button") || expanded || isMobile) return;
    dragLive.current = { active: true, startX: e.clientX, startY: e.clientY, origX: drag.x, origY: drag.y, curX: drag.x, curY: drag.y };
    if (containerRef.current) containerRef.current.style.transition = "none";
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [drag, expanded, isMobile]);

  /* ---- RESIZE ---- */
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const rl = resizeLive.current;
      if (!rl.active || !rl.edge) return;
      const ddx = e.clientX - rl.startX;
      const ddy = e.clientY - rl.startY;
      const n = { ...rl.origSize };
      if (rl.edge.includes("e")) n.dw = rl.origSize.dw + ddx;
      if (rl.edge.includes("w")) { n.dw = rl.origSize.dw - ddx; n.dx = rl.origSize.dx + ddx; }
      if (rl.edge.includes("s")) n.dh = rl.origSize.dh + ddy;
      if (rl.edge.includes("n")) { n.dh = rl.origSize.dh - ddy; n.dy = rl.origSize.dy + ddy; }
      setSize({ dw: n.dw, dh: n.dh, dx: n.dx, dy: n.dy });
    };
    const onUp = () => { resizeLive.current.active = false; };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  }, []);

  const edgeDown = useCallback((edge: Edge) => (e: React.PointerEvent) => {
    if (expanded || isMobile) return;
    e.stopPropagation(); e.preventDefault();
    resizeLive.current = { active: true, edge, startX: e.clientX, startY: e.clientY, origSize: { ...size } };
  }, [size, expanded, isMobile]);

  /* ---- SNAPSHOT ---- */
  const captureSnapshot = useCallback((): string | null => {
    if (!contentRef.current) return null;
    const video = contentRef.current.querySelector("video");
    if (video) {
      try {
        const c = document.createElement("canvas");
        c.width = video.videoWidth || video.clientWidth;
        c.height = video.videoHeight || video.clientHeight;
        const ctx = c.getContext("2d");
        if (ctx) { ctx.drawImage(video, 0, 0, c.width, c.height); return c.toDataURL("image/jpeg", 0.8); }
      } catch { /* noop */ }
    }
    const img = contentRef.current.querySelector("img");
    return img?.src || null;
  }, []);

  /* ---- CLOSE: crumble from current position (normal or expanded) ---- */
  const handleClose = useCallback(() => {
    if (crumbling) return;
    setSnapshotUrl(captureSnapshot());
    // Start crumble — do NOT collapse expanded first, crumble happens in-place
    setCrumbling(true);
  }, [crumbling, captureSnapshot]);

  useEffect(() => {
    if (!crumbling) return;
    const t = setTimeout(() => {
      // Capture target position before resetting state
      const targetTop = basePos ? basePos.top : 0;

      setCrumbling(false);
      setExpanded(false);
      setDrag({ x: 0, y: 0 });
      setSize({ dw: 0, dh: 0, dx: 0, dy: 0 });
      setSnapshotUrl(null);

      // Whiz down: start above viewport, fly to resting position
      const el = containerRef.current;
      if (el) {
        const scrollY = window.scrollY;
        const startTop = scrollY - 200; // above the visible viewport
        // Jump to start position with no transition
        el.style.transition = "none";
        el.style.top = `${startTop}px`;
        el.style.opacity = "0";
        el.style.transform = "scale(0.88) rotate(-2deg)";
        // Force reflow so the jump is applied before the animation
        void el.offsetHeight;
        // Animate to resting position
        el.style.transition = "top 0.65s cubic-bezier(0.22, 1.2, 0.36, 1), opacity 0.35s ease-out, transform 0.65s cubic-bezier(0.22, 1.2, 0.36, 1)";
        el.style.top = `${targetTop}px`;
        el.style.opacity = "1";
        el.style.transform = "scale(1) rotate(0deg)";
        // Clean up inline styles after animation
        const cleanup = setTimeout(() => {
          el.style.transition = "";
          el.style.opacity = "";
          el.style.transform = "";
        }, 700);
        return () => clearTimeout(cleanup);
      }
    }, 1800);
    return () => clearTimeout(t);
  }, [crumbling, basePos]);

  /* ---- EXPAND ---- */
  const handleExpand = useCallback(() => {
    if (crumbling) return;
    if (!expanded) {
      preExpand.current = { drag: { ...drag }, size: { ...size } };
      setExpanded(true);
    } else {
      setExpanded(false);
      setDrag(preExpand.current.drag);
      setSize(preExpand.current.size);
    }
  }, [expanded, crumbling, drag, size]);

  /* ---- MINIMIZE (yellow button) â€" snap back to spawn position ---- */
  const handleMinimize = useCallback(() => {
    if (crumbling) return;
    if (expanded) {
      // Exit expanded mode and reset to origin
      setExpanded(false);
      setDrag({ x: 0, y: 0 });
      setSize({ dw: 0, dh: 0, dx: 0, dy: 0 });
      preExpand.current = { drag: { x: 0, y: 0 }, size: { dw: 0, dh: 0, dx: 0, dy: 0 } };
    } else {
      // Already in normal mode â€" just reset to origin
      setDrag({ x: 0, y: 0 });
      setSize({ dw: 0, dh: 0, dx: 0, dy: 0 });
    }
  }, [expanded, crumbling]);

  if (!basePos || !ready) return null;

  /* ---- POSITION CALC ---- */
  let w: number, contentH: number, top: number, left: number;
  let useFixed = false;

  if (expanded) {
    // Fit within viewport: nav + padding top, padding bottom
    const pad = isMobile ? 8 : EXPAND_PAD;
    const availH = window.innerHeight - NAV_H - pad * 2;
    const chromeBarH = 40;
    const maxW = isMobile
      ? Math.round(window.innerWidth - pad * 2)
      : Math.round(window.innerWidth * 0.75);
    const idealContentH = Math.round(maxW * 10 / 16);
    const totalIdealH = idealContentH + chromeBarH;

    if (totalIdealH > availH) {
      // Shrink to fit
      contentH = availH - chromeBarH;
      w = Math.round(contentH * 16 / 10);
    } else {
      w = maxW;
      contentH = idealContentH;
    }
    const totalH = contentH + chromeBarH;
    // Use fixed positioning when expanded so scroll lock doesn't affect placement
    useFixed = true;
    // Center vertically within the available viewport space (below nav)
    const viewportAvail = window.innerHeight - NAV_H;
    top = NAV_H + Math.max(pad, Math.round((viewportAvail - totalH) / 2));
    left = Math.round((window.innerWidth - w) / 2);
  } else {
    w = Math.max(220, basePos.width + size.dw);
    contentH = Math.max(140, Math.round(basePos.width * 10 / 16) + size.dh);
    top = basePos.top + drag.y + size.dy;
    left = basePos.left + drag.x + size.dx;
  }

  const chromeBar = (interactive: boolean) => (
    <div
      className={`flex items-center gap-1.5 border-b border-envrt-charcoal/5 bg-envrt-cream/60 px-4 py-2.5 select-none ${!expanded && interactive && !isMobile ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`}
      {...(interactive ? { onPointerDown: barDown } : {})}
    >
      {interactive ? (
        <button onPointerDown={e => e.stopPropagation()} onClick={handleClose} className="h-3 w-3 rounded-full bg-[#ff605c] transition-transform hover:scale-125 active:scale-95 cursor-pointer" />
      ) : (
        <span className="h-3 w-3 rounded-full bg-[#ff605c]" />
      )}
      {interactive ? (
        <button onPointerDown={e => e.stopPropagation()} onClick={handleMinimize} className="h-3 w-3 rounded-full bg-[#ffbd44] transition-transform hover:scale-125 active:scale-95 cursor-pointer" />
      ) : (
        <span className="h-3 w-3 rounded-full bg-[#ffbd44]" />
      )}
      {interactive ? (
        <button onPointerDown={e => e.stopPropagation()} onClick={handleExpand} className="h-3 w-3 rounded-full bg-[#00ca4e] transition-transform hover:scale-125 active:scale-95 cursor-pointer" />
      ) : (
        <span className="h-3 w-3 rounded-full bg-[#00ca4e]" />
      )}
      <div className="ml-3 flex-1 rounded-lg bg-envrt-charcoal/[0.04] px-3 py-1 text-[11px] text-envrt-muted/60 truncate">app.envrt.com/{verb.toLowerCase()}</div>
    </div>
  );

  return createPortal(
    <>
      <AnimatePresence>
        {expanded && !crumbling && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            style={{ zIndex: SCREEN_Z - 1 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleExpand}
          />
        )}
      </AnimatePresence>

      <div
        ref={containerRef}
        style={{
          position: useFixed ? "fixed" : "absolute",
          top, left, width: w,
          zIndex: SCREEN_Z,
          overflow: "visible",
          transition: "top 0.4s cubic-bezier(0.34,1.56,0.64,1), left 0.4s cubic-bezier(0.34,1.56,0.64,1), width 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          willChange: "transform",
        }}
        className="relative"
      >
        {/* CRUMBLE */}
        <div
          className={crumbling ? "crumble-go" : ""}
          style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", display: crumbling ? "block" : "none" }}
        >
          {Array.from({ length: isMobile ? MOBILE_PIECE_COUNT : DESKTOP_PIECE_COUNT }, (_, i) => (
            <div key={i} className={`${isMobile ? "mp" : "cp"}-${i} absolute inset-0`} style={isMobile ? undefined : { willChange: "transform, opacity" }}>
              <div className="overflow-hidden rounded-xl border border-envrt-charcoal/8 bg-white shadow-xl shadow-envrt-green/[0.06]" style={{ width: w }}>
                {chromeBar(false)}
                <div className="bg-white overflow-hidden" style={{ height: contentH }}>
                  {snapshotUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={snapshotUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-envrt-cream" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* REAL WINDOW */}
        <div style={{ opacity: crumbling ? 0 : 1, position: "relative", zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div className="overflow-hidden rounded-xl border border-envrt-charcoal/8 bg-white shadow-xl shadow-envrt-green/[0.06]">
              {chromeBar(true)}
              <div ref={contentRef} className="bg-white overflow-hidden" style={{ height: contentH, transition: "height 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
                <div className="w-full h-full"><ScreenContent src={src} verb={verb} /></div>
              </div>
            </div>
          </motion.div>
          {!crumbling && !expanded && !isMobile && (
            <>
              <div onPointerDown={edgeDown("n")} className="absolute -top-1 left-3 right-3 h-2 cursor-ns-resize" />
              <div onPointerDown={edgeDown("s")} className="absolute -bottom-1 left-3 right-3 h-2 cursor-ns-resize" />
              <div onPointerDown={edgeDown("w")} className="absolute top-10 -left-1 bottom-3 w-2 cursor-ew-resize" />
              <div onPointerDown={edgeDown("e")} className="absolute top-10 -right-1 bottom-3 w-2 cursor-ew-resize" />
              <div onPointerDown={edgeDown("nw")} className="absolute -top-1 -left-1 h-3 w-3 cursor-nwse-resize" />
              <div onPointerDown={edgeDown("ne")} className="absolute -top-1 -right-1 h-3 w-3 cursor-nesw-resize" />
              <div onPointerDown={edgeDown("sw")} className="absolute -bottom-1 -left-1 h-3 w-3 cursor-nesw-resize" />
              <div onPointerDown={edgeDown("se")} className="absolute -bottom-1 -right-1 h-3 w-3 cursor-nwse-resize" />
            </>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}

export function HowItWorksSection() {
  const [active, setActive] = useState(0);
  const [verbAnim, setVerbAnim] = useState<VerbAnimation>(null);
  const step = howItWorksSteps[active];
  const anchorRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleTabClick = useCallback((i: number, verb: string, btnEl: HTMLButtonElement | null) => {
    setActive(i);
    if (btnEl && !verbAnim) {
      const rect = btnEl.getBoundingClientRect();
      setVerbAnim({ verb: verb.toLowerCase(), rect });
    }
  }, [verbAnim]);

  const clearVerbAnim = useCallback(() => setVerbAnim(null), []);

  useEffect(() => {
    const container = tabsRef.current;
    const btn = tabRefs.current[active];
    if (!container || !btn) return;
    const scrollLeft = btn.offsetLeft - container.offsetWidth / 2 + btn.offsetWidth / 2;
    container.scrollTo({ left: scrollLeft, behavior: "smooth" });
  }, [active]);

  usePreloadMedia();
  useInjectCrumbleCSS();

  return (
    <div className="px-4 py-8 sm:px-6" id="how-it-works">
      <SectionCard className="mx-auto max-w-[1360px]">
        <Container className="py-16 sm:py-20">
          <FadeUp>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-envrt-teal">How it works</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-envrt-charcoal sm:text-4xl">From data to DPP in under an hour</h2>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div ref={tabsRef} className="mx-auto mt-12 max-w-lg overflow-x-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}>
              <div className="flex justify-center gap-2 px-4 sm:px-0" style={{ minWidth: "max-content" }}>
              {howItWorksSteps.map((s, i) => (
                <button ref={el => { tabRefs.current[i] = el; }} key={s.id} onClick={(e) => handleTabClick(i, s.verb, e.currentTarget)} className={`relative rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-300 ${active === i ? "bg-envrt-green text-white shadow-md" : "text-envrt-charcoal/60 hover:bg-envrt-charcoal/5"}`}>
                  {s.verb}
                  {active === i && <motion.div layoutId="activeTab" className="absolute inset-0 rounded-xl bg-envrt-green" style={{ zIndex: -1 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                </button>
              ))}
              </div>
            </div>
          </FadeUp>
          <div className="mt-12 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <motion.div key={step.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-envrt-teal/10 text-sm font-bold text-envrt-teal">{active + 1}</span>
                <h3 className="text-xl font-semibold text-envrt-charcoal sm:text-2xl">{step.title}</h3>
              </div>
              <p className="mt-4 text-base leading-relaxed text-envrt-muted">{step.description}</p>
              <ul className="mt-5 space-y-2.5">
                {step.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-envrt-charcoal/80">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-envrt-teal" />{b}
                  </li>
                ))}
              </ul>
            </motion.div>
            <div ref={anchorRef} className="w-full" style={{ aspectRatio: "16 / 10" }} />
          </div>
          <FloatingScreen key={step.id} src={step.mockImage} verb={step.verb} anchorRef={anchorRef} />

          {/* Verb button animations */}
          {verbAnim?.verb === "collect" && <CollectAnimation btnRect={verbAnim.rect} onDone={clearVerbAnim} />}
          {verbAnim?.verb === "assess" && <AssessAnimation btnRect={verbAnim.rect} onDone={clearVerbAnim} />}
          {verbAnim?.verb === "calculate" && <CalculateAnimation btnRect={verbAnim.rect} onDone={clearVerbAnim} />}
          {verbAnim?.verb === "publish" && <PublishAnimation btnRect={verbAnim.rect} onDone={clearVerbAnim} />}
        </Container>
      </SectionCard>
    </div>
  );
}