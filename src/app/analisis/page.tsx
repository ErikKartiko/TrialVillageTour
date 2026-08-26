import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Timer, FileCheck2 } from "lucide-react";
import { Wizard } from "@/components/form/wizard";
import { Logo } from "@/components/shared";

export const metadata: Metadata = {
  title: "Mulai Analisis — POTENSIA",
  description: "Isi profil desa dan unggah foto untuk mendapatkan analisis potensi desa wisata otomatis.",
};

export default function AnalisisPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <div className="dot-grid absolute inset-0 text-pine opacity-[0.05]" />
      <div className="absolute -left-32 -top-32 size-[420px] rounded-full bg-fern/20 blur-[100px]" />
      <div className="absolute -bottom-24 -right-24 size-[420px] rounded-full bg-gold/15 blur-[100px]" />

      <header className="relative mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:px-8">
        <Logo />
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[13px] font-bold text-ink/50 transition-colors hover:text-pine"
        >
          <ArrowLeft className="size-4" /> Beranda
        </Link>
      </header>

      <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-6 md:px-8">
        <div className="mx-auto mb-10 max-w-4xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-semibold text-ink md:text-4xl">
                Formulir Analisis Desa
              </h1>
              <p className="mt-1.5 text-sm text-ink/50">
                ±3 menit mengisi — disusul laporan strategis dalam hitungan menit.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              {[
                { icon: ShieldCheck, t: "Data aman" },
                { icon: Timer, t: "±3 menit" },
                { icon: FileCheck2, t: "9 hasil analisis" },
              ].map((b) => (
                <span
                  key={b.t}
                  className="hidden items-center gap-1.5 rounded-full border border-pine/15 bg-paper/80 px-3.5 py-1.5 text-[11px] font-bold text-pine sm:inline-flex"
                >
                  <b.icon className="size-3.5" /> {b.t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <Wizard />
      </div>
    </main>
  );
}
