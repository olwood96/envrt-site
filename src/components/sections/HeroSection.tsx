"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { FadeUp } from "../ui/Motion";
import { heroContent } from "@/lib/config";

function PhoneMockup({ src }: { src: string }) {
  const screenRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      if (screenRef.current) {
        setScale(screenRef.current.offsetWidth / 375);
      }
    };
    update();
    const observer = new ResizeObserver(update);
    if (screenRef.current) observer.observe(screenRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[280px] lg:max-w-[300px]">
      {/* Phone outer shell */}
      <div className="relative overflow-hidden rounded-[2.8rem] border-[5px] border-envrt-charcoal/90 bg-envrt-charcoal shadow-2xl">
        {/* Notch / dynamic island */}
        <div className="absolute left-1/2 top-[6px] z-20 h-[18px] w-[76px] -translate-x-1/2 rounded-full bg-envrt-charcoal" />
        {/* Full-screen iframe area — scaled to hide scrollbar */}
        <div ref={screenRef} className="relative w-full overflow-hidden rounded-[2.3rem]" style={{ aspectRatio: "9 / 19" }}>
          <div className="absolute inset-0 overflow-hidden">
            <iframe
              src={src}
              title="Digital Product Passport"
              className="absolute border-0"
              style={{
                top: 0,
                left: 0,
                width: "375px",
                height: "812px",
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                overflow: "auto",
                WebkitOverflowScrolling: "touch",
              }}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          </div>
        </div>
      </div>
      {/* Try it out note */}
      <p className="mt-3 text-center text-xs text-envrt-muted/60">
        ↕ Scroll to explore the live DPP
      </p>
    </div>
  );
}

export function HeroSection() {
  const phoneRef = useRef<HTMLDivElement>(null);
  const [phoneHeight, setPhoneHeight] = useState(0);

  const updateHeight = useCallback(() => {
    if (phoneRef.current) {
      setPhoneHeight(phoneRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    if (phoneRef.current) observer.observe(phoneRef.current);
    return () => observer.disconnect();
  }, [updateHeight]);

  const jacketHeight = phoneHeight * 0.7;
  const qrHeight = phoneHeight * 0.3;

  return (
    <section className="relative mx-auto max-w-[1360px] px-6 pt-28 pb-16 sm:px-10 sm:pt-32 sm:pb-20 lg:px-16 lg:pb-24">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="max-w-xl">
          <FadeUp><Badge>{heroContent.badge}</Badge></FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="mt-6 text-4xl font-bold leading-[1.4] tracking-tight text-envrt-charcoal sm:text-4xl lg:text-[3rem]">
              {heroContent.headline.split("\n").map((line, i) => (
                <span key={i}>{line}{i < heroContent.headline.split("\n").length - 1 && <br />}</span>
              ))}
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="mt-6 text-base leading-relaxed text-envrt-muted sm:text-lg">{heroContent.subheadline}</p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={heroContent.ctaPrimary.href} size="lg">{heroContent.ctaPrimary.label}<span className="ml-2">→</span></Button>
              <Button href={heroContent.ctaSecondary.href} variant="secondary" size="lg">{heroContent.ctaSecondary.label}</Button>
            </div>
          </FadeUp>
        </div>
        <FadeUp delay={0.2}>
          {/* Outer wrapper handles full-bleed on mobile */}
          <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-[100vw] px-6 pb-12 sm:px-10 sm:pb-14 lg:static lg:ml-0 lg:mr-0 lg:w-auto lg:px-0 lg:pb-0 lg:pl-4">
            {/* Inner wrapper — positioning anchor for all elements */}
            <div ref={phoneRef} className="relative mx-auto max-w-md lg:max-w-none">
              {/* Jacket image — 70% of phone height, top-left */}
              {phoneHeight > 0 && (
                <div
                  className="absolute z-0 -rotate-[8deg]"
                  style={{
                    height: jacketHeight,
                    top: "-3%",
                    left: "-15%",
                  }}
                >
                  <Image
                    src="/jacket.png"
                    alt="Sustainable jacket"
                    width={480}
                    height={560}
                    className="h-full w-auto object-contain drop-shadow-xl"
                    priority
                  />
                </div>
              )}
              {/* QR code — 30% of phone height, bottom-right */}
              {phoneHeight > 0 && (
                <div
                  className="absolute z-[1] rotate-[12deg]"
                  style={{
                    height: qrHeight,
                    bottom: "2%",
                    right: "-8%",
                  }}
                >
                  <Image
                    src="/qr-code.png"
                    alt="Digital Product Passport QR code"
                    width={320}
                    height={320}
                    className="h-full w-auto object-contain drop-shadow-lg"
                  />
                </div>
              )}
              {/* Live DPP in phone mockup */}
              <div className="relative z-10">
                <PhoneMockup src="https://dpp.envrt.com/dpp/angry_pablo/40-00-06-03" />
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
