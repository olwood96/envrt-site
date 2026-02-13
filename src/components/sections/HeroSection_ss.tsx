"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { VideoFrame } from "../ui/VideoFrame";
import { FadeUp } from "../ui/Motion";
import { heroContent } from "@/lib/config";

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
            {/* Inner wrapper — this is the positioning anchor for all elements */}
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
              {/* Phone mockup on top */}
              <div className="relative z-10">
                <VideoFrame src={heroContent.videoSrc} />
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
