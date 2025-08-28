
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bollinger Bands (KLineCharts)",
  description: "Next.js + TS + Tailwind + KLineCharts Bollinger Bands assignment",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
