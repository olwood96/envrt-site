"use client";

import { useState } from "react";
import {
  PageHero,
  FaqSnippet,
  ButtonV3,
  Card,
  Input,
  Label,
  WizardStepper,
} from "@/components/v3";
import { DropdownV3 } from "@/components/v3/DropdownV3";

function toOptions(list: readonly string[], placeholder: string) {
  return [
    { value: "", label: placeholder },
    ...list.map((v) => ({ value: v, label: v })),
  ];
}
import {
  Eyebrow,
  SectionCorners,
} from "@/components/sections/v3/_shared";
import { FadeUp } from "@/components/ui/Motion";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { HiddenTurnstile } from "@/components/ui/TurnstileWidget";

// //free-dpp — three-step wizard. Submit one garment, receive
// a regulation-ready DPP within a day. Brand-aligned form primitives,
// inline progress indicator, FAQ snippet at the bottom.

const GARMENT_TYPES = [
  "T-shirt",
  "Long-sleeve top",
  "Hoodie",
  "Sweatshirt",
  "Jeans",
  "Trousers",
  "Shorts",
  "Skirt",
  "Dress",
  "Jacket",
  "Coat",
  "Knitwear",
  "Other",
];

const MATERIALS = [
  "Cotton (conventional)",
  "Cotton (organic)",
  "Polyester (virgin)",
  "Polyester (recycled)",
  "Wool",
  "Cashmere",
  "Linen",
  "Hemp",
  "Viscose",
  "Lyocell (TENCEL)",
  "Modal",
  "Elastane",
  "Polyamide (nylon)",
  "Acrylic",
  "Silk",
];

const COUNTRIES = [
  "Portugal",
  "Turkey",
  "Italy",
  "Bangladesh",
  "China",
  "India",
  "Vietnam",
  "Spain",
  "France",
  "United Kingdom",
  "Tunisia",
  "Morocco",
  "Romania",
  "Other",
];

const BUSINESS_TYPES = [
  "Direct-to-consumer brand",
  "Wholesale brand",
  "Retailer",
  "Manufacturer",
  "Other",
];

type FormData = {
  garment_name: string;
  garment_type: string;
  material_1: string;
  weight_g: string;
  country_assembly: string;
  business_type: string;
  number_of_references: string;
  contact_name: string;
  brand_name: string;
  contact_email: string;
};

const STEPS = ["Garment", "Context", "Contact"];

const faqs = [
  {
    question: "What do I get back?",
    answer:
      "A live eco-score DPP for one of your garments, based on the official French environmental labelling methodology. Hosted at a permanent URL with a QR code.",
  },
  {
    question: "Do I need a credit card?",
    answer:
      "No. The free DPP is genuinely free. We use it to demonstrate the platform on a real garment of yours. No commitment.",
  },
  {
    question: "How long does it take?",
    answer:
      "We will email you a link to your live eco-score DPP within 24 hours of submitting.",
  },
  {
    question: "What if I want full DPPs for my whole collection?",
    answer:
      "Get in touch after receiving your trial DPP. We offer full lifecycle DPPs with supply chain mapping, emissions data and water impact. Paid plans start from £149 a month.",
  },
];

export default function FreeDppV3Page() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");

  const [form, setForm] = useState<FormData>({
    garment_name: "",
    garment_type: "",
    material_1: "",
    weight_g: "",
    country_assembly: "",
    business_type: "",
    number_of_references: "",
    contact_name: "",
    brand_name: "",
    contact_email: "",
  });

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const weightNum = parseInt(form.weight_g) || 0;
  const canAdvanceStep0 =
    form.garment_name &&
    form.garment_type &&
    form.material_1 &&
    weightNum >= 10 &&
    weightNum <= 5000;
  const canAdvanceStep1 = true; // Step 2 is optional context
  const canSubmit =
    form.contact_name && form.brand_name && form.contact_email;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/free-dpp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          garment_name: form.garment_name,
          garment_type: form.garment_type,
          materials: [{ name: form.material_1, share: 100 }],
          weight_g: weightNum,
          country_assembly: form.country_assembly,
          fabric_process: "",
          number_of_references: form.number_of_references
            ? parseInt(form.number_of_references)
            : null,
          price_eur: null,
          business_type: form.business_type || null,
          dead_stock_pct: null,
          making_waste_pct: null,
          contact_name: form.contact_name,
          brand_name: form.brand_name,
          contact_email: form.contact_email,
          product_url: null,
          turnstile_token: turnstileToken,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Submission failed");
      }
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed");
    }
    setSubmitting(false);
  }

  if (done) {
    return <DoneState brandName={form.brand_name} />;
  }

  return (
    <main>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://envrt.com" },
          { name: "Free DPP", url: "https://envrt.com/free-dpp" },
        ]}
      />
      <FAQJsonLd items={faqs} />
      <PageHero
        eyebrow="Free DPP"
        heading={
          <>
            Submit one garment.{" "}
            <span className="text-envrt-brand-black/40">
              Get a regulation-ready passport back.
            </span>
          </>
        }
        body="Three short steps. Tell us about the garment, add any context you have on the supply chain and leave us your contact details. We calculate the lifecycle assessment, generate the DPP and return it within a working day. No card required."
        cornerLeft="ENVRT/01"
        cornerRight="Free DPP"
      />

      <section className="relative bg-envrt-brand-vista py-16 sm:py-20 lg:py-24">
        <SectionCorners left="ENVRT/02" right={`Step ${step + 1} of ${STEPS.length}`} />
        <div className="mx-auto max-w-[640px] px-5 sm:px-8">
          <FadeUp>
            <WizardStepper steps={STEPS} current={step} />
          </FadeUp>

          <FadeUp delay={0.08}>
            <Card className="mt-10 sm:mt-12">
              {step === 0 && (
                <Step0
                  form={form}
                  update={update}
                  canAdvance={Boolean(canAdvanceStep0)}
                  onNext={() => setStep(1)}
                />
              )}
              {step === 1 && (
                <Step1
                  form={form}
                  update={update}
                  canAdvance={canAdvanceStep1}
                  onBack={() => setStep(0)}
                  onNext={() => setStep(2)}
                />
              )}
              {step === 2 && (
                <Step2
                  form={form}
                  update={update}
                  canSubmit={Boolean(canSubmit)}
                  submitting={submitting}
                  error={error}
                  onBack={() => setStep(1)}
                  onSubmit={handleSubmit}
                  onTurnstileToken={setTurnstileToken}
                />
              )}
            </Card>
          </FadeUp>
        </div>
      </section>

      <FaqSnippet
        eyebrow="Common questions"
        heading="About the free DPP"
        items={faqs}
        ctaHref="/faq"
        ctaLabel="See all FAQs"
      />
    </main>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────

function Step0({
  form,
  update,
  canAdvance,
  onNext,
}: {
  form: FormData;
  update: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  canAdvance: boolean;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <Eyebrow>Step 1 · Garment</Eyebrow>
      <h2 className="font-display text-2xl font-medium tracking-tight text-envrt-brand-black sm:text-3xl">
        Tell us about the garment.
      </h2>
      <p className="text-sm leading-relaxed text-envrt-brand-black/65">
        The four core fields below are what we need to calculate the
        lifecycle assessment. Step 2 adds supply chain context if you have
        it, but is optional.
      </p>

      <div className="space-y-5 pt-2">
        <FieldRow>
          <Label htmlFor="garment_name">Product name</Label>
          <Input
            id="garment_name"
            placeholder="e.g. Classic Organic Tee"
            value={form.garment_name}
            onChange={(e) => update("garment_name", e.target.value)}
          />
        </FieldRow>

        <FieldRow>
          <Label htmlFor="garment_type">Garment type</Label>
          <DropdownV3
            id="garment_type"
            placeholder="Select type"
            value={form.garment_type}
            options={toOptions(GARMENT_TYPES, "Select type")}
            onChange={(v) => update("garment_type", v)}
          />
        </FieldRow>

        <FieldRow>
          <Label htmlFor="material_1">Main material</Label>
          <DropdownV3
            id="material_1"
            placeholder="Select material"
            value={form.material_1}
            options={toOptions(MATERIALS, "Select material")}
            onChange={(v) => update("material_1", v)}
          />
        </FieldRow>

        <FieldRow>
          <Label htmlFor="weight_g">Garment weight</Label>
          <div className="flex items-center gap-3">
            <Input
              id="weight_g"
              type="number"
              inputMode="numeric"
              min={10}
              max={5000}
              placeholder="320"
              value={form.weight_g}
              onChange={(e) => update("weight_g", e.target.value)}
              className="max-w-[180px]"
            />
            <span className="font-mono text-xs text-envrt-brand-black/55">
              grams
            </span>
          </div>
        </FieldRow>
      </div>

      <div className="flex justify-end pt-4">
        <ButtonV3
          variant="primary"
          onClick={onNext}
          disabled={!canAdvance}
          className={!canAdvance ? "opacity-40" : ""}
        >
          Continue<span>→</span>
        </ButtonV3>
      </div>
    </div>
  );
}

function Step1({
  form,
  update,
  onBack,
  onNext,
}: {
  form: FormData;
  update: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  canAdvance: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <Eyebrow>Step 2 · Context</Eyebrow>
      <h2 className="font-display text-2xl font-medium tracking-tight text-envrt-brand-black sm:text-3xl">
        Anything else you can share?
      </h2>
      <p className="text-sm leading-relaxed text-envrt-brand-black/65">
        Each extra field improves the accuracy of your DPP. All optional.
      </p>

      <div className="space-y-5 pt-2">
        <FieldRow>
          <Label htmlFor="country_assembly" optional>
            Country of assembly
          </Label>
          <DropdownV3
            id="country_assembly"
            placeholder="Select country"
            value={form.country_assembly}
            options={toOptions(COUNTRIES, "Select country")}
            onChange={(v) => update("country_assembly", v)}
          />
        </FieldRow>

        <FieldRow>
          <Label htmlFor="business_type" optional>
            Business type
          </Label>
          <DropdownV3
            id="business_type"
            placeholder="Select business type"
            value={form.business_type}
            options={toOptions(BUSINESS_TYPES, "Select business type")}
            onChange={(v) => update("business_type", v)}
          />
        </FieldRow>

        <FieldRow>
          <Label htmlFor="number_of_references" optional>
            SKU count in your collection
          </Label>
          <Input
            id="number_of_references"
            type="number"
            inputMode="numeric"
            min={1}
            placeholder="e.g. 60"
            value={form.number_of_references}
            onChange={(e) => update("number_of_references", e.target.value)}
            className="max-w-[180px]"
          />
        </FieldRow>
      </div>

      <div className="flex items-center justify-between pt-4">
        <ButtonV3 variant="ghost" onClick={onBack}>
          <span>←</span>Back
        </ButtonV3>
        <ButtonV3 variant="primary" onClick={onNext}>
          Continue<span>→</span>
        </ButtonV3>
      </div>
    </div>
  );
}

function Step2({
  form,
  update,
  canSubmit,
  submitting,
  error,
  onBack,
  onSubmit,
  onTurnstileToken,
}: {
  form: FormData;
  update: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  canSubmit: boolean;
  submitting: boolean;
  error: string | null;
  onBack: () => void;
  onSubmit: () => void;
  onTurnstileToken: (token: string) => void;
}) {
  return (
    <div className="space-y-6">
      <Eyebrow>Step 3 · Contact</Eyebrow>
      <h2 className="font-display text-2xl font-medium tracking-tight text-envrt-brand-black sm:text-3xl">
        Where should we send the DPP?
      </h2>
      <p className="text-sm leading-relaxed text-envrt-brand-black/65">
        We will email you a link to the hosted passport plus the audit
        exports. No follow-up sales emails unless you ask.
      </p>

      <div className="space-y-5 pt-2">
        <FieldRow>
          <Label htmlFor="contact_name">Your name</Label>
          <Input
            id="contact_name"
            placeholder="Jane Roberts"
            value={form.contact_name}
            onChange={(e) => update("contact_name", e.target.value)}
          />
        </FieldRow>

        <FieldRow>
          <Label htmlFor="brand_name">Brand name</Label>
          <Input
            id="brand_name"
            placeholder="Angry Pablo"
            value={form.brand_name}
            onChange={(e) => update("brand_name", e.target.value)}
          />
        </FieldRow>

        <FieldRow>
          <Label htmlFor="contact_email">Work email</Label>
          <Input
            id="contact_email"
            type="email"
            placeholder="jane@angrypablo.com"
            value={form.contact_email}
            onChange={(e) => update("contact_email", e.target.value)}
          />
        </FieldRow>
      </div>

      {error && (
        <p className="rounded-xl bg-envrt-brand-crimson/10 px-4 py-3 text-sm text-envrt-brand-crimson">
          {error}
        </p>
      )}

      <HiddenTurnstile onToken={onTurnstileToken} />

      <div className="flex items-center justify-between pt-4">
        <ButtonV3 variant="ghost" onClick={onBack} disabled={submitting}>
          <span>←</span>Back
        </ButtonV3>
        <ButtonV3
          variant="primary"
          onClick={onSubmit}
          disabled={!canSubmit || submitting}
          className={!canSubmit || submitting ? "opacity-60" : ""}
        >
          {submitting ? "Submitting…" : "Get my free DPP"}
          <span>{submitting ? "" : "→"}</span>
        </ButtonV3>
      </div>
    </div>
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

// ─── Done state ──────────────────────────────────────────────────────────

function DoneState({ brandName }: { brandName: string }) {
  return (
    <main>
      <PageHero
        eyebrow="Free DPP"
        heading={
          <>
            Submitted.{" "}
            <span className="text-envrt-brand-black/40">
              Your DPP is on the way.
            </span>
          </>
        }
        body={`Thanks ${brandName}. We will email the hosted DPP plus audit exports within 1 working day.`}
        actions={
          <>
            <ButtonV3 href="/platform" variant="primary">
              See the full platform<span>→</span>
            </ButtonV3>
            <ButtonV3 href="/pricing" variant="ghost">
              See pricing<span>→</span>
            </ButtonV3>
          </>
        }
        cornerLeft="ENVRT/01"
        cornerRight="Done"
      />
    </main>
  );
}
