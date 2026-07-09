// src/app/api/admin/email-previews/route.ts
// Serves the site's email preview catalogue to the dashboard's admin email
// page (/admin/tools/emails). Guarded by EMAIL_PREVIEW_SECRET, which must
// be set to the same value in both Vercel projects.

import { NextRequest, NextResponse } from "next/server";
import { getSiteEmailPreviews } from "@/lib/email/previews";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const secret = process.env.EMAIL_PREVIEW_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Preview endpoint not configured" }, { status: 503 });
  }

  const provided = request.headers.get("x-email-preview-secret");
  if (provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ previews: getSiteEmailPreviews() });
}
