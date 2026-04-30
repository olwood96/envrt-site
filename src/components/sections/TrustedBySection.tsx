// Server component — reads /public/brand/logos/ at build/request time
// No "use client" — this runs on the server only

import { readdirSync } from "fs";
import { join } from "path";
import { TrustedByCarousel } from "./TrustedByCarousel";

function getLogos(): { src: string; alt: string; slug: string }[] {
  try {
    const dir = join(process.cwd(), "public", "brand", "logos");
    return readdirSync(dir)
      .filter((f) => /\.(png|svg|jpg|jpeg|webp)$/i.test(f))
      .map((f) => {
        const slug = f.replace(/\.[^.]+$/, "");
        return {
          src: `/brand/logos/${f}`,
          alt: slug.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          slug,
        };
      });
  } catch {
    return [];
  }
}

export function TrustedBySection() {
  const logos = getLogos();
  if (logos.length === 0) return null;
  return <TrustedByCarousel logos={logos} />;
}
