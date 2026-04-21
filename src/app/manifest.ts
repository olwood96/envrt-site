import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ENVRT - Digital Product Passports in minutes, not months.",
    short_name: "ENVRT",
    description:
      "Digital Product Passports, lifecycle metrics and sustainability analytics, all in one place. Fast and simple.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF9F6",
    theme_color: "#2DD4A8",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
