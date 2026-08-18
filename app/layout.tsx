import type { Metadata } from "next";
import "./globals.css";
import { LanguageRuntime } from "./language-runtime";

export const metadata: Metadata = {
  metadataBase: new URL("https://nexusmc.flux-productions.com"),
  title: {
    default: "NEXUS — GEARMORPH & AURION",
    template: "%s — NEXUS",
  },
  description:
    "NEXUS — сеть Minecraft-миров GEARMORPH и AURION от Flux Production.",
  icons: {
    icon: [
      { url: "/favicon.ico?v=3", type: "image/x-icon", sizes: "32x32" },
      { url: "/nexus-favicon.png?v=3", type: "image/png", sizes: "1024x1024" },
    ],
    shortcut: "/favicon.ico?v=3",
    apple: "/nexus-favicon.png",
  },
  openGraph: {
    title: "NEXUS — GEARMORPH & AURION",
    description: "Два Minecraft-мира. Одна история.",
    images: [{ url: "/gearmorph-world.png", width: 1672, height: 939, alt: "GEARMORPH — Minecraft сервер" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXUS — GEARMORPH & AURION",
    description: "Два Minecraft-мира. Одна история.",
    images: ["/gearmorph-world.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body><LanguageRuntime />{children}</body>
    </html>
  );
}
