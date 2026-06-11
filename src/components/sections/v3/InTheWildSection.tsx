"use client";

import Image from "next/image";
import Link from "next/link";
import { FadeUp } from "@/components/ui/Motion";
import type { CollectiveCardData } from "@/lib/collective/types";
import { LivePill } from "./_shared";

export function InTheWildSection({
  collectiveCards = [],
}: {
  collectiveCards?: CollectiveCardData[];
}) {
  return (
    <section
      className="relative bg-white py-20 sm:py-24 lg:py-32"
      style={{ overflowX: "clip" }}
    >
      <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-16">
        <FadeUp>
          <LivePill label="Live · in the wild" />
          <h2 className="mt-5 font-display text-2xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-4xl lg:text-[3rem]">
            Real garments.<br />
            <span className="text-envrt-brand-black/35">Real passports.</span>
          </h2>
        </FadeUp>

        {/* Spotlight card */}
        <FadeUp delay={0.1}>
          <div className="mt-12 grid gap-8 sm:mt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            {/* Visual */}
            <div className="relative">
              <div className="relative aspect-[5/6] w-full overflow-hidden rounded-3xl bg-envrt-stone">
                <Image
                  src="/v3-assets/angry-pablo-tag.jpg"
                  alt="Angry Pablo Short Sleeve Cycling Jersey 001 with ENVRT-issued DPP hangtag"
                  fill
                  sizes="(min-width: 1024px) 580px, 100vw"
                  className="object-cover"
                />
                {/* Official French Coût Environnemental label (Ecobalyse portal SVG).
                    Policy: the label may not be redrawn or restyled. Anchored as an
                    inside corner overlay so it reads as part of the photo. */}
                <div className="absolute bottom-4 right-4 rounded-md bg-white p-2 shadow-[0_4px_14px_-6px_rgba(0,0,0,0.18)] sm:bottom-6 sm:right-6 sm:p-2.5">
                  <Image
                    src="/v3-assets/angry-pablo-ecoscore.svg"
                    alt="Coût environnemental : 1573 points d'impact, 449 pour 100g"
                    width={154}
                    height={77}
                    className="block h-auto w-[140px] sm:w-[170px]"
                    unoptimized
                  />
                </div>
              </div>
            </div>

            {/* Detail column */}
            <div className="flex flex-col lg:py-6">
              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-envrt-brand-black/55 sm:text-[11px]">
                  Brand
                </p>
                <p className="mt-1.5 font-display text-xl font-semibold tracking-tight text-envrt-brand-black sm:text-2xl">
                  Angry Pablo
                </p>
              </div>

              <div className="mt-8">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-envrt-brand-black/55 sm:text-[11px]">
                  Product
                </p>
                <p className="mt-1.5 font-display text-xl font-semibold tracking-tight text-envrt-brand-black sm:text-2xl">
                  Short Sleeve Cycling Jersey 001
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-envrt-brand-black/45">
                  DPP-FA-2026-00742
                </p>
              </div>

              {/* Compact stat grid */}
              <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-envrt-brand-black/10 pt-8">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-envrt-brand-black/55">
                    CO₂e
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-semibold tracking-tight text-envrt-brand-black">
                    8.4 <span className="text-base text-envrt-brand-black/45">kg</span>
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-envrt-brand-black/55">
                    Water
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-semibold tracking-tight text-envrt-brand-black">
                    14.8k <span className="text-base text-envrt-brand-black/45">L</span>
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-envrt-brand-black/55">
                    Origin
                  </dt>
                  <dd className="mt-1 text-sm text-envrt-brand-black">
                    Portugal
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-envrt-brand-black/55">
                    Composition
                  </dt>
                  <dd className="mt-1 text-sm text-envrt-brand-black">
                    100% recycled polyester
                  </dd>
                </div>
              </dl>

              {/* Live passport CTA — given real weight as a button-style link,
                  not a tiny mono caption. */}
              <a
                href="https://dpp.envrt.com/envrt/demo-garments/hoodie-0509-1882"
                target="_blank"
                rel="noreferrer"
                className="group mt-10 inline-flex items-center gap-2 self-start rounded-xl bg-envrt-brand-ultramarine px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-12px_rgba(62,0,255,0.6)] transition-transform duration-200 hover:-translate-y-0.5 sm:text-base"
              >
                Open the live passport
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </FadeUp>

        {/* More-in-The-Collective card. Real product photos from live
            DPPs arranged as a 2x2 mosaic; the static fallback kicks in
            when the DB returns no cards. Every tile is a fixed aspect
            box with object-cover so the source image's native ratio
            stops mattering. */}
        <FadeUp delay={0.2}>
          <Link
            href="/collective"
            className="group mt-12 grid overflow-hidden rounded-3xl bg-envrt-brand-vista ring-1 ring-envrt-brand-black/8 transition-shadow duration-300 hover:shadow-[0_24px_50px_-22px_rgba(14,14,14,0.18)] sm:mt-16 sm:grid-cols-[1fr_1.4fr]"
          >
            <CollectiveMosaic cards={collectiveCards} />
            <div className="flex flex-col justify-center gap-3 p-6 sm:p-8 lg:p-10">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-envrt-brand-ultramarine sm:text-[11px]">
                The Collective
              </p>
              <h3 className="font-display text-xl font-medium leading-tight tracking-[-0.01em] text-envrt-brand-black sm:text-2xl lg:text-3xl">
                More live passports.{" "}
                <span className="text-envrt-brand-black/40">
                  From every brand using ENVRT.
                </span>
              </h3>
              <p className="text-sm leading-relaxed text-envrt-brand-black/65 sm:text-base">
                A growing gallery of garments with audit-grade DPPs and
                live customer scans.
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-envrt-brand-ultramarine sm:text-base">
                Browse the Collective
                <span
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </span>
            </div>
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}

// Mosaic on the left of the "More in The Collective" card. Picks one
// product per brand (in order of appearance) so the four tiles always
// represent four different brands when at least four brands are
// available. Each tile is cropped to an identical box so source-
// aspect-ratio differences don't bleed into the layout. Falls back to
// the editorial folded-clothes photo when we can't get four distinct
// brand-with-image cards.
function CollectiveMosaic({ cards }: { cards: CollectiveCardData[] }) {
  const seenBrands = new Set<string>();
  const oneEach: CollectiveCardData[] = [];
  for (const c of cards) {
    if (!c.productImageUrl) continue;
    if (seenBrands.has(c.brand.id)) continue;
    seenBrands.add(c.brand.id);
    oneEach.push(c);
    if (oneEach.length === 4) break;
  }
  // Top up with second-best products from already-seen brands if we
  // didn't reach four distinct brands (small Collective)
  const withImages = oneEach.length === 4
    ? oneEach
    : [
        ...oneEach,
        ...cards
          .filter((c) => c.productImageUrl && !oneEach.includes(c))
          .slice(0, 4 - oneEach.length),
      ];

  if (withImages.length < 4) {
    return (
      <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-auto">
        <Image
          src="/v3-assets/folded-clothes.jpg"
          alt="Folded apparel, more garments with live ENVRT passports"
          fill
          sizes="(min-width: 1024px) 420px, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  return (
    <div className="relative grid aspect-[4/5] w-full grid-cols-2 grid-rows-2 gap-1 overflow-hidden bg-envrt-brand-black/5 p-1 sm:aspect-auto">
      {withImages.map((card) => (
        <div
          key={card.dpp.id}
          className="relative overflow-hidden bg-envrt-brand-vista"
        >
          <Image
            src={card.productImageUrl!}
            alt={card.dpp.garment_name}
            fill
            sizes="(min-width: 1024px) 210px, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          {/* Bottom-left brand chip on each tile so the strip still reads
              as "real brands" at a glance. */}
          <span className="pointer-events-none absolute bottom-1.5 left-1.5 max-w-[88%] truncate rounded-md bg-envrt-brand-black/65 px-1.5 py-0.5 font-mono text-[8.5px] font-semibold uppercase tracking-[0.16em] text-white sm:text-[9px]">
            {card.brand.name}
          </span>
        </div>
      ))}
    </div>
  );
}
