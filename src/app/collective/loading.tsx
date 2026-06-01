// app/collective/loading.tsx
//
// Suspense fallback shown while the collective list page server-
// renders. Uses the same QRScanLoader as every other DPP-related
// loading surface (hero, collective product page, popup overlays,
// embed.js shadow DOM) so visitors see a consistent loading visual
// across envrt.com.
//
// Previously this rendered greyed-out skeleton bones for the header,
// filter bar, and card grid alongside a StitchingLoader cue. Stripped
// to a single focal animation for visual consistency with the rest of
// the DPP loading flow.

import { QRScanLoader } from "@/components/ui/QRScanLoader";

export default function CollectiveLoading() {
  return (
    <div className="relative min-h-screen w-full">
      <QRScanLoader />
    </div>
  );
}
