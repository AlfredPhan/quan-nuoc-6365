import type { Metadata } from "next";
import { getSiteUrl, siteConfig } from "@/lib/site";
import "./globals.css";

const siteUrl = getSiteUrl();
const ogImageUrl = `${siteUrl}${siteConfig.ogImagePath}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteUrl,
    siteName: siteConfig.name,
    type: "website",
    locale: "vi_VN",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Menu đồ uống 6365 Trà & Nước",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [ogImageUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
