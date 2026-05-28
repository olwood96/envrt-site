import { formatReceiptDate, generateReference } from "@/lib/roi-receipt";

type Market = "uk" | "eu" | "both";

interface RoiResultsReceiptProps {
  envrtCost: number;
  envrtPlan: string;
  consultantCost: number;
  inhouseCost: number;
  savingVsConsultant: number;
  savingVsInhouse: number;
  maxSaving: number;
  skuCount: number;
  market: Market;
  brandName?: string | null;
  /** Injectable for tests; defaults to "now" at first render. */
  date?: Date;
}

function marketLabel(market: Market): string {
  if (market === "uk") return "UK";
  if (market === "eu") return "EU";
  return "UK + EU";
}

function fmtCurrency(n: number): string {
  return `£${n.toLocaleString("en-GB")}`;
}

function skuLabel(count: number): string {
  return `${count} ${count === 1 ? "SKU" : "SKUs"}`;
}

/**
 * Till-receipt presentation of the ROI calculator results.
 *
 * Replaces the previous animated savings headline plus animated cost bars
 * with a single calm document: itemised costs, itemised savings, total at
 * the foot. Reads as a boutique receipt rather than a SaaS dashboard.
 *
 * All animation removed — the form is the content.
 */
export function RoiResultsReceipt({
  envrtCost,
  envrtPlan,
  consultantCost,
  inhouseCost,
  savingVsConsultant,
  savingVsInhouse,
  maxSaving,
  skuCount,
  market,
  brandName,
  date = new Date(),
}: RoiResultsReceiptProps) {
  const reference = generateReference(
    date,
    envrtCost,
    consultantCost,
    inhouseCost,
    skuCount,
  );
  const displayDate = formatReceiptDate(date);

  return (
    <div className="receipt-paper mx-auto max-w-[400px] px-7 pb-10 pt-7 font-mono text-[11px] tabular-nums text-envrt-charcoal">
      {/* Header */}
      <div className="text-center">
        <p className="text-sm font-bold tracking-[0.4em]">E N V R T</p>
        <p className="mt-1 text-[10px] tracking-[0.25em] text-envrt-muted">
          COST COMPARISON
        </p>
      </div>

      <DoubleRule />

      {/* Meta block */}
      <div className="space-y-1">
        <Row label="Reference" value={reference} />
        <Row label="Date" value={displayDate} />
        {brandName ? <Row label="Brand" value={brandName} /> : null}
        <Row label="Products" value={skuLabel(skuCount)} />
        <Row label="Market" value={marketLabel(market)} />
      </div>

      <DashedRule />

      {/* Annual cost */}
      <SectionTitle>ANNUAL COST</SectionTitle>
      <div className="mt-2 space-y-1.5">
        <Row label="Consultant approach" value={fmtCurrency(consultantCost)} />
        <Row label="In-house hire" value={fmtCurrency(inhouseCost)} />
        <Row label={`ENVRT (${envrtPlan} plan)`} value={fmtCurrency(envrtCost)} />
      </div>

      <DashedRule />

      {/* Annual saving */}
      <SectionTitle>ANNUAL SAVING</SectionTitle>
      <div className="mt-2 space-y-1.5">
        <Row label="vs consultant" value={fmtCurrency(savingVsConsultant)} />
        <Row label="vs in-house" value={fmtCurrency(savingVsInhouse)} />
      </div>

      <DoubleRule />

      {/* Total */}
      <div className="flex items-baseline justify-between text-sm font-bold">
        <span>TOTAL SAVING</span>
        <span>{fmtCurrency(maxSaving)}</span>
      </div>

      {/* Tear-off perforation */}
      <div className="mt-6 border-t border-dashed border-envrt-charcoal/40" />

      <p className="mt-4 text-center text-[10px] tracking-[0.25em] text-envrt-muted">
        Thank you for using ENVRT
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-envrt-charcoal/80">{label}</span>
      <span className="text-envrt-charcoal">{value}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <p className="text-[10px] tracking-[0.25em] text-envrt-muted">{children}</p>
  );
}

function DashedRule() {
  return <div className="my-3 border-t border-dashed border-envrt-charcoal/20" />;
}

function DoubleRule() {
  return <div className="my-4 border-y-2 border-double border-envrt-charcoal/30 h-[3px]" />;
}
