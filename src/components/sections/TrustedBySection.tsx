"use client";

import { useEffect } from "react";

/*
  Infinite logo carousel using pure CSS animation.
  Logos are duplicated to create seamless loop.
  All logos rendered as grayscale at low opacity for understated feel.
  
  Place your brand logos in /public/brand/logos/ as PNG or SVG files.
  Update the LOGOS array below with the filename and brand name.
*/

const LOGOS = [
  { src: "/brand/logos/brand-1.png", alt: "Brand 1" },
  { src: "/brand/logos/brand-2.png", alt: "Brand 2" },
  { src: "/brand/logos/brand-3.png", alt: "Brand 3" },
  { src: "/brand/logos/brand-4.png", alt: "Brand 4" },
  { src: "/brand/logos/brand-5.png", alt: "Brand 5" },
  { src: "/brand/logos/brand-6.png", alt: "Brand 6" },
  { src: "/brand/logos/brand-7.png", alt: "Brand 7" },
  { src: "/brand/logos/brand-8.png", alt: "Brand 8" },
];

function useInjectCarouselCSS() {
  useEffect(() => {
    if (document.getElementById("trusted-carousel-css")) return;
    const el = document.createElement("style");
    el.id = "trusted-carousel-css";
    el.textContent = `
      @keyframes trusted-scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .trusted-track {
        animation: trusted-scroll 35s linear infinite;
      }
      .trusted-track:hover {
        animation-play-state: paused;
      }
    `;
    document.head.appendChild(el);
  }, []);
}

export function TrustedBySection() {
  useInjectCarouselCSS();

  // Double the logos for seamless loop
  const allLogos = [...LOGOS, ...LOGOS];

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-envrt-muted/60">
          Trusted by forward-thinking brands
        </p>

        {/* Carousel container */}
        <div className="relative mt-8 overflow-hidden">
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-envrt-offwhite to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-envrt-offwhite to-transparent" />

          {/* Scrolling track */}
          <div className="trusted-track flex items-center gap-16 sm:gap-20 w-max">
            {allLogos.map((logo, i) => (
              <div
                key={`${logo.alt}-${i}`}
                className="flex h-10 w-28 flex-shrink-0 items-center justify-center sm:h-12 sm:w-32"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-full w-full object-contain opacity-30 grayscale transition-all duration-500 hover:opacity-60 hover:grayscale-0"
                  onError={(e) => {
                    // Hide broken images gracefully
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
