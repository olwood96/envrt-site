"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/ui/Motion";

// Apple-style hero: a single confident headline, one short sub, two CTAs,
// one big considered product photo. No editorial italic, no rotated tiles,
// no foot quote. The hero earns the scroll by being calm.

export function HeroV3() {
  return (
    <section className="relative overflow-hidden bg-envrt-offwhite">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-6 pt-28 pb-20 sm:px-10 sm:pt-32 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:pt-36 lg:pb-28">
        {/* Left: confident headline + sub + CTAs */}
        <div className="max-w-xl">
          <FadeUp>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-envrt-teal">
              EU ESPR · Ready
            </p>
          </FadeUp>

          <FadeUp delay={0.08}>
            <h1 className="mt-6 text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.02em] text-envrt-ink sm:text-5xl lg:text-[3.75rem]">
              Digital Product Passports for fashion brands.
            </h1>
          </FadeUp>

          <FadeUp delay={0.18}>
            <p className="mt-6 max-w-lg text-lg leading-[1.55] text-envrt-charcoal/70 sm:text-xl">
              Calculate emissions, water scarcity and Eco-Score for every
              garment. Attach a QR to the care label. Customers scan and
              see the full story.
            </p>
          </FadeUp>

          <FadeUp delay={0.26}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                href="/free-dpp"
                size="md"
                className="sm:px-7 sm:py-3.5 sm:text-base"
                data-cta="hero-v3-free-dpp"
              >
                Get a free DPP<span className="ml-2">→</span>
              </Button>
              <Button
                href="/contact"
                variant="ghost"
                size="md"
                className="sm:px-2 sm:py-3.5 sm:text-base"
                data-cta="hero-v3-book-demo"
              >
                Book a demo<span className="ml-1.5">→</span>
              </Button>
            </div>
          </FadeUp>

          <FadeUp delay={0.34}>
            <p className="mt-10 text-xs font-medium uppercase tracking-[0.2em] text-envrt-charcoal/45">
              Built for fashion and apparel brands selling into the EU.
            </p>
          </FadeUp>
        </div>

        {/* Right: product hero. Photo enters with a quiet reveal. The QR sits
            inside a clean white care-label, ring-lit by a soft pulse. */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-[560px]"
        >
          {/* Stone-toned scene plate behind the photo */}
          <div
            aria-hidden
            className="absolute inset-x-4 bottom-2 top-12 rounded-[2.5rem] bg-envrt-stone"
          />
          {/* Soft teal halo behind the QR, hinting at "scannable" */}
          <div
            aria-hidden
            className="absolute left-1/2 top-[55%] z-0 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-envrt-teal/15 blur-3xl"
          />

          <div className="relative aspect-[4/5] w-full">
            <Image
              src="/jacket.png"
              alt="Sustainable hoodie with attached care-label QR"
              fill
              sizes="(min-width: 1024px) 560px, 80vw"
              className="object-contain drop-shadow-[0_30px_60px_rgba(14,14,14,0.16)]"
              priority
            />

            {/* QR sits where a real care label would */}
            <div className="absolute left-1/2 top-[55%] z-10 w-[136px] -translate-x-1/2 -translate-y-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden rounded-[12px] bg-white shadow-[0_22px_44px_rgba(14,14,14,0.22)] ring-1 ring-envrt-ink/8"
              >
                <div className="p-2.5">
                  <div className="relative h-[100px] w-full">
                    <Image
                      src="/qr-code.png"
                      alt="Digital Product Passport QR"
                      fill
                      sizes="100px"
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="border-t border-envrt-ink/8 bg-envrt-offwhite px-3 py-2">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-envrt-charcoal/65">
                    Scan · ENVRT passport
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
