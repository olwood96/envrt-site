"use client";

import { useState } from "react";
import {
  PageHero,
  FaqSnippet,
  ButtonV3,
  Card,
  Input,
  Select,
  Label,
  WizardStepper,
} from "@/components/v3";
import {
  Eyebrow,
  SectionCorners,
} from "@/components/sections/v3/_shared";
import { FadeUp } from "@/components/ui/Motion";

// /preview/v3/free-dpp — three-step wizard. Submit one garment, receive
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
      "A fully calculated DPP with CO₂e, water scarcity, French Eco-Score and supply chain reconstruction across the tiers you provide. Hosted at a permanent URL with a QR code. Audit-ready exports in PDF, CSV and JSON.",
  },
  {
    question: "Do I need a credit card?",
    answer:
      "No. The free DPP is genuinely free. We use it to demonstrate the platform on a real garment of yours. No commitment.",
  },
  {
    question: "How long does it take?",
    answer:
      "We aim to return your DPP within 1 working day. If you submit more detail in Step 2, the DPP is richer.",
  },
  {
    question: "What happens after I receive it?",
    answer:
      "Use the DPP however you like. If you want more garments calculated, you can move to a paid plan from £149 a month. No sales pressure.",
  },
];

export default function FreeDppV3Page() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // Submit handler stub. Reuse existing /api/free-dpp endpoint.
      await new Promise((r) => setTimeout(r, 800));
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
        ctaHref="/preview/v3/faq"
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
          <Select
            id="garment_type"
            value={form.garment_type}
            onChange={(e) => update("garment_type", e.target.value)}
          >
            <option value="">Select type</option>
            {GARMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </FieldRow>

        <FieldRow>
          <Label htmlFor="material_1">Main material</Label>
          <Select
            id="material_1"
            value={form.material_1}
            onChange={(e) => update("material_1", e.target.value)}
          >
            <option value="">Select material</option>
            {MATERIALS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
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
          <Select
            id="country_assembly"
            value={form.country_assembly}
            onChange={(e) => update("country_assembly", e.target.value)}
          >
            <option value="">Select country</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </FieldRow>

        <FieldRow>
          <Label htmlFor="business_type" optional>
            Business type
          </Label>
          <Select
            id="business_type"
            value={form.business_type}
            onChange={(e) => update("business_type", e.target.value)}
          >
            <option value="">Select business type</option>
            {BUSINESS_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
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
}: {
  form: FormData;
  update: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  canSubmit: boolean;
  submitting: boolean;
  error: string | null;
  onBack: () => void;
  onSubmit: () => void;
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
            <ButtonV3 href="/preview/v3/platform" variant="primary">
              See the full platform<span>→</span>
            </ButtonV3>
            <ButtonV3 href="/preview/v3/pricing" variant="ghost">
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
