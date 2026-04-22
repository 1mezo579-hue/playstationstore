import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import "./table.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PlayStation Store Manager",
  description: "نظام إدارة متكامل لمحلات بلايستيشن (مخزون، صيانة، مبيعات)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body>{children}</body>
    </html>
  );
}
