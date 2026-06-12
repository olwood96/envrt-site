// One-shot image optimizer using sharp. Resizes + recompresses the
// biggest assets in public/ in place. Refuses to overwrite when the
// new file would be larger than the original, so re-running is safe.
//
// Run: node scripts/optimize-images.mjs

import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Each target: source path, max width (preserves aspect ratio,
// never upscales), encoder + quality. PNGs with transparency stay
// PNG; texture/photo JPGs stay JPG with mozjpeg.
const TARGETS = [
  // ── Critical hero asset — homepage LCP ──────────────────────────────
  {
    file: "public/jacket.png",
    maxWidth: 1080,
    encode: (img) =>
      img.png({ compressionLevel: 9, palette: true, quality: 85 }),
  },

  // ── Social share image — most platforms cap at 1200x630 ─────────────
  {
    file: "public/og-image.png",
    maxWidth: 1200,
    maxHeight: 630,
    fit: "cover",
    encode: (img) => img.png({ compressionLevel: 9, quality: 85 }),
  },

  // ── DPP demo screenshot ─────────────────────────────────────────────
  {
    file: "public/screenshots/dpp/hoodie-full.png",
    maxWidth: 1240,
    encode: (img) =>
      img.png({ compressionLevel: 9, palette: true, quality: 80 }),
  },

  // ── v3-asset texture / photo JPGs ───────────────────────────────────
  // Section visuals render at <= 1320px width, so 2400px gives 2x
  // headroom for retina displays. Quality 78 with mozjpeg is
  // visually indistinguishable from the originals.
  ...[
    "cta-texture.jpg",
    "regulatory-eu-building.jpg",
    "story-fabric.jpg",
    "platform-thread-spools.jpg",
    "manifesto.jpg",
    "step3-qr.jpg",
    "theme-water-droplets.jpg",
    "provenance-loom.jpg",
    "theme-eu-flag.jpg",
    "folded-clothes.jpg",
    "angry-pablo-tag.jpg",
    "step1-studio.jpg",
    "step2-swatches.jpg",
  ].map((name) => ({
    file: `public/v3-assets/${name}`,
    maxWidth: 2400,
    encode: (img) =>
      img.jpeg({ quality: 78, progressive: true, mozjpeg: true }),
  })),
];

async function fileSize(file) {
  try {
    const stat = await fs.stat(file);
    return stat.size;
  } catch {
    return null;
  }
}

function fmtBytes(n) {
  if (n >= 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(2)} MB`;
  if (n >= 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${n} B`;
}

async function optimizeOne(target) {
  const full = path.join(ROOT, target.file);
  const before = await fileSize(full);
  if (before === null) {
    return { ...target, skipped: "missing" };
  }

  const tmp = `${full}.opt`;
  const img = sharp(full).resize({
    width: target.maxWidth,
    height: target.maxHeight,
    fit: target.fit ?? "inside",
    withoutEnlargement: true,
  });
  await target.encode(img).toFile(tmp);

  const after = await fileSize(tmp);
  if (after === null || after >= before) {
    // New version isn't smaller — discard, keep original.
    await fs.unlink(tmp).catch(() => {});
    return { ...target, before, after, kept: "original" };
  }

  await fs.rename(tmp, full);
  return { ...target, before, after, kept: "optimized" };
}

async function main() {
  let totalBefore = 0;
  let totalAfter = 0;
  for (const target of TARGETS) {
    const result = await optimizeOne(target);
    if (result.skipped) {
      console.log(`SKIP   ${target.file} — ${result.skipped}`);
      continue;
    }
    totalBefore += result.before;
    totalAfter += result.after ?? result.before;
    const savedPct =
      result.kept === "optimized"
        ? `-${Math.round(((result.before - result.after) / result.before) * 100)}%`
        : "no change";
    console.log(
      `${result.kept === "optimized" ? "OPT   " : "KEEP  "} ${target.file.padEnd(56)} ${fmtBytes(result.before).padStart(10)} → ${fmtBytes(result.after ?? result.before).padStart(10)} (${savedPct})`,
    );
  }
  console.log(
    `\nTOTAL: ${fmtBytes(totalBefore)} → ${fmtBytes(totalAfter)} (saved ${fmtBytes(totalBefore - totalAfter)})`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
