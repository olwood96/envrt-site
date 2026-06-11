import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "turvlmcvvngszvzyzmms.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  experimental: {
    optimizePackageImports: ["framer-motion"],
    instrumentationHook: true,
  },

  async redirects() {
    return [
      {
        source: "/how-it-works",
        destination: "/#how-it-works",
        permanent: true,
      },
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/demo",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/dashboard-demo",
        destination: "/contact",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        // Widget pages are designed for iframe embedding
        source: "/collective/:brandSlug/:productSku/widget",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
        ],
      },
      {
        // Widget API endpoint
        source: "/api/collective/widget",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        // Public embed script loaded by brand sites. Long cache on the CDN
        // with a shorter browser cache so we can roll out fixes quickly.
        source: "/embed.js",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400" },
        ],
      },
      {
        // N27 font files loaded cross-origin by embed.js into the popup
        // shadow DOM via @font-face. Browsers require CORS on font
        // resources, without these headers the font request succeeds
        // but the browser refuses to use the font and falls back to the
        // system default. Long cache because font files don't change.
        source: "/fonts/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // QR code PNG used by the embed.js popup loading state. Loaded
        // cross-origin from brand sites. Long cache for the same reason
        // as fonts above.
        source: "/qr-code.png",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=86400, s-maxage=2592000" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
        ],
      },
    ];
  },
};

// Sentry wrapping. Source maps upload only when a SENTRY_AUTH_TOKEN
// is present (Vercel build), keeping local dev builds quiet. The
// tunnel route routes browser-side error events through a same-origin
// proxy so ad blockers do not drop them.
export default withSentryConfig(nextConfig, {
  // Set SENTRY_ORG, SENTRY_PROJECT and SENTRY_AUTH_TOKEN in Vercel
  // env so source maps upload on deploy. Without them, the build
  // still works, source maps just aren't uploaded.
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.SENTRY_AUTH_TOKEN,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  disableLogger: true,
  automaticVercelMonitors: false,
});
