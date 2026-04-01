import { Container } from "@/components/ui/Container";

export default function PricingLoading() {
  return (
    <div className="pt-28 pb-16">
      <Container>
        {/* Header */}
        <div className="mx-auto max-w-2xl animate-pulse text-center">
          <div className="mx-auto h-10 w-1/3 rounded-lg bg-envrt-cream" />
          <div className="mx-auto mt-4 h-5 w-2/3 rounded bg-envrt-cream" />
        </div>

        {/* Toggle placeholders */}
        <div className="mt-10 flex animate-pulse items-center justify-center gap-4">
          <div className="h-9 w-28 rounded-full bg-envrt-cream" />
          <div className="h-9 w-36 rounded-full bg-envrt-cream" />
        </div>

        {/* Plan cards */}
        <div className="mt-10 grid animate-pulse gap-5 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col rounded-2xl border border-envrt-charcoal/5 bg-white p-8"
            >
              <div className="h-5 w-20 rounded bg-envrt-cream" />
              <div className="mt-2 h-5 w-32 rounded bg-envrt-cream" />
              <div className="mt-5 h-8 w-24 rounded bg-envrt-cream" />
              <div className="mt-4 h-3 w-full rounded bg-envrt-cream" />
              <div className="mt-2 h-3 w-4/5 rounded bg-envrt-cream" />
              {/* Feature lines */}
              <div className="mt-6 space-y-2.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-envrt-cream" />
                    <div className="h-3 flex-1 rounded bg-envrt-cream" />
                  </div>
                ))}
              </div>
              <div className="mt-8 h-11 rounded-xl bg-envrt-cream" />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
