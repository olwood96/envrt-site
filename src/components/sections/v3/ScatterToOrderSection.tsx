"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { AssetIcon, type AssetIconType } from "./AssetIcon";

// Scatter-to-order pain-state section. Desktop runs a scroll-pinned story:
// cards fly in from off-screen, settle into a scatter, converge to centre,
// shed their pills + filenames, fade out, and one clean garment.dpp card
// emerges. Mobile gets a static side-by-side instead, no sticky.

// ─── Card data ─────────────────────────────────────────────────────────────

type Tone = "crimson" | "vibrant" | "ultramarine" | "neutral";
type Pill = { label: string; tone: "crimson" | "golden" | "ultramarine" } | null;

type ScatterCard = {
  filename: string;
  icon: AssetIconType;
  typeLabel: string;
  tone: Tone;
  pill: Pill;
  // Scatter resting position (% of stage box)
  x: number;
  y: number;
  rotate: number;
  // Off-screen origin for entry phase
  fromX: number;
  fromY: number;
  fromRotate: number;
  // Final tight-stack offset around centre (% of stage box)
  dx: number;
  dy: number;
  finalRotate: number;
  // Z-stacking
  z: number;
};

const CARDS: ScatterCard[] = [
  {
    filename: "REACH_declaration.pdf",
    icon: "pdf",
    typeLabel: "PDF",
    tone: "crimson",
    pill: { label: "Missing", tone: "crimson" },
    x: 8, y: 4, rotate: -6,
    fromX: -40, fromY: -40, fromRotate: -25,
    dx: -3, dy: -3, finalRotate: -3,
    z: 5,
  },
  {
    filename: "Invoice_2024_final_v3.xlsx",
    icon: "xlsx",
    typeLabel: "XLSX",
    tone: "crimson",
    pill: { label: "Expired", tone: "crimson" },
    x: 60, y: 0, rotate: 5,
    fromX: 60, fromY: -50, fromRotate: 20,
    dx: 2, dy: -2, finalRotate: 2,
    z: 4,
  },
  {
    filename: "CoC_supplier_042.eml",
    icon: "email",
    typeLabel: "EML",
    tone: "ultramarine",
    pill: null,
    x: 80, y: 26, rotate: 8,
    fromX: 130, fromY: 26, fromRotate: 25,
    dx: 3, dy: 1, finalRotate: 4,
    z: 3,
  },
  {
    filename: "Supplier_Docs_TR/",
    icon: "folder",
    typeLabel: "Folder",
    tone: "neutral",
    pill: null,
    x: 0, y: 38, rotate: -4,
    fromX: -50, fromY: 38, fromRotate: -20,
    dx: -3, dy: 0, finalRotate: -2,
    z: 6,
  },
  {
    filename: "audit_report_Q3.xlsx",
    icon: "xlsx",
    typeLabel: "XLSX",
    tone: "vibrant",
    pill: { label: "Overdue", tone: "crimson" },
    x: 38, y: 42, rotate: 2,
    fromX: -30, fromY: 130, fromRotate: 15,
    dx: 0, dy: 2, finalRotate: 1,
    z: 7,
  },
  {
    filename: "supplier_chat_export.txt",
    icon: "chat",
    typeLabel: "Chat",
    tone: "ultramarine",
    pill: null,
    x: 70, y: 65, rotate: 4,
    fromX: 130, fromY: 65, fromRotate: 30,
    dx: 3, dy: 0, finalRotate: 3,
    z: 2,
  },
  {
    filename: "test_report_SGS.xlsx",
    icon: "xlsx",
    typeLabel: "XLSX",
    tone: "vibrant",
    pill: { label: "Draft", tone: "golden" },
    x: 5, y: 70, rotate: -7,
    fromX: -40, fromY: 130, fromRotate: -25,
    dx: -2, dy: 2, finalRotate: -4,
    z: 8,
  },
  {
    filename: "BoM_FW24.csv",
    icon: "csv",
    typeLabel: "CSV",
    tone: "neutral",
    pill: null,
    x: 32, y: 84, rotate: 3,
    fromX: 32, fromY: 130, fromRotate: 30,
    dx: 0, dy: -1, finalRotate: 2,
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
      {/* Construction marks */}
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

  // Phase markers used across cards + copy:
  //   0      → 0.08  entry from off-screen
  //   0.08   → 0.30  idle scatter
  //   0.30   → 0.50  converge to centre
  //   0.40   → 0.55  decorations (pills + filenames) fade
  //   0.50   → 0.62  cards fade out
  //   0.55   → 0.72  dpp card emerges with flourish

  const step1Opacity = useTransform(scrollYProgress, [0, 0.18, 0.26], [1, 1, 0]);
  const step2Opacity = useTransform(
    scrollYProgress,
    [0.24, 0.32, 0.48, 0.55],
    [0, 1, 1, 0],
  );
  const step3Opacity = useTransform(scrollYProgress, [0.55, 0.67], [0, 1]);

  const dppOpacity = useTransform(scrollYProgress, [0.55, 0.70], [0, 1]);
  const dppScale = useTransform(
    scrollYProgress,
    [0.55, 0.68, 0.80],
    [0.72, 1.04, 1],
  );
  const flourishOpacity = useTransform(
    scrollYProgress,
    [0.55, 0.65, 0.82],
    [0, 0.55, 0],
  );
  const flourishScale = useTransform(scrollYProgress, [0.55, 0.85], [0.7, 1.6]);

  return (
    <div
      ref={sectionRef}
      className="relative hidden lg:block"
      style={{ height: "260vh" }}
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
                heading="One source of truth, per garment."
                body="Every input normalised against the same database. Materials, suppliers, certificates, claims, all dated, all versioned, all linked back to source."
              />
              <Step
                opacity={step3Opacity}
                eyebrow="The output"
                heading="garment.dpp"
                body="Hosted at a permanent URL. Scannable by a customer, exportable to a regulator. The work you already did, finally in one place."
              />
            </div>
          </div>

          {/* Right: animated stage */}
          <div className="relative">
            <div className="relative mx-auto aspect-[5/4] w-full max-w-[560px]">
              {CARDS.map((card, i) => (
                <ScatterCardEl
                  key={card.filename}
                  card={card}
                  index={i}
                  progress={scrollYProgress}
                />
              ))}

              {/* Flourish ring expanding from centre as DPP emerges */}
              <motion.div
                aria-hidden
                style={{
                  opacity: flourishOpacity,
                  scale: flourishScale,
                }}
                className="pointer-events-none absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-envrt-brand-ultramarine/15 blur-2xl"
              />

              {/* Clean DPP card */}
              <motion.div
                style={{ opacity: dppOpacity, scale: dppScale }}
                className="absolute left-1/2 top-1/2 w-[72%] -translate-x-1/2 -translate-y-1/2"
              >
                <DppCard />
              </motion.div>
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
  index: number;
  progress: MotionValue<number>;
}) {
  // Position track: off-screen → scatter → hold → centre stack
  const leftPct = useTransform(
    progress,
    [0, 0.08, 0.30, 0.50],
    [card.fromX, card.x, card.x, 50 + card.dx],
  );
  const topPct = useTransform(
    progress,
    [0, 0.08, 0.30, 0.50],
    [card.fromY, card.y, card.y, 50 + card.dy],
  );
  const rotate = useTransform(
    progress,
    [0, 0.08, 0.30, 0.50],
    [card.fromRotate, card.rotate, card.rotate, card.finalRotate],
  );

  // Decorations (pill + footer) fade ahead of the card itself
  const decorationOpacity = useTransform(progress, [0.40, 0.55], [1, 0]);
  // Card fades to zero
  const cardOpacity = useTransform(progress, [0.50, 0.62], [1, 0]);

  const left = useMotionTemplate`${leftPct}%`;
  const top = useMotionTemplate`${topPct}%`;

  return (
    <motion.div
      style={{ left, top, zIndex: card.z, rotate, opacity: cardOpacity }}
      className="absolute"
    >
      {/* Inner div carries the -50% centring transform so the card's visual
          centre lands on the left/top anchor point. */}
      <div className="-translate-x-1/2 -translate-y-1/2">
        <CardChrome card={card} decorationOpacity={decorationOpacity} />
      </div>
    </motion.div>
  );
}

// ─── Card chrome (decoration motion values applied) ───────────────────────

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

// ─── DPP resolution card ───────────────────────────────────────────────────

function DppCard() {
  return (
    <div className="relative rounded-3xl border border-envrt-brand-black/12 bg-white p-5 shadow-[0_30px_70px_-30px_rgba(62,0,255,0.45)] sm:p-6">
      {/* Status row */}
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-vibrant sm:text-[11px]">
          <span
            aria-hidden
            className="relative inline-flex h-1.5 w-1.5 items-center justify-center"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-envrt-brand-vibrant opacity-70" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-envrt-brand-vibrant" />
          </span>
          Live · verified
        </span>
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-envrt-brand-black/45">
          ENVRT/DPP
        </span>
      </div>

      <p className="mt-4 font-mono text-xs font-medium text-envrt-brand-black/55 sm:text-sm">
        garment.dpp
      </p>
      <p className="mt-1 font-display text-xl font-medium tracking-[-0.01em] text-envrt-brand-black sm:text-2xl">
        Hoodie 0509-1882
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-envrt-brand-black/10 pt-4">
        <DataRow label="CO₂e" value="6.8 kg" />
        <DataRow label="Water" value="2,134 L" />
        <DataRow label="Tiers" value="3 / 3" />
        <DataRow label="Standards" value="PEF · ISO" />
      </div>

      <div className="mt-5 flex items-center justify-between rounded-xl bg-envrt-brand-vista/70 p-3">
        <div className="flex items-center gap-2.5">
          <AssetIcon type="qr" size={28} className="text-envrt-brand-black" />
          <div>
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55">
              Permanent URL
            </p>
            <p className="font-mono text-[10px] text-envrt-brand-black">
              dpp.envrt.com/…/0509-1882
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

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/45">
        {label}
      </p>
      <p className="mt-0.5 font-display text-base font-medium tracking-tight text-envrt-brand-black sm:text-lg">
        {value}
      </p>
    </div>
  );
}

// ─── Mobile: static before/after presentation ─────────────────────────────

function MobileScatter() {
  // Four cards visible as a tilted cluster on mobile, no scroll choreography.
  const mobileCards = [CARDS[0], CARDS[2], CARDS[4], CARDS[6]];

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

        {/* Tilted card cluster (static, no animation). Light rotation per
            card via transform: rotate() — broad browser support. */}
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

        {/* Divider arrow */}
        <div className="my-12 flex items-center gap-3 sm:my-14">
          <span aria-hidden className="h-px flex-1 bg-envrt-brand-black/15" />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine sm:text-[11px]">
            ENVRT ↓
          </span>
          <span aria-hidden className="h-px flex-1 bg-envrt-brand-black/15" />
        </div>

        {/* After block */}
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine sm:text-[11px]">
          The output
        </p>
        <h2 className="mt-3 font-display text-3xl font-medium leading-[1.05] tracking-[-0.02em] text-envrt-brand-black sm:text-4xl">
          garment.dpp
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-envrt-brand-black/65 sm:text-base">
          Hosted at a permanent URL. Scannable by a customer, exportable to a
          regulator. The work you already did, finally in one place.
        </p>

        <div className="mt-8">
          <DppCard />
        </div>
      </div>
    </div>
  );
}
