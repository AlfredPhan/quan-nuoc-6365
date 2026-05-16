import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "6365 Trà & Nước | Order nhanh",
  description: "Đặt trà và nước nhanh tại 6365 Trà & Nước.",
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
