import { db } from "@/db";
import { villageAnalyses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin, CalendarDays, ArrowLeft, ArrowUpRight, BadgeCheck,
  ShieldCheck, TriangleAlert, DoorOpen, Sparkles, ListOrdered,
  Milestone, Compass, Layers, ScanEye, Grid3x3, TrendingUp,
  Megaphone, Quote, Check, Crosshair, Package, Palette,
} from "lucide-react";
import type { AnalysisReport } from "@/lib/analysis/catalog";
import { Logo } from "@/components/shared";
import { Footer } from "@/components/site/chrome";
import { ScoreGauge, RadarChart, AnimBar, RevenuePanel, PrintButton } from "@/components/report/viz";

export const dynamic = "force-dynamic";

const CATEGORY_STYLES: Record<string, string> = {
  Pionir: "bg-sprout text-ink",
  Berkembang: "bg-fern text-ink",
  Potensial: "bg-gold text-ink",
  Tumbuh: "bg-[#e0a184] text-ink",
  Rintisan: "bg-[#e0836a] text-ink",
};

export default async function HasilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [row] = await db.select().from(villageAnalyses).where(eq(villageAnalyses.id, id)).limit(1);
  if (!row || row.status !== "completed" || !row.report) return notFound();

  const report = row.report as unknown as AnalysisReport;
  const generatedDate = new Date(report.generatedAt).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });
  const sorted6A = [...report.sixA].sort((a, b) => b.score - a.score);

  const NAV = [
    ["analisis-6a", "6A"], ["visual", "Visual"], ["swot", "SWOT"], ["pendapatan", "Pendapatan"],
    ["branding", "Branding"], ["prioritas", "Prioritas"], ["roadmap", "Roadmap"], ["rekomendasi", "Rekomendasi"],
  ] as const;

  return (
    <main className="relative min-h-screen overflow-x-clip">
      {/* ═══ HERO ═══ */}
      <header className="relative overflow-hidden bg-pine text-paper">
        <div className="dot-grid absolute inset-0 text-sprout opacity-[0.06]" />
        <div className="absolute -right-32 top-0 size-[480px] rounded-full bg-forest blur-[110px]" />
        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-6 md:px-8">
          <div className="no-print flex items-center justify-between">
            <Logo dark />
            <Link
              href="/analisis"
              className="group inline-flex items-center gap-2 rounded-full border border-paper/20 px-4 py-2 text-[12px] font-bold text-paper/80 transition-all hover:bg-sprout hover:text-ink"
            >
              Analisis desa lain <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.15fr_auto]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider ${CATEGORY_STYLES[report.categoryShort] ?? "bg-sprout text-ink"}`}>
                  <BadgeCheck className="size-3.5" /> {report.category}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-paper/20 px-3.5 py-1.5 text-[11px] font-semibold text-paper/60">
                  <CalendarDays className="size-3.5" /> {generatedDate}
                </span>
              </div>
              <h1 className="headline-balance mt-5 font-display text-4xl font-medium leading-[1.05] md:text-6xl">
                Laporan Potensi Wisata—<br className="hidden md:block" />
                <span className="italic text-sprout">Desa {row.villageName}</span>
              </h1>
              <p className="mt-3 flex items-center gap-2 text-sm text-paper/60">
                <MapPin className="size-4" /> {row.district}, {row.city}, {row.province}
                {row.population ? ` · ${row.population.toLocaleString("id-ID")} jiwa` : ""}
                {row.areaHa ? ` · ${row.areaHa.toLocaleString("id-ID")} ha` : ""}
              </p>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-paper/65">{report.categoryDesc}</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <ScoreGauge score={report.readinessScore} />
              <p className="text-center text-[10px] font-bold uppercase tracking-[0.25em] text-paper/50">
                Skor Kesiapan Desa Wisata
              </p>
            </div>
          </div>

          {/* Metrik kunci */}
          <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {report.keyMetrics.map((m) => (
              <div key={m.label} className="rounded-2xl border border-paper/10 bg-paper/[0.05] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-paper/40">{m.label}</p>
                <p className={`mt-1.5 truncate font-display text-xl font-semibold ${
                  m.tone === "good" ? "text-sprout" : m.tone === "bad" ? "text-[#f0b09a]" : "text-paper"
                }`}>
                  {m.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ═══ NAV STICKY ═══ */}
      <nav className="no-print sticky top-0 z-40 border-b border-ink/8 bg-paper/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-1.5 overflow-x-auto px-5 py-3 md:px-8">
          <span className="mr-2 hidden shrink-0 text-[10px] font-bold uppercase tracking-widest text-ink/35 md:block">Isi laporan</span>
          {NAV.map(([href, label]) => (
            <a
              key={href}
              href={`#${href}`}
              className="shrink-0 rounded-full border border-ink/10 px-3.5 py-1.5 text-[11px] font-bold text-ink/55 transition-all hover:border-pine hover:bg-pine hover:text-paper"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-7xl space-y-24 px-5 py-16 md:px-8 md:py-24">
        {/* ═══ 01 · 6A ═══ */}
        <section id="analisis-6a" className="scroll-mt-24">
          <SectionHead
            icon={Layers}
            no="01"
            kicker="Analisis 6A Pariwisata"
            title="Enam komponen pembentuk destinasi, ditimbang jujur."
          />
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr]">
            <div className="rounded-3xl border border-ink/10 bg-paper p-6">
              <RadarChart values={sorted6A.map((s) => s.score)} labels={sorted6A.map((s) => s.label)} />
              <div className="mt-4 space-y-1.5 border-t border-ink/8 pt-4 text-[11px] text-ink/55">
                <p className="flex items-center gap-2"><ShieldCheck className="size-3.5 text-moss" /> Terkuat: {sorted6A[0].label} ({sorted6A[0].score})</p>
                <p className="flex items-center gap-2"><TriangleAlert className="size-3.5 text-clay" /> Terlemah: {sorted6A[sorted6A.length - 1].label} ({sorted6A[sorted6A.length - 1].score})</p>
              </div>
            </div>
            <div className="space-y-4">
              {report.sixA.map((s) => (
                <div key={s.key} className="rounded-3xl border border-ink/10 bg-paper p-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-bold text-ink">{s.label}</p>
                    <p className={`font-display text-2xl font-bold ${s.score >= 70 ? "text-moss" : s.score >= 45 ? "text-gold" : "text-clay"}`}>
                      {s.score}
                    </p>
                  </div>
                  <AnimBar pct={s.score} tone={s.score >= 70 ? "pine" : s.score >= 45 ? "gold" : "clay"} className="mt-2.5" />
                  <p className="mt-3 text-[13px] leading-relaxed text-ink/55">{s.note}</p>
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {s.sub.map((sb) => (
                      <span
                        key={sb.label}
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          sb.score >= 70 ? "bg-pine/8 text-pine" : sb.score >= 40 ? "bg-gold/12 text-[#a55f13]" : "bg-clay/10 text-clay"
                        }`}
                      >
                        {sb.label} · {sb.score}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 02 · VISUAL ═══ */}
        <section id="visual" className="scroll-mt-24">
          <SectionHead
            icon={ScanEye}
            no="02"
            kicker="Analisis Visual Foto"
            title="AI membaca karakter visual desa dari setiap frame."
          />
          <div className="mt-10 rounded-3xl border border-ink/10 bg-pine p-6 text-paper md:p-8">
            <div className="grid gap-6 md:grid-cols-5">
              {[
                ["Vegetasi", report.visualSummary.avgGreenness],
                ["Langit / Perairan", report.visualSummary.avgBlueness],
                ["Kecerahan", report.visualSummary.avgBrightness],
                ["Kekayaan warna", report.visualSummary.avgColorfulness],
                ["Kualitas rata-rata", report.visualSummary.avgQuality],
              ].map(([label, v]) => (
                <div key={label as string}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-paper/45">{label}</p>
                  <p className="mt-1 font-display text-3xl font-bold text-sprout">{v}%</p>
                </div>
              ))}
            </div>
            <p className="mt-6 border-t border-paper/10 pt-5 text-sm italic leading-relaxed text-paper/75">
              “{report.visualSummary.note}”
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {report.photos.map((p, i) => (
              <figure key={p.filePath} className="group overflow-hidden rounded-3xl border border-ink/10 bg-paper">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={p.filePath}
                    alt={`Foto desa ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-[10px] font-bold text-paper backdrop-blur">
                    FOTO {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold backdrop-blur ${
                    p.quality >= 58 ? "bg-sprout/90 text-ink" : p.quality >= 42 ? "bg-gold/90 text-ink" : "bg-[#e0836a]/90 text-ink"
                  }`}>
                    {p.quality}/100
                  </span>
                  <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-[11px] font-bold text-paper">{p.verdict}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {p.tags.map((t) => (
                        <span key={t} className="rounded-full bg-paper/20 px-2 py-0.5 text-[9px] font-bold text-paper backdrop-blur">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <figcaption className="space-y-2 p-4">
                  {[
                    ["Vegetasi", p.greenness, "pine"],
                    ["Warna", p.colorfulness, "gold"],
                    ["Kecerahan", p.brightness, "sprout"],
                  ].map(([label, v, tone]) => (
                    <div key={label as string} className="grid grid-cols-[70px_1fr_32px] items-center gap-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-ink/45">{label}</span>
                      <AnimBar pct={v as number} tone={tone as "pine" | "gold" | "sprout"} className="h-1.5" />
                      <span className="text-right text-[11px] font-bold text-ink/60">{v}</span>
                    </div>
                  ))}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ═══ 03 · SWOT ═══ */}
        <section id="swot" className="scroll-mt-24">
          <SectionHead
            icon={Grid3x3}
            no="03"
            kicker="Analisis SWOT"
            title="Empat medan yang wajib dipahami pengambil keputusan."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <SwotCard
              letter="S" title="Kekuatan" tone="strength"
              items={report.swot.strengths}
            />
            <SwotCard
              letter="W" title="Kelemahan" tone="weakness"
              items={report.swot.weaknesses}
            />
            <SwotCard
              letter="O" title="Peluang" tone="opportunity"
              items={report.swot.opportunities}
            />
            <SwotCard
              letter="T" title="Ancaman" tone="threat"
              items={report.swot.threats}
            />
          </div>
        </section>

        {/* ═══ 04 · PENDAPATAN ═══ */}
        <section id="pendapatan" className="scroll-mt-24">
          <SectionHead
            icon={TrendingUp}
            no="04"
            kicker="Simulasi Potensi Pendapatan"
            title="Jika dikelola serius, berapa yang bisa mengalir ke desa?"
          />
          <div className="mt-10">
            <RevenuePanel scenarios={report.revenue.scenarios} spendBreakdown={report.revenue.spendBreakdown} />
            <div className="mt-5 rounded-3xl border border-gold/25 bg-gold/8 p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a55f13]">Asumsi simulasi</p>
              <ul className="mt-3 space-y-2">
                {report.revenue.assumptions.map((a) => (
                  <li key={a} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink/65">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-gold" strokeWidth={3} /> {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ═══ 05 · BRANDING & TARGET PASAR ═══ */}
        <section id="branding" className="scroll-mt-24">
          <SectionHead
            icon={Megaphone}
            no="05"
            kicker="Branding & Target Pasar"
            title="Bagaimana desa sebaiknya memperkenalkan diri ke dunia."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5">
              <div className="rounded-3xl border border-ink/10 bg-ink p-7 text-paper">
                <Quote className="size-6 text-gold" />
                <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.22em] text-paper/45">Arahan tagline</p>
                {report.branding.taglines.map((t, i) => (
                  <p key={t} className={`font-display ${i === 0 ? "mt-3 text-2xl font-semibold text-sprout md:text-3xl" : "mt-2 text-base italic text-paper/65"}`}>
                    “{t}”
                  </p>
                ))}
              </div>
              <div className="rounded-3xl border border-ink/10 bg-paper p-7">
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ink/45">
                  <Crosshair className="size-4 text-clay" /> Posisi strategis
                </p>
                <p className="mt-3 text-[14px] leading-relaxed text-ink/70">{report.branding.positioning}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {report.branding.keywords.map((k) => (
                    <span key={k} className="rounded-full bg-pine/8 px-3.5 py-1.5 text-[11px] font-bold text-pine">#{k}</span>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-ink/10 bg-paper p-7">
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ink/45">
                  <Palette className="size-4 text-moss" /> Palet identitas visual
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {report.branding.palette.map((c) => (
                    <div key={c.hex} className="overflow-hidden rounded-2xl border border-ink/8">
                      <div className="h-16" style={{ backgroundColor: c.hex }} />
                      <div className="bg-paper p-2.5">
                        <p className="text-[11px] font-bold text-ink">{c.name}</p>
                        <p className="font-mono text-[10px] text-ink/40">{c.hex}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-3xl border border-ink/10 bg-paper p-7">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink/45">Target pasar prioritas</p>
                <div className="mt-5 space-y-5">
                  {report.targetMarkets.map((m, i) => (
                    <div key={m.segment}>
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[13px] font-bold text-ink">
                          <span className="mr-2 font-display italic text-ink/30">{String(i + 1).padStart(2, "0")}</span>
                          {m.segment}
                        </p>
                        <span className="rounded-full bg-pine/8 px-2.5 py-1 font-display text-[13px] font-bold text-pine">{m.fit}%</span>
                      </div>
                      <AnimBar pct={m.fit} tone={i === 0 ? "pine" : "sprout"} className="mt-2 h-2" />
                      <p className="mt-1.5 text-[11px] leading-relaxed text-ink/45">{m.note}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-ink/10 bg-paper p-7">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink/45">Signature experience usulan</p>
                <ul className="mt-4 space-y-2.5">
                  {report.branding.signatureExperiences.map((e) => (
                    <li key={e} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink/70">
                      <Sparkles className="mt-0.5 size-3.5 shrink-0 text-gold" /> {e}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-ink/10 bg-paper p-7">
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ink/45">
                  <Package className="size-4 text-moss" /> Ide paket wisata
                </p>
                <div className="mt-4 space-y-3">
                  {report.branding.packages.map((p) => (
                    <div key={p.name} className="rounded-2xl bg-parchment/70 p-4">
                      <p className="font-display text-[15px] font-semibold text-pine">“{p.name}”</p>
                      <p className="mt-1 text-[12px] leading-relaxed text-ink/55">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 06 · PRIORITAS ═══ */}
        <section id="prioritas" className="scroll-mt-24">
          <SectionHead
            icon={ListOrdered}
            no="06"
            kicker="Prioritas Pengembangan"
            title="Lima gerakan pertama yang paling berdampak."
          />
          <div className="mt-10 space-y-4">
            {report.priorities.map((p) => (
              <div
                key={p.rank}
                className="group grid gap-5 rounded-3xl border border-ink/10 bg-paper p-6 transition-all duration-300 hover:border-pine/25 hover:shadow-[0_30px_60px_-40px_rgba(23,62,44,0.5)] md:grid-cols-[80px_1fr_auto] md:items-center"
              >
                <div className="flex items-center gap-4 md:block">
                  <p className="font-display text-5xl font-bold italic text-pine/15 transition-colors group-hover:text-gold">
                    {String(p.rank).padStart(2, "0")}
                  </p>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-pine/8 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-pine">{p.component}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ink/35">{p.timeline}</span>
                  </div>
                  <h3 className="mt-2 font-display text-xl font-semibold text-ink">{p.title}</h3>
                  <p className="mt-1.5 max-w-3xl text-[13px] leading-relaxed text-ink/55">{p.detail}</p>
                </div>
                <div className="flex flex-row gap-2 md:flex-col md:items-end">
                  <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${p.impact === "Tinggi" ? "bg-clay/10 text-clay" : "bg-gold/12 text-[#a55f13]"}`}>
                    Dampak {p.impact}
                  </span>
                  <span className="rounded-full bg-ink/5 px-3 py-1 text-[10px] font-bold text-ink/50">
                    Upaya {p.effort}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ 07 · ROADMAP ═══ */}
        <section id="roadmap" className="scroll-mt-24">
          <SectionHead
            icon={Milestone}
            no="07"
            kicker="Roadmap Desa Wisata"
            title="Peta jalan tiga fase, dari fondasi hingga pengakuan."
          />
          <div className="relative mt-10">
            <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-ink/10 lg:block" />
            <div className="grid gap-6 lg:grid-cols-3">
              {report.roadmap.map((phase, i) => (
                <div key={phase.phase} className="relative rounded-3xl border border-ink/10 bg-paper p-7">
                  <span className={`absolute -top-3.5 left-7 rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
                    i === 0 ? "bg-pine text-paper" : i === 1 ? "bg-gold text-ink" : "bg-clay text-paper"
                  }`}>
                    {phase.phase} · {phase.period}
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-semibold text-ink">{phase.title}</h3>
                  <p className="mt-1.5 text-[12px] italic leading-relaxed text-ink/50">{phase.focus}</p>
                  <ul className="mt-5 space-y-3">
                    {phase.tasks.map((t, j) => (
                      <li key={j} className="flex items-start gap-3 rounded-2xl bg-parchment/60 p-3.5 text-[12.5px] leading-relaxed text-ink/70">
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-pine/10 font-display text-[10px] font-bold text-pine">
                          {j + 1}
                        </span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 08 · REKOMENDASI ═══ */}
        <section id="rekomendasi" className="scroll-mt-24">
          <SectionHead
            icon={Compass}
            no="08"
            kicker="Rekomendasi Strategis"
            title="Nasihat terakhir — bisa langsung dieksekusi pekan ini."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {report.recommendations.map((r, i) => (
              <div key={r.title} className="group relative overflow-hidden rounded-3xl border border-ink/10 bg-paper p-7 transition-all duration-300 hover:border-pine/25">
                <span className="pointer-events-none absolute -right-3 -top-7 font-display text-[110px] font-bold italic leading-none text-pine/[0.06]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-gold/12 font-display text-sm font-bold text-gold">{i + 1}</span>
                  <h3 className="font-display text-lg font-semibold leading-snug text-ink">{r.title}</h3>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-ink/60">{r.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ CTA AKHIR ═══ */}
        <section className="relative overflow-hidden rounded-[36px] bg-ink px-8 py-14 text-paper md:px-14">
          <div className="dot-grid absolute inset-0 text-sprout opacity-[0.06]" />
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="eyebrow text-[10px] font-bold uppercase text-sprout/80">Dokumen ini milik desa Anda</p>
              <h2 className="headline-balance mt-3 max-w-xl font-display text-3xl font-medium leading-tight md:text-4xl">
                Bawa laporan ini ke <span className="italic text-sprout">musyawarah desa</span> berikutnya.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-paper/55">
                Cetak atau simpan sebagai PDF untuk dibagikan ke pemerintah desa, BUMDes, Pokdarwis,
                dan dinas pariwisata setempat.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <PrintButton />
              <Link
                href="/analisis"
                className="no-print inline-flex items-center gap-2.5 rounded-full bg-sprout px-6 py-3 text-[13px] font-bold text-ink transition-all hover:bg-gold"
              >
                <Sparkles className="size-4" /> Analisis Desa Lain
              </Link>
            </div>
          </div>
          <p className="relative mt-10 border-t border-paper/10 pt-5 text-[11px] leading-relaxed text-paper/35">
            <DoorOpen className="mr-1.5 inline size-3.5" />
            Potensia menghasilkan rekomendasi indikatif berbasis data yang Anda berikan. Verifikasi kondisi lapangan,
            tata ruang, dan aspek legal tetap direkomendasikan sebelum eksekusi besar.
          </p>
        </section>

        <div className="no-print flex justify-center pb-4">
          <Link href="/" className="inline-flex items-center gap-2 text-[13px] font-bold text-ink/40 transition-colors hover:text-pine">
            <ArrowLeft className="size-4" /> Kembali ke beranda
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}

// ── Heading section ─────────────────────────────────────────────────────────
function SectionHead({
  icon: Icon, no, kicker, title,
}: {
  icon: React.ElementType; no: string; kicker: string; title: string;
}) {
  return (
    <div className="flex flex-col gap-6 border-b border-ink/10 pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-pine text-paper">
            <Icon className="size-5" strokeWidth={1.9} />
          </span>
          <div>
            <p className="eyebrow text-[10px] font-bold uppercase text-pine/70">{kicker}</p>
            <p className="font-display text-lg italic text-ink/30">{no}</p>
          </div>
        </div>
        <h2 className="headline-balance mt-4 max-w-xl font-display text-3xl font-medium leading-[1.1] tracking-tight text-ink md:text-4xl">
          {title}
        </h2>
      </div>
    </div>
  );
}

// ── Kartu SWOT ──────────────────────────────────────────────────────────────
const SWOT_TONES = {
  strength: { bg: "bg-pine", chip: "bg-sprout text-ink", li: "text-paper/75", letter: "text-sprout/20" },
  weakness: { bg: "bg-clay", chip: "bg-ink/15 text-paper", li: "text-paper/80", letter: "text-ink/20" },
  opportunity: { bg: "bg-gold", chip: "bg-ink/10 text-ink", li: "text-ink/70", letter: "text-ink/10" },
  threat: { bg: "bg-rust", chip: "bg-ink/15 text-paper", li: "text-paper/80", letter: "text-ink/20" },
} as const;

function SwotCard({
  letter, title, tone, items,
}: {
  letter: string; title: string; tone: keyof typeof SWOT_TONES; items: string[];
}) {
  const t = SWOT_TONES[tone];
  return (
    <div className={`relative overflow-hidden rounded-3xl p-7 ${t.bg}`}>
      <span className={`pointer-events-none absolute -right-4 -top-8 font-display text-[150px] font-bold italic leading-none ${t.letter}`}>
        {letter}
      </span>
      <div className="relative">
        <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${t.chip}`}>{title}</span>
        <ul className="mt-5 space-y-3">
          {items.map((it) => (
            <li key={it} className={`flex items-start gap-3 text-[13px] leading-relaxed ${t.li}`}>
              <Check className="mt-1 size-3.5 shrink-0 opacity-70" strokeWidth={3} />
              {it}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
