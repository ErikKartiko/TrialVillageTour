import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "POTENSIA — Analisis AI Potensi Desa Wisata",
  description:
    "Unggah informasi dan foto desa Anda, AI POTENSIA menganalisis potensi desa wisata secara otomatis dalam hitungan menit: analisis 6A, SWOT, skor kesiapan, simulasi pendapatan, branding, hingga roadmap pengembangan.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${fraunces.variable} ${jakarta.variable}`}>
      <body className="grain font-sans bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
