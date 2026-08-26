"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, Sprout } from "lucide-react";
import { Logo } from "@/components/shared";

const LINKS = [
  { href: "/#fitur", label: "Fitur" },
  { href: "/#cara-kerja", label: "Cara Kerja" },
  { href: "/#pratinjau", label: "Pratinjau Laporan" },
  { href: "/#pengguna", label: "Untuk Siapa" },
  { href: "/riwayat", label: "Riwayat Analisis" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`no-print fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-paper/85 shadow-[0_1px_0_rgba(15,36,26,0.08)] backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:px-8">
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13px] font-semibold text-ink/70 transition-colors hover:text-pine"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/analisis"
            className="group hidden items-center gap-2 rounded-full bg-pine px-5 py-2.5 text-[13px] font-bold text-paper transition-all hover:bg-forest sm:inline-flex"
          >
            Mulai Analisis
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="grid size-10 place-items-center rounded-full border border-ink/10 lg:hidden"
            aria-label="Menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-ink/5 bg-paper/95 px-5 pb-6 pt-3 backdrop-blur-xl lg:hidden">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="block py-3 text-sm font-semibold text-ink/80">
              {l.label}
            </Link>
          ))}
          <Link
            href="/analisis"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-pine px-5 py-3 text-sm font-bold text-paper"
          >
            Mulai Analisis <ArrowUpRight className="size-4" />
          </Link>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="no-print relative overflow-hidden bg-ink text-paper">
      <div className="dot-grid absolute inset-0 text-sprout opacity-[0.06]" />
      <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-sprout text-ink">
                <Sprout className="size-5" strokeWidth={2.2} />
              </span>
              <span className="font-display text-xl font-semibold">POTENSIA</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/60">
              Platform analisis potensi desa wisata berbasis AI. Dari data desa menjadi strategi,
              dalam hitungan menit — untuk 74.000+ desa di seluruh Indonesia.
            </p>
          </div>
          <div>
            <p className="eyebrow text-[10px] font-bold uppercase text-sprout/80">Navigasi</p>
            <ul className="mt-4 space-y-2.5 text-sm text-paper/70">
              <li><Link href="/#fitur" className="hover:text-sprout">Fitur Analisis</Link></li>
              <li><Link href="/#cara-kerja" className="hover:text-sprout">Cara Kerja</Link></li>
              <li><Link href="/analisis" className="hover:text-sprout">Mulai Analisis</Link></li>
              <li><Link href="/riwayat" className="hover:text-sprout">Riwayat Analisis</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-[10px] font-bold uppercase text-sprout/80">Kerangka</p>
            <ul className="mt-4 space-y-2.5 text-sm text-paper/70">
              <li>Analisis 6A Pariwisata</li>
              <li>Matriks SWOT</li>
              <li>Skor Kesiapan Desa Wisata</li>
              <li>Simulasi Pendapatan</li>
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-paper/10 pt-6 text-xs text-paper/40 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} POTENSIA — Untuk desa yang berdaya.</p>
          <p>Rekomendasi bersifat indikatif; verifikasi lapangan tetap diperlukan.</p>
        </div>
      </div>
    </footer>
  );
}
