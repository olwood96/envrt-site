"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionCard } from "@/components/ui/SectionCard";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/ui/Motion";
import { Badge } from "@/components/ui/Badge";
import { FilterDropdown } from "@/components/collective/FilterDropdown";
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
  { value: "cotton", label: "Cotton" },
  { value: "organic cotton", label: "Organic Cotton" },
  { value: "linen", label: "Linen" },
  { value: "wool", label: "Wool" },
  { value: "silk", label: "Silk" },
  { value: "polyester", label: "Polyester" },
  { value: "recycled polyester", label: "Recycled Polyester" },
  { value: "nylon", label: "Nylon" },
  { value: "recycled nylon", label: "Recycled Nylon" },
  { value: "elastane", label: "Elastane / Spandex" },
  { value: "viscose", label: "Viscose" },
  { value: "lyocell", label: "Lyocell / Tencel" },
  { value: "modal", label: "Modal" },
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
];

const WASTE_OPTIONS = [
  { value: "3", label: "Under 5%" },
  { value: "7", label: "5 - 10%" },
  { value: "12", label: "10 - 15%" },
  { value: "20", label: "15%+" },
];

/* ================================================================
   COMPONENT
   ================================================================ */

type Step = "product" | "boost" | "contact" | "done";

interface FormData {
  garment_name: string;
  garment_type: string;
  material_1: string;
  material_1_pct: number;
  material_2: string;
  material_2_pct: number;
  weight_g: string;
  country_assembly: string;
  fabric_process: string;
  number_of_references: string;
  price_eur: string;
  business_type: string;
  dead_stock_pct: string;
  making_waste_pct: string;
  contact_name: string;
  brand_name: string;
  contact_email: string;
  product_url: string;
}

const inputClasses =
  "w-full rounded-xl border border-envrt-charcoal/10 bg-white px-4 py-3 text-sm text-envrt-charcoal placeholder:text-envrt-muted/60 outline-none transition-colors focus:border-envrt-teal/40 focus:ring-1 focus:ring-envrt-teal/20";

const labelClasses = "block text-xs font-medium text-envrt-muted mb-2";

export default function FreeDppPage() {
  const [step, setStep] = useState<Step>("product");
  const [showSecondMaterial, setShowSecondMaterial] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    garment_name: "",
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

  // Garment name, type, material and weight are required
  const canContinueProduct = () =>
    form.garment_name && form.garment_type && form.material_1 && form.weight_g;

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
          garment_name: form.garment_name,
          garment_type: form.garment_type,
          materials,
          weight_g: parseInt(form.weight_g),
          country_assembly: form.country_assembly || null,
          fabric_process: form.fabric_process || null,
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

  /* ──────── HERO ──────── */

  if (step === "product" || step === "boost" || step === "contact") {
    return (
      <div className="pb-20 pt-28 sm:pt-32">
        <Container className="max-w-[640px]">
          {/* Header */}
          <FadeUp>
            <div className="mb-10 text-center">
              <Badge className="mb-6">Free Eco-Score DPP</Badge>
              <h1 className="text-2xl font-bold tracking-tight text-envrt-charcoal sm:text-3xl">
                Get your free eco-score DPP
              </h1>
              <p className="mx-auto mt-3 max-w-md text-sm text-envrt-muted">
                Tell us about one product. We will generate a Digital Product
                Passport with its environmental score and send it to you.
              </p>
            </div>
          </FadeUp>

          {/* Step 1: Product details */}
          {step === "product" && (
            <FadeUp delay={0.1}>
              <SectionCard>
                <div className="space-y-6 p-6 sm:p-8">
                  {/* Garment name */}
                  <div>
                    <label className={labelClasses}>Product name</label>
                    <input
                      type="text"
                      className={inputClasses}
                      placeholder="e.g. Classic Organic Tee"
                      value={form.garment_name}
                      onChange={(e) => update("garment_name", e.target.value)}
                    />
                  </div>

                  {/* Garment type */}
                  <div>
                    <label className={labelClasses}>Garment type</label>
                    <FilterDropdown
                      label="Select type"
                      value={form.garment_type}
                      options={GARMENT_TYPES}
                      onChange={(v) => update("garment_type", v)}
                      className="w-full"
                    />
                  </div>

                  {/* Main material */}
                  <div>
                    <label className={labelClasses}>Main material</label>
                    <FilterDropdown
                      label="Select material"
                      value={form.material_1}
                      options={MATERIALS}
                      onChange={(v) => update("material_1", v)}
                      className="w-full"
                    />
                  </div>

                  {/* Material percentage + second material */}
                  {showSecondMaterial ? (
                    <div className="space-y-4 rounded-xl border border-envrt-charcoal/5 bg-envrt-cream/30 p-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-envrt-muted">
                          Material split
                          <span className="ml-2 text-envrt-charcoal">
                            {form.material_1_pct}% / {form.material_2_pct}%
                          </span>
                        </label>
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
                      <input
                        type="range"
                        min={10}
                        max={90}
                        value={form.material_1_pct}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          update("material_1_pct", val);
                          update("material_2_pct", 100 - val);
                        }}
                        className="w-full accent-envrt-teal"
                      />
                      <div>
                        <label className={labelClasses}>Second material</label>
                        <FilterDropdown
                          label="Select material"
                          value={form.material_2}
                          options={MATERIALS}
                          onChange={(v) => update("material_2", v)}
                          className="w-full"
                        />
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="text-xs text-envrt-teal hover:underline"
                      onClick={() => {
                        setShowSecondMaterial(true);
                        update("material_1_pct", 80);
                        update("material_2_pct", 20);
                      }}
                    >
                      + Add another material
                    </button>
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
                    <p className="mt-1.5 text-[11px] text-envrt-muted/70">
                      A t-shirt is ~150g, jeans ~800g, a coat ~1200g
                    </p>
                  </div>

                  {/* Country of assembly (optional) */}
                  <div>
                    <label className={labelClasses}>
                      Country of assembly
                      <span className="ml-1 font-normal text-envrt-muted/60">(optional)</span>
                    </label>
                    <FilterDropdown
                      label="Select country"
                      value={form.country_assembly}
                      options={COUNTRIES}
                      onChange={(v) => update("country_assembly", v)}
                      className="w-full"
                    />
                  </div>

                  {/* Knit or woven (optional) */}
                  <div>
                    <label className={labelClasses}>
                      Fabric type
                      <span className="ml-1 font-normal text-envrt-muted/60">(optional)</span>
                    </label>
                    <FilterDropdown
                      label="Skip"
                      value={form.fabric_process}
                      options={[
                        { value: "knit", label: "Knit" },
                        { value: "woven", label: "Woven" },
                      ]}
                      onChange={(v) => update("fabric_process", v)}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex justify-end border-t border-envrt-charcoal/5 px-6 py-4 sm:px-8">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      setStep("boost");
                      window.scrollTo(0, 0);
                    }}
                    className={!canContinueProduct() ? "opacity-40 pointer-events-none" : ""}
                  >
                    Continue
                  </Button>
                </div>
              </SectionCard>
            </FadeUp>
          )}

          {/* Step 2: Boost your score */}
          {step === "boost" && (
            <FadeUp delay={0.1}>
              <SectionCard>
                <div className="space-y-6 p-6 sm:p-8">
                  <p className="text-xs text-envrt-muted">
                    These are optional. Each one helps produce a more accurate result for your product.
                  </p>

                  {/* Catalogue size */}
                  <div>
                    <label className={labelClasses}>How many products in your catalogue?</label>
                    <FilterDropdown
                      label="Skip"
                      value={form.number_of_references}
                      options={CATALOGUE_SIZES}
                      onChange={(v) => update("number_of_references", v)}
                      className="w-full"
                    />
                  </div>

                  {/* Retail price */}
                  <div>
                    <label className={labelClasses}>Retail price range (EUR)</label>
                    <FilterDropdown
                      label="Skip"
                      value={form.price_eur}
                      options={PRICE_RANGES}
                      onChange={(v) => update("price_eur", v)}
                      className="w-full"
                    />
                  </div>

                  {/* Business size */}
                  <div>
                    <label className={labelClasses}>Business size</label>
                    <FilterDropdown
                      label="Skip"
                      value={form.business_type}
                      options={[
                        { value: "small-business", label: "Small brand" },
                        { value: "large-business-without-services", label: "Large brand" },
                      ]}
                      onChange={(v) => update("business_type", v)}
                      className="w-full"
                    />
                  </div>

                  {/* Dead stock */}
                  <div>
                    <label className={labelClasses}>Estimated unsold stock</label>
                    <FilterDropdown
                      label="Skip"
                      value={form.dead_stock_pct}
                      options={DEADSTOCK_OPTIONS}
                      onChange={(v) => update("dead_stock_pct", v)}
                      className="w-full"
                    />
                  </div>

                  {/* Cutting waste */}
                  <div>
                    <label className={labelClasses}>Estimated cutting waste</label>
                    <FilterDropdown
                      label="Skip"
                      value={form.making_waste_pct}
                      options={WASTE_OPTIONS}
                      onChange={(v) => update("making_waste_pct", v)}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-envrt-charcoal/5 px-6 py-4 sm:px-8">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setStep("product"); window.scrollTo(0, 0); }}
                  >
                    Back
                  </Button>
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => { setStep("contact"); window.scrollTo(0, 0); }}
                    >
                      Skip
                    </Button>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => { setStep("contact"); window.scrollTo(0, 0); }}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </SectionCard>
            </FadeUp>
          )}

          {/* Step 3: Contact details */}
          {step === "contact" && (
            <FadeUp delay={0.1}>
              <SectionCard>
                <div className="space-y-5 p-6 sm:p-8">
                  <p className="text-xs text-envrt-muted">
                    We will email you a link to your eco-score DPP within 24 hours.
                  </p>

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
                      <span className="ml-1 font-normal text-envrt-muted/60">(optional)</span>
                    </label>
                    <input
                      type="url"
                      className={inputClasses}
                      placeholder="https://yourbrand.com/products/..."
                      value={form.product_url}
                      onChange={(e) => update("product_url", e.target.value)}
                    />
                    <p className="mt-1.5 text-[11px] text-envrt-muted/70">
                      Helps us verify details and add your product image to the DPP
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <HiddenTurnstile onToken={setTurnstileToken} />
                  </div>

                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                      {error}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-envrt-charcoal/5 px-6 py-4 sm:px-8">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setStep("boost"); window.scrollTo(0, 0); }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleSubmit}
                    className={!canSubmit() || submitting ? "opacity-40 pointer-events-none" : ""}
                  >
                    {submitting ? "Submitting..." : "Get my free DPP"}
                  </Button>
                </div>
              </SectionCard>
            </FadeUp>
          )}
        </Container>
      </div>
    );
  }

  /* ──────── DONE ──────── */

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-5 py-20 text-center">
      <FadeUp>
        <SectionCard className="mx-auto max-w-md p-8 sm:p-12">
          <div className="text-3xl mb-4">&#10003;</div>
          <h2 className="text-xl font-bold tracking-tight text-envrt-charcoal mb-3">
            Request received
          </h2>
          <p className="text-sm text-envrt-muted">
            We will generate your eco-score DPP and email it to you within 24 hours.
          </p>
          <div className="mt-8">
            <Button href="/" variant="secondary" size="md">
              Back to ENVRT
            </Button>
          </div>
        </SectionCard>
      </FadeUp>
    </div>
  );
}
