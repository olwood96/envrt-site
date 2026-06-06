"use client";

import { useRef } from "react";
import {
  easeIn,
  easeInOut,
  easeOut,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { AssetIcon, type AssetIconType } from "./AssetIcon";

// Scatter-to-order pain-state section. Cards fly in from far off-screen,
// fade in via opacity, settle into a scatter, then each card converges to
// its assigned row position inside the emerging DPP card and transmutes
// into that row. Real Hoodie 0509-1882 numbers throughout.

// ─── Real hoodie data ─────────────────────────────────────────────────────

const HOODIE = {
  name: "Hoodie 0509-1882",
  url: "dpp.envrt.com/…/hoodie-0509-1882",
};

// ─── Card definitions ─────────────────────────────────────────────────────

type Tone = "crimson" | "vibrant" | "ultramarine" | "neutral";
type Pill = { label: string; tone: "crimson" | "golden" | "ultramarine" } | null;

type ScatterCard = {
  // Identity
  filename: string;
  icon: AssetIconType;
  typeLabel: string;
  tone: Tone;
  pill: Pill;
  // Scatter rest position (% of stage)
  scatterX: number;
  scatterY: number;
  scatterRotate: number;
  // Off-screen entry origin (% of stage, way outside)
  fromX: number;
  fromY: number;
  fromRotate: number;
  // DPP row destination (% of stage). All rows centred on the DPP column.
  rowY: number;
  rowLabel: string;
  rowValue: string;
  z: number;
};

// Cards in the order their rows appear in the DPP, top to bottom.
// Real Hoodie 0509-1882 numbers from envrt_lab fixtures.
const CARDS: ScatterCard[] = [
  {
    filename: "audit_report_Q3.xlsx",
    icon: "xlsx",
    typeLabel: "XLSX",
    tone: "crimson",
    pill: { label: "Overdue", tone: "crimson" },
    scatterX: 8, scatterY: 6, scatterRotate: -7,
    fromX: -160, fromY: -40, fromRotate: -30,
    rowY: 31,
    rowLabel: "CO₂e total",
    rowValue: "7.45 kg",
    z: 7,
  },
  {
    filename: "test_report_SGS.xlsx",
    icon: "xlsx",
    typeLabel: "XLSX",
    tone: "ultramarine",
    pill: { label: "Pass", tone: "ultramarine" },
    scatterX: 62, scatterY: 0, scatterRotate: 5,
    fromX: 80, fromY: -160, fromRotate: 28,
    rowY: 37,
    rowLabel: "Water · AWARE",
    rowValue: "6,477 L",
    z: 6,
  },
  {
    filename: "BoM_FW24.csv",
    icon: "csv",
    typeLabel: "CSV",
    tone: "vibrant",
    pill: null,
    scatterX: 88, scatterY: 18, scatterRotate: 8,
    fromX: 220, fromY: 18, fromRotate: 32,
    rowY: 43,
    rowLabel: "Composition",
    rowValue: "80% organic cotton",
    z: 5,
  },
  {
    filename: "Invoice_2024_final_v3.xlsx",
    icon: "xlsx",
    typeLabel: "XLSX",
    tone: "crimson",
    pill: { label: "Expired", tone: "crimson" },
    scatterX: 0, scatterY: 38, scatterRotate: -5,
    fromX: -180, fromY: 38, fromRotate: -22,
    rowY: 49,
    rowLabel: "Garment mass",
    rowValue: "0.35 kg",
    z: 4,
  },
  {
    filename: "Supplier_Docs_TR/",
    icon: "folder",
    typeLabel: "Folder",
    tone: "neutral",
    pill: null,
    scatterX: 35, scatterY: 50, scatterRotate: 3,
    fromX: 35, fromY: -180, fromRotate: 18,
    rowY: 55,
    rowLabel: "Tier 1 supply",
    rowValue: "Turkey · Aydın",
    z: 3,
  },
  {
    filename: "CoC_supplier_042.eml",
    icon: "email",
    typeLabel: "EML",
    tone: "ultramarine",
    pill: null,
    scatterX: 90, scatterY: 60, scatterRotate: 7,
    fromX: 240, fromY: 60, fromRotate: 30,
    rowY: 61,
    rowLabel: "Tier 3 supply",
    rowValue: "Portugal · Viana do Castelo",
    z: 8,
  },
  {
    filename: "REACH_declaration.pdf",
    icon: "pdf",
    typeLabel: "PDF",
    tone: "crimson",
    pill: { label: "Missing", tone: "crimson" },
    scatterX: 5, scatterY: 78, scatterRotate: -6,
    fromX: -160, fromY: 220, fromRotate: -28,
    rowY: 67,
    rowLabel: "REACH compliance",
    rowValue: "Verified",
    z: 2,
  },
  {
    filename: "supplier_chat_export.txt",
    icon: "chat",
    typeLabel: "Chat",
    tone: "vibrant",
    pill: null,
    scatterX: 50, scatterY: 88, scatterRotate: 4,
    fromX: 50, fromY: 220, fromRotate: 22,
    rowY: 73,
    rowLabel: "Standards",
    rowValue: "EU PEF · ISO 14040",
    z: 1,
  },
];

const TONE_BG: Record<Tone, string> = {
  crimson: "bg-envrt-brand-crimson/15",
  vibrant: "bg-envrt-brand-vibrant/15",
  ultramarine: "bg-envrt-brand-ultramarine/10",
  neutral: "bg-white",
};

const TONE_ICON: Record<Tone, string> = {
  crimson: "text-envrt-brand-crimson/80",
  vibrant: "text-envrt-brand-vibrant",
  ultramarine: "text-envrt-brand-ultramarine/85",
  neutral: "text-envrt-brand-black/55",
};

const TONE_FOOT: Record<Tone, string> = {
  crimson: "bg-envrt-brand-crimson/25 text-envrt-brand-crimson",
  vibrant: "bg-envrt-brand-vibrant/30 text-envrt-brand-black",
  ultramarine: "bg-envrt-brand-ultramarine/20 text-envrt-brand-ultramarine",
  neutral: "bg-envrt-brand-black/8 text-envrt-brand-black/60",
};

const TONE_ROW_ACCENT: Record<Tone, string> = {
  crimson: "text-envrt-brand-crimson",
  vibrant: "text-envrt-brand-vibrant",
  ultramarine: "text-envrt-brand-ultramarine",
  neutral: "text-envrt-brand-black/70",
};

const PILL_STYLE: Record<NonNullable<Pill>["tone"], string> = {
  crimson: "bg-envrt-brand-crimson/15 text-envrt-brand-crimson",
  golden: "bg-envrt-brand-golden/30 text-envrt-brand-black",
  ultramarine: "bg-envrt-brand-ultramarine/15 text-envrt-brand-ultramarine",
};

// ─── Section ──────────────────────────────────────────────────────────────

export function ScatterToOrderSection() {
  return (
    <section
      className="relative bg-envrt-brand-vista text-envrt-brand-black"
      style={{ overflowX: "clip" }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute left-4 top-6 z-10 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/25 sm:left-6"
      >
        ENVRT/SCATTER
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 top-6 z-10 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/25 sm:right-6"
      >
        Before → After
      </span>

      <DesktopScatter />
      <MobileScatter />
    </section>
  );
}

// ─── Desktop: scroll-pinned story ─────────────────────────────────────────

function DesktopScatter() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Phase markers:
  //   0      → 0.06  entry: off-screen → scatter, with opacity fade
  //   0.06   → 0.28  idle scatter
  //   0.28   → 0.52  cards converge to row positions
  //   0.40   → 0.55  decorations (pills + filenames) fade
  //   0.50   → 0.62  cards fade out; rows fade in (handoff)
  //   0.48   → 0.66  DPP frame fades in around the rows

  const step1Opacity = useTransform(scrollYProgress, [0, 0.18, 0.24], [1, 1, 0]);
  const step2Opacity = useTransform(
    scrollYProgress,
    [0.22, 0.30, 0.48, 0.54],
    [0, 1, 1, 0],
  );
  const step3Opacity = useTransform(scrollYProgress, [0.52, 0.64], [0, 1]);

  const dppFrameOpacity = useTransform(scrollYProgress, [0.48, 0.66], [0, 1]);
  const dppFrameScale = useTransform(
    scrollYProgress,
    [0.48, 0.66, 0.85],
    [0.92, 1.02, 1],
  );
  const flourishOpacity = useTransform(
    scrollYProgress,
    [0.48, 0.60, 0.80],
    [0, 0.55, 0],
  );
  const flourishScale = useTransform(scrollYProgress, [0.48, 0.85], [0.6, 1.5]);

  return (
    <div
      ref={sectionRef}
      className="relative hidden lg:block"
      style={{ height: "280vh" }}
    >
      <div className="sticky top-0 flex h-screen items-center bg-envrt-brand-vista">
        <div className="mx-auto grid w-full max-w-[1320px] grid-cols-[1fr_1.15fr] items-center gap-16 px-16">
          {/* Left: stepped narrative */}
          <div className="relative min-h-[320px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine sm:text-[11px]">
              The before / after
            </p>

            <div className="relative mt-6 min-h-[280px]">
              <Step
                opacity={step1Opacity}
                eyebrow="Today"
                heading="Compliance lives in your inbox."
                body="PDFs, spreadsheets, supplier WhatsApps, expired certificates. Eight inboxes serving one regulator, and a deadline that doesn't care which folder it's in."
              />
              <Step
                opacity={step2Opacity}
                eyebrow="The shift"
                heading="Every input, in the same shape."
                body="Each document becomes a structured row. Normalised against the same database, dated, versioned, linked back to source."
              />
              <Step
                opacity={step3Opacity}
                eyebrow="The output"
                heading="garment.dpp"
                body="One passport. Hosted at a permanent URL, scannable by a customer, exportable to a regulator. The work you already did, finally in one place."
              />
            </div>
          </div>

          {/* Right: animated stage. container-type: size makes cqw / cqh
              container query units resolve against this box, so card
              positions translate in % of the stage via GPU-accelerated
              transform3d — no left/top layout thrash. */}
          <div className="relative">
            <div
              className="relative mx-auto aspect-[5/4] w-full max-w-[560px]"
              style={{ containerType: "size" }}
            >
              {/* Flourish — subtle ultramarine bloom at centre */}
              <motion.div
                aria-hidden
                style={{ opacity: flourishOpacity, scale: flourishScale }}
                className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-envrt-brand-ultramarine/15 blur-3xl"
              />

              {/* DPP frame fades in around the rows. Sits behind the cards
                  (z-0) so cards stay visible during convergence. */}
              <motion.div
                style={{ opacity: dppFrameOpacity, scale: dppFrameScale }}
                className="absolute inset-x-[14%] top-[8%] bottom-[6%] z-0"
              >
                <DppFrame />
              </motion.div>

              {/* DPP rows fade in at each card's destination. Also behind the
                  cards (z-10), so cards visually "land" on top of them at
                  convergence and the card fade-out reveals the row beneath. */}
              {CARDS.map((card) => (
                <DppRow
                  key={`row-${card.filename}`}
                  card={card}
                  progress={scrollYProgress}
                />
              ))}

              {/* Scatter cards (z-20, above frame and rows) */}
              {CARDS.map((card) => (
                <ScatterCardEl
                  key={card.filename}
                  card={card}
                  progress={scrollYProgress}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Scroll-driven step copy ──────────────────────────────────────────────

function Step({
  opacity,
  eyebrow,
  heading,
  body,
}: {
  opacity: MotionValue<number>;
  eyebrow: string;
  heading: string;
  body: string;
}) {
  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-black/45 sm:text-[11px]">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-3xl font-medium leading-[1.05] tracking-[-0.02em] text-envrt-brand-black sm:text-4xl lg:text-[2.5rem]">
        {heading}
      </h2>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-envrt-brand-black/65 sm:mt-5 sm:text-base">
        {body}
      </p>
    </motion.div>
  );
}

// ─── Single scatter card ──────────────────────────────────────────────────

function ScatterCardEl({
  card,
  progress,
}: {
  card: ScatterCard;
  progress: MotionValue<number>;
}) {
  // Position track. Anchor X is the centre of the DPP column (50%) for row
  // destination; Y is the card's assigned row.
  const x = useTransform(
    progress,
    [0, 0.06, 0.28, 0.52],
    [card.fromX, card.scatterX, card.scatterX, 50],
    { ease: [easeOut, easeInOut, easeInOut] },
  );
  const y = useTransform(
    progress,
    [0, 0.06, 0.28, 0.52],
    [card.fromY, card.scatterY, card.scatterY, card.rowY],
    { ease: [easeOut, easeInOut, easeInOut] },
  );
  const rotate = useTransform(
    progress,
    [0, 0.06, 0.28, 0.52],
    [card.fromRotate, card.scatterRotate, card.scatterRotate, 0],
    { ease: [easeOut, easeInOut, easeInOut] },
  );

  // Entry opacity — independently fades 0 → 1 alongside the entry motion.
  const entryOpacity = useTransform(progress, [0, 0.02, 0.06], [0, 0.4, 1], {
    ease: [easeOut, easeOut],
  });
  // Exit opacity — fades cards out as their row underneath becomes visible.
  const exitOpacity = useTransform(progress, [0.50, 0.62], [1, 0], {
    ease: [easeInOut],
  });
  const opacity = useTransform([entryOpacity, exitOpacity], (vals) => {
    const v = vals as number[];
    return Math.min(v[0], v[1]);
  });

  // Cards shrink and flatten as they arrive at their row, giving a hint of
  // morphing into a row strip before the actual row swap takes over.
  const scaleX = useTransform(progress, [0.40, 0.55], [1, 0.92], {
    ease: [easeInOut],
  });
  const scaleY = useTransform(progress, [0.40, 0.55], [1, 0.55], {
    ease: [easeInOut],
  });

  const decorationOpacity = useTransform(progress, [0.36, 0.50], [1, 0], {
    ease: [easeIn],
  });

  // Compose all transforms into one motion template so the browser only
  // applies a single GPU-composited transform per frame.
  const transform = useMotionTemplate`translate3d(${x}cqw, ${y}cqh, 0) translate(-50%, -50%) rotate(${rotate}deg) scale(${scaleX}, ${scaleY})`;

  return (
    <motion.div
      style={{
        transform,
        opacity,
        zIndex: 20 + card.z,
        willChange: "transform, opacity",
      }}
      className="absolute left-0 top-0"
    >
      <CardChrome card={card} decorationOpacity={decorationOpacity} />
    </motion.div>
  );
}

// ─── Card chrome ──────────────────────────────────────────────────────────

function CardChrome({
  card,
  decorationOpacity,
}: {
  card: ScatterCard;
  decorationOpacity?: MotionValue<number>;
}) {
  return (
    <div
      className={`relative w-[150px] overflow-hidden rounded-2xl shadow-[0_18px_40px_-22px_rgba(14,14,14,0.35)] ring-1 ring-envrt-brand-black/8 sm:w-[170px] ${TONE_BG[card.tone]}`}
    >
      {card.pill && (
        <motion.span
          style={decorationOpacity ? { opacity: decorationOpacity } : undefined}
          className={`absolute right-2.5 top-2.5 rounded-full px-2 py-0.5 font-mono text-[8.5px] font-semibold uppercase tracking-[0.16em] ${PILL_STYLE[card.pill.tone]}`}
        >
          {card.pill.label}
        </motion.span>
      )}

      <div className="flex h-[88px] items-center justify-center sm:h-[100px]">
        <AssetIcon
          type={card.icon}
          size={42}
          className={TONE_ICON[card.tone]}
        />
      </div>

      <motion.div
        style={decorationOpacity ? { opacity: decorationOpacity } : undefined}
        className={`flex items-center gap-2 px-3 py-2 ${TONE_FOOT[card.tone]}`}
      >
        <span className="rounded px-1.5 py-0.5 font-mono text-[8.5px] font-semibold uppercase tracking-[0.14em]">
          {card.typeLabel}
        </span>
        <span className="truncate font-mono text-[10px] text-envrt-brand-black/70">
          {card.filename}
        </span>
      </motion.div>
    </div>
  );
}

// ─── DPP row (fades in beneath the converging card) ───────────────────────

function DppRow({
  card,
  progress,
}: {
  card: ScatterCard;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, [0.54, 0.68], [0, 1], {
    ease: [easeOut],
  });

  const transform = useMotionTemplate`translate3d(50cqw, ${card.rowY}cqh, 0) translate(-50%, -50%)`;

  return (
    <motion.div
      style={{ transform, opacity, zIndex: 10 }}
      className="absolute left-0 top-0 w-[68%]"
    >
      <div className="flex items-center gap-3 px-4 py-2">
        <span className={`flex-shrink-0 ${TONE_ROW_ACCENT[card.tone]}`}>
          <AssetIcon type={card.icon} size={16} />
        </span>
        <span className="flex-shrink-0 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-envrt-brand-black/60">
          {card.rowLabel}
        </span>
        <span aria-hidden className="flex-1 border-b border-dotted border-envrt-brand-black/15" />
        <span className="flex-shrink-0 font-display text-xs font-semibold tracking-[-0.01em] text-envrt-brand-black">
          {card.rowValue}
        </span>
      </div>
    </motion.div>
  );
}

// ─── DPP frame (header + footer behind the rows) ──────────────────────────

function DppFrame() {
  return (
    <div className="relative h-full w-full rounded-3xl border border-envrt-brand-black/12 bg-white shadow-[0_30px_70px_-30px_rgba(62,0,255,0.45)]">
      {/* Header */}
      <div className="absolute inset-x-0 top-0 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-vibrant">
            <span
              aria-hidden
              className="relative inline-flex h-1.5 w-1.5 items-center justify-center"
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-envrt-brand-vibrant opacity-70" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-envrt-brand-vibrant" />
            </span>
            Live · verified
          </span>
          <span className="font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/45">
            ENVRT/DPP
          </span>
        </div>
        <p className="mt-3 font-mono text-[10px] font-medium text-envrt-brand-black/55">
          garment.dpp
        </p>
        <p className="mt-1 font-display text-lg font-medium tracking-[-0.01em] text-envrt-brand-black">
          {HOODIE.name}
        </p>
      </div>

      {/* Footer with permanent URL + QR */}
      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="flex items-center justify-between rounded-xl bg-envrt-brand-vista/70 p-3">
          <div className="flex items-center gap-2.5">
            <AssetIcon type="qr" size={26} className="text-envrt-brand-black" />
            <div>
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55">
                Permanent URL
              </p>
              <p className="font-mono text-[10px] text-envrt-brand-black">
                {HOODIE.url}
              </p>
            </div>
          </div>
          <span className="font-mono text-[10px] font-medium text-envrt-brand-ultramarine">
            ↗
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile: static before/after with real hoodie data ────────────────────

function MobileScatter() {
  const mobileCards = [CARDS[0], CARDS[2], CARDS[5], CARDS[7]];

  return (
    <div className="lg:hidden">
      <div className="mx-auto max-w-[640px] px-5 py-20 sm:px-8 sm:py-24">
        {/* Before block */}
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine sm:text-[11px]">
          Today
        </p>
        <h2 className="mt-3 font-display text-3xl font-medium leading-[1.05] tracking-[-0.02em] text-envrt-brand-black sm:text-4xl">
          Compliance lives in your inbox.
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-envrt-brand-black/65 sm:text-base">
          PDFs, spreadsheets, supplier WhatsApps, expired certificates. Eight
          inboxes serving one regulator, and a deadline that doesn&apos;t care
          which folder it&apos;s in.
        </p>

        <div className="relative mx-auto mt-10 grid w-full max-w-[420px] grid-cols-2 gap-x-3 gap-y-4">
          {mobileCards.map((card, i) => (
            <div
              key={card.filename}
              style={{ transform: `rotate(${[-4, 3, -2, 4][i]}deg)` }}
              className="flex justify-self-center"
            >
              <CardChrome card={card} />
            </div>
          ))}
        </div>

        <div className="my-12 flex items-center gap-3 sm:my-14">
          <span aria-hidden className="h-px flex-1 bg-envrt-brand-black/15" />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine sm:text-[11px]">
            ENVRT ↓
          </span>
          <span aria-hidden className="h-px flex-1 bg-envrt-brand-black/15" />
        </div>

        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine sm:text-[11px]">
          The output
        </p>
        <h2 className="mt-3 font-display text-3xl font-medium leading-[1.05] tracking-[-0.02em] text-envrt-brand-black sm:text-4xl">
          garment.dpp
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-envrt-brand-black/65 sm:text-base">
          Eight inputs become eight rows. Hosted at a permanent URL, scannable
          by a customer, exportable to a regulator.
        </p>

        <div className="mt-8 rounded-3xl border border-envrt-brand-black/12 bg-white p-5 shadow-[0_30px_70px_-30px_rgba(62,0,255,0.45)] sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-vibrant">
              <span
                aria-hidden
                className="relative inline-flex h-1.5 w-1.5 items-center justify-center"
              >
                <span className="absolute inset-0 animate-ping rounded-full bg-envrt-brand-vibrant opacity-70" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-envrt-brand-vibrant" />
              </span>
              Live · verified
            </span>
            <span className="font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/45">
              ENVRT/DPP
            </span>
          </div>
          <p className="mt-3 font-mono text-[10px] font-medium text-envrt-brand-black/55">
            garment.dpp
          </p>
          <p className="mt-1 font-display text-xl font-medium tracking-[-0.01em] text-envrt-brand-black">
            {HOODIE.name}
          </p>

          <div className="mt-5 space-y-2 border-t border-envrt-brand-black/10 pt-4">
            {CARDS.map((card) => (
              <div
                key={card.filename}
                className="flex items-center gap-3"
              >
                <span className={`flex-shrink-0 ${TONE_ROW_ACCENT[card.tone]}`}>
                  <AssetIcon type={card.icon} size={16} />
                </span>
                <span className="flex-shrink-0 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-envrt-brand-black/60">
                  {card.rowLabel}
                </span>
                <span aria-hidden className="flex-1 border-b border-dotted border-envrt-brand-black/15" />
                <span className="flex-shrink-0 font-display text-xs font-semibold tracking-[-0.01em] text-envrt-brand-black">
                  {card.rowValue}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl bg-envrt-brand-vista/70 p-3">
            <div className="flex items-center gap-2.5">
              <AssetIcon type="qr" size={28} className="text-envrt-brand-black" />
              <div>
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55">
                  Permanent URL
                </p>
                <p className="font-mono text-[10px] text-envrt-brand-black">
                  {HOODIE.url}
                </p>
              </div>
            </div>
            <span className="font-mono text-[10px] font-medium text-envrt-brand-ultramarine">
              ↗
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
