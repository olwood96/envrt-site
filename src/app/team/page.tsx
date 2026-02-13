"use client";

import { Container } from "@/components/ui/Container";
import { FadeUp, StaggerChildren, StaggerItem } from "@/components/ui/Motion";
import { teamMembers } from "@/lib/config";

function MemberCard({ member }: { member: (typeof teamMembers)[number] }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-envrt-charcoal/5 bg-white p-6 sm:p-8 transition-all duration-300 hover:border-envrt-teal/20 hover:shadow-lg">
      <div>
        <h3 className="text-xl font-bold text-envrt-charcoal">{member.name}</h3>
        <p className="mt-1 text-sm font-semibold text-envrt-teal">{member.role}</p>
      </div>

      <ul className="mt-5 flex-1 space-y-3">
        {member.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2.5 text-sm leading-relaxed text-envrt-muted">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-envrt-teal/50" />
            {b}
          </li>
        ))}
      </ul>

      {member.email && (
        <a
          href={`mailto:${member.email}`}
          className="mt-6 inline-block text-sm font-medium text-envrt-charcoal underline decoration-envrt-teal/40 underline-offset-4 transition-colors hover:text-envrt-teal"
        >
          {member.email}
        </a>
      )}
    </div>
  );
}

export default function TeamPage() {
  const founders = teamMembers.filter((m) => m.type === "founder");
  const advisors = teamMembers.filter((m) => m.type === "advisor");

  return (
    <div className="pt-28 pb-16">
      <Container>
        <FadeUp>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-envrt-charcoal sm:text-5xl">
              Our team
            </h1>
            <p className="mt-4 text-base text-envrt-muted sm:text-lg">
              A small team with deep expertise in sustainability, AI, and fashion technology.
            </p>
          </div>
        </FadeUp>

        <StaggerChildren className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-2">
          {founders.map((member) => (
            <StaggerItem key={member.name}>
              <MemberCard member={member} />
            </StaggerItem>
          ))}
        </StaggerChildren>

        <FadeUp delay={0.15}>
          <p className="mx-auto mt-16 max-w-4xl text-xs font-medium uppercase tracking-widest text-envrt-teal">
            Advisors
          </p>
        </FadeUp>
        <StaggerChildren className="mx-auto mt-4 grid max-w-4xl gap-6 sm:grid-cols-2">
          {advisors.map((member) => (
            <StaggerItem key={member.name}>
              <MemberCard member={member} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Container>
    </div>
  );
}
