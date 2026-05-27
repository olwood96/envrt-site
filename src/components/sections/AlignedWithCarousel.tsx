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
            className="text-center text-xs font-medium uppercase tracking-[0.2em] text-envrt-muted/70"
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
                    sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw"
                    className="max-h-full w-auto object-contain"
                  />
                </div>
                <span
                  data-aligned-label
                  className="mt-4 text-xs font-medium uppercase tracking-widest text-envrt-muted"
                >
                  {logo.label}
                </span>
                <span data-aligned-sr-description className="sr-only">
                  {logo.description}
                </span>
              </div>
            ))}
          </div>

          <p
            data-aligned-references
            className="mx-auto mt-10 max-w-3xl text-center text-xs font-medium uppercase leading-relaxed tracking-[0.2em] text-envrt-muted/70 sm:mt-12"
          >
            Referencing
            {ALIGNED_WITH_STANDARDS.map((standard) => (
              <span key={standard.slug}>
                <span aria-hidden="true"> · </span>
                {standard.shortName}
                <span className="sr-only"> ({standard.description})</span>
              </span>
            ))}
          </p>
        </FadeUp>
      </Container>
    </section>
  );
}
