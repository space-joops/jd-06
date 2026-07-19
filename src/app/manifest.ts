import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "아스트로펫",
    short_name: "아스트로펫",
    description: "우주쓰레기를 먹는 나의 펫과 교감하는 힐링 게임",
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
