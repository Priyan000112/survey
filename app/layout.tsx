import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/bottom-nav";
import { TextSizeToggle } from "@/components/text-size-toggle";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://survey-maribaya.vercel.app"
  ),
  title: "Suara Warga Maribaya 2026",
  description:
    "Survei aspirasi warga Desa Maribaya untuk menentukan tokoh potensial kepala desa periode berikutnya.",
  icons: {
    icon: "/icon.svg"
  },
  openGraph: {
    title: "Suara Warga Maribaya 2026",
    description:
      "Survei aspirasi warga Desa Maribaya untuk menentukan tokoh potensial kepala desa periode berikutnya.",
    images: ["/og-maribaya.svg"]
  }
};

export const viewport: Viewport = {
  themeColor: "#1f5d3f",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-text-scale="normal">
      <body>
        <TextSizeToggle />
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
