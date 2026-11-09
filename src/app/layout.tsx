import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { TopBar } from "@/components/TopBar";
import { loadContent } from "@/lib/content/load";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  axes: ["opsz", "wdth"],
});
const plex = IBM_Plex_Sans({ subsets: ["latin"], variable: "--font-plex", display: "swap" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
});

const { site, hero } = loadContent();
// Favicons are cropped from Ravi's photo by scripts/generate-images.mjs.
const GENERATED = `${process.env.PAGES_BASE_PATH ?? ""}/images/generated`;

export const metadata: Metadata = {
  metadataBase: new URL(`${site.siteUrl}/`),
  title: `${site.name} · ${hero.headline}`,
  description: site.tagline,
  icons: {
    icon: [
      { url: `${GENERATED}/icon-32.png`, sizes: "32x32", type: "image/png" },
      { url: `${GENERATED}/icon-192.png`, sizes: "192x192", type: "image/png" },
    ],
    apple: { url: `${GENERATED}/apple-touch-icon.png`, sizes: "180x180" },
  },
  openGraph: {
    title: site.name,
    description: hero.headline,
    images: ["images/generated/share.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${bricolage.variable} ${plex.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <a
          href="#main"
          className="absolute top-1 left-1 z-30 inline-flex min-h-(--size-target) -translate-y-20 items-center bg-bg px-2 font-semibold text-text focus:translate-y-0"
        >
          {site.skipLabel}
        </a>
        <TopBar />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
