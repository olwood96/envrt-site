import { Container } from "@/components/ui/Container";

export default function InsightLoading() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-3xl animate-pulse">
          {/* Title */}
          <div className="h-10 w-3/4 rounded-lg bg-envrt-cream" />
          <div className="mt-4 h-5 w-1/2 rounded bg-envrt-cream" />

          {/* Meta */}
          <div className="mt-6 flex gap-4">
            <div className="h-4 w-24 rounded bg-envrt-cream" />
            <div className="h-4 w-20 rounded bg-envrt-cream" />
          </div>

          {/* Content lines */}
          <div className="mt-12 space-y-4">
            <div className="h-4 w-full rounded bg-envrt-cream" />
            <div className="h-4 w-5/6 rounded bg-envrt-cream" />
            <div className="h-4 w-full rounded bg-envrt-cream" />
            <div className="h-4 w-4/6 rounded bg-envrt-cream" />
            <div className="mt-8 h-4 w-full rounded bg-envrt-cream" />
            <div className="h-4 w-5/6 rounded bg-envrt-cream" />
            <div className="h-4 w-3/4 rounded bg-envrt-cream" />
          </div>
        </div>
      </Container>
    </section>
  );
}
