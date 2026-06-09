import type { ReactNode } from "react";
import { PageHero, ButtonV3 } from "@/components/v3";
import {
  Eyebrow,
  SectionCorners,
} from "@/components/sections/v3/_shared";
import { FadeUp } from "@/components/ui/Motion";
import { FinalCtaV3 } from "@/components/sections/v3/FinalCtaV3";

// Shared v3 chrome for legal pages (privacy, terms). PageHero at top,
// inline table of contents that links to numbered sections, then each
// section is rendered with v3 prose helpers. Pages pass an array of
// numbered sections with ReactNode bodies.

export type LegalSection = {
  index: string;
  title: string;
  body: ReactNode;
};

type Props = {
  cornerLabel: string;
  pageTitle: string;
  pageBody: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export function LegalShell({
  cornerLabel,
  pageTitle,
  pageBody,
  lastUpdated,
  sections,
}: Props) {
  return (
    <main>
      <PageHero
        eyebrow="Legal"
        heading={
          <>
            {pageTitle}.{" "}
            <span className="text-envrt-brand-black/40">{lastUpdated}.</span>
          </>
        }
        body={pageBody}
        actions={
          <>
            <ButtonV3 href="/preview/v3/contact" variant="primary">
              Contact us<span>→</span>
            </ButtonV3>
            <ButtonV3 href="/preview/v3/about" variant="ghost">
              About ENVRT<span>→</span>
            </ButtonV3>
          </>
        }
        cornerLeft="ENVRT/01"
        cornerRight={cornerLabel}
      />

      <SectionsToc sections={sections} />
      <SectionsBody sections={sections} />

      <FinalCtaV3 />
    </main>
  );
}

function SectionsToc({ sections }: { sections: LegalSection[] }) {
  return (
    <section className="relative bg-envrt-brand-vista py-10 sm:py-14">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-16">
        <FadeUp>
          <ul className="flex flex-wrap gap-2 sm:gap-3">
            {sections.map((s) => (
              <li key={s.index}>
                <a
                  href={`#section-${s.index}`}
                  className="inline-flex items-center gap-2 rounded-full border border-envrt-brand-black/12 bg-white px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/70 transition-colors duration-200 hover:border-envrt-brand-ultramarine/30 hover:text-envrt-brand-ultramarine sm:text-[11px]"
                >
                  <span className="text-envrt-brand-ultramarine">{s.index}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </FadeUp>
      </div>
    </section>
  );
}

function SectionsBody({ sections }: { sections: LegalSection[] }) {
  return (
    <>
      {sections.map((s, i) => (
        <LegalSectionBlock
          key={s.index}
          section={s}
          isLast={i === sections.length - 1}
        />
      ))}
    </>
  );
}

function LegalSectionBlock({
  section,
  isLast,
}: {
  section: LegalSection;
  isLast: boolean;
}) {
  return (
    <section
      id={`section-${section.index}`}
      className={`scroll-mt-28 relative bg-envrt-brand-vista pb-14 sm:pb-16 ${
        isLast ? "" : ""
      }`}
    >
      <SectionCorners
        left={`ENVRT/${section.index}`}
        right={section.title}
      />
      <div className="mx-auto max-w-[900px] px-5 sm:px-8 lg:px-16">
        <div className="border-t border-envrt-brand-black/8 pt-12 sm:pt-14">
          <FadeUp>
            <Eyebrow>{`${section.index} · ${section.title}`}</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="mt-4 font-display text-2xl font-medium leading-tight tracking-tight text-envrt-brand-black sm:text-3xl">
              {section.index}. {section.title}
            </h2>
          </FadeUp>

          <div className="mt-8 space-y-5">{section.body}</div>
        </div>
      </div>
    </section>
  );
}

// ─── Prose helpers ─────────────────────────────────────────────────

export function LegalP({ children }: { children: ReactNode }) {
  return (
    <p className="text-[15px] leading-[1.7] text-envrt-brand-black/80 sm:text-base">
      {children}
    </p>
  );
}

export function LegalH3({ children }: { children: ReactNode }) {
  return (
    <h3 className="pt-4 font-display text-base font-medium leading-tight tracking-tight text-envrt-brand-black sm:text-lg">
      {children}
    </h3>
  );
}

export function LegalUl({ children }: { children: ReactNode }) {
  return <ul className="space-y-2 pl-1">{children}</ul>;
}

export function LegalLi({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-[15px] leading-[1.65] text-envrt-brand-black/80 sm:text-base">
      <span
        aria-hidden
        className="mt-2.5 h-1 w-1 flex-shrink-0 rounded-full bg-envrt-brand-ultramarine/60"
      />
      <span>{children}</span>
    </li>
  );
}

export function LegalStrong({ children }: { children: ReactNode }) {
  return (
    <strong className="font-semibold text-envrt-brand-black">{children}</strong>
  );
}

export function LegalLink({
  href,
  external = false,
  children,
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="text-envrt-brand-ultramarine underline decoration-envrt-brand-ultramarine/30 underline-offset-[5px] transition-colors hover:decoration-envrt-brand-ultramarine"
    >
      {children}
    </a>
  );
}
