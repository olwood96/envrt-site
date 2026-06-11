import type { Metadata } from "next";
import Image from "next/image";
import { PageHero, FaqSnippet, ButtonV3 } from "@/components/v3";
import {
  AssetIcon,
  type AssetIconType,
} from "@/components/sections/v3/AssetIcon";
import {
  Eyebrow,
  SectionCorners,
} from "@/components/sections/v3/_shared";
import { FadeUp } from "@/components/ui/Motion";
import { FinalCtaV3 } from "@/components/sections/v3/FinalCtaV3";

export const metadata: Metadata = {
  title: "Platform | ENVRT v3",
  description:
    "Supply chain mapping, in-house LCA, water scarcity, Eco-Score, DPP production and more. The full environmental platform for fashion.",
  robots: { index: false, follow: false },
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
    cta: { label: "See the engine anatomy", href: "/preview/v3/lab" },
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
      { label: "Hosting", value: "envrt.com or own domain" },
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
            <ButtonV3 href="/preview/v3/free-dpp" variant="primary">
              Try ENVRT on one garment<span>→</span>
            </ButtonV3>
            <ButtonV3 href="/preview/v3/pricing" variant="ghost">
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

      <ComparisonSection />

      <FaqSnippet
        eyebrow="Platform questions"
        heading="Common platform questions"
        items={platformFaqs}
        ctaHref="/preview/v3/faq"
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
  return (
    <div
      className={`relative ${isLast ? "" : "border-b border-envrt-brand-black/8"}`}
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
  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[520px]">
      {/* Soft brand-tinted wash behind */}
      <div
        aria-hidden
        className="absolute inset-6 rounded-3xl bg-envrt-brand-ultramarine/5"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex h-32 w-32 items-center justify-center rounded-[2rem] border border-envrt-brand-black/12 bg-white shadow-[0_30px_70px_-30px_rgba(62,0,255,0.35)] sm:h-40 sm:w-40">
          <AssetIcon
            type={cap.icon}
            size={56}
            className="text-envrt-brand-ultramarine"
          />
        </div>
      </div>

      {/* Index chip */}
      <span className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-envrt-brand-black/12 bg-white px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/65">
        <span className="text-envrt-brand-ultramarine">{cap.index}</span>
        <span aria-hidden className="text-envrt-brand-black/20">/</span>
        <span>Capability</span>
      </span>
    </div>
  );
}

// ─── Comparison vs alternatives ──────────────────────────────────────────
// Ported from the v1 ComparisonSection. Six dimensions, three columns
// (Consultant / In-house / ENVRT). Positions the stack against the two
// real alternatives buyers consider before us.

type ComparisonRow = {
  label: string;
  consultant: string;
  inHouse: string;
  envrt: string;
};

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    label: "Annual cost",
    consultant: "From £30,000",
    inHouse: "From £80,000",
    envrt: "From £1,788",
  },
  {
    label: "Time to first DPP",
    consultant: "2-4 months",
    inHouse: "3-6 months",
    envrt: "Same day",
  },
  {
    label: "Scalability",
    consultant: "Limited by availability",
    inHouse: "Scales with headcount",
    envrt: "Scales with plan",
  },
  {
    label: "Regulatory updates",
    consultant: "Manual re-engagement",
    inHouse: "Your team researches",
    envrt: "Built into platform",
  },
  {
    label: "Lifecycle metrics",
    consultant: "Varies by consultant",
    inHouse: "Requires specialist hire",
    envrt: "Included from Growth",
  },
  {
    label: "Ongoing platform",
    consultant: "None, reports only",
    inHouse: "Custom-built or none",
    envrt: "Full dashboard included",
  },
];

function ComparisonSection() {
  return (
    <section className="relative bg-white py-20 sm:py-24 lg:py-32">
      <SectionCorners left="ENVRT/Compare" right="vs alternatives" />
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-2xl text-center">
          <FadeUp>
            <Eyebrow>vs the alternatives</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="mt-4 font-display text-3xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-4xl">
              The two real options before this one.
            </h2>
          </FadeUp>
          <FadeUp delay={0.16}>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-envrt-brand-black/65 sm:text-base">
              Most brands considering ENVRT have already priced a consultant
              or weighed up hiring in-house. Here is what each looks like
              against the same six measures.
            </p>
          </FadeUp>
        </div>

        {/* Desktop table */}
        <FadeUp delay={0.2}>
          <div className="mt-14 hidden overflow-hidden rounded-2xl ring-1 ring-envrt-brand-black/10 lg:block">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="border-b border-envrt-brand-black/10 bg-envrt-brand-vista/60">
                  <th className="w-[28%] px-5 py-5 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55">
                    Measure
                  </th>
                  <th className="w-[24%] px-5 py-5 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/65">
                    Consultant
                  </th>
                  <th className="w-[24%] px-5 py-5 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/65">
                    In-house team
                  </th>
                  <th className="w-[24%] px-5 py-5 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine">
                    ENVRT
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr
                    key={row.label}
                    className={
                      i % 2 === 1
                        ? "bg-envrt-brand-vista/30"
                        : "bg-white"
                    }
                  >
                    <td className="px-5 py-5 align-top font-display text-sm font-semibold tracking-[-0.01em] text-envrt-brand-black sm:text-base">
                      {row.label}
                    </td>
                    <td className="px-5 py-5 align-top text-sm leading-snug text-envrt-brand-black/65">
                      {row.consultant}
                    </td>
                    <td className="px-5 py-5 align-top text-sm leading-snug text-envrt-brand-black/65">
                      {row.inHouse}
                    </td>
                    <td className="px-5 py-5 align-top text-sm font-semibold leading-snug text-envrt-brand-ultramarine">
                      {row.envrt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeUp>

        {/* Mobile / tablet card stack */}
        <FadeUp delay={0.2}>
          <div className="mt-12 grid gap-3 lg:hidden">
            {COMPARISON_ROWS.map((row) => (
              <div
                key={row.label}
                className="rounded-2xl border border-envrt-brand-black/10 bg-white p-5"
              >
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55 sm:text-[11px]">
                  {row.label}
                </p>
                <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                  <div>
                    <dt className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-envrt-brand-black/45">
                      Consultant
                    </dt>
                    <dd className="mt-1 text-sm text-envrt-brand-black/70">
                      {row.consultant}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-envrt-brand-black/45">
                      In-house
                    </dt>
                    <dd className="mt-1 text-sm text-envrt-brand-black/70">
                      {row.inHouse}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-envrt-brand-ultramarine">
                      ENVRT
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-envrt-brand-ultramarine">
                      {row.envrt}
                    </dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={0.3}>
          <p className="mt-10 text-center font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-envrt-brand-black/45 sm:text-[11px]">
            Want the full maths? See the ROI calculator
            <ButtonV3 href="/preview/v3/roi" variant="ghost" className="!ml-2">
              Open ROI<span>→</span>
            </ButtonV3>
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
