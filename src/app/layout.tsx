import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { TopBar } from "@/components/TopBar";
import { loadContent } from "@/lib/content/load";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
});

const { site, hero } = loadContent();

export const metadata: Metadata = {
  metadataBase: new URL(`${site.siteUrl}/`),
  title: `${site.name} · ${hero.headline}`,
  description: site.tagline,
  icons: { icon: `${process.env.PAGES_BASE_PATH ?? ""}/images/generated/icon.svg` },
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
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <a
          href="#main"
          className="absolute top-1 left-1 z-30 inline-flex min-h-(--size-target) -translate-y-20 items-center rounded-sm bg-bg px-2 font-semibold focus:translate-y-0"
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
