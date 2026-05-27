import Image from "next/image";
import { Container } from "../ui/Container";
import { FadeUp } from "../ui/Motion";
import {
  ALIGNED_WITH_LOGOS,
  ALIGNED_WITH_STANDARDS,
} from "@/lib/aligned-with";

export function AlignedWithCarousel() {
  return (
    <section aria-labelledby="aligned-with-heading" className="py-12 sm:py-16">
      <Container>
        <FadeUp>
          <h2
            data-aligned-heading
            id="aligned-with-heading"
            className="text-center text-[11px] font-medium uppercase tracking-[0.2em] text-envrt-muted/70"
          >
            Aligned with
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-envrt-muted sm:text-base">
            Our methodology is aligned with EU Product Environmental Footprint
            guidelines, ISO 14040 lifecycle assessment standards and the AWARE
            water scarcity model.
          </p>

          <div
            data-aligned-grid
            className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 sm:mt-14 md:grid-cols-3 md:gap-x-10 md:gap-y-12 lg:grid-cols-6 lg:gap-x-6"
          >
            {ALIGNED_WITH_LOGOS.map((logo) => (
              <div
                key={logo.slug}
                data-aligned-cell
                className="flex flex-col items-center text-center"
              >
                <div className="relative flex h-12 w-full items-center justify-center sm:h-16">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={180}
                    height={72}
                    className="max-h-full w-auto object-contain"
                  />
                </div>
                <span
                  data-aligned-label
                  className="mt-4 text-[11px] font-medium uppercase tracking-widest text-envrt-muted"
                >
                  {logo.label}
                </span>
                <span data-aligned-sr-description className="sr-only">
                  {logo.description}
                </span>
              </div>
            ))}

            {ALIGNED_WITH_STANDARDS.map((standard) => (
              <div
                key={standard.slug}
                data-aligned-cell
                className="flex flex-col items-center text-center"
              >
                <div
                  data-aligned-text-box
                  className="flex h-12 w-full items-center justify-center rounded-xl border border-envrt-charcoal/[0.08] px-3 sm:h-16"
                  aria-label={standard.fullName}
                >
                  <span className="text-base font-semibold tracking-tight text-envrt-charcoal/85 sm:text-lg">
                    {standard.shortName}
                  </span>
                </div>
                <span
                  data-aligned-label
                  className="mt-4 text-[11px] font-medium uppercase tracking-widest text-envrt-muted"
                >
                  {standard.label}
                </span>
                <span data-aligned-sr-description className="sr-only">
                  {standard.description}
                </span>
              </div>
            ))}
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}
