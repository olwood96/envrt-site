"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Props {
  url: string;
  title: string;
  productName: string;
  embedSnippet: string;
  badgeSnippet: string;
}

type Tab = "share" | "qr" | "embed" | "badge";

export function CollectiveShareModal({
  url,
  title,
  productName,
  embedSnippet,
  badgeSnippet,
}: Props) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("share");
  const [copied, setCopied] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  // Generate ENVRT-branded QR code (matching DPP style)
  const generateQr = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const QRCode = (await import("qrcode")).default;
    const size = 200;
    const renderSize = size * 4;

    await QRCode.toCanvas(canvas, url, {
      width: renderSize,
      margin: 1,
      color: { dark: "#000000", light: "#FFFFFF" },
      errorCorrectionLevel: "H",
    });

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Circular white mask in the centre
    const centreX = renderSize / 2;
    const centreY = renderSize / 2;
    const circleRadius = renderSize * 0.19;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centreX, centreY, circleRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.restore();

    // Draw ENVRT logo inside the circle
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      const maxDim = circleRadius * 1.4;
      let logoW: number, logoH: number;
      if (aspectRatio >= 1) {
        logoW = maxDim;
        logoH = maxDim / aspectRatio;
      } else {
        logoH = maxDim;
        logoW = maxDim * aspectRatio;
      }
      const x = centreX - logoW / 2;
      const y = centreY - logoH / 2;
      ctx.drawImage(img, x, y, logoW, logoH);
      setQrDataUrl(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      setQrDataUrl(canvas.toDataURL("image/png"));
    };
    img.src = "/brand/envrt-logo.png";
  }, [url]);

  useEffect(() => {
    if (open && activeTab === "qr") {
      generateQr();
    }
  }, [open, activeTab, generateQr]);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const input = document.createElement("input");
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled
      }
    } else {
      copyToClipboard(url, "link");
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "share", label: "Share" },
    { key: "qr", label: "QR Code" },
    { key: "embed", label: "Embed" },
    { key: "badge", label: "Badge" },
  ];

  return (
    <div className="relative" ref={modalRef}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 rounded-xl border border-envrt-charcoal/8 px-3 py-1.5 text-xs font-medium text-envrt-muted transition-colors hover:border-envrt-teal/20 hover:text-envrt-teal"
      >
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
          />
        </svg>
        Share
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-envrt-charcoal/10 bg-white p-4 shadow-xl">
          {/* Tabs */}
          <div className="flex gap-1 rounded-lg bg-envrt-cream/60 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 rounded-md px-3 py-1.5 text-[11px] font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-white text-envrt-charcoal shadow-sm"
                    : "text-envrt-muted hover:text-envrt-charcoal"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Share tab */}
          {activeTab === "share" && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 rounded-lg bg-envrt-cream/40 px-3 py-2">
                <input
                  type="text"
                  value={url}
                  readOnly
                  className="flex-1 bg-transparent text-[11px] text-envrt-charcoal outline-none"
                />
                <button
                  onClick={() => copyToClipboard(url, "link")}
                  className="shrink-0 rounded-md bg-envrt-charcoal/5 px-2.5 py-1 text-[10px] font-medium text-envrt-charcoal transition-colors hover:bg-envrt-charcoal/10"
                >
                  {copied === "link" ? "Copied!" : "Copy"}
                </button>
              </div>
              <button
                onClick={handleNativeShare}
                className="w-full rounded-lg border border-envrt-charcoal/8 px-3 py-2 text-xs font-medium text-envrt-charcoal transition-colors hover:border-envrt-teal/20 hover:text-envrt-teal"
              >
                Share via device...
              </button>
            </div>
          )}

          {/* QR Code tab */}
          {activeTab === "qr" && (
            <div className="mt-4">
              <canvas ref={canvasRef} className="hidden" />
              {qrDataUrl ? (
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={qrDataUrl}
                    alt="QR Code"
                    className="h-40 w-40 rounded-lg"
                    style={{ imageRendering: "pixelated" }}
                  />
                  <p className="text-center text-[10px] text-envrt-muted">
                    Scan to view this product&apos;s sustainability data
                  </p>
                  <a
                    href={qrDataUrl}
                    download={`envrt-qr-${productName.toLowerCase().replace(/\s+/g, "-")}.png`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-envrt-charcoal/8 px-3 py-1.5 text-[11px] font-medium text-envrt-charcoal transition-colors hover:border-envrt-teal/20 hover:text-envrt-teal"
                  >
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                    Download QR
                  </a>
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-envrt-teal border-t-transparent" />
                </div>
              )}
            </div>
          )}

          {/* Embed tab */}
          {activeTab === "embed" && (
            <div className="mt-4 space-y-3">
              <p className="text-[10px] text-envrt-muted">
                Add this product card to your website.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-envrt-cream/60 p-3 text-[10px] leading-relaxed text-envrt-charcoal">
                {embedSnippet}
              </pre>
              <button
                onClick={() => copyToClipboard(embedSnippet, "embed")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-envrt-charcoal/8 px-3 py-1.5 text-[11px] font-medium text-envrt-charcoal transition-colors hover:border-envrt-teal/20 hover:text-envrt-teal"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                  />
                </svg>
                {copied === "embed" ? "Copied!" : "Copy embed code"}
              </button>
            </div>
          )}

          {/* Badge tab */}
          {activeTab === "badge" && (
            <div className="mt-4 space-y-3">
              <p className="text-[10px] text-envrt-muted">
                Add a link badge to your product page. Creates a backlink to this DPP.
              </p>
              {/* Preview */}
              <div className="flex justify-center rounded-lg bg-envrt-cream/40 p-4">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(27,58,45,0.1)",
                    backgroundColor: "#ffffff",
                    color: "#1b3a2d",
                    fontSize: "12px",
                    fontWeight: 500,
                    textDecoration: "none",
                    fontFamily: "system-ui, sans-serif",
                    transition: "border-color 0.2s",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a7a6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="M8 12h8M12 8v8" />
                  </svg>
                  View Digital Product Passport
                </a>
              </div>
              <pre className="overflow-x-auto rounded-lg bg-envrt-cream/60 p-3 text-[10px] leading-relaxed text-envrt-charcoal">
                {badgeSnippet}
              </pre>
              <button
                onClick={() => copyToClipboard(badgeSnippet, "badge")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-envrt-charcoal/8 px-3 py-1.5 text-[11px] font-medium text-envrt-charcoal transition-colors hover:border-envrt-teal/20 hover:text-envrt-teal"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                  />
                </svg>
                {copied === "badge" ? "Copied!" : "Copy badge code"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
