// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DHITI.AI - Discover Your IT Career Path",
  description:
    "AI-powered career assessment platform that helps you discover the perfect IT role based on your unique strengths and passions.",
  keywords:
    "career assessment, IT careers, AI career guidance, software engineering, data science",
  authors: [{ name: "DHITI.AI" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
  openGraph: {
    title: "DHITI.AI - Discover Your IT Career Path",
    description:
      "AI-powered career assessment platform that helps you discover the perfect IT role based on your unique strengths and passions.",
    url: "https://dhiti.ai",
    siteName: "DHITI.AI",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DHITI.AI - Career Assessment Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DHITI.AI - Discover Your IT Career Path",
    description: "AI-powered career assessment platform",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />

        {/* PWA Tags */}
        <meta name="application-name" content="DHITI.AI" />
        <meta name="apple-mobile-web-app-title" content="DHITI.AI" />

        {/* Theme Color for Mobile Browsers */}
        <meta
          name="theme-color"
          content="#7c3aed"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#6d28d9"
          media="(prefers-color-scheme: dark)"
        />

        {/* Preconnect to optimize font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full overflow-x-hidden`}
      >
        <Providers>{children}</Providers>

        {/* NextAuth uses client-side JS, so we add a noscript fallback */}
        <noscript>
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              backgroundColor: "#f3f4f6",
              color: "#111827",
            }}
          >
            This application requires JavaScript to be enabled for
            authentication and interactive features.
          </div>
        </noscript>
      </body>
    </html>
  );
}
