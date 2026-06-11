import type { Metadata } from "next";
import { PageHero, ButtonV3 } from "@/components/v3";
import {
  Eyebrow,
  SectionCorners,
} from "@/components/sections/v3/_shared";
import { FadeUp } from "@/components/ui/Motion";

export const metadata: Metadata = {
  title: "Payment confirmed v3 preview",
  robots: { index: false, follow: false },
};

const STEPS = [
  {
    index: "01",
    title: "Check your email",
    body: "We have sent you a link to set up your dashboard account.",
  },
  {
    index: "02",
    title: "Set your password",
    body: "Create your login credentials for the ENVRT dashboard.",
  },
  {
    index: "03",
    title: "Set up your brand",
    body: "Enter your brand details and first collection name.",
  },
  {
    index: "04",
    title: "We review and activate",
    body: "Our team reviews your details and switches your workspace on.",
  },
];

export default function PaymentSuccessV3Page() {
  return (
    <main>
      <PageHero
        eyebrow="Payment confirmed"
        heading={
          <>
            You&apos;re in.{" "}
            <span className="text-envrt-brand-black/40">
              Subscription active.
            </span>
          </>
        }
        body="Thanks for joining ENVRT. Your subscription is now active. Check your email for a link to finish setting up your dashboard."
        actions={
          <>
            <ButtonV3 href="/" variant="primary">
              Back to home<span>→</span>
            </ButtonV3>
            <ButtonV3 href="/contact" variant="ghost">
              Need help? Contact us<span>→</span>
            </ButtonV3>
          </>
        }
        cornerLeft="ENVRT/01"
        cornerRight="Confirmed"
      />

      <NextStepsSection />
      <SupportSection />
    </main>
  );
}

function NextStepsSection() {
  return (
    <section className="relative bg-envrt-brand-vista pb-20 sm:pb-24 lg:pb-32">
      <SectionCorners left="ENVRT/02" right="What happens next" />
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-16">
        <div className="border-t border-envrt-brand-black/8 pt-14 sm:pt-16">
          <FadeUp>
            <Eyebrow>02 · What happens next</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="mt-4 max-w-2xl font-display text-2xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-3xl lg:text-4xl">
              Four short steps to a live workspace.
            </h2>
          </FadeUp>

          <ol className="mt-12 grid gap-5 sm:grid-cols-2 sm:gap-6">
            {STEPS.map((step, i) => (
              <FadeUp key={step.index} delay={0.16 + i * 0.05}>
                <li className="flex h-full gap-5 rounded-2xl border border-envrt-brand-black/10 bg-white p-6 sm:p-7">
                  <span
                    aria-hidden
                    className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine sm:text-[11px]"
                  >
                    {step.index}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-medium leading-tight tracking-tight text-envrt-brand-black sm:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-envrt-brand-black/70 sm:text-[15px]">
                      {step.body}
                    </p>
                  </div>
                </li>
              </FadeUp>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function SupportSection() {
  return (
    <section className="relative bg-envrt-brand-vista pb-20 sm:pb-24 lg:pb-32">
      <SectionCorners left="ENVRT/03" right="Support" />
      <div className="mx-auto max-w-[900px] px-5 sm:px-8 lg:px-16">
        <div className="border-t border-envrt-brand-black/8 pt-14 sm:pt-16">
          <FadeUp>
            <Eyebrow>03 · Did the email not arrive?</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="mt-4 font-display text-2xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-3xl">
              Check your spam folder, then reach out.
            </h2>
          </FadeUp>
          <FadeUp delay={0.16}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-envrt-brand-black/70 sm:text-lg">
              If the confirmation email has not arrived after five minutes,
              check spam and promotions. If it still is not there, message us
              and we will resend it within the same working day.
            </p>
          </FadeUp>
          <FadeUp delay={0.24}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonV3 href="/contact" variant="primary">
                Contact us<span>→</span>
              </ButtonV3>
              <ButtonV3 href="mailto:info@envrt.com" variant="ghost">
                info@envrt.com<span>→</span>
              </ButtonV3>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
