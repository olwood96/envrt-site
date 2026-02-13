"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "../ui/Container";
import { SectionCard } from "../ui/SectionCard";
import { FadeUp } from "../ui/Motion";
import { howItWorksSteps } from "@/lib/config";

const SCREEN_Z = 30;
const PIECE_COUNT = 69;
const COLS = 9;
const ROWS = Math.ceil(PIECE_COUNT / COLS);
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

function useInjectCrumbleCSS() {
  useEffect(() => {
    if (document.getElementById("crumble-69")) return;
    const el = document.createElement("style");
    el.id = "crumble-69";
    let css = "";
    for (let i = 0; i < PIECE_COUNT; i++) {
      const c = i % COLS;
      const r = Math.floor(i / COLS);
      const x1 = (c / COLS) * 100;
      const y1 = (r / ROWS) * 100;
      const x2 = Math.min(((c + 1) / COLS) * 100, 100);
      const y2 = Math.min(((r + 1) / ROWS) * 100, 100);
      const cx = (c + 0.5) / COLS - 0.5;
      const xD = Math.round(cx * 350 + (Math.random() - 0.5) * 120);
      const yD = Math.round(700 + Math.random() * 700);
      const rot = Math.round((Math.random() - 0.5) * 140);
      const sc = (0.04 + Math.random() * 0.25).toFixed(2);
      const del = (r * 0.02 + c * 0.005 + Math.random() * 0.025).toFixed(3);
      css += `.crumble-go .cp-${i}{clip-path:polygon(${x1}% ${y1}%,${x2}% ${y1}%,${x2}% ${y2}%,${x1}% ${y2}%);animation:cf-${i} 1.15s ${del}s cubic-bezier(0.35,0,1,0.4) forwards}`;
      css += `@keyframes cf-${i}{0%{transform:translate(0,0) rotate(0) scale(1);opacity:1}8%{opacity:1}100%{transform:translate(${xD}px,${yD}px) rotate(${rot}deg) scale(${sc});opacity:0}}`;
    }
    el.textContent = css;
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

function ScreenContent({ src, verb }: { src: string; verb: string }) {
  const isVideoExt = /\.(mp4|mov|webm|m4v)$/i.test(src);
  const [mode, setMode] = useState<"video" | "image" | "fallback">(isVideoExt ? "video" : "image");
  useEffect(() => { setMode(isVideoExt ? "video" : "image"); }, [src, isVideoExt]);

  if (mode === "video") {
    return <video key={src + "-v"} src={src} autoPlay muted loop playsInline className="h-full w-full object-cover" onError={() => setMode("image")} />;
  }
  if (mode === "image") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img key={src + "-i"} src={src} alt={`${verb} step`} className="h-full w-full object-cover" onError={() => setMode("fallback")} />;
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
    if ((e.target as HTMLElement).closest("button") || expanded) return;
    dragLive.current = { active: true, startX: e.clientX, startY: e.clientY, origX: drag.x, origY: drag.y, curX: drag.x, curY: drag.y };
    if (containerRef.current) containerRef.current.style.transition = "none";
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [drag, expanded]);

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
    if (expanded) return;
    e.stopPropagation(); e.preventDefault();
    resizeLive.current = { active: true, edge, startX: e.clientX, startY: e.clientY, origSize: { ...size } };
  }, [size, expanded]);

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
      setCrumbling(false);
      setExpanded(false);
      setDrag({ x: 0, y: 0 });
      setSize({ dw: 0, dh: 0, dx: 0, dy: 0 });
      setSnapshotUrl(null);
    }, 1800);
    return () => clearTimeout(t);
  }, [crumbling]);

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

  if (!basePos || !ready) return null;

  /* ---- POSITION CALC ---- */
  let w: number, contentH: number, top: number, left: number;
  let useFixed = false;

  if (expanded) {
    // Fit within viewport: nav + padding top, padding bottom
    const availH = window.innerHeight - NAV_H - EXPAND_PAD * 2;
    const chromeBarH = 40;
    const maxW = Math.round(window.innerWidth * 0.75);
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
    // Use fixed positioning when expanded so scroll lock doesn't affect placement
    useFixed = true;
    top = NAV_H + EXPAND_PAD;
    left = Math.round((window.innerWidth - w) / 2);
  } else {
    w = Math.max(220, basePos.width + size.dw);
    contentH = Math.max(140, Math.round(basePos.width * 10 / 16) + size.dh);
    top = basePos.top + drag.y + size.dy;
    left = basePos.left + drag.x + size.dx;
  }

  const chromeBar = (interactive: boolean) => (
    <div
      className={`flex items-center gap-1.5 border-b border-envrt-charcoal/5 bg-envrt-cream/60 px-4 py-2.5 select-none ${!expanded && interactive ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`}
      {...(interactive ? { onPointerDown: barDown } : {})}
    >
      {interactive ? (
        <button onPointerDown={e => e.stopPropagation()} onClick={handleClose} className="h-3 w-3 rounded-full bg-[#ff605c] transition-transform hover:scale-125 active:scale-95 cursor-pointer" />
      ) : (
        <span className="h-3 w-3 rounded-full bg-[#ff605c]" />
      )}
      <span className="h-3 w-3 rounded-full bg-[#ffbd44]" />
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
          {Array.from({ length: PIECE_COUNT }, (_, i) => (
            <div key={i} className={`cp-${i} absolute inset-0`} style={{ willChange: "transform, opacity" }}>
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
          {!crumbling && !expanded && (
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
  const step = howItWorksSteps[active];
  const anchorRef = useRef<HTMLDivElement>(null);
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
            <div className="mx-auto mt-12 flex max-w-lg justify-center gap-2">
              {howItWorksSteps.map((s, i) => (
                <button key={s.id} onClick={() => setActive(i)} className={`relative rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-300 ${active === i ? "bg-envrt-green text-white shadow-md" : "text-envrt-charcoal/60 hover:bg-envrt-charcoal/5"}`}>
                  {s.verb}
                  {active === i && <motion.div layoutId="activeTab" className="absolute inset-0 rounded-xl bg-envrt-green" style={{ zIndex: -1 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                </button>
              ))}
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
        </Container>
      </SectionCard>
    </div>
  );
}
