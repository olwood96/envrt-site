import { redirect } from "next/navigation";
import type { Metadata } from "next";

// The v3 homepage moved to /preview/v3. This route stays as a permanent
// redirect so any external link that still points at /preview/home-v3
// lands on the new home.

export const metadata: Metadata = {
  title: "Moved to /preview/v3",
  robots: { index: false, follow: false },
};

export default function HomeV3RedirectPage() {
  redirect("/preview/v3");
}
