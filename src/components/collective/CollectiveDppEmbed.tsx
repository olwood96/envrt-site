"use client";

import { useState } from "react";
import { QRScanLoader } from "../ui/QRScanLoader";

interface Props {
  embedUrl: string;
  garmentName: string;
}

export function CollectiveDppEmbed({ embedUrl, garmentName }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-envrt-charcoal/5 bg-white">
      <QRScanLoader visible={isLoading} />
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
