"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SupplyChainBackground } from "../ui/SupplyChainBackground";

// Wraps the v1 navbar, footer and supply-chain background. Returns just
// the children (no v1 chrome) when the user is anywhere under
// /preview/v3/. The v3 preview area provides its own navbar via
// src/app/preview/v3/layout.tsx, so the v1 chrome must not stack on top
// of it.

export function V1Chrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const isV3Preview = pathname.startsWith("/preview/v3");

  if (isV3Preview) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <SupplyChainBackground>{children}</SupplyChainBackground>
      </main>
      <Footer />
    </>
  );
}
