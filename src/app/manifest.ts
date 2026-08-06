import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mon Empreinte — Créations artisanales",
    short_name: "Mon Empreinte",
    description: "Créations artisanales & ateliers créatifs à Tunis",
    start_url: "/",
    display: "standalone",
    background_color: "#FDFBF7",
    theme_color: "#8B7355",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}