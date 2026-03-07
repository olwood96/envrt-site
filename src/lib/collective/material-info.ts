/** Short descriptions for common textile materials */
const MATERIAL_DESCRIPTIONS: Record<string, string> = {
  "Organic Cotton":
    "Grown without synthetic pesticides or fertilisers. Uses significantly less water than conventional cotton.",
  Cotton:
    "Natural cellulose fibre. Breathable and versatile, but conventional farming is water-intensive.",
  "Recycled Cotton":
    "Made from pre- or post-consumer cotton waste. Reduces landfill and raw material demand.",
  Polyester:
    "Synthetic petroleum-based fibre. Durable and wrinkle-resistant, but non-biodegradable.",
  "Recycled Polyester":
    "Made from post-consumer PET bottles or textile waste. Reduces virgin plastic demand and energy use.",
  Nylon:
    "Strong synthetic fibre with excellent elasticity. Energy-intensive to produce.",
  "Recycled Nylon":
    "Regenerated from pre- and post-consumer nylon waste such as fishing nets and carpet fibre.",
  Wool:
    "Natural animal fibre with excellent insulation. Biodegradable, but farming has land-use impacts.",
  Silk:
    "Natural protein fibre produced by silkworms. Luxurious hand-feel with a high strength-to-weight ratio.",
  Linen:
    "Made from flax plants. Requires minimal water and pesticides. Naturally strong and breathable.",
  Hemp:
    "Fast-growing plant fibre requiring little water or pesticides. Naturally antimicrobial.",
  Viscose:
    "Semi-synthetic fibre from wood pulp. Soft and breathable, but processing can be chemically intensive.",
  Modal:
    "Semi-synthetic fibre from beech wood pulp. Softer than viscose with a lower environmental footprint.",
  Lyocell:
    "Closed-loop cellulose fibre (e.g. TENCEL). Solvent is recycled, making it one of the most sustainable regenerated fibres.",
  Elastane:
    "Synthetic stretch fibre (also known as spandex). Adds flexibility but is difficult to recycle.",
  Spandex:
    "Synthetic stretch fibre. Provides elasticity in blended fabrics but complicates end-of-life recycling.",
  Acrylic:
    "Lightweight synthetic fibre often used as a wool alternative. Non-biodegradable and can shed microfibres.",
  Leather:
    "Natural animal hide. Durable but tanning processes can be environmentally harmful.",
  "Synthetic Leather":
    "Man-made alternative to animal leather. Avoids animal farming but is typically petroleum-based.",
  ECONYL:
    "Regenerated nylon made from ocean waste, fishing nets, and fabric scraps. Infinitely recyclable.",
};

/**
 * Get a short description for a material name.
 * Returns null if no description is available.
 */
export function getMaterialDescription(material: string): string | null {
  return MATERIAL_DESCRIPTIONS[material] ?? null;
}
