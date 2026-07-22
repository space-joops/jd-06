import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  // 매니페스트는 요청별 로케일 전환이 어려워 기본 로케일(en) 1개로 유지한다.
  return {
    name: "Astropet",
    short_name: "Astropet",
    description: "A cozy game where you bond with a pet that feeds on space debris.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b1026",
    theme_color: "#0b1026",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
