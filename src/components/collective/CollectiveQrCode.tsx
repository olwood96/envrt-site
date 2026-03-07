"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface Props {
  url: string;
  productName: string;
}

export function CollectiveQrCode({ url, productName }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    QRCode.toCanvas(canvas, url, {
      width: 200,
      margin: 2,
      errorCorrectionLevel: "H",
      color: { dark: "#1a3a2a", light: "#ffffff" },
    }).then(() => {
      setDataUrl(canvas.toDataURL("image/png"));
    });
  }, [url]);

  return (
    <div className="rounded-2xl border border-envrt-charcoal/5 bg-white p-5 sm:p-6">
      <p className="text-[10px] font-medium uppercase tracking-widest text-envrt-muted">
        QR Code
      </p>
      <p className="mt-1 text-xs text-envrt-muted">
        Print on garment tags to link customers to this product&apos;s
        sustainability data.
      </p>
      <div className="mt-4 flex items-start gap-4">
        <canvas ref={canvasRef} className="h-[120px] w-[120px] rounded-lg" />
        {dataUrl && (
          <a
            href={dataUrl}
            download={`envrt-qr-${productName.toLowerCase().replace(/\s+/g, "-")}.png`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-envrt-charcoal/8 px-4 py-2 text-xs font-medium text-envrt-charcoal transition-colors hover:border-envrt-teal/20 hover:text-envrt-teal"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download QR
          </a>
        )}
      </div>
    </div>
  );
}
