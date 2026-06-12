import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import { PageHero, FaqSnippet, ButtonV3 } from "@/components/v3";
import { PlatformComparison } from "@/components/v3/pricing/PlatformComparison";
import { type AssetIconType } from "@/components/sections/v3/AssetIcon";
import {
  Eyebrow,
  SectionCorners,
} from "@/components/sections/v3/_shared";
// Per-capability visuals are heavy (d3-geo + topojson + fetched
// world map) and all sit below the fold. Code-split so the platform
// hero ships without dragging them into the main chunk.
const VisualFor = dynamic(() =>
  import("@/components/sections/v3/platform/CapabilityVisuals").then(
    (m) => m.VisualFor,
  ),
);
import { FadeUp } from "@/components/ui/Motion";
import { FinalCtaV3 } from "@/components/sections/v3/FinalCtaV3";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { ItemListJsonLd } from "@/components/seo/ItemListJsonLd";

export const metadata: Metadata = {
  title: "Platform | ENVRT environmental software for fashion",
  description:
    "Supply chain mapping, in-house LCA, AWARE water scarcity, French Eco-Score, hosted DPPs, evidence vault, audit-ready reports, compliance monitoring and green-claims audit. Nine capabilities, one platform.",
  alternates: { canonical: "/platform" },
};

type Capability = {
  index: string;
  icon: AssetIconType;
  name: string;
  tagline: string;
  body: string;
  detail: { label: string; value: string }[];
  cta?: { label: string; href: string };
};

const CAPABILITIES: Capability[] = [
  {
    index: "01",
    icon: "supply-chain",
    name: "Supply chain mapping",
    tagline: "Every tier from fibre to factory, verified at source.",
    body: "We reconstruct your supply chain across all four tiers. Tier 1 (final assembly), Tier 2 (fabric production), Tier 3 (yarn spinning) and Tier 4 (raw fibre extraction). Each node is geotagged, named and tied to evidence. Supplier follow-up is built into the platform on Growth and Pro, so the data-chasing is not yours alone.",
    detail: [
      { label: "Tier coverage", value: "Tier 1 to Tier 4" },
      { label: "Verification", value: "Document upload + dated" },
      { label: "Supplier follow-up", value: "Growth + Pro" },
    ],
  },
  {
    index: "02",
    icon: "lca",
    name: "In-house LCA",
    tagline: "Per-garment lifecycle calculations. EU PEF and ISO 14040.",
    body: "We built the calculation engine in-house. Not licensed from a third party. Six lifecycle stages from fibre to transport, each driven by per-stage emission factors, country-specific energy grids and AWARE water scarcity weighting. Every passport runs the same engine, with 68,000+ reference cells per garment.",
    detail: [
      { label: "Standards", value: "EU PEF, ISO 14040, AWARE" },
      { label: "Stages modelled", value: "Fibre, yarn, fabric, dye, assembly, transport" },
      { label: "Reference cells per LCA", value: "68,431" },
    ],
    cta: { label: "See the engine anatomy", href: "/lab" },
  },
  {
    index: "03",
    icon: "eco-score",
    name: "French Eco-Score",
    tagline: "Coût Environnemental built in. Government-recognised.",
    body: "The Coût Environnemental score is calculated for every garment using the official methodology via Ecobalyse. Sixteen data blocks per product, French regulator-recognised, ready to display on the DPP or on your own product pages.",
    detail: [
      { label: "Methodology", value: "Coût Environnemental (Ecobalyse)" },
      { label: "Data blocks per product", value: "16" },
      { label: "Display", value: "DPP + embeddable widget" },
    ],
  },
  {
    index: "04",
    icon: "dpp",
    name: "DPP production",
    tagline: "Hosted Digital Product Passports at a permanent URL.",
    body: "Each garment gets a brand-customisable passport page at a permanent URL. Attach the QR to the care label, hangtag or packaging. Customers scan, regulators audit. EU ESPR-ready, with the legal framework changes tracked for you so the schema stays current.",
    detail: [
      { label: "Hosting", value: "envrt.com, brand-customisable" },
      { label: "URL", value: "Permanent, ESPR-ready" },
      { label: "Customisation", value: "Brand voice + visuals" },
    ],
  },
  {
    index: "05",
    icon: "vault",
    name: "Evidence vault",
    tagline: "Supplier certificates, test reports, declarations. Versioned and signed.",
    body: "Every document attached to your supply chain lives in a versioned, dated, signed vault. Supplier CoCs, REACH declarations, SGS test reports, audit packs. Each one tied to the supplier, the tier and the garment it backs. When the regulator asks for evidence, it is one click away.",
    detail: [
      { label: "Supported formats", value: "PDF, CSV, JSON, EML, XLSX" },
      { label: "Versioning", value: "Every change tracked" },
      { label: "Signing", value: "Yes, with audit trail" },
    ],
  },
  {
    index: "06",
    icon: "audit",
    name: "Audit-ready reports",
    tagline: "Export the proof pack in one click. PDF and JSON.",
    body: "Auditors and regulators do not want a slick UI. They want the data. Export the full proof pack per garment: calculation inputs, factor sources, frozen methodology version and the audit trail. One click.",
    detail: [
      { label: "Export formats", value: "PDF, JSON" },
      { label: "Per-garment pack", value: "Inputs + factors + methodology version" },
      { label: "Audit trail", value: "Included by default" },
    ],
  },
  {
    index: "07",
    icon: "compliance",
    name: "Compliance monitoring",
    tagline: "Active watch on EU PEF, ISO updates, AGEC and US state acts.",
    body: "Regulations move. Schemas update. We track the changes for you and apply them to your passports so you do not ship a DPP today that fails an audit in six months. Coverage includes EU PEF updates, ISO revisions, French AGEC and emerging US state-level acts.",
    detail: [
      { label: "Coverage", value: "EU PEF, ISO, AGEC, US state acts" },
      { label: "Update cadence", value: "Reviewed regularly, applied as schemas change" },
      { label: "Change log", value: "Per regulation, dated" },
    ],
  },
  {
    index: "08",
    icon: "analytics",
    name: "QR scan analytics",
    tagline: "Per-SKU and brand-wide dashboards. Scans, country, dwell time.",
    body: "Every QR scan is logged with geo, time and dwell. See which products get scanned most, where your DPP reach extends, how long customers spend reading. Available on Growth and Pro.",
    detail: [
      { label: "Granularity", value: "Per-SKU and brand-wide" },
      { label: "Metrics", value: "Scans, country, dwell time" },
      { label: "Tier", value: "Growth and Pro" },
    ],
  },
  {
    index: "09",
    icon: "claims",
    name: "Green-claims audit",
    tagline: "Every marketing claim tied to source data and methodology.",
    body: "When you say a garment is responsibly made, the platform ties that claim to the source data backing it. Material composition, supplier verification, calculation outputs. If a claim cannot be evidenced, the platform flags it before you ship.",
    detail: [
      { label: "Claims linked to", value: "Source data + methodology" },
      { label: "Pre-publish check", value: "Yes, with flags" },
      { label: "Audit pack", value: "Per claim, exportable" },
    ],
  },
];

const platformFaqs = [
  {
    question: "Which lifecycle stages does ENVRT cover?",
    answer:
      "Six stages: fibre production, yarn production, fabric production, dyeing, assembly and transport. Each stage runs through our in-house calculation engine using EU PEF methodology and AWARE water scarcity weighting.",
  },
  {
    question: "Is ENVRT a DPP-only platform?",
    answer:
      "No. The DPP is one output among several. The platform does supply chain mapping across four tiers, in-house lifecycle assessment, French Eco-Score calculation, evidence management and compliance monitoring. The DPP is the publishing surface for that work.",
  },
  {
    question: "Do you build your own LCA engine or use a third party?",
    answer:
      "Built in-house. EU PEF and ISO 14040 throughout. AWARE water scarcity model integrated. The engine is the differentiator: some platforms in our space rely on partner providers for LCA, where we own the entire stack.",
  },
  {
    question: "Can I export the methodology behind every passport?",
    answer:
      "Yes. Three formats (PDF, CSV, JSON) per garment. Each export includes the calculation inputs, factor sources, supplier evidence and audit trail.",
  },
];

export default function PlatformV3Page() {
  return (
    <main>
      <SoftwareApplicationJsonLd />
      <FAQJsonLd items={platformFaqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://envrt.com" },
          { name: "Platform", url: "https://envrt.com/platform" },
        ]}
      />
      <ItemListJsonLd
        name="ENVRT platform capabilities"
        description="Nine capabilities across supply chain mapping, in-house LCA, French Eco-Score, hosted DPPs, evidence vault, audit-ready exports, compliance monitoring, scan analytics and green-claims audit."
        url="https://envrt.com/platform"
        items={CAPABILITIES.map((c) => ({
          name: c.name,
          description: c.tagline,
          url: `https://envrt.com/platform#${c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        }))}
      />
      <PageHero
        eyebrow="Platform"
        heading={
          <>
            The full environmental platform.{" "}
            <span className="text-envrt-brand-black/40">
              Not just the DPP at the end.
            </span>
          </>
        }
        body="Nine capabilities, one platform. Supplier mapping, in-house lifecycle assessment, water scarcity, Eco-Score, hosted DPPs, evidence vault, audit reports, compliance monitoring and green-claims audit. EU PEF and ISO 14040 throughout."
        actions={
          <>
            <ButtonV3 href="/free-dpp" variant="primary">
              Try ENVRT on one garment<span>→</span>
            </ButtonV3>
            <ButtonV3 href="/pricing" variant="ghost">
              See pricing<span>→</span>
            </ButtonV3>
          </>
        }
        cornerLeft="ENVRT/01"
        cornerRight="Platform"
      />

      {/* Editorial header strip — graded thread spool wall. Suggests
          "every material, every supplier" before we list the nine
          capabilities. Full-bleed, no caption, lets the image speak. */}
      <section className="relative -mt-1 bg-envrt-brand-vista pb-12 sm:pb-16 lg:pb-20">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-16">
          <div className="relative aspect-[21/8] w-full overflow-hidden rounded-3xl ring-1 ring-envrt-brand-black/10 sm:aspect-[21/7]">
            <Image
              src="/v3-assets/platform-thread-spools.jpg"
              alt="Wall of dyed thread spool cones in a textile mill"
              fill
              sizes="(min-width: 1024px) 1200px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <CapabilitiesList />

      <PlatformComparison />

      <FaqSnippet
        eyebrow="Platform questions"
        heading="Common platform questions"
        items={platformFaqs}
        ctaHref="/faq"
        ctaLabel="See all FAQs"
      />

      <FinalCtaV3 />
    </main>
  );
}

function CapabilitiesList() {
  return (
    <section className="relative bg-envrt-brand-vista">
      {CAPABILITIES.map((cap, i) => (
        <CapabilityRow
          key={cap.index}
          cap={cap}
          reverse={i % 2 === 1}
          isLast={i === CAPABILITIES.length - 1}
        />
      ))}
    </section>
  );
}

function CapabilityRow({
  cap,
  reverse,
  isLast,
}: {
  cap: Capability;
  reverse: boolean;
  isLast: boolean;
}) {
  // Anchor slug matches the homepage CapabilitiesSection link target and
  // the ItemListJsonLd URLs. scroll-mt-24 keeps the heading clear of the
  // sticky v3 navbar when navigated via hash.
  const slug = cap.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div
      id={slug}
      className={`relative scroll-mt-24 ${isLast ? "" : "border-b border-envrt-brand-black/8"}`}
    >
      <SectionCorners left={`ENVRT/${cap.index}`} right={cap.name} />

      <div className="mx-auto max-w-[1320px] px-5 py-20 sm:px-8 sm:py-24 lg:px-16 lg:py-28">
        <div
          className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
            reverse ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          {/* Text */}
          <FadeUp>
            <div>
              <Eyebrow>
                {cap.index} · {cap.name}
              </Eyebrow>
              <h2 className="mt-4 font-display text-3xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-4xl lg:text-[2.5rem]">
                {cap.tagline}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-envrt-brand-black/70 sm:text-lg">
                {cap.body}
              </p>

              <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
                {cap.detail.map((d) => (
                  <div key={d.label}>
                    <dt className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine sm:text-[10px]">
                      {d.label}
                    </dt>
                    <dd className="mt-1 font-display text-sm font-semibold tracking-tight text-envrt-brand-black sm:text-base">
                      {d.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {cap.cta && (
                <div className="mt-8">
                  <ButtonV3 href={cap.cta.href} variant="ghost">
                    {cap.cta.label}<span>→</span>
                  </ButtonV3>
                </div>
              )}
            </div>
          </FadeUp>

          {/* Visual */}
          <FadeUp delay={0.12}>
            <CapabilityVisual cap={cap} />
          </FadeUp>
        </div>
      </div>
    </div>
  );
}

function CapabilityVisual({ cap }: { cap: Capability }) {
  // Canvas sizing strategy:
  // - Desktop (lg+): every visual except cap 04 sits inside a fixed 5:4
  //   aspect canvas so the page reads as a consistent set of "screenshots".
  // - Mobile / tablet: the canvas grows to fit content instead of forcing
  //   stage rows, table rows or chart axes to be squeezed into a too-short
  //   box. The visuals were getting clipped or overlapping the card border
  //   before. min-h baseline keeps light-content visuals from collapsing.
  // - Cap 04 (DPP phone) always opts out of the fixed aspect because the
  //   phone is a 9:19 portrait that wants its own natural height.
  const fixedAspect = cap.index !== "04";
  return (
    <div
      className={`relative mx-auto w-full max-w-[520px] ${fixedAspect ? "lg:aspect-[5/4]" : ""}`}
    >
      <div className={fixedAspect ? "lg:absolute lg:inset-0" : ""}>
        <VisualFor id={cap.index} />
      </div>
    </div>
  );
}

