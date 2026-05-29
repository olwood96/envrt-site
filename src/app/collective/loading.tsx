import { Container } from "@/components/ui/Container";
import { StitchingLoader } from "@/components/ui/StitchingLoader";

export default function CollectiveLoading() {
  return (
    <div className="pt-28 pb-16">
      <Container>
        {/* Header (static placeholders, no pulse) */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto h-4 w-28 rounded bg-envrt-cream" />
          <div className="mx-auto mt-4 h-10 w-3/4 rounded-lg bg-envrt-cream" />
          <div className="mx-auto mt-4 h-5 w-1/2 rounded bg-envrt-cream" />
        </div>

        {/* Filter bar placeholders */}
        <div className="mt-12 flex flex-wrap items-center gap-3">
          <div className="h-9 w-44 rounded-xl bg-envrt-cream" />
          <div className="h-9 w-32 rounded-xl bg-envrt-cream" />
          <div className="h-9 w-32 rounded-xl bg-envrt-cream" />
          <div className="h-9 w-32 rounded-xl bg-envrt-cream" />
          <div className="h-9 w-36 rounded-xl bg-envrt-cream" />
          <div className="ml-auto h-4 w-20 rounded bg-envrt-cream" />
        </div>

        {/* Single calm loading cue */}
        <StitchingLoader label="Loading the collective" className="py-8" />

        {/* Card grid placeholders (static, no pulse) */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col rounded-2xl border border-envrt-charcoal/5 bg-white"
            >
              <div className="aspect-[4/3] rounded-t-2xl bg-envrt-cream/60" />
              <div className="space-y-3 px-5 pb-5 pt-4">
                <div className="h-3 w-16 rounded bg-envrt-cream" />
                <div className="h-4 w-3/4 rounded bg-envrt-cream" />
                <div className="h-3 w-1/3 rounded bg-envrt-cream" />
                <div className="h-3 w-2/3 rounded bg-envrt-cream" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
