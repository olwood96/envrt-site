"use client";

import { useRef } from "react";
import {
  easeInOut,
  easeOut,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { AssetIcon, type AssetIconType } from "./AssetIcon";
import { Eyebrow, LivePill, SectionCorners } from "./_shared";

// Scatter-to-order: eight supplier inputs sweep in from off-screen, fade
// out as a single DPP card lands at centre. Real Hoodie 0509-1882 data.

const HOODIE = {
  name: "Hoodie 0509-1882",
  url: "dpp.envrt.com/…/hoodie-0509-1882",
};

// ─── Cards ────────────────────────────────────────────────────────────────

type Tone = "crimson" | "vibrant" | "ultramarine" | "neutral";
type Pill = { label: string; tone: "crimson" | "ultramarine" } | null;

type ScatterCard = {
  filename: string;
  icon: AssetIconType;
  typeLabel: string;
  tone: Tone;
  pill: Pill;
  // Off-screen entry origin. fromX in vw, fromY in vh — viewport units so
  // cards genuinely fly in from beyond the viewport edges in all directions.
  fromX: number;
  fromY: number;
  fromRotate: number;
  // Where the card lands inside the DPP card — its row's vertical position
  // (vh) relative to the right-pane centre anchor. Cards distribute up and
  // down the DPP rather than all converging at one point.
  finalY: number;
  // Scroll progress at which this card hits its row. Staggered so each card
  // arrives at a different time and morphs into its row in turn.
  arrivalTime: number;
  z: number;
  rowLabel: string;
  rowValue: string;
};

// Eight cards entering from eight different viewport edges. Values chosen
// so each card's anchor (centre of right pane, ~70vw, 50vh) plus the
// fromX/fromY translate places the card visually beyond the nearest
// viewport edge before scroll starts.
const CARDS: ScatterCard[] = [
  {
    filename: "audit_report_Q3.xlsx",
    icon: "xlsx",
    typeLabel: "XLSX",
    tone: "crimson",
    pill: { label: "Overdue", tone: "crimson" },
    fromX: -110, fromY: -90, fromRotate: -22, // top-left
    finalY: -14, arrivalTime: 0.10, z: 1,
    rowLabel: "CO₂e total",
    rowValue: "7.45 kg",
  },
  {
    filename: "test_report_SGS.xlsx",
    icon: "xlsx",
    typeLabel: "XLSX",
    tone: "ultramarine",
    pill: { label: "Pass", tone: "ultramarine" },
    fromX: -10, fromY: -110, fromRotate: 18, // top
    finalY: -10, arrivalTime: 0.14, z: 2,
    rowLabel: "Water · AWARE",
    rowValue: "6,477 L",
  },
  {
    filename: "BoM_FW24.csv",
    icon: "csv",
    typeLabel: "CSV",
    tone: "vibrant",
    pill: null,
    fromX: 85, fromY: -85, fromRotate: 24, // top-right
    finalY: -6, arrivalTime: 0.18, z: 3,
    rowLabel: "Composition",
    rowValue: "80% organic cotton",
  },
  {
    filename: "Invoice_2024_final_v3.xlsx",
    icon: "xlsx",
    typeLabel: "XLSX",
    tone: "crimson",
    pill: { label: "Expired", tone: "crimson" },
    fromX: -120, fromY: 10, fromRotate: -18, // left
    finalY: -2, arrivalTime: 0.22, z: 4,
    rowLabel: "Garment mass",
    rowValue: "0.35 kg",
  },
  {
    filename: "Supplier_Docs_TR/",
    icon: "folder",
    typeLabel: "Folder",
    tone: "neutral",
    pill: null,
    fromX: 95, fromY: 5, fromRotate: 14, // right
    finalY: 2, arrivalTime: 0.26, z: 5,
    rowLabel: "Tier 1 supply",
    rowValue: "Turkey · Aydın",
  },
  {
    filename: "CoC_supplier_042.eml",
    icon: "email",
    typeLabel: "EML",
    tone: "ultramarine",
    pill: null,
    fromX: 80, fromY: 85, fromRotate: 26, // bottom-right
    finalY: 6, arrivalTime: 0.30, z: 6,
    rowLabel: "Tier 3 supply",
    rowValue: "Portugal · Viana do Castelo",
  },
  {
    filename: "REACH_declaration.pdf",
    icon: "pdf",
    typeLabel: "PDF",
    tone: "crimson",
    pill: { label: "Missing", tone: "crimson" },
    fromX: -100, fromY: 75, fromRotate: -24, // bottom-left
    finalY: 10, arrivalTime: 0.34, z: 7,
    rowLabel: "REACH compliance",
    rowValue: "Verified",
  },
  {
    filename: "supplier_chat_export.txt",
    icon: "chat",
    typeLabel: "Chat",
    tone: "vibrant",
    pill: null,
    fromX: -5, fromY: 100, fromRotate: 16, // bottom
    finalY: 14, arrivalTime: 0.38, z: 8,
    rowLabel: "Standards",
    rowValue: "EU PEF · ISO 14040",
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
  ultramarine: "bg-envrt-brand-ultramarine/15 text-envrt-brand-ultramarine",
};

// Row activations — rows drop in after the DPP card has finished sliding
// up into place (~0.68), one per progress step. Last row settled by ~0.86,
// leaving ~14% of section scroll for full-state dwell.

// ─── Section ──────────────────────────────────────────────────────────────

export function ScatterToOrderSection() {
  return (
    <section
      className="relative bg-envrt-brand-vista text-envrt-brand-black"
      style={{ overflowX: "clip" }}
    >
      <SectionCorners left="ENVRT/SCATTER" right="Before → After" />

      <DesktopScatter />
      <MobileScatter />
    </section>
  );
}

// ─── Desktop ──────────────────────────────────────────────────────────────

function DesktopScatter() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Step copy beats. Three swaps timed with the visual:
  //   "Today" while cards are flying in (0 → 0.30)
  //   "The shift" while cards are converging + DPP starts (0.30 → 0.55)
  //   "The output" while DPP fills (0.55 → end)
  // Three-step narrative, compressed to match the new card arrival window
  // (0.10 → 0.38). All animation completes by progress ~0.46, leaving the
  // last ~54% of section scroll as dwell at the fully-populated DPP.
  //   "Today"      while first cards fly in     (0    → 0.10)
  //   "The shift"  while cards land + morph     (0.08 → 0.42)
  //   "The output" once the full DPP is shown   (0.44 → end)
  const step1Opacity = useTransform(scrollYProgress, [0, 0.06, 0.10], [1, 1, 0]);
  const step2Opacity = useTransform(
    scrollYProgress,
    [0.08, 0.14, 0.40, 0.46],
    [0, 1, 1, 0],
  );
  const step3Opacity = useTransform(scrollYProgress, [0.44, 0.52], [0, 1]);

  // DPP card is rendered STATIC behind the scatter cards (z-0). It's
  // permanently in the DOM at opacity 1 from the moment the page loads;
  // we don't gate it on scroll progress. The scatter cards on top
  // (z-20+) cover it during the animation, and fade out at the end —
  // which reveals the DPP underneath. No motion-driven entry to debug,
  // no possibility the DPP is hidden behind a broken transform: it's
  // just there.
  // Flourish pulses across the new arrival window 0.10 → 0.46
  const flourishOpacity = useTransform(
    scrollYProgress,
    [0.10, 0.24, 0.46],
    [0, 0.5, 0],
  );
  const flourishScale = useTransform(scrollYProgress, [0.10, 0.46], [0.6, 1.6]);

  return (
    <div
      ref={sectionRef}
      className="relative hidden lg:block"
      style={{ height: "400vh" }}
    >
      <div className="sticky top-0 flex h-screen items-center bg-envrt-brand-vista">
        <div className="mx-auto grid w-full max-w-[1320px] grid-cols-[1fr_1.15fr] items-center gap-16 px-16">
          <div className="relative min-h-[320px]">
            <Eyebrow>The before / after</Eyebrow>

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
                body="Each document normalised against the same database. Dated, versioned, linked back to source."
              />
              <Step
                opacity={step3Opacity}
                eyebrow="The output"
                heading="garment.dpp"
                body="One passport. Hosted at a permanent URL, scannable by a customer, exportable to a regulator."
              />
            </div>
          </div>

          {/* Right pane.
              No stage box, no overflow clip, no fixed pixel container —
              the user explicitly didn't want a visible boundary. This
              is just a layout anchor: relative for positioning context,
              520px tall to balance the grid row height. Cards and DPP
              sit absolutely inside, anchored to its centre. Cards animate
              in viewport units (vw/vh) so their off-screen origins are
              genuinely off the viewport edges in every direction. */}
          <div className="relative h-[520px]">
            {/* DPP card — STATIC, always present at z-0. No motion-driven
                entry, no opacity ramp. Cards (z-20+) sit on top during the
                animation; when they fade and lift off, the DPP underneath
                is revealed. Reliability over flair: this is guaranteed to
                be visible at the end because it's just sitting there. */}
            <div className="absolute inset-0 z-0 flex items-center justify-center">
              <div className="w-[88%] max-w-[560px]">
                <DppCard progress={scrollYProgress} />
              </div>
            </div>

            {/* Flourish bloom — above DPP, below cards. Subtle reveal
                accent at the moment cards lift off. */}
            <motion.div
              aria-hidden
              style={{ opacity: flourishOpacity, scale: flourishScale }}
              className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center"
            >
              <div className="h-[340px] w-[340px] rounded-full bg-envrt-brand-ultramarine/18 blur-3xl" />
            </motion.div>

            {/* Cards fly in, converge, then lift upward off-screen + fade.
                As they exit, the static DPP behind them is revealed. */}
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
  );
}

// ─── Step copy ────────────────────────────────────────────────────────────

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

// ─── Scatter card with constant-speed linear motion ───────────────────────

function ScatterCardEl({
  card,
  progress,
}: {
  card: ScatterCard;
  progress: MotionValue<number>;
}) {
  // Per-card timeline (simpler, smoother):
  //   0            → arrivalTime         Fly in to row Y position
  //   arrivalTime  → arrivalTime + 0.08  Shrink (1 → 0.5) + fade (1 → 0).
  //                                       The row content underneath reveals
  //                                       over the EXACT same window so the
  //                                       card and row crossfade in lockstep.
  const at = card.arrivalTime;

  const x = useTransform(progress, [0, at], [card.fromX, 0]);
  const y = useTransform(progress, [0, at], [card.fromY, card.finalY]);
  const rotate = useTransform(progress, [0, at], [card.fromRotate, 0]);

  // Uniform shrink (one scale value, not stretched on two axes). Reads as
  // the card gently entering the DPP — no distortion.
  const scale = useTransform(progress, [at, at + 0.08], [1, 0.5], {
    ease: [easeOut],
  });

  // Section-pin gate: invisible before sticky activates
  const pinGate = useTransform(progress, [0, 0.02], [0, 1]);

  // Fade matches the shrink window exactly
  const exitFade = useTransform(progress, [at, at + 0.08], [1, 0], {
    ease: [easeOut],
  });

  const opacity = useTransform(
    [pinGate, exitFade],
    (vals) => (vals as number[])[0] * (vals as number[])[1],
  );

  const decorationOpacity = useTransform(
    progress,
    [at - 0.06, at - 0.01],
    [1, 0],
    { ease: [easeInOut] },
  );

  const transform = useMotionTemplate`translate(${x}vw, ${y}vh) translate(-50%, -50%) rotate(${rotate}deg) scale(${scale})`;

  return (
    <motion.div
      style={{
        left: "50%",
        top: "50%",
        transform,
        opacity,
        zIndex: 20 + card.z,
        willChange: "transform, opacity",
      }}
      className="absolute"
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

// ─── DPP card — single unit, larger and more prominent ────────────────────

function DppCard({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="relative rounded-3xl border border-envrt-brand-black/12 bg-white p-6 shadow-[0_40px_80px_-30px_rgba(62,0,255,0.55)] lg:p-7">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <LivePill label="Live · verified" />
        <span className="font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/45 lg:text-[10px]">
          ENVRT/DPP
        </span>
      </div>

      <p className="mt-3 font-mono text-xs font-medium text-envrt-brand-black/55">
        garment.dpp
      </p>
      <p className="mt-1 font-display text-2xl font-medium tracking-[-0.01em] text-envrt-brand-black">
        {HOODIE.name}
      </p>

      <div className="mt-5 space-y-2 border-t border-envrt-brand-black/10 pt-4">
        {CARDS.map((card) => (
          <DppRowItem key={card.filename} card={card} progress={progress} />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between rounded-xl bg-envrt-brand-vista/70 p-3">
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
  );
}

function DppRowItem({
  card,
  progress,
}: {
  card: ScatterCard;
  progress: MotionValue<number>;
}) {
  // Row population window matches the card's shrink-and-fade window
  // exactly: [arrivalTime, arrivalTime + 0.08]. Each row reveals with
  // three coordinated transforms so the "this row was just populated"
  // moment reads clearly:
  //   • opacity   0 → 1   (becomes visible)
  //   • scale  0.94 → 1   (subtle settle-in)
  //   • y         6 → 0   (drops the last 6px into place)
  // Together they make the row look like it materialises into the DPP at
  // the same beat the card dissolves. Each row is independently driven by
  // its own card.arrivalTime, so all eight rows progressively populate
  // top-to-bottom as their matching cards arrive.
  const at = card.arrivalTime;

  const opacity = useTransform(progress, [at, at + 0.08], [0, 1], {
    ease: [easeOut],
  });
  const scale = useTransform(progress, [at, at + 0.08], [0.94, 1], {
    ease: [easeOut],
  });
  const y = useTransform(progress, [at, at + 0.08], [6, 0], {
    ease: [easeOut],
  });

  return (
    <motion.div
      style={{ opacity, scale, y }}
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
    </motion.div>
  );
}

// ─── Mobile ───────────────────────────────────────────────────────────────

function MobileScatter() {
  const mobileCards = [CARDS[0], CARDS[2], CARDS[5], CARDS[7]];

  return (
    <div className="lg:hidden">
      <div className="mx-auto max-w-[640px] px-5 py-20 sm:px-8 sm:py-24">
        <Eyebrow>Today</Eyebrow>
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

        <Eyebrow>The output</Eyebrow>
        <h2 className="mt-3 font-display text-3xl font-medium leading-[1.05] tracking-[-0.02em] text-envrt-brand-black sm:text-4xl">
          garment.dpp
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-envrt-brand-black/65 sm:text-base">
          Eight inputs become eight rows. Hosted at a permanent URL, scannable
          by a customer, exportable to a regulator.
        </p>

        <div className="mt-8 rounded-3xl border border-envrt-brand-black/12 bg-white p-5 shadow-[0_30px_70px_-30px_rgba(62,0,255,0.45)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <LivePill label="Live · verified" />
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
              <div key={card.filename} className="flex items-center gap-3">
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
