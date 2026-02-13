"use client";

import { Container } from "@/components/ui/Container";
import { FadeUp, StaggerChildren, StaggerItem } from "@/components/ui/Motion";
import { teamMembers } from "@/lib/config";

function MemberCard({ name, role, bio }: { name: string; role: string; bio: string }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-envrt-charcoal/5 bg-white transition-all duration-300 hover:border-envrt-teal/20 hover:shadow-lg">
      <div className="flex items-center justify-center aspect-[4/3] bg-gradient-to-br from-envrt-green/5 to-envrt-teal/10">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-envrt-green/10 text-2xl font-bold text-envrt-green">
          {name.split(" ").map((n) => n[0]).join("")}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-envrt-charcoal">{name}</h3>
        <p className="mt-0.5 text-sm font-medium text-envrt-teal">{role}</p>
        <p className="mt-2 text-sm text-envrt-muted">{bio}</p>
      </div>
    </div>
  );
}

export default function TeamPage() {
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

        <StaggerChildren className="mx-auto mt-14 grid max-w-3xl gap-6 sm:grid-cols-2">
          {teamMembers.map((member) => (
            <StaggerItem key={member.name}>
              <MemberCard name={member.name} role={member.role} bio={member.bio} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Container>
    </div>
  );
}
