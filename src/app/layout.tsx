import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import Providers from "@/components/Providers";
import ConversationForm from "@/components/ConversationForm";
import Analytics from "@/components/Analytics";
import CookieBanner from "@/components/CookieBanner";
import LaunchBanner from "@/components/LaunchBanner";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import { IS_PREVIEW_SITE } from "@/config/features";
import { JsonLd, SITE_LD } from "@/lib/jsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

// Home page metadata. Every other page sets its own title, description and
// share card via pageMetadata() in its layout.tsx / page.tsx.
const home = pageMetadata({
  title: "Axion Index — From ambiguity to architecture.",
  description: "Axion Index is an operating architect. We do not begin by selling a service. We read what is already breaking — and build what must hold.",
  path: "/",
});

export const metadata: Metadata = {
  ...home,
  metadataBase: new URL(SITE_URL),
  alternates: undefined, // canonical is set per page, not inherited from here
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <JsonLd data={SITE_LD} />
        <Providers>
          <SmoothScroll>
            <Navbar />
            <main>{children}</main>
            <ConversationForm />
            <LaunchBanner />
            <CookieBanner />
            {!IS_PREVIEW_SITE && <Analytics />}
            {IS_PREVIEW_SITE && (
              <div className="fixed bottom-3 right-3 z-[400] px-3 py-1.5 bg-[#C9A24A] text-[#0A0A0B] font-mono text-[10px] tracking-[0.16em] uppercase shadow-lg pointer-events-none">
                Preview · not the live site
              </div>
            )}
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
