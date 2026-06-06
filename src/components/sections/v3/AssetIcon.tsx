// Inline SVG glyph library for v3 homepage sections. Single source for both
// the scatter pain-state section (file types) and the capabilities spec table
// (conceptual capability glyphs). Line-art style, 24×24 viewBox, 1.5px stroke,
// rounded line caps. Brand-aligned, no external icon library dependency.

import type { SVGProps } from "react";

export type AssetIconType =
  // File types — used by ScatterToOrderSection
  | "pdf"
  | "xlsx"
  | "csv"
  | "json"
  | "folder"
  | "email"
  | "chat"
  | "image"
  | "qr"
  // Capability glyphs — used by CapabilitiesSection
  | "supply-chain"
  | "lca"
  | "eco-score"
  | "dpp"
  | "vault"
  | "audit"
  | "compliance"
  | "analytics"
  | "claims";

type Props = SVGProps<SVGSVGElement> & {
  type: AssetIconType;
  size?: number;
};

export function AssetIcon({ type, size = 24, className, ...rest }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    ...rest,
  };

  switch (type) {
    // ─── File types ────────────────────────────────────────────────────

    case "pdf":
      return (
        <svg {...common}>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5" />
          <text
            x="12"
            y="17.5"
            textAnchor="middle"
            fontSize="5"
            fontFamily="ui-monospace, monospace"
            fontWeight="700"
            fill="currentColor"
            stroke="none"
          >
            PDF
          </text>
        </svg>
      );

    case "xlsx":
      return (
        <svg {...common}>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5" />
          <path d="M8 13h8" />
          <path d="M8 17h8" />
          <path d="M12 13v4" />
        </svg>
      );

    case "csv":
      return (
        <svg {...common}>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5" />
          <text
            x="12"
            y="17.5"
            textAnchor="middle"
            fontSize="5"
            fontFamily="ui-monospace, monospace"
            fontWeight="700"
            fill="currentColor"
            stroke="none"
          >
            CSV
          </text>
        </svg>
      );

    case "json":
      return (
        <svg {...common}>
          <path d="M9 4a2 2 0 0 0-2 2v3a2 2 0 0 1-2 2 2 2 0 0 1 2 2v3a2 2 0 0 0 2 2" />
          <path d="M15 4a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2 2 2 0 0 0-2 2v3a2 2 0 0 1-2 2" />
        </svg>
      );

    case "folder":
      return (
        <svg {...common}>
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
      );

    case "email":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );

    case "chat":
      return (
        <svg {...common}>
          <path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12z" />
        </svg>
      );

    case "image":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="9" cy="10" r="1.5" />
          <path d="m4 18 5-5 4 4 3-3 4 4" />
        </svg>
      );

    case "qr":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <path d="M14 14h3" />
          <path d="M14 18h2" />
          <path d="M18 14v3" />
          <path d="M21 17v4" />
          <path d="M17 21h4" />
        </svg>
      );

    // ─── Capability glyphs ─────────────────────────────────────────────

    case "supply-chain":
      // Three connected nodes — tier 1, tier 2, tier 3
      return (
        <svg {...common}>
          <circle cx="5" cy="6" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="18" r="2" />
          <path d="m6.4 7.4 4.2 3.2" />
          <path d="m13.4 13.4 4.2 3.2" />
        </svg>
      );

    case "lca":
      // Beaker / flask — calculation engine
      return (
        <svg {...common}>
          <path d="M9 3v6l-5 9a2 2 0 0 0 1.7 3h12.6a2 2 0 0 0 1.7-3L15 9V3" />
          <path d="M8 3h8" />
          <path d="M7 15h10" />
        </svg>
      );

    case "eco-score":
      // Leaf with score grade band
      return (
        <svg {...common}>
          <path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 11-9 0 5-2 12-4 16Z" />
          <path d="M4 13c4-1 7-3 8-7" />
        </svg>
      );

    case "dpp":
      // Phone with screen highlight = hosted passport
      return (
        <svg {...common}>
          <rect x="6" y="2" width="12" height="20" rx="2.5" />
          <path d="M11 18.5h2" />
          <path d="M9 5h6" />
          <path d="M9 9h6" />
          <path d="M9 13h4" />
        </svg>
      );

    case "vault":
      // Safe / vault with dial
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="11" cy="12" r="3.5" />
          <path d="M11 9.5v2.5l1.5 1" />
          <path d="M18 9v6" />
        </svg>
      );

    case "audit":
      // Stack of pages with checkmark
      return (
        <svg {...common}>
          <path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
          <path d="M14 3v5h5" />
          <path d="m9 14 2 2 4-4" />
        </svg>
      );

    case "compliance":
      // Radar / scope — active watch
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <path d="M12 3v9l6 4" />
        </svg>
      );

    case "analytics":
      // Bar chart with pulse
      return (
        <svg {...common}>
          <path d="M3 20V10" />
          <path d="M9 20V4" />
          <path d="M15 20v-7" />
          <path d="M21 20V8" />
        </svg>
      );

    case "claims":
      // Speech bubble with tick — source-tied claims
      return (
        <svg {...common}>
          <path d="M20 15a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
          <path d="m8 10 2.5 2.5L16 7" />
        </svg>
      );

    default:
      return null;
  }
}
