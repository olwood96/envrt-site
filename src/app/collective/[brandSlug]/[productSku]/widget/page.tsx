import { notFound } from "next/navigation";
import Image from "next/image";
import { getFeaturedDpp } from "@/lib/collective/fetch";

export const revalidate = 300;

interface PageProps {
  params: { brandSlug: string; productSku: string };
}

export default async function WidgetPage({ params }: PageProps) {
  const { brandSlug, productSku } = params;
  const card = await getFeaturedDpp(brandSlug, productSku);

  if (!card) notFound();

  const { dpp, brand, productImageUrl, brandLogoUrl } = card;
  const detailUrl = `https://envrt.com/collective/${brandSlug}/${productSku}`;

  return (
    <html>
      <head>
        <meta name="robots" content="noindex" />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: transparent; }
          .card { width: 300px; border-radius: 16px; border: 1px solid rgba(26,58,42,0.05); background: #fff; overflow: hidden; }
          .image-area { position: relative; width: 300px; height: 200px; background: #f8f7f4; overflow: hidden; }
          .image-area img { width: 100%; height: 100%; object-fit: contain; padding: 12px; }
          .content { padding: 16px; }
          .brand-row { display: flex; align-items: center; gap: 6px; }
          .brand-logo { width: 20px; height: 20px; border-radius: 4px; object-fit: contain; }
          .brand-name { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #2aa198; }
          .product-name { margin-top: 6px; font-size: 14px; font-weight: 600; color: #1a3a2a; line-height: 1.3; }
          .collection { margin-top: 2px; font-size: 11px; color: #8b8b8b; }
          .metrics { margin-top: 10px; display: flex; flex-wrap: wrap; gap: 6px; }
          .metric { display: inline-block; padding: 3px 8px; border-radius: 20px; font-size: 10px; font-weight: 500; }
          .metric-co2 { background: rgba(26,58,42,0.05); color: #1a3a2a; }
          .metric-water { background: #eff6ff; color: #1d4ed8; }
          .metric-trace { background: rgba(42,161,152,0.05); color: #2aa198; }
          .footer { margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(26,58,42,0.05); display: flex; justify-content: space-between; align-items: center; }
          .footer a { font-size: 11px; font-weight: 500; color: #2aa198; text-decoration: none; }
          .footer a:hover { color: #1a3a2a; }
          .powered { font-size: 9px; color: #8b8b8b; }
          .powered a { color: #2aa198; text-decoration: none; }
        `}</style>
      </head>
      <body>
        <div className="card">
          <div className="image-area">
            {productImageUrl ? (
              <Image
                src={productImageUrl}
                alt={dpp.garment_name}
                width={300}
                height={200}
                style={{ width: "100%", height: "100%", objectFit: "contain", padding: "12px" }}
              />
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#ccc" }}>
                No image
              </div>
            )}
          </div>
          <div className="content">
            <div className="brand-row">
              {brandLogoUrl && (
                <Image
                  src={brandLogoUrl}
                  alt={brand.name}
                  width={20}
                  height={20}
                  className="brand-logo"
                />
              )}
              <span className="brand-name">{brand.name}</span>
            </div>
            <p className="product-name">{dpp.garment_name}</p>
            <p className="collection">{dpp.collection_name}</p>
            <div className="metrics">
              {dpp.total_emissions != null && (
                <span className="metric metric-co2">
                  {dpp.total_emissions.toFixed(1)} kg CO₂e
                </span>
              )}
              {dpp.total_water != null && (
                <span className="metric metric-water">
                  {dpp.total_water.toFixed(1)} L H₂O
                </span>
              )}
              {dpp.transparency_score != null && (
                <span className="metric metric-trace">
                  {Math.round(dpp.transparency_score)}% transparency
                </span>
              )}
            </div>
            <div className="footer">
              <a href={detailUrl} target="_blank" rel="noopener noreferrer">
                View full DPP →
              </a>
              <span className="powered">
                Powered by{" "}
                <a href="https://envrt.com" target="_blank" rel="noopener noreferrer">
                  ENVRT
                </a>
              </span>
            </div>
          </div>
        </div>
        {/* Record embed view */}
        <script
          dangerouslySetInnerHTML={{
            __html: `fetch("/api/dpp-view",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({dppId:"${dpp.id.replace(/[^a-f0-9-]/gi, "")}"}),keepalive:true}).catch(function(){});`,
          }}
        />
      </body>
    </html>
  );
}
