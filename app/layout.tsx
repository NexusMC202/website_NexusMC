import type { Metadata } from "next";
import "./globals.css";
import { LanguageRuntime } from "./language-runtime";

export const metadata: Metadata = {
  metadataBase: new URL("https://nexus.flux-productions.com"),
  title: {
    default: "NEXUS — One core. Infinite possibilities.",
    template: "%s — NEXUS",
  },
  description:
    "NEXUS Season II — science-fantasy Minecraft project by Flux Production.",
  icons: {
    icon: [{ url: "/nexus-favicon.png", type: "image/png", sizes: "1024x1024" }],
    shortcut: "/nexus-favicon.png",
    apple: "/nexus-favicon.png",
  },
  openGraph: {
    title: "NEXUS — One core. Infinite possibilities.",
    description: "Science-fantasy Minecraft NeoForge 1.21.1 · Season II",
    images: [{ url: "/og.png", width: 1728, height: 928, alt: "NEXUS Season II" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXUS — One core. Infinite possibilities.",
    description: "Science-fantasy Minecraft NeoForge 1.21.1 · Season II",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body><LanguageRuntime />{children}</body>
    </html>
  );
}
