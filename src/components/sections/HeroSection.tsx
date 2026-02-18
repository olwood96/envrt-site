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
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [minDisplayDone, setMinDisplayDone] = useState(false);

  useEffect(() => {
    const fullText = "WANT DPPs?";
    let i = 0;
    let firstCycleDone = false;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else if (!firstCycleDone) {
        // First full cycle complete — hold for a beat then allow transition
        firstCycleDone = true;
        setTimeout(() => setMinDisplayDone(true), 600);
      } else {
        // Keep looping in case iframe is still loading
        setTimeout(() => { i = 0; }, 800);
      }
    }, 120);
    return () => clearInterval(interval);
  }, []);

  const showContent = iframeLoaded && minDisplayDone;

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
      <div className="relative overflow-hidden rounded-[2.8rem] border-[5px] border-envrt-charcoal/90 bg-envrt-charcoal shadow-[0_25px_60px_-10px_rgba(0,0,0,0.4)]">
        {/* Status bar — white with black text */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between rounded-t-[2.3rem] bg-white px-5" style={{ height: 22 }}>
          <span className="text-[9px] font-semibold leading-none text-envrt-charcoal">21:37</span>
          <div className="w-[72px]" />
          <div className="flex items-center gap-[4px]">
            <svg width="12" height="9" viewBox="0 0 14 10" fill="none" className="text-envrt-charcoal">
              <rect x="0" y="7" width="2.5" height="3" rx="0.5" fill="currentColor" />
              <rect x="3.5" y="5" width="2.5" height="5" rx="0.5" fill="currentColor" />
              <rect x="7" y="2.5" width="2.5" height="7.5" rx="0.5" fill="currentColor" />
              <rect x="10.5" y="0" width="2.5" height="10" rx="0.5" fill="currentColor" />
            </svg>
            <svg width="11" height="9" viewBox="0 0 13 10" fill="none" className="text-envrt-charcoal">
              <path d="M6.5 8.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" fill="currentColor" />
              <path d="M4 7.2a3.5 3.5 0 0 1 5 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M1.8 4.8a6.5 6.5 0 0 1 9.4 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span className="text-[8px] font-medium leading-none text-envrt-charcoal">69</span>
            <div className="flex items-center gap-[1px]">
              <div className="relative h-[8px] w-[17px] rounded-[2px] border border-envrt-charcoal/80">
                <div className="absolute inset-[1px] rounded-[1px] bg-envrt-charcoal" style={{ width: "69%" }} />
              </div>
              <div className="h-[3px] w-[1px] rounded-r-full bg-envrt-charcoal/80" />
            </div>
          </div>
        </div>
        {/* Notch / dynamic island */}
        <div className="absolute left-1/2 top-[4px] z-30 h-[16px] w-[72px] -translate-x-1/2 rounded-full bg-envrt-charcoal" />
        {/* Full-screen iframe area */}
        <div ref={screenRef} className="relative w-full overflow-hidden rounded-[2.3rem] bg-white" style={{ aspectRatio: "9 / 19" }}>
          {/* Typewriter loading screen */}
          {!showContent && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
              <div className="flex items-center">
                <span
                  className="font-mono text-xl font-bold tracking-[0.25em] text-envrt-charcoal uppercase"
                  style={{ letterSpacing: "0.25em" }}
                >
                  {typedText}
                </span>
                <span className="ml-[2px] inline-block h-6 w-[3px] animate-pulse bg-envrt-charcoal" />
              </div>
            </div>
          )}
          <div className="absolute inset-0 overflow-hidden">
            <iframe
              src={src}
              title="Digital Product Passport"
              onLoad={() => setIframeLoaded(true)}
              className={`absolute border-0 transition-opacity duration-500 ${showContent ? "opacity-100" : "opacity-0"}`}
              style={{
                top: 0,
                left: 0,
                width: "375px",
                height: "812px",
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                overflow: "auto",
                WebkitOverflowScrolling: "touch",
                paddingTop: "22px",
              }}
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

  const jacketHeight = phoneHeight * 1.183;
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
            </div>
          </FadeUp>
        </div>
        <FadeUp delay={0.2}>
          <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-[100vw] px-6 pb-12 sm:px-10 sm:pb-14 lg:static lg:ml-0 lg:mr-0 lg:w-auto lg:px-0 lg:pb-0 lg:pl-4">
            <div ref={phoneRef} className="relative mx-auto max-w-md lg:max-w-none">
              {/* Jacket image — 70% of phone height, top-left */}
              {phoneHeight > 0 && (
                <div
                  className="absolute z-0 -rotate-[18deg]"
                  style={{
                    height: jacketHeight,
                    top: "-25%",
                    left: "-28%",
                  }}
                >
                  <Image
                    src="/jacket.png"
                    alt="Sustainable jacket"
                    width={480}
                    height={560}
                    className="h-full w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                    priority
                  />
                </div>
              )}
              {/* QR code — 30% of phone height, bottom-right, behind phone (z-0) */}
              {phoneHeight > 0 && (
                <div
                  className="absolute z-0 pointer-events-none"
                  style={{
                    width: qrHeight,
                    height: qrHeight,
                    bottom: "2%",
                    right: "-8%",
                    transform: "rotate(12deg)",
                  }}
                >
                  <Image
                    src="/qr-code.png"
                    alt="Digital Product Passport QR code"
                    width={320}
                    height={320}
                    className="h-full w-full object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.25)]"
                  />
                </div>
              )}
              {/* Live DPP in phone mockup */}
              <div className="relative z-10">
                <PhoneMockup src="https://dashboard.envrt.com/dpp/envrt/Demo%20Garments/hoodie-0509-1882" />
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
