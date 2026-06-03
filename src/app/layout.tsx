import type { Metadata } from "next";
import localFont from "next/font/local";
import { Saira } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/lib/site";

// Fuente de texto: Geist (legible) — variable --font-geist-sans
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Fuente display: Saira (ancha y técnica, acorde al wordmark del logo)
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.nombre} | ${siteConfig.slogan}`,
    template: `%s | ${siteConfig.nombre}`,
  },
  description: siteConfig.descripcion,
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: siteConfig.nombre,
    title: `${siteConfig.nombre} | ${siteConfig.slogan}`,
    description: siteConfig.descripcion,
    url: siteConfig.url,
    images: [
      {
        url: "/logo-trench.svg",
        width: 240,
        height: 268,
        alt: `${siteConfig.nombre} — Logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.nombre} | ${siteConfig.slogan}`,
    description: siteConfig.descripcion,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${saira.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}
