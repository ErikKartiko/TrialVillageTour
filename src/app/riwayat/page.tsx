import { db } from "@/db";
import { villageAnalyses, analysisPhotos } from "@/db/schema";
import { asc, desc, inArray } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowUpRight, Images, Sparkles } from "lucide-react";
import { Navbar, Footer } from "@/components/site/chrome";
import { Eyebrow, CtaButton } from "@/components/shared";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Riwayat Analisis — POTENSIA",
  description: "Daftar desa yang telah dianalisis oleh AI POTENSIA.",
};

const CATEGORY_STYLES: Record<string, string> = {
  Pionir: "bg-sprout text-ink",
  Berkembang: "bg-fern text-ink",
  Potensial: "bg-gold text-ink",
  Tumbuh: "bg-[#e0a184] text-ink",
  Rintisan: "bg-[#e0836a] text-ink",
};

export default async function RiwayatPage() {
  const rows = await db
    .select()
    .from(villageAnalyses)
    .orderBy(desc(villageAnalyses.createdAt))
    .limit(24);

  const completed = rows.filter((r) => r.status === "completed" && r.readinessScore !== null);
  const ids = completed.map((r) => r.id);

  const photos = ids.length
    ? await db
        .select()
        .from(analysisPhotos)
        .where(inArray(analysisPhotos.analysisId, ids))
        .orderBy(asc(analysisPhotos.analysisId), asc(analysisPhotos.createdAt))
    : [];

  const byAnalysis = new Map<string, typeof photos>();
  for (const p of photos) {
    const arr = byAnalysis.get(p.analysisId) ?? [];
    arr.push(p);
    byAnalysis.set(p.analysisId, arr);
  }

  const items = completed.map((r) => {
    const list = byAnalysis.get(r.id) ?? [];
    return {
      ...r,
      photoCount: list.length,
      firstPhoto: list[0]?.filePath ?? null,
    };
  });

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Navbar />
      <div className="dot-grid absolute inset-0 text-pine opacity-[0.05]" />

      <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8">
        <Eyebrow>Arsip Analisis</Eyebrow>
        <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h1 className="headline-balance font-display text-4xl font-medium leading-[1.05] tracking-tight text-ink md:text-5xl">
            Desa-desa yang telah <span className="italic text-pine">dipetakan.</span>
          </h1>
          <CtaButton href="/analisis" variant="ghost">Tambah Desa Anda</CtaButton>
        </div>

        {items.length === 0 ? (
          <div className="mt-16 grid place-items-center rounded-[32px] border border-dashed border-ink/15 bg-parchment/50 px-6 py-24 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-pine/8 text-pine">
              <Sparkles className="size-6" />
            </span>
            <h2 className="mt-5 font-display text-2xl font-semibold text-ink">Belum ada desa yang dianalisis</h2>
            <p className="mt-2 max-w-sm text-sm text-ink/50">
              Jadilah yang pertama — isi profil desa, unggah foto, dan terima laporan strategi dalam hitungan menit.
            </p>
            <div className="mt-6"><CtaButton href="/analisis">Mulai Analisis Pertama</CtaButton></div>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((r) => (
              <Link
                key={r.id}
                href={`/hasil/${r.id}`}
                className="group overflow-hidden rounded-3xl border border-ink/10 bg-paper transition-all duration-300 hover:-translate-y-1.5 hover:border-pine/25 hover:shadow-[0_36px_70px_-40px_rgba(23,62,44,0.5)]"
              >
                <div className="relative h-44 overflow-hidden">
                  {r.firstPhoto ? (
                    <Image
                      src={r.firstPhoto}
                      alt={`Foto ${r.villageName}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="size-full bg-parchment" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                  <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${CATEGORY_STYLES[r.category ?? ""] ?? "bg-sprout text-ink"}`}>
                    {r.category}
                  </span>
                  <span className="absolute bottom-3 left-4 flex items-center gap-1.5 text-[11px] font-semibold text-paper/80">
                    <Images className="size-3.5" /> {r.photoCount} foto dianalisis
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-xl font-semibold text-ink">Desa {r.villageName}</h2>
                      <p className="mt-1 flex items-center gap-1.5 text-[12px] text-ink/50">
                        <MapPin className="size-3.5" /> {r.city}, {r.province}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-3xl font-bold text-pine">{r.readinessScore}</p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-ink/35">skor</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-ink/8 pt-3.5">
                    <p className="text-[11px] text-ink/40">
                      {new Date(r.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[12px] font-bold text-pine">
                      Lihat laporan <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
