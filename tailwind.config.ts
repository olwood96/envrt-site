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
        },
      },
      fontFamily: {
        n27: ["N27", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        body: ["N27", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
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
