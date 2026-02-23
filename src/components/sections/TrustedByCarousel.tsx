"use client";

import { useEffect } from "react";

/*
  Infinite logo carousel — pure CSS animation, no JS scroll loop.
  Logos are duplicated enough times to always fill the viewport with no gaps,
  regardless of how many logos are provided.
*/

interface Logo {
  src: string;
  alt: string;
}

// How many copies of the logo set to render.
// More logos = fewer copies needed. Fewer logos = more copies needed.
// We always want at least ~4× the original set visible so the loop is seamless.
function buildTrack(logos: Logo[]): Logo[] {
  if (logos.length === 0) return [];
  // Aim for at least 16 logo slots total so there's never a gap
  const minSlots = 16;
  const copies = Math.ceil(minSlots / logos.length) * 2; // ×2 for the seamless 50% trick
  return Array.from({ length: copies }, () => logos).flat();
}

function useInjectCarouselCSS() {
  useEffect(() => {
    if (document.getElementById("trusted-carousel-css")) return;
    const el = document.createElement("style");
    el.id = "trusted-carousel-css";
    el.textContent = `
      @keyframes trusted-scroll {
        0%   { transform: translateX(0); }
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

export function TrustedByCarousel({ logos }: { logos: Logo[] }) {
  useInjectCarouselCSS();

  const track = buildTrack(logos);

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-envrt-muted/60">
          Trusted by forward-thinking brands
        </p>

        <div className="relative mt-8 overflow-hidden">
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-envrt-offwhite to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-envrt-offwhite to-transparent" />

          {/* Scrolling track */}
          <div className="trusted-track flex items-center gap-16 sm:gap-20 w-max">
            {track.map((logo, i) => (
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
