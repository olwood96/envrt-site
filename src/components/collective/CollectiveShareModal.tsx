"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Props {
  url: string;
  title: string;
  productName: string;
  /** Snippet brands paste on their site: <a> link + <script> that opens the
      DPP in a popup iframe via envrt.com/embed.js. */
  popupSnippet: string;
  /** Shopify-flavoured variant of popupSnippet using {{ product.handle }}
      so one paste covers every product when added to a Custom Liquid block. */
  shopifySnippet: string;
}

type Tab = "share" | "qr" | "popup";

export function CollectiveShareModal({
  url,
  title,
  productName,
  popupSnippet,
  shopifySnippet,
}: Props) {
  const [shopifyHelpOpen, setShopifyHelpOpen] = useState(false);
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
    { key: "popup", label: "Popup" },
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

          {/* Popup tab */}
          {activeTab === "popup" && (
            <div className="mt-4 space-y-3">
              <p className="text-[10px] leading-relaxed text-envrt-muted">
                Add a link to your product page that opens this DPP in a
                popup. Your domain must be approved in Settings &rarr; Embeds.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-envrt-cream/60 p-3 text-[10px] leading-relaxed text-envrt-charcoal">
                {popupSnippet}
              </pre>
              <button
                onClick={() => copyToClipboard(popupSnippet, "popup")}
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
                {copied === "popup" ? "Copied!" : "Copy popup code"}
              </button>

              {/* Shopify install guide (collapsible) */}
              <div className="border-t border-envrt-charcoal/5 pt-3">
                <button
                  onClick={() => setShopifyHelpOpen((v) => !v)}
                  aria-expanded={shopifyHelpOpen}
                  className="flex w-full items-center gap-1.5 text-[11px] font-medium text-envrt-charcoal transition-colors hover:text-envrt-teal"
                >
                  <svg
                    className={`h-3 w-3 shrink-0 text-envrt-muted transition-transform ${
                      shopifyHelpOpen ? "rotate-90" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                  How to add to Shopify (Focal theme)
                </button>

                {shopifyHelpOpen && (
                  <div className="mt-3 space-y-3 text-[10px] leading-relaxed text-envrt-charcoal">
                    <ol className="list-inside list-decimal space-y-1.5 text-envrt-muted [&_strong]:text-envrt-charcoal">
                      <li>
                        Approve your domain in your ENVRT dashboard at{" "}
                        <strong>Settings &rarr; Embeds</strong>.
                      </li>
                      <li>
                        In Shopify admin go to{" "}
                        <strong>Online Store &rarr; Themes</strong> and click{" "}
                        <strong>Customize</strong> on your Focal theme.
                      </li>
                      <li>
                        In the top dropdown, switch to{" "}
                        <strong>Products</strong> so the change applies to
                        every product.
                      </li>
                      <li>
                        In the left sidebar, find the{" "}
                        <strong>Product information</strong> section and click{" "}
                        <strong>Add block &rarr; Custom Liquid</strong>.
                      </li>
                      <li>
                        Drag the new block to where you want the link (under
                        the description works well).
                      </li>
                      <li>
                        Paste this Shopify-specific snippet (it auto-fills the
                        right DPP per product):
                      </li>
                    </ol>

                    <pre className="overflow-x-auto rounded-lg bg-envrt-cream/60 p-3 text-[10px] leading-relaxed text-envrt-charcoal">
                      {shopifySnippet}
                    </pre>
                    <button
                      onClick={() =>
                        copyToClipboard(shopifySnippet, "shopify")
                      }
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
                      {copied === "shopify" ? "Copied!" : "Copy Shopify snippet"}
                    </button>
                    <p className="text-[10px] leading-relaxed text-envrt-muted">
                      <strong className="text-envrt-charcoal">Heads up:</strong>{" "}
                      your Shopify product handles need to match the SKUs you
                      uploaded to ENVRT so the link resolves to the right DPP.
                      Contact us if you need an alias.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
