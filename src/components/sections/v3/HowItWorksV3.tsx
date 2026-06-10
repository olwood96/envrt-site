"use client";

import Image from "next/image";
import { FadeUp } from "@/components/ui/Motion";
import { Eyebrow } from "./_shared";

type Step = {
  index: string;
  title: string;
  body: string;
  caption: string;
  /** Square thumbnail rendered to the right on desktop, below the body on mobile. */
  image: { src: string; alt: string };
};

const steps: Step[] = [
  {
    index: "01",
    title: "Upload your collection.",
    body: "CSV, line sheet, or the ENVRT collection form. Garment names, materials, weights, suppliers, country of origin. Whatever you have.",
    caption: "≈ 30 minutes for a typical SS collection",
    image: {
      src: "/v3-assets/step1-studio.jpg",
      alt: "Fashion design studio with line-sheet sketches",
    },
  },
  {
    index: "02",
    title: "ENVRT fills the gaps.",
    body: "Our calculator pulls verified factors for fibres, processing, transport. Missing entries are flagged with a confidence score so you can review.",
    caption: "EU PEF · ISO 14040 · AWARE",
    image: {
      src: "/v3-assets/step2-swatches.jpg",
      alt: "Fabric swatches in warm neutral tones",
    },
  },
  {
    index: "03",
    title: "Ship the QR.",
    body: "Each garment gets a hosted passport at a permanent URL. Attach the QR to the care label, hangtag, or packaging. Customers scan, regulators audit.",
    caption: "Hosted on envrt.com or your own domain",
    image: {
      src: "/v3-assets/step3-qr.jpg",
      alt: "Phone scanning a QR code on a printed card",
    },
  },
];

export function HowItWorksV3() {
  return (
    <section className="bg-envrt-brand-vista py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1320px] px-6 sm:px-10 lg:px-16">
        <FadeUp>
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-5 max-w-3xl font-display text-2xl font-medium leading-[1.1] tracking-[-0.02em] text-envrt-brand-black sm:text-4xl lg:text-[2.75rem]">
            Three steps. Half a day. One passport per garment.
          </h2>
        </FadeUp>

        <div className="mt-14 border-t border-envrt-brand-black/8">
          {steps.map((step, i) => (
            <FadeUp key={step.index} delay={0.08 + i * 0.08}>
              {/* 4 col on desktop: numeral / text / thumbnail / caption */}
              <div className="group grid grid-cols-1 gap-6 border-b border-envrt-brand-black/8 py-10 transition-colors duration-300 hover:bg-white/60 sm:grid-cols-[80px_1fr_160px_200px] sm:items-center sm:gap-8 sm:px-2 sm:py-12 lg:gap-10">
                <p className="text-5xl font-semibold leading-none tracking-[-0.04em] text-envrt-brand-black/15 transition-colors duration-300 group-hover:text-envrt-brand-ultramarine sm:text-6xl">
                  {step.index}
                </p>
                <div>
                  <h3 className="text-2xl font-semibold leading-snug tracking-[-0.01em] text-envrt-brand-black sm:text-[1.75rem]">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-envrt-brand-black/70">
                    {step.body}
                  </p>
                </div>
                {/* Thumbnail */}
                <div className="relative aspect-square w-full max-w-[160px] overflow-hidden rounded-2xl bg-envrt-stone">
                  <Image
                    src={step.image.src}
                    alt={step.image.alt}
                    fill
                    sizes="(min-width: 640px) 160px, 60vw"
                    className="object-cover"
                  />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine sm:text-right">
                  {step.caption}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
