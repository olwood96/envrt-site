import type { Metadata } from "next";
import { PageHero, ButtonV3 } from "@/components/v3";
import {
  Eyebrow,
  SectionCorners,
} from "@/components/sections/v3/_shared";
import { FadeUp } from "@/components/ui/Motion";
import { FinalCtaV3 } from "@/components/sections/v3/FinalCtaV3";
import { teamMembers } from "@/lib/config";

export const metadata: Metadata = {
  title: "Team v3 preview",
  robots: { index: false, follow: false },
};

type Member = (typeof teamMembers)[number];

export default function TeamV3Page() {
  const founders = teamMembers.filter((m) => m.type === "founder");
  const advisors = teamMembers.filter((m) => m.type === "advisor");

  return (
    <main>
      <PageHero
        tone="lilac"
        eyebrow="Team"
        heading={
          <>
            The people behind ENVRT.{" "}
            <span className="text-envrt-brand-black/40">
              Small team, deep stack.
            </span>
          </>
        }
        body="Two founders running the product. Two advisors shaping the methodology. Environmental engineering, data science, applied AI."
        actions={
          <>
            <ButtonV3 href="/preview/v3/contact" variant="primary">
              Talk to us<span>→</span>
            </ButtonV3>
            <ButtonV3 href="/preview/v3/about" variant="ghost">
              Read the founding story<span>→</span>
            </ButtonV3>
          </>
        }
        cornerLeft="ENVRT/01"
        cornerRight="Team"
      />

      <FoundersSection founders={founders} />
      <AdvisorsSection advisors={advisors} />

      <FinalCtaV3 />
    </main>
  );
}

function FoundersSection({ founders }: { founders: Member[] }) {
  return (
    <section className="relative bg-envrt-brand-vista pb-20 sm:pb-24 lg:pb-32">
      <SectionCorners left="ENVRT/02" right="Founders" />
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-16">
        <div className="border-t border-envrt-brand-black/8 pt-14 sm:pt-16">
          <FadeUp>
            <Eyebrow>02 · Founders</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="mt-4 max-w-2xl font-display text-2xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-3xl lg:text-4xl">
              The two people who own the product end to end.
            </h2>
          </FadeUp>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 sm:gap-8">
            {founders.map((member, i) => (
              <FadeUp key={member.name} delay={0.16 + i * 0.06}>
                <MemberCard member={member} accent />
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AdvisorsSection({ advisors }: { advisors: Member[] }) {
  return (
    <section className="relative bg-white pb-20 sm:pb-24 lg:pb-32">
      <SectionCorners left="ENVRT/03" right="Advisors" />
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-16">
        <div className="border-t border-envrt-brand-black/8 pt-14 sm:pt-16">
          <FadeUp>
            <Eyebrow>03 · Advisors</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="mt-4 max-w-2xl font-display text-2xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-3xl lg:text-4xl">
              The methodology gets pressure-tested here.
            </h2>
          </FadeUp>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 sm:gap-8">
            {advisors.map((member, i) => (
              <FadeUp key={member.name} delay={0.16 + i * 0.06}>
                <MemberCard member={member} />
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MemberCard({ member, accent = false }: { member: Member; accent?: boolean }) {
  return (
    <div
      className={`flex h-full flex-col rounded-3xl border bg-white p-7 transition-colors duration-300 sm:p-9 ${
        accent
          ? "border-envrt-brand-black/12 hover:border-envrt-brand-ultramarine/30"
          : "border-envrt-brand-black/10 hover:border-envrt-brand-ultramarine/25"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl font-medium leading-tight tracking-tight text-envrt-brand-black sm:text-[1.625rem]">
            {member.name}
          </h3>
          <p className="mt-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine sm:text-[11px]">
            {member.role}
          </p>
        </div>
        <span
          aria-hidden
          className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/35 sm:text-[11px]"
        >
          {member.type === "founder" ? "F/01" : "A/01"}
        </span>
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {member.bullets.map((b) => (
          <li
            key={b}
            className="flex items-start gap-2.5 text-sm leading-relaxed text-envrt-brand-black/70 sm:text-[15px]"
          >
            <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-envrt-brand-ultramarine/60" />
            {b}
          </li>
        ))}
      </ul>

      {member.email && (
        <a
          href={`mailto:${member.email}`}
          className="mt-7 inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/70 transition-colors duration-200 hover:text-envrt-brand-ultramarine"
        >
          <span>{member.email}</span>
          <span aria-hidden>→</span>
        </a>
      )}
    </div>
  );
}
