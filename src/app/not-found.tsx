import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-paper px-5">
      <div className="text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-pine/8 text-pine">
          <Compass className="size-8" strokeWidth={1.6} />
        </span>
        <p className="mt-6 font-display text-7xl font-bold italic text-pine/15">404</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-ink">Halaman tidak ditemukan</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink/50">
          Tautan mungkin keliru, atau laporan telah berubah. Mari kembali berkemas ke beranda.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-pine px-6 py-3 text-sm font-bold text-paper transition-colors hover:bg-forest"
        >
          <ArrowLeft className="size-4" /> Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
