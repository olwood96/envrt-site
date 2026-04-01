import type { CollectiveProductionStage } from "@/lib/collective/types";

interface Props {
  stages: CollectiveProductionStage[];
}

export function CollectiveProductionJourney({ stages }: Props) {
  return (
    <div className="rounded-2xl border border-envrt-charcoal/5 bg-white p-5 sm:p-6">
      <p className="text-[10px] font-medium uppercase tracking-widest text-envrt-muted">
        Production Journey
      </p>
      <div className="mt-4 flex flex-wrap items-start gap-2 sm:flex-nowrap sm:gap-0">
        {stages.map((stage, i) => (
          <div key={stage.key} className="flex items-start">
            <div className="flex flex-col items-center rounded-xl border border-envrt-charcoal/5 bg-envrt-cream/40 px-3 py-2 sm:px-4">
              <span className="text-[10px] font-medium uppercase tracking-widest text-envrt-muted">
                {stage.label}
              </span>
              <span className="mt-1 text-sm font-medium text-envrt-charcoal">
                {stage.country ?? "—"}
              </span>
            </div>
            {i < stages.length - 1 && (
              <div className="hidden items-center px-1.5 pt-4 text-envrt-charcoal/20 sm:flex">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
