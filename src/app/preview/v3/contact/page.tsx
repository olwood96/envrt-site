"use client";

import { useState } from "react";
import {
  PageHero,
  FaqSnippet,
  ButtonV3,
  Card,
  Input,
  Textarea,
  Label,
} from "@/components/v3";
import { DropdownV3 } from "@/components/v3/DropdownV3";
import {
  Eyebrow,
  SectionCorners,
} from "@/components/sections/v3/_shared";
import { FadeUp } from "@/components/ui/Motion";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";

// /preview/v3/contact — demo booking form. Three fields plus a product
// interest dropdown. Done state replaces the form on submit.

const INTEREST_OPTIONS = [
  { value: "dpp-hub", label: "Starter · Regulation-ready passports" },
  { value: "impact-analyst", label: "Growth · Lifecycle metrics and insights" },
  { value: "sustainability-team", label: "Pro · Full sustainability operations" },
  { value: "not-sure", label: "Not sure yet, I want to explore options" },
];

const faqs = [
  {
    question: "What happens after I book a demo?",
    answer:
      "We email you a calendar link within one working day. The first call is 30 minutes. We walk through the platform on one of your real garments and answer pricing or scope questions.",
  },
  {
    question: "Do I need to prepare anything?",
    answer:
      "No. Helpful but optional: a sample SKU sheet or garment composition data so we can run a quick LCA in the demo.",
  },
  {
    question: "What is the difference between Starter, Growth and Pro?",
    answer:
      "Starter at £149 a month covers up to 50 SKUs with regulation-ready DPPs. Growth at £495 a month adds lifecycle metrics, hotspot detection and analytics, up to 250 SKUs. Pro is custom-priced for high SKU counts and dedicated support.",
  },
  {
    question: "Can I just email instead?",
    answer:
      "Yes. Send anything to info@envrt.com. Same team replies.",
  },
];

export default function ContactV3Page() {
  const [name, setName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = name && brandName && email && interest;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      // Split the single name field into first/last to match the v1
      // API shape. /api/contact persists to Supabase + sends the
      // confirmation email; brandName lands in the company column.
      const [firstName, ...rest] = name.trim().split(/\s+/);
      const lastName = rest.join(" ");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          company: brandName,
          interest,
          message,
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
    return <DoneState />;
  }

  return (
    <main>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://envrt.com" },
          { name: "Contact", url: "https://envrt.com/contact" },
        ]}
      />
      <FAQJsonLd items={faqs} />
      <PageHero
        eyebrow="Contact"
        heading={
          <>
            Book a demo.{" "}
            <span className="text-envrt-brand-black/40">
              Or just send us a question.
            </span>
          </>
        }
        body="Thirty-minute call. We walk through the platform on one of your real garments and answer pricing or scope questions. No sales theatre."
        cornerLeft="ENVRT/01"
        cornerRight="Contact"
      />

      <section className="relative bg-envrt-brand-vista py-16 sm:py-20 lg:py-24">
        <SectionCorners left="ENVRT/02" right="Form" />
        <div className="mx-auto max-w-[640px] px-5 sm:px-8">
          <FadeUp>
            <Card>
              <form onSubmit={handleSubmit} className="space-y-5">
                <Eyebrow>Demo request</Eyebrow>

                <FieldRow>
                  <Label htmlFor="name">Your name</Label>
                  <Input
                    id="name"
                    placeholder="Jane Roberts"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FieldRow>

                <FieldRow>
                  <Label htmlFor="brand">Brand name</Label>
                  <Input
                    id="brand"
                    placeholder="Angry Pablo"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                  />
                </FieldRow>

                <FieldRow>
                  <Label htmlFor="email">Work email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane@angrypablo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FieldRow>

                <FieldRow>
                  <Label htmlFor="interest">What are you interested in?</Label>
                  <DropdownV3
                    id="interest"
                    placeholder="Select an option"
                    value={interest}
                    options={INTEREST_OPTIONS}
                    onChange={setInterest}
                  />
                </FieldRow>

                <FieldRow>
                  <Label htmlFor="message" optional>
                    Anything else we should know?
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="SKU count, sustainability priorities, regulatory deadlines, anything that helps"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </FieldRow>

                {error && (
                  <p className="rounded-xl bg-envrt-brand-crimson/10 px-4 py-3 text-sm text-envrt-brand-crimson">
                    {error}
                  </p>
                )}

                <div className="pt-2">
                  <ButtonV3
                    type="submit"
                    variant="primary"
                    disabled={!canSubmit || submitting}
                    className={`w-full ${!canSubmit || submitting ? "opacity-60" : ""}`}
                  >
                    {submitting ? "Sending…" : "Book my demo"}
                    <span>{submitting ? "" : "→"}</span>
                  </ButtonV3>
                  <p className="mt-3 text-center text-xs text-envrt-brand-black/55">
                    We reply within one working day. No marketing list.
                  </p>
                </div>
              </form>
            </Card>
          </FadeUp>
        </div>
      </section>

      <FaqSnippet
        eyebrow="Common questions"
        heading="About booking a demo"
        items={faqs}
        ctaHref="/preview/v3/faq"
        ctaLabel="See all FAQs"
      />
    </main>
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

function DoneState() {
  return (
    <main>
      <PageHero
        eyebrow="Contact"
        heading={
          <>
            Got it.{" "}
            <span className="text-envrt-brand-black/40">
              We will reply within one working day.
            </span>
          </>
        }
        body="Thanks for reaching out. The same person who answers replies. No marketing chain emails."
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
