import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        envrt: {
          green: "var(--envrt-green)",
          "green-light": "var(--envrt-green-light)",
          teal: "var(--envrt-teal)",
          "teal-light": "var(--envrt-teal-light)",
          charcoal: "var(--envrt-charcoal)",
          offwhite: "var(--envrt-offwhite)",
          cream: "var(--envrt-cream)",
          muted: "var(--envrt-muted)",
          // v3: deeper near-black for editorial type, warmer paper tone for
          // layered backgrounds. See docs/homepage-v3-design-notes.md.
          ink: "var(--envrt-ink)",
          stone: "var(--envrt-stone)",
          // v3.next (NexDyne-inspired): deep + aqua direction
          deep: "var(--envrt-deep)",
          aqua: "var(--envrt-aqua)",
          "aqua-soft": "var(--envrt-aqua-soft)",
          "mute-cool": "var(--envrt-mute-cool)",
          // v3 brand identity (from 2022 brand guidelines, scoped to v3 only)
          "brand-ultramarine": "#3E00FF",
          "brand-shamrock": "#00B92C",
          "brand-royal": "#1F5BFF",
          "brand-vibrant": "#20E036",
          "brand-aqua": "#00DAFF",
          "brand-golden": "#FFBF00",
          "brand-lilac": "#DF5FFF",
          "brand-sunny": "#FFE50F",
          "brand-crimson": "#B50003",
          "brand-neon": "#EDFF00",
          "brand-black": "#1A1A1A",
          "brand-vista": "#FCF9F0",
        },
      },
      fontFamily: {
        n27: ["N27", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        body: ["N27", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        // v3: Apple-style system stack. Resolves to SF Pro on Apple devices,
        // Segoe UI on Windows, Roboto on Android. No webfont download — the
        // exact font Apple uses on apple.com.
        system: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        // v3.next: Manrope display sans for h1/h2/h3 (closest free equivalent
        // to NexDyne's Nohemi). Loaded via next/font/google on the home-v3
        // route — see src/app/preview/home-v3/page.tsx.
        manrope: ["var(--font-manrope)", "Manrope", "ui-sans-serif", "sans-serif"],
        // v3 brand: Big Shoulders Text (headlines) + Karla (body), loaded on
        // the home-v3 route. Per 2022 ENVRT brand guidelines. Renamed from
        // `body` to `karla` to avoid clashing with the existing `body` key.
        display: ["var(--font-display)", "Big Shoulders Text", "Impact", "ui-sans-serif", "sans-serif"],
        karla: ["var(--font-body)", "Karla", "ui-sans-serif", "sans-serif"],
      },
      borderRadius: {
        scene: "1.5rem",
      },
      animation: {
        "glitch-1": "glitch1 0.3s ease-in-out",
        "glitch-2": "glitch2 0.3s ease-in-out",
      },
      keyframes: {
        glitch1: {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 1px)" },
          "40%": { transform: "translate(2px, -1px)" },
          "60%": { transform: "translate(-1px, -1px)" },
          "80%": { transform: "translate(1px, 2px)" },
        },
        glitch2: {
          "0%, 100%": { clipPath: "inset(0 0 0 0)" },
          "20%": { clipPath: "inset(20% 0 60% 0)" },
          "40%": { clipPath: "inset(40% 0 20% 0)" },
          "60%": { clipPath: "inset(60% 0 10% 0)" },
          "80%": { clipPath: "inset(10% 0 40% 0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
