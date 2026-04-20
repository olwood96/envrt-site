"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionCard } from "@/components/ui/SectionCard";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/ui/Motion";
import { HiddenTurnstile } from "@/components/ui/TurnstileWidget";

/* ================================================================
   FORM DATA
   ================================================================ */

const GARMENT_TYPES = [
  { value: "t-shirt", label: "T-shirt / Polo" },
  { value: "shirt", label: "Shirt / Blouse" },
  { value: "sweater", label: "Sweater / Hoodie" },
  { value: "jeans", label: "Jeans" },
  { value: "trousers", label: "Trousers / Shorts" },
  { value: "dress", label: "Dress / Skirt" },
  { value: "coat", label: "Coat / Jacket" },
  { value: "socks", label: "Socks" },
  { value: "underwear-woven", label: "Underwear (woven)" },
  { value: "underwear-knit", label: "Underwear (knitted)" },
  { value: "swimwear", label: "Swimwear" },
];

const MATERIALS = [
  { group: "Natural", options: [
    { value: "cotton", label: "Cotton" },
    { value: "organic cotton", label: "Organic Cotton" },
    { value: "linen", label: "Linen" },
    { value: "wool", label: "Wool" },
    { value: "silk", label: "Silk" },
  ]},
  { group: "Synthetic", options: [
    { value: "polyester", label: "Polyester" },
    { value: "recycled polyester", label: "Recycled Polyester" },
    { value: "nylon", label: "Nylon" },
    { value: "recycled nylon", label: "Recycled Nylon" },
    { value: "elastane", label: "Elastane / Spandex" },
  ]},
  { group: "Regenerated", options: [
    { value: "viscose", label: "Viscose" },
    { value: "lyocell", label: "Lyocell / Tencel" },
    { value: "modal", label: "Modal" },
  ]},
];

const COUNTRIES = [
  { value: "China", label: "China" },
  { value: "Bangladesh", label: "Bangladesh" },
  { value: "Turkey", label: "Turkey" },
  { value: "Portugal", label: "Portugal" },
  { value: "India", label: "India" },
  { value: "Italy", label: "Italy" },
  { value: "Vietnam", label: "Vietnam" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Cambodia", label: "Cambodia" },
  { value: "Pakistan", label: "Pakistan" },
  { value: "Morocco", label: "Morocco" },
  { value: "Tunisia", label: "Tunisia" },
  { value: "France", label: "France" },
  { value: "Spain", label: "Spain" },
  { value: "Germany", label: "Germany" },
  { value: "Romania", label: "Romania" },
  { value: "Poland", label: "Poland" },
  { value: "Indonesia", label: "Indonesia" },
  { value: "Myanmar", label: "Myanmar" },
  { value: "Thailand", label: "Thailand" },
];

const CATALOGUE_SIZES = [
  { value: "50", label: "Under 100 products" },
  { value: "300", label: "100 - 500 products" },
  { value: "750", label: "500 - 1,000 products" },
  { value: "2500", label: "1,000 - 5,000 products" },
  { value: "10000", label: "5,000+ products" },
];

const PRICE_RANGES = [
  { value: "15", label: "Under 20 EUR" },
  { value: "35", label: "20 - 50 EUR" },
  { value: "75", label: "50 - 100 EUR" },
  { value: "150", label: "100 - 200 EUR" },
  { value: "300", label: "200+ EUR" },
];

const DEADSTOCK_OPTIONS = [
  { value: "3", label: "Under 5%" },
  { value: "7", label: "5 - 10%" },
  { value: "15", label: "10 - 20%" },
  { value: "25", label: "20%+" },
  { value: "", label: "Not sure" },
];

const WASTE_OPTIONS = [
  { value: "3", label: "Under 5%" },
  { value: "7", label: "5 - 10%" },
  { value: "12", label: "10 - 15%" },
  { value: "20", label: "15%+" },
  { value: "", label: "Not sure" },
];

/* ================================================================
   COMPONENT
   ================================================================ */

type Step = "product" | "boost" | "contact" | "done";

interface FormData {
  // Section A
  garment_type: string;
  material_1: string;
  material_1_pct: number;
  material_2: string;
  material_2_pct: number;
  weight_g: string;
  country_assembly: string;
  fabric_process: string;
  // Section B
  number_of_references: string;
  price_eur: string;
  business_type: string;
  dead_stock_pct: string;
  making_waste_pct: string;
  // Contact
  contact_name: string;
  brand_name: string;
  contact_email: string;
  product_url: string;
}

export default function FreeDppPage() {
  const [step, setStep] = useState<Step>("product");
  const [showSecondMaterial, setShowSecondMaterial] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    garment_type: "",
    material_1: "",
    material_1_pct: 100,
    material_2: "",
    material_2_pct: 0,
    weight_g: "",
    country_assembly: "",
    fabric_process: "",
    number_of_references: "",
    price_eur: "",
    business_type: "",
    dead_stock_pct: "",
    making_waste_pct: "",
    contact_name: "",
    brand_name: "",
    contact_email: "",
    product_url: "",
  });

  const update = (field: keyof FormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const canContinueProduct = () =>
    form.garment_type &&
    form.material_1 &&
    form.weight_g &&
    form.country_assembly &&
    form.fabric_process;

  const canSubmit = () =>
    form.contact_name && form.brand_name && form.contact_email && turnstileToken;

  async function handleSubmit() {
    if (!canSubmit()) return;
    setSubmitting(true);
    setError(null);

    const materials = [
      { name: form.material_1, share: form.material_1_pct },
    ];
    if (showSecondMaterial && form.material_2 && form.material_2_pct > 0) {
      materials.push({ name: form.material_2, share: form.material_2_pct });
    }

    try {
      const res = await fetch("/api/free-dpp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          garment_type: form.garment_type,
          materials,
          weight_g: parseInt(form.weight_g),
          country_assembly: form.country_assembly,
          fabric_process: form.fabric_process,
          number_of_references: form.number_of_references ? parseInt(form.number_of_references) : null,
          price_eur: form.price_eur ? parseFloat(form.price_eur) : null,
          business_type: form.business_type || null,
          dead_stock_pct: form.dead_stock_pct ? parseFloat(form.dead_stock_pct) : null,
          making_waste_pct: form.making_waste_pct ? parseFloat(form.making_waste_pct) : null,
          contact_name: form.contact_name,
          brand_name: form.brand_name,
          contact_email: form.contact_email,
          product_url: form.product_url || null,
          turnstile_token: turnstileToken,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong");
      }

      setStep("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed");
    }
    setSubmitting(false);
  }

  /* ────────── Shared styles ────────── */

  const inputClasses =
    "w-full rounded-xl border border-envrt-charcoal/15 bg-white px-4 py-3 text-sm text-envrt-charcoal placeholder:text-envrt-muted/60 focus:outline-none focus:ring-2 focus:ring-envrt-teal/30 focus:border-envrt-teal transition-all";

  const labelClasses = "block text-sm font-medium text-envrt-charcoal mb-1.5";

  const selectClasses = `${inputClasses} appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-10`;

  /* ────────── STEP: Product Details ────────── */

  if (step === "product") {
    return (
      <main className="min-h-screen bg-envrt-offwhite py-16 md:py-24">
        <Container className="max-w-lg">
          <FadeUp>
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-semibold text-envrt-charcoal">
                Get your free eco-score DPP
              </h1>
              <p className="mt-3 text-envrt-muted text-base max-w-md mx-auto">
                Tell us about one product. We will generate a Digital Product Passport with its environmental score and send it to you.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <SectionCard className="p-6 md:p-8">
              <div className="space-y-5">
                {/* Garment type */}
                <div>
                  <label className={labelClasses}>Garment type</label>
                  <select
                    className={selectClasses}
                    value={form.garment_type}
                    onChange={(e) => update("garment_type", e.target.value)}
                  >
                    <option value="">Select type</option>
                    {GARMENT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                {/* Main material */}
                <div>
                  <label className={labelClasses}>Main material</label>
                  <select
                    className={selectClasses}
                    value={form.material_1}
                    onChange={(e) => update("material_1", e.target.value)}
                  >
                    <option value="">Select material</option>
                    {MATERIALS.map((group) => (
                      <optgroup key={group.group} label={group.group}>
                        {group.options.map((m) => (
                          <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {/* Material percentage */}
                <div>
                  <label className={labelClasses}>
                    Material percentage
                    <span className="ml-2 text-envrt-muted font-normal">{form.material_1_pct}%</span>
                  </label>
                  <input
                    type="range"
                    min={showSecondMaterial ? 10 : 100}
                    max={100}
                    value={form.material_1_pct}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      update("material_1_pct", val);
                      update("material_2_pct", 100 - val);
                    }}
                    className="w-full accent-envrt-teal"
                    disabled={!showSecondMaterial}
                  />
                  {!showSecondMaterial && (
                    <button
                      type="button"
                      className="mt-2 text-xs text-envrt-teal hover:underline"
                      onClick={() => {
                        setShowSecondMaterial(true);
                        update("material_1_pct", 80);
                        update("material_2_pct", 20);
                      }}
                    >
                      + Add another material
                    </button>
                  )}
                </div>

                {/* Second material (conditional) */}
                {showSecondMaterial && (
                  <div className="pl-4 border-l-2 border-envrt-teal/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className={labelClasses}>Second material ({form.material_2_pct}%)</label>
                      <button
                        type="button"
                        className="text-xs text-red-400 hover:underline"
                        onClick={() => {
                          setShowSecondMaterial(false);
                          update("material_1_pct", 100);
                          update("material_2", "");
                          update("material_2_pct", 0);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                    <select
                      className={selectClasses}
                      value={form.material_2}
                      onChange={(e) => update("material_2", e.target.value)}
                    >
                      <option value="">Select material</option>
                      {MATERIALS.map((group) => (
                        <optgroup key={group.group} label={group.group}>
                          {group.options.map((m) => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                )}

                {/* Weight */}
                <div>
                  <label className={labelClasses}>Weight (grams)</label>
                  <input
                    type="number"
                    className={inputClasses}
                    placeholder="e.g. 180"
                    value={form.weight_g}
                    onChange={(e) => update("weight_g", e.target.value)}
                    min={10}
                    max={5000}
                  />
                  <p className="mt-1 text-xs text-envrt-muted">
                    A t-shirt is ~150g, jeans ~800g, a coat ~1200g
                  </p>
                </div>

                {/* Country of assembly */}
                <div>
                  <label className={labelClasses}>Country of assembly</label>
                  <select
                    className={selectClasses}
                    value={form.country_assembly}
                    onChange={(e) => update("country_assembly", e.target.value)}
                  >
                    <option value="">Select country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* Knit or woven */}
                <div>
                  <label className={labelClasses}>Fabric type</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                        form.fabric_process === "knit"
                          ? "border-envrt-teal bg-envrt-teal/5 text-envrt-teal"
                          : "border-envrt-charcoal/15 text-envrt-charcoal hover:border-envrt-charcoal/30"
                      }`}
                      onClick={() => update("fabric_process", "knit")}
                    >
                      Knit
                    </button>
                    <button
                      type="button"
                      className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                        form.fabric_process === "woven"
                          ? "border-envrt-teal bg-envrt-teal/5 text-envrt-teal"
                          : "border-envrt-charcoal/15 text-envrt-charcoal hover:border-envrt-charcoal/30"
                      }`}
                      onClick={() => update("fabric_process", "woven")}
                    >
                      Woven
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setStep("boost")}
                  className={!canContinueProduct() ? "opacity-50 pointer-events-none" : ""}
                >
                  Continue
                </Button>
              </div>
            </SectionCard>
          </FadeUp>
        </Container>
      </main>
    );
  }

  /* ────────── STEP: Boost Your Score ────────── */

  if (step === "boost") {
    return (
      <main className="min-h-screen bg-envrt-offwhite py-16 md:py-24">
        <Container className="max-w-lg">
          <FadeUp>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-semibold text-envrt-charcoal">
                Help us calculate a more accurate score
              </h2>
              <p className="mt-3 text-envrt-muted text-base max-w-md mx-auto">
                These are optional. Each one helps produce a more representative result for your product.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <SectionCard className="p-6 md:p-8">
              <div className="space-y-5">
                {/* Catalogue size */}
                <div>
                  <label className={labelClasses}>How many products in your catalogue?</label>
                  <select
                    className={selectClasses}
                    value={form.number_of_references}
                    onChange={(e) => update("number_of_references", e.target.value)}
                  >
                    <option value="">Skip</option>
                    {CATALOGUE_SIZES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* Retail price */}
                <div>
                  <label className={labelClasses}>Retail price range (EUR)</label>
                  <select
                    className={selectClasses}
                    value={form.price_eur}
                    onChange={(e) => update("price_eur", e.target.value)}
                  >
                    <option value="">Skip</option>
                    {PRICE_RANGES.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>

                {/* Business size */}
                <div>
                  <label className={labelClasses}>Business size</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                        form.business_type === "small-business"
                          ? "border-envrt-teal bg-envrt-teal/5 text-envrt-teal"
                          : "border-envrt-charcoal/15 text-envrt-charcoal hover:border-envrt-charcoal/30"
                      }`}
                      onClick={() => update("business_type", "small-business")}
                    >
                      Small brand
                    </button>
                    <button
                      type="button"
                      className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                        form.business_type === "large-business-without-services"
                          ? "border-envrt-teal bg-envrt-teal/5 text-envrt-teal"
                          : "border-envrt-charcoal/15 text-envrt-charcoal hover:border-envrt-charcoal/30"
                      }`}
                      onClick={() => update("business_type", "large-business-without-services")}
                    >
                      Large brand
                    </button>
                  </div>
                </div>

                {/* Dead stock */}
                <div>
                  <label className={labelClasses}>Estimated unsold stock</label>
                  <select
                    className={selectClasses}
                    value={form.dead_stock_pct}
                    onChange={(e) => update("dead_stock_pct", e.target.value)}
                  >
                    <option value="">Skip</option>
                    {DEADSTOCK_OPTIONS.map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>

                {/* Cutting waste */}
                <div>
                  <label className={labelClasses}>Estimated cutting waste</label>
                  <select
                    className={selectClasses}
                    value={form.making_waste_pct}
                    onChange={(e) => update("making_waste_pct", e.target.value)}
                  >
                    <option value="">Skip</option>
                    {WASTE_OPTIONS.map((w) => (
                      <option key={w.value} value={w.value}>{w.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="ghost" size="md" onClick={() => setStep("product")}>
                  Back
                </Button>
                <div className="flex gap-3">
                  <Button variant="secondary" size="md" onClick={() => setStep("contact")}>
                    Skip
                  </Button>
                  <Button variant="primary" size="md" onClick={() => setStep("contact")}>
                    Continue
                  </Button>
                </div>
              </div>
            </SectionCard>
          </FadeUp>
        </Container>
      </main>
    );
  }

  /* ────────── STEP: Contact Details ────────── */

  if (step === "contact") {
    return (
      <main className="min-h-screen bg-envrt-offwhite py-16 md:py-24">
        <Container className="max-w-lg">
          <FadeUp>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-semibold text-envrt-charcoal">
                Where should we send your DPP?
              </h2>
              <p className="mt-3 text-envrt-muted text-base max-w-md mx-auto">
                We will email you a link to your eco-score DPP within 24 hours.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <SectionCard className="p-6 md:p-8">
              <div className="space-y-5">
                <div>
                  <label className={labelClasses}>Your name</label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="First name"
                    value={form.contact_name}
                    onChange={(e) => update("contact_name", e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelClasses}>Brand name</label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="Your brand"
                    value={form.brand_name}
                    onChange={(e) => update("brand_name", e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelClasses}>Email</label>
                  <input
                    type="email"
                    className={inputClasses}
                    placeholder="you@brand.com"
                    value={form.contact_email}
                    onChange={(e) => update("contact_email", e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelClasses}>
                    Product URL
                    <span className="ml-2 text-envrt-muted font-normal">(optional)</span>
                  </label>
                  <input
                    type="url"
                    className={inputClasses}
                    placeholder="https://yourbrand.com/products/..."
                    value={form.product_url}
                    onChange={(e) => update("product_url", e.target.value)}
                  />
                  <p className="mt-1 text-xs text-envrt-muted">
                    Helps us verify details and add your product image to the DPP
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <HiddenTurnstile onToken={setTurnstileToken} />
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-8 flex justify-between">
                <Button variant="ghost" size="md" onClick={() => setStep("boost")}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSubmit}
                  className={!canSubmit() || submitting ? "opacity-50 pointer-events-none" : ""}
                >
                  {submitting ? "Submitting..." : "Get my free DPP"}
                </Button>
              </div>
            </SectionCard>
          </FadeUp>
        </Container>
      </main>
    );
  }

  /* ────────── STEP: Done ────────── */

  return (
    <main className="min-h-screen bg-envrt-offwhite py-16 md:py-24">
      <Container className="max-w-lg">
        <FadeUp>
          <SectionCard className="p-8 md:p-12 text-center">
            <div className="text-4xl mb-4">&#10003;</div>
            <h2 className="text-2xl font-semibold text-envrt-charcoal mb-3">
              Request received
            </h2>
            <p className="text-envrt-muted text-base max-w-sm mx-auto">
              We will generate your eco-score DPP and email it to you within 24 hours.
            </p>
            <div className="mt-8">
              <Button href="/" variant="secondary" size="md">
                Back to ENVRT
              </Button>
            </div>
          </SectionCard>
        </FadeUp>
      </Container>
    </main>
  );
}
