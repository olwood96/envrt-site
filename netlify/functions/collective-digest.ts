import { schedule } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import {
  buildDigestEmail,
  type DigestProduct,
} from "../../src/lib/collective/email-templates";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const STORAGE_BASE = `${SUPABASE_URL}/storage/v1/object/public`;
const FROM_ADDRESS = "ENVRT Collective <collective@envrt.com>";
const BATCH_SIZE = 100;

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const handler = schedule("0 9 * * 1", async () => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
  });

  // 1. Check kill switch
  const { data: config } = await supabase
    .from("collective_config")
    .select("value")
    .eq("key", "digest_enabled")
    .single();

  if (config?.value !== "true") {
    console.log("Collective digest is disabled");
    return { statusCode: 200, body: "Digest disabled" };
  }

  // 2. Fetch DPPs featured in last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: newDpps, error: dppError } = await supabase
    .from("dpp_generated")
    .select(
      "id, brand_id, garment_name, product_sku, collection_name, total_emissions, total_water, image_path, featured_at"
    )
    .eq("featured_on_site", true)
    .is("deleted_at", null)
    .gte("featured_at", sevenDaysAgo)
    .order("featured_at", { ascending: false });

  if (dppError || !newDpps?.length) {
    console.log("No new DPPs this week");
    return { statusCode: 200, body: "No new products" };
  }

  // 3. Fetch brand names
  const brandIds = Array.from(new Set(newDpps.map((d) => d.brand_id)));
  const { data: brands } = await supabase
    .from("brands")
    .select("id, name, slug")
    .in("id", brandIds);

  const brandMap = new Map<string, { name: string; slug: string | null }>();
  for (const b of brands ?? []) {
    brandMap.set(b.id, { name: b.name, slug: b.slug });
  }

  // 4. Build product list for the email
  const products: DigestProduct[] = newDpps.map((dpp) => {
    const brand = brandMap.get(dpp.brand_id);
    const brandSlug = brand?.slug || slugify(brand?.name ?? "unknown");
    return {
      name: dpp.garment_name,
      brand: brand?.name ?? "Unknown",
      imageUrl: dpp.image_path
        ? `${STORAGE_BASE}/dpp-images/${dpp.image_path}`
        : null,
      detailUrl: `/collective/${brandSlug}/${dpp.product_sku}`,
      emissions: dpp.total_emissions,
      water: dpp.total_water,
    };
  });

  // 5. Fetch confirmed active subscribers
  const { data: subscribers, error: subError } = await supabase
    .from("collective_subscribers")
    .select("email, token")
    .not("confirmed_at", "is", null)
    .is("unsubscribed_at", null);

  if (subError || !subscribers?.length) {
    console.log("No active subscribers");
    return { statusCode: 200, body: "No subscribers" };
  }

  // 6. Send digest in batches
  const resend = new Resend(RESEND_API_KEY);
  let sent = 0;

  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE);

    const emails = batch.map((sub) => {
      const unsubscribeUrl = `https://envrt.com/api/collective/unsubscribe?token=${sub.token}`;
      return {
        from: FROM_ADDRESS,
        to: sub.email,
        subject: `${products.length} new product${products.length === 1 ? "" : "s"} on The Collective`,
        html: buildDigestEmail(products, unsubscribeUrl),
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      };
    });

    try {
      await resend.batch.send(emails);
      sent += batch.length;
    } catch (err) {
      console.error(`Batch send error (batch ${i / BATCH_SIZE + 1}):`, err);
    }
  }

  console.log(`Digest sent to ${sent}/${subscribers.length} subscribers (${products.length} products)`);
  return { statusCode: 200, body: `Sent to ${sent} subscribers` };
});
