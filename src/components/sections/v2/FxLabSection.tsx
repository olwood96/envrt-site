"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { FadeUp } from "@/components/ui/Motion";

// ─── Tiny utilities ───────────────────────────────────────────────────────

function DemoTile({
  label,
  desc,
  children,
}: {
  label: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <FadeUp>
      <div className="rounded-2xl border border-envrt-charcoal/5 bg-white p-6 sm:p-8">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h3 className="text-lg font-semibold text-envrt-charcoal">{label}</h3>
          <p className="text-xs text-envrt-muted">{desc}</p>
        </div>
        {children}
      </div>
    </FadeUp>
  );
}

// ─── 1. Card shimmer ──────────────────────────────────────────────────────

function ShimmerDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {["No shimmer", "Shimmer", "Shimmer + featured"].map((title, i) => {
        const isShimmer = i === 1;
        const isFeatured = i === 2;
        return (
          <div
            key={title}
            className={`relative overflow-hidden rounded-2xl border p-6 ${
              isFeatured
                ? "border-envrt-teal/20 bg-white shadow-xl shadow-envrt-teal/5"
                : "border-envrt-charcoal/5 bg-white shadow-sm"
            }`}
          >
            {(isShimmer || isFeatured) && (
              <span aria-hidden className="animate-card-shimmer absolute inset-0" />
            )}
            <p className="relative text-xs font-medium uppercase tracking-[0.15em] text-envrt-muted">
              {title}
            </p>
            <p className="relative mt-3 text-2xl font-bold text-envrt-charcoal">£495</p>
            <p className="relative mt-1 text-sm text-envrt-muted">per month</p>
            <p className="relative mt-4 text-sm text-envrt-charcoal/80">
              Demonstrates a barely-there teal sweep across the card surface.
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ─── 2. Auto-scrolling mockup ─────────────────────────────────────────────

function AutoScrollDemo() {
  return (
    <div className="grid items-center gap-8 sm:grid-cols-[1fr_1.4fr]">
      <div className="space-y-3">
        <p className="text-sm text-envrt-charcoal/80">
          Tall screenshot pans up and back down inside a fixed-height frame.
          Hover to pause.
        </p>
        <p className="text-xs text-envrt-muted">
          Placeholder uses the existing tall DPP capture. Once the dashboard
          Playwright script is in place, swap the source for a captured
          dashboard route at the same aspect ratio.
        </p>
      </div>
      <div className="dpp-scroll-frame mx-auto w-full max-w-[280px]">
        <div className="relative overflow-hidden rounded-[2.2rem] border-[10px] border-envrt-charcoal bg-envrt-charcoal shadow-2xl">
          <div className="relative h-[460px] overflow-hidden bg-white">
            <div className="animate-dpp-scroll relative w-full">
              <Image
                src="/screenshots/dpp/hoodie-full.png"
                alt="Auto-scrolling DPP preview"
                width={828}
                height={9014}
                sizes="260px"
                className="block w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 3. SVG draw-on-scroll ────────────────────────────────────────────────

function DrawOnScrollDemo() {
  // A figure-eight / Möbius-ish loop. Draws once when in view.
  const path =
    "M 60 100 C 60 30, 200 30, 260 100 S 460 170, 520 100 S 460 30, 260 100 S 60 170, 60 100 Z";

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        viewBox="0 0 580 200"
        className="h-auto w-full max-w-[520px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <motion.path
          d={path}
          className="text-envrt-teal"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Endpoint dots */}
        <motion.circle
          cx={60}
          cy={100}
          r={5}
          className="fill-envrt-green"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        />
        <motion.circle
          cx={520}
          cy={100}
          r={5}
          className="fill-envrt-green"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 2.2 }}
        />
      </svg>
      <p className="text-xs text-envrt-muted">
        Line traces itself as the section enters view, then stops. Replaces
        a static diagram with a moment of motion.
      </p>
    </div>
  );
}

// ─── 4. Orbit ─────────────────────────────────────────────────────────────

function OrbitDemo() {
  // Center the stage; orbiters are absolutely positioned with the keyframe
  // rotating around the center. Inner span counter-rotates to keep upright.
  const items = [
    { label: "Docs", color: "bg-envrt-teal/15 text-envrt-teal" },
    { label: "AI", color: "bg-envrt-green/15 text-envrt-green" },
    { label: "DPP", color: "bg-envrt-charcoal/10 text-envrt-charcoal" },
  ];
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative flex h-[260px] w-[260px] items-center justify-center"
        style={{ ["--orbit-r" as string]: "100px" }}
      >
        {/* Center hub */}
        <div className="absolute z-10 flex h-20 w-20 items-center justify-center rounded-full bg-envrt-green text-sm font-bold text-white shadow-lg">
          ENVRT
        </div>
        {/* Ring */}
        <div
          aria-hidden
          className="absolute inset-0 m-auto rounded-full border border-dashed border-envrt-charcoal/10"
          style={{ width: 200, height: 200 }}
        />
        {/* Orbiters — all same direction + duration, different start delays
            so they end up evenly spaced on the ring */}
        {items.map((it, i) => (
          <div
            key={it.label}
            className="animate-orbit-cw absolute"
            style={{ animationDelay: `${-(i * 18) / items.length}s` }}
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-semibold shadow-sm ${it.color}`}
            >
              {it.label}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-envrt-muted">
        Three nodes circle a central hub. Direction alternates so the motion
        reads as a cycle rather than a single rotation.
      </p>
    </div>
  );
}

// ─── 5. Annotated image with sequenced callouts ───────────────────────────

function AnnotatedCalloutsDemo() {
  const callouts = [
    {
      top: "8%",
      left: "8%",
      title: "What scanners see",
      body: "Customer lands here from the QR.",
    },
    {
      top: "32%",
      left: "62%",
      title: "Headline impact",
      body: "Real numbers, peer-reviewed methods.",
    },
    {
      top: "56%",
      left: "6%",
      title: "Supply chain",
      body: "Every stage, fibre to finish.",
    },
    {
      top: "78%",
      left: "58%",
      title: "Eco-Score",
      body: "Regulation-recognised label.",
    },
  ];
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-[640px]">
        <div className="relative overflow-hidden rounded-2xl border border-envrt-charcoal/5 bg-white">
          <Image
            src="/screenshots/dpp/hoodie-full.png"
            alt="DPP screenshot with annotations"
            width={828}
            height={9014}
            sizes="640px"
            className="block w-full"
            style={{ objectFit: "cover", objectPosition: "top", maxHeight: 520 }}
          />
        </div>
        {callouts.map((c, i) => (
          <FadeUp key={c.title} delay={0.15 + i * 0.18}>
            <div
              className="absolute z-10"
              style={{ top: c.top, left: c.left, maxWidth: 200 }}
            >
              <div className="rounded-xl border border-envrt-charcoal/10 bg-white p-3 shadow-lg">
                <p className="text-xs font-semibold text-envrt-charcoal">
                  {c.title}
                </p>
                <p className="mt-1 text-xs text-envrt-muted">{c.body}</p>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
      <p className="text-xs text-envrt-muted">
        Callouts fade in sequentially as the section enters view. Existing
        DppAnatomySection covers a similar idea; this version is denser and
        positioned with raw top/left percentages instead of arrows.
      </p>
    </div>
  );
}

// ─── Section shell ────────────────────────────────────────────────────────

export function FxLabSection() {
  return (
    <section className="bg-envrt-offwhite py-16 sm:py-20">
      <Container>
        <FadeUp>
          <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-envrt-teal">
                Sandbox
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-envrt-charcoal sm:text-4xl">
                FX lab — five effects under review
              </h2>
              <p className="mt-3 max-w-2xl text-base text-envrt-muted sm:text-lg">
                Each tile shows one effect borrowed from merloop.eu, rebuilt in
                ENVRT colours. Review which to keep, then promote into a real
                section.
              </p>
            </div>
          </div>
        </FadeUp>

        <div className="space-y-6">
          <DemoTile label="1. Card shimmer" desc="6s sweep, teal at low opacity">
            <ShimmerDemo />
          </DemoTile>

          <DemoTile
            label="2. Auto-scrolling mockup"
            desc="14s pan inside a phone frame"
          >
            <AutoScrollDemo />
          </DemoTile>

          <DemoTile
            label="3. SVG draw-on-scroll"
            desc="2.2s pathLength on enter"
          >
            <DrawOnScrollDemo />
          </DemoTile>

          <DemoTile label="4. Orbit" desc="18–22s loop, alternating directions">
            <OrbitDemo />
          </DemoTile>

          <DemoTile
            label="5. Annotated callouts"
            desc="Staggered fade-up, 180ms apart"
          >
            <AnnotatedCalloutsDemo />
          </DemoTile>
        </div>
      </Container>
    </section>
  );
}
