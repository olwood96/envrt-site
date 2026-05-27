export type AlignedWithItem = {
  slug: string;
  shortName: string;
  label: string;
  fullName: string;
  description: string;
  url: string;
  schemaType: "Organization" | "DefinedTerm";
};

export type AlignedWithLogo = AlignedWithItem & {
  src: string;
  alt: string;
};

export const ALIGNED_WITH_LOGOS: AlignedWithLogo[] = [
  {
    slug: "eu-emblem",
    shortName: "EU PEF",
    label: "EU PEF",
    fullName: "European Union Product Environmental Footprint",
    description:
      "The European Commission's standardised methodology for measuring product environmental impact, used across all 27 EU member states.",
    url: "https://environment.ec.europa.eu/topics/circular-economy/product-environmental-footprint_en",
    schemaType: "Organization",
    src: "/logos/aligned-with/eu-emblem.jpg",
    alt: "EU emblem indicating alignment with EU Product Environmental Footprint methodology and the Digital Product Passport regulation",
  },
  {
    slug: "un-sdgs",
    shortName: "UN SDGS",
    label: "UN SDGS",
    fullName: "United Nations Sustainable Development Goals",
    description:
      "The 17 Sustainable Development Goals adopted by all 193 United Nations member states to address global challenges including climate, water and responsible consumption.",
    url: "https://sdgs.un.org/goals",
    schemaType: "Organization",
    src: "/logos/aligned-with/un-sdgs.png",
    alt: "United Nations Sustainable Development Goals colour wheel logo, indicating alignment with the 17 SDGs",
  },
  {
    slug: "ghg-protocol",
    shortName: "GHG PROTOCOL",
    label: "GHG PROTOCOL",
    fullName: "Greenhouse Gas Protocol",
    description:
      "The world's most widely used greenhouse gas accounting standard, developed by the World Resources Institute and World Business Council for Sustainable Development.",
    url: "https://ghgprotocol.org",
    schemaType: "Organization",
    src: "/logos/aligned-with/ghg-protocol.png",
    alt: "Greenhouse Gas Protocol logo, the world's most widely used greenhouse gas accounting standard",
  },
  {
    slug: "wulca-aware",
    shortName: "AWARE",
    label: "AWARE",
    fullName: "AWARE Water Scarcity Model",
    description:
      "Available Water Remaining (AWARE) is the United Nations Environment Programme recommended methodology for assessing water scarcity in life cycle assessment, developed by the WULCA working group.",
    url: "https://wulca-waterlca.org/aware/",
    schemaType: "DefinedTerm",
    src: "/logos/aligned-with/wulca-aware.png",
    alt: "WULCA logo, developer of the AWARE water scarcity assessment model used in life cycle assessment",
  },
  {
    slug: "ecobalyse",
    shortName: "ECOBALYSE",
    label: "ECOBALYSE",
    fullName: "Ecobalyse",
    description:
      "Ecobalyse is the French government's official lifecycle assessment engine for the apparel industry, operated by the Agency for Ecological Transition (ADEME).",
    url: "https://ecobalyse.beta.gouv.fr",
    schemaType: "Organization",
    src: "/logos/aligned-with/ecobalyse.png",
    alt: "Ecobalyse logo, the French government's official lifecycle assessment engine for the apparel industry",
  },
  {
    slug: "unep-lci",
    shortName: "UNEP LCI",
    label: "UNEP LCI",
    fullName: "UNEP Life Cycle Initiative",
    description:
      "The Life Cycle Initiative is hosted by the United Nations Environment Programme and is the global authority on life cycle assessment methodology.",
    url: "https://www.lifecycleinitiative.org",
    schemaType: "Organization",
    src: "/logos/aligned-with/unep-lci.png",
    alt: "UNEP Life Cycle Initiative logo, the United Nations Environment Programme's life cycle assessment initiative",
  },
];

export const ALIGNED_WITH_STANDARDS: AlignedWithItem[] = [
  {
    slug: "iso-14040",
    shortName: "ISO 14040",
    label: "LCA PRINCIPLES",
    fullName: "ISO 14040 Life Cycle Assessment Principles",
    description:
      "ISO 14040 is the international standard published by the International Organization for Standardization that defines the principles and framework for life cycle assessment.",
    url: "https://www.iso.org/standard/37456.html",
    schemaType: "DefinedTerm",
  },
  {
    slug: "iso-14044",
    shortName: "ISO 14044",
    label: "LCA REQUIREMENTS",
    fullName: "ISO 14044 Life Cycle Assessment Requirements and Guidelines",
    description:
      "ISO 14044 is the international standard that defines the requirements and guidelines for conducting a life cycle assessment.",
    url: "https://www.iso.org/standard/38498.html",
    schemaType: "DefinedTerm",
  },
  {
    slug: "iso-14046",
    shortName: "ISO 14046",
    label: "WATER FOOTPRINT",
    fullName: "ISO 14046 Water Footprint Standard",
    description:
      "ISO 14046 is the international standard that defines principles, requirements and guidelines for the assessment of water footprint of products, processes and organisations.",
    url: "https://www.iso.org/standard/43263.html",
    schemaType: "DefinedTerm",
  },
  {
    slug: "pefcr",
    shortName: "PEFCR",
    label: "APPAREL & FOOTWEAR",
    fullName: "PEFCR for Apparel and Footwear",
    description:
      "The Product Environmental Footprint Category Rules for Apparel and Footwear are the European Commission's specific rules for assessing apparel and footwear products.",
    url: "https://environment.ec.europa.eu/news/pefcr-apparel-and-footwear-2024-11-26_en",
    schemaType: "DefinedTerm",
  },
  {
    slug: "espr",
    shortName: "ESPR",
    label: "EU ECODESIGN",
    fullName: "EU Ecodesign for Sustainable Products Regulation",
    description:
      "The Ecodesign for Sustainable Products Regulation is the EU framework that establishes ecodesign requirements for sustainable products, including the Digital Product Passport mandate.",
    url: "https://commission.europa.eu/energy-climate-change-environment/standards-tools-and-labels/products-labelling-rules-and-requirements/sustainable-products/ecodesign-sustainable-products-regulation_en",
    schemaType: "DefinedTerm",
  },
  {
    slug: "eu-dpp",
    shortName: "EU DPP",
    label: "PASSPORT REGULATION",
    fullName: "EU Digital Product Passport",
    description:
      "The EU Digital Product Passport is the European Union regulation mandating that products provide structured digital information about their environmental impact, origin and lifecycle, becoming mandatory for textiles from 2027.",
    url: "https://commission.europa.eu/energy-climate-change-environment/standards-tools-and-labels/products-labelling-rules-and-requirements/sustainable-products/digital-product-passport_en",
    schemaType: "DefinedTerm",
  },
];

export const ALIGNED_WITH_ALL: AlignedWithItem[] = [
  ...ALIGNED_WITH_LOGOS,
  ...ALIGNED_WITH_STANDARDS,
];
