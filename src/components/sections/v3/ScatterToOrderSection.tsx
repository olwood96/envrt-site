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

// Scatter-to-order pain-state section. The right pane opens with eight messy
// supplier inputs (PDF spec sheets, expired invoices, supplier emails, chat
// exports, MISSING pills). As the user scrolls, every card converges to the
// centre, rotates upright and fades into a single clean garment.dpp card —
// the argument for ENVRT in a single scene. Left pane copy steps through
// three beats in time with the visual.

type Tone = "crimson" | "vibrant" | "ultramarine" | "neutral";
type Pill = { label: string; tone: "crimson" | "golden" | "ultramarine" } | null;

type ScatterCard = {
  filename: string;
  icon: AssetIconType;
  typeLabel: string;
  tone: Tone;
  pill: Pill;
  /* Scatter resting position, percent of stage box width/height. */
  x: number;
  y: number;
  rotate: number;
  /* Z-stacking order so overlapping cards layer plausibly. */
  z: number;
};

const CARDS: ScatterCard[] = [
  {
    filename: "REACH_declaration.pdf",
    icon: "pdf",
    typeLabel: "PDF",
    tone: "crimson",
    pill: { label: "Missing", tone: "crimson" },
    x: 8,
    y: 4,
    rotate: -6,
    z: 5,
  },
  {
    filename: "Invoice_2024_final_v3.xlsx",
    icon: "xlsx",
    typeLabel: "XLSX",
    tone: "crimson",
    pill: { label: "Expired", tone: "crimson" },
    x: 55,
    y: 0,
    rotate: 5,
    z: 4,
  },
  {
    filename: "CoC_supplier_042.eml",
    icon: "email",
    typeLabel: "EML",
    tone: "ultramarine",
    pill: null,
    x: 70,
    y: 26,
    rotate: 8,
    z: 3,
  },
  {
    filename: "Supplier_Docs_TR/",
    icon: "folder",
    typeLabel: "Folder",
    tone: "neutral",
    pill: null,
    x: 0,
    y: 38,
    rotate: -4,
    z: 6,
  },
  {
    filename: "audit_report_Q3.xlsx",
    icon: "xlsx",
    typeLabel: "XLSX",
    tone: "vibrant",
    pill: { label: "Overdue", tone: "crimson" },
    x: 38,
    y: 42,
    rotate: 2,
    z: 7,
  },
  {
    filename: "supplier_chat_export.txt",
    icon: "chat",
    typeLabel: "Chat",
    tone: "ultramarine",
    pill: null,
    x: 60,
    y: 65,
    rotate: 4,
    z: 2,
  },
  {
    filename: "test_report_SGS.xlsx",
    icon: "xlsx",
    typeLabel: "XLSX",
    tone: "vibrant",
    pill: { label: "Draft", tone: "golden" },
    x: 5,
    y: 70,
    rotate: -7,
    z: 8,
  },
  {
    filename: "BoM_FW24.csv",
    icon: "csv",
    typeLabel: "CSV",
    tone: "neutral",
    pill: null,
    x: 32,
    y: 80,
    rotate: 3,
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

export function ScatterToOrderSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Phase 1: cards drift slightly (0 → 0.3, still scattered)
  // Phase 2: cards converge to centre, rotate to 0 (0.3 → 0.65)
  // Phase 3: scattered cards fade, dpp card emerges (0.65 → 0.95)

  const dppOpacity = useTransform(scrollYProgress, [0.6, 0.78], [0, 1]);
  const dppScale = useTransform(scrollYProgress, [0.6, 0.85], [0.85, 1]);
  const cardsFade = useTransform(scrollYProgress, [0.55, 0.82], [1, 0]);

  // Step copy on the left — fades between three states
  const step1Opacity = useTransform(scrollYProgress, [0, 0.25, 0.32], [1, 1, 0]);
  const step2Opacity = useTransform(
    scrollYProgress,
    [0.3, 0.4, 0.55, 0.62],
    [0, 1, 1, 0],
  );
  const step3Opacity = useTransform(scrollYProgress, [0.6, 0.72], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-envrt-brand-vista text-envrt-brand-black"
      style={{ height: "260vh", overflowX: "clip" }}
    >
      {/* Construction marks */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-4 top-6 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/25 sm:left-6"
      >
        ENVRT/SCATTER
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 top-6 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/25 sm:right-6"
      >
        Before → After
      </span>

      <div className="sticky top-0 flex h-screen items-center bg-envrt-brand-vista">
        <div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.15fr] lg:gap-16 lg:px-16">
          {/* Left: stepped narrative */}
          <div className="relative min-h-[300px]">
            <div className="relative">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine sm:text-[11px]">
                The before / after
              </p>

              <div className="relative mt-5 min-h-[260px] sm:mt-6">
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
          </div>

          {/* Right: animated stage */}
          <div className="relative">
            <div className="relative mx-auto aspect-[5/4] w-full max-w-[560px]">
              {/* Stage canvas */}
              <motion.div style={{ opacity: cardsFade }} className="absolute inset-0">
                {CARDS.map((card, i) => (
                  <ScatterCardEl
                    key={card.filename}
                    card={card}
                    index={i}
                    progress={scrollYProgress}
                  />
                ))}
              </motion.div>

              {/* Clean dpp card emerges at centre */}
              <motion.div
                style={{ opacity: dppOpacity, scale: dppScale }}
                className="absolute left-1/2 top-1/2 w-[68%] -translate-x-1/2 -translate-y-1/2"
              >
                <DppCard />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Step ──────────────────────────────────────────────────────────────────

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

// ─── Scatter card ──────────────────────────────────────────────────────────

function ScatterCardEl({
  card,
  index,
  progress,
}: {
  card: ScatterCard;
  index: number;
  progress: MotionValue<number>;
}) {
  // Animate CSS left/top directly (in %) so the card's anchor moves from
  // (card.x, card.y) → (50, 50) across the stage. CSS translate(%) on a
  // transform is relative to the element itself, so we can't use x/y here.
  // Small per-card stagger so arrivals fan in rather than land in sync.
  const stagger = index * 0.012;
  const start = 0.3 + stagger;
  const end = 0.6 + stagger;

  const leftPct = useTransform(progress, [0, start, end], [card.x, card.x, 50]);
  const topPct = useTransform(progress, [0, start, end], [card.y, card.y, 50]);
  const rotate = useTransform(
    progress,
    [0, start, end],
    [card.rotate, card.rotate, 0],
  );

  const left = useMotionTemplate`${leftPct}%`;
  const top = useMotionTemplate`${topPct}%`;

  return (
    <motion.div
      style={{ left, top, zIndex: card.z, rotate }}
      className="absolute"
    >
      {/* Inner div carries the -50% / -50% centring transform so the card's
          visual centre lands on the left/top anchor point. Kept separate from
          the parent's left/top + rotate so they don't fight. */}
      <div className="-translate-x-1/2 -translate-y-1/2">
        <CardChrome card={card} />
      </div>
    </motion.div>
  );
}

function CardChrome({ card }: { card: ScatterCard }) {
  return (
    <div
      className={`relative w-[150px] overflow-hidden rounded-2xl shadow-[0_18px_40px_-22px_rgba(14,14,14,0.35)] ring-1 ring-envrt-brand-black/8 sm:w-[170px] ${TONE_BG[card.tone]}`}
    >
      {/* Pill (status) */}
      {card.pill && (
        <span
          className={`absolute right-2.5 top-2.5 rounded-full px-2 py-0.5 font-mono text-[8.5px] font-semibold uppercase tracking-[0.16em] ${PILL_STYLE[card.pill.tone]}`}
        >
          {card.pill.label}
        </span>
      )}

      {/* Icon panel */}
      <div className="flex h-[88px] items-center justify-center sm:h-[100px]">
        <AssetIcon
          type={card.icon}
          size={42}
          className={TONE_ICON[card.tone]}
        />
      </div>

      {/* Footer with type + filename */}
      <div
        className={`flex items-center gap-2 px-3 py-2 ${TONE_FOOT[card.tone]}`}
      >
        <span className="rounded px-1.5 py-0.5 font-mono text-[8.5px] font-semibold uppercase tracking-[0.14em]">
          {card.typeLabel}
        </span>
        <span className="truncate font-mono text-[10px] text-envrt-brand-black/70">
          {card.filename}
        </span>
      </div>
    </div>
  );
}

// ─── DPP resolution card ───────────────────────────────────────────────────

function DppCard() {
  return (
    <div className="relative rounded-3xl border border-envrt-brand-black/10 bg-white p-5 shadow-[0_30px_70px_-30px_rgba(62,0,255,0.35)] sm:p-6">
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
          Live
        </span>
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-envrt-brand-black/45">
          ENVRT/DPP
        </span>
      </div>

      {/* Filename */}
      <p className="mt-4 font-mono text-xs font-medium text-envrt-brand-black/55 sm:text-sm">
        garment.dpp
      </p>
      <p className="mt-1 font-display text-xl font-medium tracking-[-0.01em] text-envrt-brand-black sm:text-2xl">
        Hoodie 0509-1882
      </p>

      {/* Data rows */}
      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-envrt-brand-black/10 pt-4">
        <DataRow label="CO₂e" value="6.8 kg" />
        <DataRow label="Water" value="2,134 L" />
        <DataRow label="Tiers" value="3 / 3" />
        <DataRow label="Standards" value="PEF · ISO" />
      </div>

      {/* QR + permalink */}
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
