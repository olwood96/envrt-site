// src/lib/email/templates/freedpp-emails.ts
// Free DPP (trial request) emails. Registered in src/lib/email/previews.ts —
// any new email here must add a preview fixture (see the email conventions rule).

import { internalAlertHtml, textLink } from "@/lib/email/layout";

export interface TrialRequestEmailData {
  contactName: string;
  brandName: string;
  contactEmail: string;
  garmentName: string;
  garmentType: string;
  materialsSummary: string;
  weightG: number;
  countryAssembly: string;
  productUrl: string;
}

export function buildTrialRequestInternalHtml(data: TrialRequestEmailData): string {
  return internalAlertHtml({
    title: "New trial DPP request",
    rows: [
      ["Contact", data.contactName],
      ["Brand", data.brandName],
      ["Email", data.contactEmail],
      ["Product", data.garmentName],
      ["Type", data.garmentType],
      ["Materials", data.materialsSummary],
      ["Weight", `${data.weightG}g`],
      ["Assembly", data.countryAssembly],
      ["URL", data.productUrl ? data.productUrl.slice(0, 80) : ""],
    ],
    bodyHtml: `<p style="font-size:13px;">Process this in the ${textLink("https://dashboard.envrt.com/admin/trial-requests", "trial requests queue")}.</p>`,
  });
}
