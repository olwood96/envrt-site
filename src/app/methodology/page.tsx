import type { Metadata } from "next";
import {
  LegalShell,
  LegalP,
  LegalUl,
  LegalLi,
  LegalStrong,
  LegalLink,
  type LegalSection,
} from "@/components/v3/LegalShell";

export const metadata: Metadata = {
  title: "Methodology | ENVRT",
  description:
    "How ENVRT calculates the figures on Digital Product Passports. Model-level LCA, colourway variants and the ESPR three-tier framework.",
  alternates: { canonical: "/methodology" },
};

const SECTIONS: LegalSection[] = [
  {
    index: "01",
    title: "Where the numbers come from",
    body: (
      <>
        <LegalP>
          Every figure on an ENVRT Digital Product Passport (DPP) is the output
          of a stage-by-stage Life Cycle Assessment (LCA), following the ISO
          14040 / 14044 family of standards. The brand submits the
          fibre composition, factory locations and production stages for a
          garment. We run the calculation with peer-reviewed emission and water
          factors and publish the result on the passport. Brands attest to the
          underlying inputs; we own the methodology.
        </LegalP>
        <LegalP>
          The headline metrics are the cradle-to-gate footprint of the garment,
          covering raw materials, processing, dyeing, assembly and supply chain
          transport. End-of-life and consumer-use phases are reported where
          relevant but stay separate from the cradle-to-gate figure to avoid
          double counting.
        </LegalP>
      </>
    ),
  },
  {
    index: "02",
    title: "Model level, batch level, item level",
    body: (
      <>
        <LegalP>
          The EU Ecodesign for Sustainable Products Regulation (
          <LegalLink href="https://eur-lex.europa.eu/eli/reg/2024/1781/oj">
            ESPR 2024/1781
          </LegalLink>
          ) defines three levels of granularity for a Digital Product Passport:
          Model, Batch and Item. Each level answers a different question.
        </LegalP>
        <LegalUl>
          <LegalLi>
            <LegalStrong>Model level</LegalStrong> describes the design of a
            garment, its fibre composition, factory locations, baseline
            environmental footprint, durability and care. It applies to every
            unit ever produced to that design.
          </LegalLi>
          <LegalLi>
            <LegalStrong>Batch level</LegalStrong> describes a specific
            production run, when and where it was made, certifications tied to
            that run.
          </LegalLi>
          <LegalLi>
            <LegalStrong>Item level</LegalStrong> uniquely identifies a single
            physical unit using a serialised code, supporting resale and repair
            tracking through that unit&apos;s lifetime.
          </LegalLi>
        </LegalUl>
        <LegalP>
          ENVRT publishes Model-level passports as the canonical record. Item-
          and batch-level navigation is layered on where brands need it.
        </LegalP>
      </>
    ),
  },
  {
    index: "03",
    title: "Colourway variants",
    body: (
      <>
        <LegalP>
          When a brand sells the same garment in multiple colourways, the DPP
          surfaces a swatch picker so the consumer who scans their tag lands on
          the right variant view. Each variant carries its own SKU, photo and
          colour name. The headline footprint figure does not change between
          variants because the underlying LCA does not change: the fibre, the
          factory, the supply chain and the production process are identical.
        </LegalP>
        <LegalP>
          Variants are surfaced at item-level navigation under a single
          Model-level passport. ESPR allows this structure explicitly. Each
          variant SKU is its own unique identifier on the market, so a regulator
          can trace a scanned garment back to the specific colourway it came
          from. The footprint behind it remains the model-wide number.
        </LegalP>
        <LegalP>
          Where colourway-specific impact is material (for example a brand
          running a separate dye process for one colour at a different facility),
          we work with the brand to register a distinct Model-level garment
          rather than a variant under the same parent.
        </LegalP>
      </>
    ),
  },
  {
    index: "04",
    title: "Verification levels",
    body: (
      <>
        <LegalP>
          Each production stage on the journey carries one of four verification
          tags: declared, modelled, validated or verified. These tags signal how
          confident we are in the input data behind that stage.
        </LegalP>
        <LegalUl>
          <LegalLi>
            <LegalStrong>Modelled</LegalStrong>, ENVRT applied a regional or
            category baseline because the brand could not provide stage-specific
            data.
          </LegalLi>
          <LegalLi>
            <LegalStrong>Declared</LegalStrong>, the brand provided data but no
            supporting evidence beyond their attestation.
          </LegalLi>
          <LegalLi>
            <LegalStrong>Validated</LegalStrong>, the brand provided data backed
            by supplier documentation, audited or otherwise traceable.
          </LegalLi>
          <LegalLi>
            <LegalStrong>Verified</LegalStrong>, the data passes a recognised
            third-party verification scheme such as GOTS, OEKO-TEX, RWS or a
            comparable audit body.
          </LegalLi>
        </LegalUl>
        <LegalP>
          Verification tags are assigned by ENVRT, not by the brand. The brand
          provides evidence; we assess it; we apply the tag. This is editorial
          responsibility we hold, not a brand claim.
        </LegalP>
      </>
    ),
  },
  {
    index: "05",
    title: "What the brand attests, what we own",
    body: (
      <>
        <LegalP>
          We split responsibility cleanly. Anything the brand asserts as a
          factual claim about their product, supply chain or compliance is a
          brand attestation, signed and timestamped, with the brand carrying
          liability for accuracy. Anything ENVRT decides as part of the
          methodology, the calculation engine or the verification tag is ours.
        </LegalP>
        <LegalUl>
          <LegalLi>
            <LegalStrong>Brand attests</LegalStrong>: material composition, mass,
            supplier names, factory locations, certifications held, colourway
            variants share the parent&apos;s materials and supply chain.
          </LegalLi>
          <LegalLi>
            <LegalStrong>ENVRT owns</LegalStrong>: LCA methodology and the
            choice of emission and water factors, verification tags, the
            transparency score, the Model-level scoping decision described above.
          </LegalLi>
        </LegalUl>
        <LegalP>
          The full attestation log for any brand is available on request through
          their ENVRT dashboard. Attestations are written once and never edited.
        </LegalP>
      </>
    ),
  },
  {
    index: "06",
    title: "Updates to this methodology",
    body: (
      <>
        <LegalP>
          We update this page when we change a calculation input, a factor
          source or the rules around how variants and verification tags work.
          Updates are timestamped and the previous version stays available in
          the changelog at the bottom of the dashboard.
        </LegalP>
        <LegalP>
          Questions or corrections, write to{" "}
          <LegalLink href="mailto:info@envrt.com">info@envrt.com</LegalLink>.
        </LegalP>
      </>
    ),
  },
];

export default function MethodologyPage() {
  return (
    <LegalShell
      cornerLabel="ENVRT/METHODOLOGY"
      pageTitle="Methodology"
      pageBody="How ENVRT calculates the figures on every Digital Product Passport. Model-level LCA, colourway variants and the ESPR three-tier framework."
      lastUpdated="Updated June 2026"
      sections={SECTIONS}
    />
  );
}
