"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Props {
  embedUrl: string;
  garmentName: string;
}

function ViewfinderCorner({
  position,
}: {
  position: "tl" | "tr" | "bl" | "br";
}) {
  const base = "absolute w-5 h-5 border-envrt-charcoal/40";
  const styles: Record<string, string> = {
    tl: `${base} top-0 left-0 border-t-2 border-l-2 rounded-tl-md`,
    tr: `${base} top-0 right-0 border-t-2 border-r-2 rounded-tr-md`,
    bl: `${base} bottom-0 left-0 border-b-2 border-l-2 rounded-bl-md`,
    br: `${base} bottom-0 right-0 border-b-2 border-r-2 rounded-br-md`,
  };
  return <div className={styles[position]} />;
}

function QRScanOverlay({ visible }: { visible: boolean }) {
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
      className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-[#f8f7f4]"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 500ms ease-out",
      }}
    >
      {/* QR code with viewfinder frame */}
      <div className="relative aspect-square w-[120px]">
        <ViewfinderCorner position="tl" />
        <ViewfinderCorner position="tr" />
        <ViewfinderCorner position="bl" />
        <ViewfinderCorner position="br" />

        <div className="absolute inset-3 flex items-center justify-center">
          <Image
            src="/qr-code.png"
            alt="Scanning QR code"
            width={200}
            height={200}
            className="h-full w-full object-contain"
          />
        </div>

        {/* Animated scan line */}
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

      <style jsx>{`
        @keyframes qr-scan {
          0%,
          100% {
            top: 0;
          }
          50% {
            top: 100%;
          }
        }
        @keyframes qr-pulse {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export function CollectiveDppEmbed({ embedUrl, garmentName }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-envrt-charcoal/5 bg-white">
      <QRScanOverlay visible={isLoading} />
      <iframe
        src={embedUrl}
        title={`Digital Product Passport — ${garmentName}`}
        className="h-[800px] w-full border-0 sm:h-[1000px]"
        sandbox="allow-scripts allow-same-origin allow-popups"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
