"use client";

import Image from "next/image";
import { Button } from "../../ui/Button";
import { Badge } from "../../ui/Badge";
import { FadeUp } from "../../ui/Motion";

// Each annotation thumbnail shows a cropped region of a single full DPP
// screenshot (public/screenshots/dpp/hoodie-full.png). Crop is controlled
// via background-position + background-size, so all four panels share one
// asset. Tune the coordinates by eye once the screenshot is in place.
type Annotation = {
  id: number;
  label: string;
  // CSS background-position-y as a percentage of the source image height.
  // Pick the region of the DPP that corresponds to this annotation.
  cropY: string;
  // Where this panel sits on the desktop composition.
  desktopAnchor: { top: string; left?: string; right?: string };
};

const annotations: Annotation[] = [
  {
    id: 1,
    label: "Headline impact",
    cropY: "7%",
    desktopAnchor: { top: "6%", left: "-4%" },
  },
  {
    id: 2,
    label: "Materials breakdown",
    cropY: "17%",
    desktopAnchor: { top: "6%", right: "-4%" },
  },
  {
    id: 3,
    label: "Supply chain map",
    cropY: "26%",
    desktopAnchor: { top: "62%", left: "-4%" },
  },
  {
    id: 4,
    label: "Verified standards",
    cropY: "72%",
    desktopAnchor: { top: "62%", right: "-4%" },
  },
];

// Where each panel's connector line lands on the central composition,
// expressed as percentages of the right column. The QR sits roughly at
// (60%, 60%) of the column, which is the natural focal point.
const FOCAL_POINT = { x: 58, y: 62 };

// Panel anchor points (where the connector line starts), expressed as a
// percentage of the right column. Computed from desktopAnchor + panel size.
const PANEL_ANCHORS: Record<number, { x: number; y: number }> = {
  1: { x: 12, y: 22 },
  2: { x: 88, y: 22 },
  3: { x: 12, y: 78 },
  4: { x: 88, y: 78 },
};

const SCREENSHOT_SRC = "/screenshots/dpp/hoodie-full.png";

export function HeroV2() {
  return (
    <section className="relative mx-auto max-w-[1360px] overflow-x-clip px-6 pt-28 pb-16 sm:px-10 sm:pt-32 sm:pb-20 lg:px-16 lg:pb-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        {/* Left: text content */}
        <div className="max-w-xl">
          <FadeUp><Badge>Ready for the EU ESPR mandate.</Badge></FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="mt-6 text-4xl font-bold leading-[1.15] tracking-tight text-envrt-charcoal sm:text-5xl lg:text-[3.5rem]">
              Digital Product Passports for fashion brands.
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="mt-4 text-2xl font-bold leading-[1.25] tracking-tight text-envrt-charcoal/70 sm:text-3xl lg:text-4xl">
              <em className="italic">Your</em> GARMENTS.{" "}
              <em className="italic">Their</em> IMPACT.{" "}
              <em className="italic">One</em> PLATFORM.
            </p>
          </FadeUp>
          <FadeUp delay={0.25}>
            <p className="mt-6 text-base leading-relaxed text-envrt-muted sm:text-lg">
              Calculate emissions, water scarcity and Eco-Score for every garment. Attach a QR to the tag. Customers scan and see it.
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/free-dpp" size="md" className="sm:px-8 sm:py-4 sm:text-lg" data-cta="hero-free-dpp">
                Get a free DPP<span className="ml-2">→</span>
              </Button>
              <Button href="/contact" variant="secondary" size="md" className="sm:px-8 sm:py-4 sm:text-lg" data-cta="hero-book-demo">
                Book a demo
              </Button>
            </div>
          </FadeUp>
          <FadeUp delay={0.4}>
            <p className="mt-6 text-xs font-medium tracking-wide text-envrt-muted/70">
              Built for fashion and apparel brands selling into the EU.
            </p>
          </FadeUp>
        </div>

        {/* Right: hoodie + QR composition with annotated thumbnails */}
        <FadeUp delay={0.2}>
          <div className="relative mx-auto w-full max-w-[640px]">
            {/* Desktop composition with annotations around the artefact */}
            <div className="relative hidden aspect-square lg:block">
              {/* Connector overlay */}
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {annotations.map((a) => {
                  const anchor = PANEL_ANCHORS[a.id];
                  return (
                    <g key={a.id}>
                      <line
                        x1={anchor.x}
                        y1={anchor.y}
                        x2={FOCAL_POINT.x}
                        y2={FOCAL_POINT.y}
                        stroke="rgba(42, 161, 152, 0.45)"
                        strokeWidth={0.15}
                        strokeDasharray="0.5 0.5"
                        vectorEffect="non-scaling-stroke"
                      />
                      <circle
                        cx={anchor.x}
                        cy={anchor.y}
                        r={0.35}
                        fill="rgb(42, 161, 152)"
                        vectorEffect="non-scaling-stroke"
                      />
                    </g>
                  );
                })}
                <circle
                  cx={FOCAL_POINT.x}
                  cy={FOCAL_POINT.y}
                  r={0.55}
                  fill="rgb(42, 161, 152)"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Hoodie */}
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 w-[58%] -translate-x-1/2 -translate-y-1/2"
                style={{ transform: "translate(-50%, -50%) rotate(-6deg)" }}
              >
                <Image
                  src="/jacket.png"
                  alt="Sustainable hoodie"
                  width={480}
                  height={560}
                  className="h-auto w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
                  priority
                />
              </div>

              {/* QR overlay near the natural tag area */}
              <div
                className="pointer-events-none absolute"
                style={{ left: `${FOCAL_POINT.x - 7}%`, top: `${FOCAL_POINT.y - 7}%`, width: "14%" }}
              >
                <Image
                  src="/qr-code.png"
                  alt="Digital Product Passport QR code"
                  width={320}
                  height={320}
                  className="h-auto w-full object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.22)]"
                />
              </div>

              {/* Annotation panels */}
              {annotations.map((a) => (
                <div
                  key={a.id}
                  className="absolute w-[22%]"
                  style={{
                    top: a.desktopAnchor.top,
                    left: a.desktopAnchor.left,
                    right: a.desktopAnchor.right,
                  }}
                >
                  <AnnotationPanel annotation={a} />
                </div>
              ))}
            </div>

            {/* Mobile composition: hoodie + QR then 2x2 thumbnail grid */}
            <div className="lg:hidden">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[360px]">
                <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-full w-[80%]">
                  <Image
                    src="/jacket.png"
                    alt="Sustainable hoodie"
                    width={480}
                    height={560}
                    className="h-full w-full object-contain drop-shadow-[0_18px_36px_rgba(0,0,0,0.22)]"
                    priority
                  />
                </div>
                <div className="pointer-events-none absolute right-[18%] top-[42%] w-[20%]">
                  <Image
                    src="/qr-code.png"
                    alt="Digital Product Passport QR code"
                    width={320}
                    height={320}
                    className="h-auto w-full object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.2)]"
                  />
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {annotations.map((a) => (
                  <AnnotationPanel key={a.id} annotation={a} />
                ))}
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function AnnotationPanel({ annotation }: { annotation: Annotation }) {
  return (
    <div className="overflow-hidden rounded-xl border border-envrt-charcoal/10 bg-white shadow-[0_8px_20px_-8px_rgba(0,0,0,0.15)]">
      {/* Cropped DPP region */}
      <div
        className="relative aspect-[5/3] w-full bg-envrt-cream"
        style={{
          backgroundImage: `url(${SCREENSHOT_SRC})`,
          backgroundSize: "100% auto",
          backgroundPosition: `center ${annotation.cropY}`,
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="border-t border-envrt-charcoal/5 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold leading-none text-envrt-teal">
            {String(annotation.id).padStart(2, "0")}
          </span>
          <p className="text-xs font-semibold text-envrt-charcoal">{annotation.label}</p>
        </div>
      </div>
    </div>
  );
}
