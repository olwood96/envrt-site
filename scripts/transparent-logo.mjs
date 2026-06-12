// Strips the white background out of a black-on-white logo PNG by
// deriving a per-pixel alpha channel from inverse luminance:
//   - pure white pixels → fully transparent
//   - pure black pixels → fully opaque black
//   - anti-aliased edges → proportional partial alpha
//
// Output is a clean RGBA PNG where the shape sits on real
// transparency. Use anywhere a logo needs to render over coloured
// or glassy surfaces without dragging its own background with it.
//
// Run:
//   node scripts/transparent-logo.mjs
//
// To process additional logos, add entries to TARGETS.

import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const TARGETS = [
  "public/brand/envrt-logo.png",
  "public/brand/envrt-nv.png",
];

async function makeTransparent(file) {
  const full = path.join(ROOT, file);
  const original = await sharp(full)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = original;
  const { width, height, channels } = info;
  // Expect RGBA from ensureAlpha
  if (channels !== 4) {
    throw new Error(`${file}: expected 4 channels, got ${channels}`);
  }

  const out = Buffer.alloc(width * height * 4);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Luma-weighted brightness (Rec. 709) so green-leaning pixels
    // aren't accidentally retained where the logo is pure black.
    const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const alpha = Math.max(0, Math.min(255, Math.round(255 - brightness)));

    out[i] = 0;
    out[i + 1] = 0;
    out[i + 2] = 0;
    out[i + 3] = alpha;
  }

  const tmp = `${full}.tmp`;
  await sharp(out, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(tmp);
  await fs.rename(tmp, full);
}

async function main() {
  for (const file of TARGETS) {
    const before = (await fs.stat(path.join(ROOT, file))).size;
    await makeTransparent(file);
    const after = (await fs.stat(path.join(ROOT, file))).size;
    console.log(
      `${file}  ${before} B → ${after} B  (alpha derived from inverse luminance)`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
