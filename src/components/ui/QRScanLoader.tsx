"use client";

import { useState, useEffect } from "react";

interface QRScanLoaderProps {
  /** Controls visibility + fade-out. Default true. Pass false to fade
   *  the loader out smoothly (600ms) before unmounting, e.g. after an
   *  iframe finishes loading. For Next.js loading.tsx use, leave at
   *  the default since Suspense handles the unmount. */
  visible?: boolean;
  /** Tailwind class for the overlay container's border-radius, so the
   *  loader sits flush inside whatever it's overlaying. Defaults to
   *  rounded-2xl. */
  containerRadiusClassName?: string;
  /** Tailwind size class for the QR code box. Use "w-[120px]" (or
   *  similar fixed value) for static sizing, or "w-[55%]" for
   *  responsive sizing inside a sized parent (e.g. a phone mockup). */
  qrSizeClassName?: string;
}

function ViewfinderCorner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const base = "absolute w-5 h-5 border-envrt-charcoal/40";
  const styles: Record<string, string> = {
    tl: `${base} top-0 left-0 border-t-2 border-l-2 rounded-tl-md`,
    tr: `${base} top-0 right-0 border-t-2 border-r-2 rounded-tr-md`,
    bl: `${base} bottom-0 left-0 border-b-2 border-l-2 rounded-bl-md`,
    br: `${base} bottom-0 right-0 border-b-2 border-r-2 rounded-br-md`,
  };
  return <div className={styles[position]} />;
}

/**
 * Single source of truth for the "scanning a QR code" loading state
 * used wherever a DPP is being loaded into view. Animation keyframes
 * (`qr-scan` and `qr-pulse`) live in globals.css. The viewfinder corner
 * brackets, scan line gradient, glow, fade-out delay, and "Scanning..."
 * caption all match the hero / collective designs so visitors see the
 * same loader regardless of how they got to a DPP.
 */
export function QRScanLoader({
  visible = true,
  containerRadiusClassName = "rounded-2xl",
  qrSizeClassName = "w-[120px]",
}: QRScanLoaderProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => setShow(false), 600);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!show) return null;

  return (
    <div
      className={`absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden bg-[#f8f7f4] ${containerRadiusClassName}`}
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 500ms ease-out",
      }}
    >
      <div className={`relative aspect-square ${qrSizeClassName}`}>
        <ViewfinderCorner position="tl" />
        <ViewfinderCorner position="tr" />
        <ViewfinderCorner position="bl" />
        <ViewfinderCorner position="br" />

        <div className="absolute inset-3 flex items-center justify-center">
          {/* Plain <img> by design. This is a LOADING screen, so we
              cannot afford the extra fetch round-trip that next/image
              imposes via /_next/image?url=... — if that request stalls
              or fails, the loader shows a broken image icon at the
              exact moment we need a clean visual. Loading the static
              asset directly is faster and more reliable. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/qr-code.png"
            alt="Scanning QR code"
            className="h-full w-full object-contain"
          />
        </div>

        <div
          className="absolute inset-x-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(42, 161, 152, 0.6), rgba(42, 161, 152, 0.8), rgba(42, 161, 152, 0.6), transparent)",
            boxShadow: "0 0 8px rgba(42, 161, 152, 0.4)",
            animation: "qr-scan 2s ease-in-out infinite",
          }}
        />
      </div>

      <p
        className="mt-5 text-xs font-medium tracking-wider text-envrt-muted/70"
        style={{ animation: "qr-pulse 2s ease-in-out infinite" }}
      >
        Scanning...
      </p>
    </div>
  );
}
