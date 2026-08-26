import Image from "next/image";
import Link from "next/link";
import {
  Layers, Grid3x3, ScanEye, Gauge, TrendingUp, Megaphone,
  ListOrdered, Milestone, Compass, Landmark, Store, Users,
  Building2, GraduationCap, Briefcase, ArrowRight, Check,
  Upload, ClipboardList, Sparkles, Mountain, Accessibility,
  ConciergeBell, BedDouble, Handshake, Radar,
} from "lucide-react";
import { Reveal, Eyebrow, CtaButton, CountUp } from "@/components/shared";

// ────────────────────────────────────────────────────────────────────────────
// FITUR — 9 hasil analisis
// ────────────────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Layers, title: "Analisis 6A Pariwisata", desc: "Atraksi, aksesibilitas, amenitas, akomodasi, ancillary, dan awareness dinilai satu per satu dengan sub-indikator." },
  { icon: Grid3x3, title: "Analisis SWOT", desc: "Kekuatan, kelemahan, peluang, dan ancaman digenerasi kontekstual dari data desa Anda — bukan templat kosong." },
  { icon: ScanEye, title: "Analisis Visual Foto", desc: "Setiap foto dibaca: dominasi vegetasi, kekayaan warna, kualitas, hingga kelayakan pakai untuk materi promosi." },
  { icon: Gauge, title: "Skor Kesiapan Desa Wisata", desc: "Satu angka 0–100 yang merangkum seluruh kesiapan desa, lengkap dengan kategori dari Rintisan hingga Pionir." },
  { icon: TrendingUp, title: "Simulasi Potensi Pendapatan", desc: "Proyeksi 12 bulan dalam tiga skenario — konservatif, moderat, optimistis — termasuk estimasi lapangan kerja." },
  { icon: Megaphone, title: "Ide Branding & Target Pasar", desc: "Tagline, palet warna merek, kata kunci kampanye, dan segmen pasar yang paling cocok dikejar pertama." },
  { icon: ListOrdered, title: "Prioritas Pengembangan", desc: "Lima gerakan teratas diurutkan berdasar dampak & upaya — langsung tahu harus mulai dari mana." },
  { icon: Milestone, title: "Roadmap Desa Wisata", desc: "Peta jalan tiga fase (0–3 bulan, 3–12 bulan, 1–3 tahun) dengan tugas konkret yang bisa ditandatangani." },
  { icon: Compass, title: "Rekomendasi Strategis", desc: "Nasihat tingkat strategi yang bisa langsung diterapkan pengelola — tanpa jargon konsultan yang mengambang." },
];

export function FeaturesSection() {
  return (
    <section id="fitur" className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <div className="max-w-2xl">
        <Eyebrow>Hasil yang Anda Terima</Eyebrow>
        <Reveal>
          <h2 className="headline-balance mt-4 font-display text-4xl font-medium leading-[1.06] tracking-tight text-ink md:text-5xl">
            Satu kali unggah, <span className="italic text-pine">sembilan analisis</span> strategis.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 text-[15px] leading-relaxed text-ink/60">
            Laporan yang biasanya membutuhkan konsultan berminggu-minggu kini tersaji otomatis —
            terukur, kontekstual, dan siap dipresentasikan ke musyawarah desa.
          </p>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={(i % 3) * 0.08} className="h-full">
            <div className="group flex h-full flex-col bg-paper p-7 transition-colors duration-300 hover:bg-parchment">
              <div className="flex items-start justify-between">
                <span className="grid size-11 place-items-center rounded-2xl bg-pine/8 text-pine transition-all duration-500 group-hover:bg-pine group-hover:text-paper">
                  <f.icon className="size-5" strokeWidth={1.8} />
                </span>
                <span className="font-display text-2xl font-light text-ink/20">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-6 font-display text-lg font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink/55">{f.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 6A — kerangka penilaian
// ────────────────────────────────────────────────────────────────────────────
const SIXA = [
  { icon: Mountain, a: "Attraction", t: "Atraksi", d: "Seberapa kuat alasan wisatawan datang: keragaman, keunikan, dan momentum kunjungan." },
  { icon: Accessibility, a: "Accessibility", t: "Aksesibilitas", d: "Kemudahan mencapai desa: jalan, transportasi, waktu tempuh, petunjuk arah, sinyal." },
  { icon: ConciergeBell, a: "Amenity", t: "Amenitas", d: "Fasilitas kenyamanan: toilet, warung, parkir, pos informasi, air bersih, dan kawan-kawan." },
  { icon: BedDouble, a: "Accommodation", t: "Akomodasi", d: "Kemampuan menahan tamu lebih lama: homestay, camping ground, dan kesiapannya." },
  { icon: Handshake, a: "Ancillary", t: "Layanan Pendukung", d: "Mesin penggerak operasional: Pokdarwis, BUMDes, pemandu, kebersihan, keamanan." },
  { icon: Radar, a: "Awareness", t: "Promosi & Kesadaran", d: "Seberapa terlihat desa di radar pasar: media sosial, event, kemitraan biro wisata." },
];

export function SixASection() {
  return (
    <section className="relative overflow-hidden bg-pine py-24 text-paper md:py-32">
      <div className="dot-grid absolute inset-0 text-sprout opacity-[0.06]" />
      <div className="absolute -right-40 -top-40 size-[500px] rounded-full bg-forest blur-[100px]" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-xl">
            <Eyebrow dark>Kerangka Penilaian</Eyebrow>
            <Reveal>
              <h2 className="headline-balance mt-4 font-display text-4xl font-medium leading-[1.06] tracking-tight md:text-5xl">
                Dinilai dengan kerangka <span className="italic text-sprout">6A</span> yang diakui dunia pariwisata.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <p className="max-w-sm text-sm leading-relaxed text-paper/60">
              Enam komponen pembentuk destinasi — masing-masing dipecah menjadi
              sub-indikator terukur, lalu digabung menjadi Skor Kesiapan Desa Wisata.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SIXA.map((s, i) => (
            <Reveal key={s.a} delay={i * 0.07}>
              <div className="group relative overflow-hidden rounded-3xl border border-paper/10 bg-forest/40 p-7 transition-all duration-500 hover:border-sprout/30 hover:bg-forest/70">
                <span className="pointer-events-none absolute -right-4 -top-6 font-display text-[120px] font-bold italic leading-none text-paper/[0.05]">
                  {s.a[0]}
                </span>
                <s.icon className="size-6 text-sprout" strokeWidth={1.8} />
                <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.25em] text-sprout/70">{s.a}</p>
                <h3 className="mt-1 font-display text-2xl font-semibold">{s.t}</h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-paper/60">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// CARA KERJA
// ────────────────────────────────────────────────────────────────────────────
const STEPS = [
  {
    icon: ClipboardList,
    n: "01",
    t: "Isi profil desa",
    d: "Kuesioner terpandu ±3 menit: identitas, daya tarik, akses, fasilitas, dan kelembagaan. Tak butuh data rumit.",
  },
  {
    icon: Upload,
    n: "02",
    t: "Unggah 3–8 foto desa",
    d: "Foto lanskap, atraksi, dan aktivitas warga. AI memindai karakter visual: vegetasi, warna, dan kualitas gambar.",
  },
  {
    icon: Sparkles,
    n: "03",
    t: "Terima laporan strategis",
    d: "Dalam hitungan menit: skor kesiapan, 6A, SWOT, simulasi pendapatan, branding, prioritas, dan roadmap siap pakai.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="cara-kerja" className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div className="relative order-2 lg:order-1">
          <Reveal>
            <div className="relative overflow-hidden rounded-[32px]">
              <Image
                src="/images/waterfall.jpg"
                alt="Wisatawan menikmati air terjun di desa"
                width={960}
                height={1100}
                className="h-[420px] w-full object-cover md:h-[540px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="absolute -bottom-6 -right-3 rounded-3xl border border-ink/8 bg-paper p-5 shadow-[0_24px_60px_-24px_rgba(15,36,26,0.5)] sm:right-8">
              <p className="font-display text-3xl font-semibold text-pine">
                <CountUp to={9} />
              </p>
              <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-ink/50">
                Dimensi analisis<br />dalam satu laporan
              </p>
            </div>
          </Reveal>
        </div>

        <div className="order-1 lg:order-2">
          <Eyebrow>Cara Kerja</Eyebrow>
          <Reveal>
            <h2 className="headline-balance mt-4 font-display text-4xl font-medium leading-[1.06] tracking-tight text-ink md:text-5xl">
              Tiga langkah, <span className="italic text-clay">tanpa menunggu minggu.</span>
            </h2>
          </Reveal>
          <div className="mt-10 space-y-2">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                <div className="group flex gap-5 rounded-3xl border border-transparent p-5 transition-all duration-300 hover:border-ink/8 hover:bg-parchment/60">
                  <div className="flex flex-col items-center">
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-pine text-paper">
                      <s.icon className="size-5" strokeWidth={1.9} />
                    </span>
                    {i < STEPS.length - 1 && <span className="mt-2 w-px flex-1 bg-ink/10" />}
                  </div>
                  <div className="pb-4">
                    <p className="font-display text-sm italic text-ink/35">{s.n}</p>
                    <h3 className="mt-0.5 font-display text-xl font-semibold text-ink">{s.t}</h3>
                    <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-ink/55">{s.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.35}>
            <div className="mt-6">
              <CtaButton href="/analisis">Coba Sekarang — Cukup Sekali Isi</CtaButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// PRATINJAU LAPORAN — mock dashboard dalam bingkai browser
// ────────────────────────────────────────────────────────────────────────────
export function PreviewSection() {
  return (
    <section id="pratinjau" className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-parchment/70 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center"><Eyebrow>Pratinjau Laporan</Eyebrow></div>
          <Reveal>
            <h2 className="headline-balance mt-4 font-display text-4xl font-medium leading-[1.06] tracking-tight text-ink md:text-5xl">
              Laporan yang membuat <span className="italic text-pine">musyawarah desa</span> terkesima.
            </h2>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="mx-auto mt-12 max-w-4xl [perspective:1200px]">
            <div className="rounded-2xl border border-ink/10 bg-ink shadow-[0_60px_120px_-40px_rgba(15,36,26,0.5)] transition-transform duration-700 [transform:rotateX(4deg)] hover:[transform:rotateX(0deg)]">
              {/* chrome browser */}
              <div className="flex items-center gap-2 border-b border-paper/10 px-5 py-3.5">
                <span className="size-3 rounded-full bg-rust/80" />
                <span className="size-3 rounded-full bg-gold/80" />
                <span className="size-3 rounded-full bg-fern" />
                <span className="ml-4 flex-1 truncate rounded-full bg-paper/10 px-4 py-1 font-mono text-[10px] text-paper/50">
                  potensia.id/hasil/desa-sukamaju
                </span>
              </div>
              {/* isi dashboard */}
              <div className="grid gap-4 p-5 md:grid-cols-[220px_1fr_1fr]">
                {/* skor */}
                <div className="flex flex-col items-center justify-center rounded-xl bg-paper/[0.06] p-5">
                  <div
                    className="grid size-28 place-items-center rounded-full"
                    style={{ background: "conic-gradient(#b9d989 0 86%, rgba(255,255,255,0.12) 86% 100%)" }}
                  >
                    <div className="grid size-22 place-items-center rounded-full bg-ink">
                      <div className="text-center">
                        <p className="font-display text-3xl font-bold text-sprout">86</p>
                        <p className="text-[8px] uppercase tracking-widest text-paper/40">/ 100</p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 rounded-full bg-sprout/15 px-3 py-1 text-[10px] font-bold text-sprout">Sangat Siap</p>
                </div>
                {/* radar mini */}
                <div className="rounded-xl bg-paper/[0.06] p-5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-paper/40">Analisis 6A</p>
                  <svg viewBox="0 0 200 150" className="mt-2 w-full">
                    {[30, 20, 10].map((r) => (
                      <polygon
                        key={r}
                        points={Array.from({ length: 6 }, (_, i) => {
                          const a = (Math.PI / 3) * i - Math.PI / 2;
                          return `${100 + r * 2 * Math.cos(a)},${75 + r * 2 * Math.sin(a)}`;
                        }).join(" ")}
                        fill="none"
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="0.7"
                      />
                    ))}
                    <polygon
                      points="100,17 148,75 120,121 78,123 54,63 92,30"
                      fill="rgba(185,217,137,0.35)"
                      stroke="#b9d989"
                      strokeWidth="1.6"
                    />
                  </svg>
                </div>
                {/* swot mini */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { l: "S", c: "bg-fern/25 text-sprout" },
                    { l: "W", c: "bg-clay/25 text-[#f0b09a]" },
                    { l: "O", c: "bg-gold/20 text-gold" },
                    { l: "T", c: "bg-rust/25 text-[#e0836a]" },
                  ].map((q) => (
                    <div key={q.l} className={`rounded-xl p-3 ${q.c.split(" ")[0]}`}>
                      <p className={`font-display text-lg font-bold ${q.c.split(" ")[1]}`}>{q.l}</p>
                      <div className="mt-1.5 space-y-1">
                        <div className="h-1 w-full rounded-full bg-paper/15" />
                        <div className="h-1 w-2/3 rounded-full bg-paper/15" />
                      </div>
                    </div>
                  ))}
                </div>
                {/* batang pendapatan */}
                <div className="rounded-xl bg-paper/[0.06] p-5 md:col-span-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-paper/40">
                      Simulasi Pendapatan 12 Bulan · Skenario Moderat
                    </p>
                    <p className="font-display text-sm font-semibold text-sprout">Rp 412.480.000</p>
                  </div>
                  <div className="mt-3 flex h-20 items-end gap-1.5">
                    {[24, 22, 28, 32, 38, 44, 62, 58, 40, 36, 34, 66].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-forest to-fern" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// UNTUK SIAPA
// ────────────────────────────────────────────────────────────────────────────
const AUDIENCES = [
  { icon: Landmark, t: "Pemerintah Desa", d: "Bahan presentasi musyawarah, dokumen RPJMDes, dan advokasi anggaran berbasis data." },
  { icon: Store, t: "BUMDes", d: "Menilai unit usaha wisata paling layak didahulukan, lengkap dengan simulasi arus kas tahunan." },
  { icon: Users, t: "Pokdarwis", d: "Bahan kerja konkret: prioritas 90 hari, agenda pelatihan pemandu, dan kalender promosi." },
  { icon: Building2, t: "Dinas Pariwisata", d: "Potret kesiapan banyak desa dalam satu kerangka seragam — mudah dibandingkan dan diprioritaskan." },
  { icon: GraduationCap, t: "Akademisi & Mahasiswa", d: "Instrumen riset lapangan: KKN, skripsi, hingga studi pengembangan wilayah dengan data terstruktur." },
  { icon: Briefcase, t: "Konsultan Pariwisata", d: "Baseline assessment dalam hitungan menit — sisakan waktu konsultan untuk intervensi yang benar-benar penting." },
];

export function AudienceSection() {
  return (
    <section id="pengguna" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div className="max-w-xl">
          <Eyebrow>Untuk Siapa</Eyebrow>
          <Reveal>
            <h2 className="headline-balance mt-4 font-display text-4xl font-medium leading-[1.06] tracking-tight text-ink md:text-5xl">
              Dirancang untuk semua <span className="italic text-pine">penjaga desa.</span>
            </h2>
          </Reveal>
        </div>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {AUDIENCES.map((a, i) => (
          <Reveal key={a.t} delay={(i % 3) * 0.08}>
            <div className="group h-full rounded-3xl border border-ink/8 bg-paper p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-pine/25 hover:shadow-[0_30px_60px_-30px_rgba(23,62,44,0.4)]">
              <div className="flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-2xl bg-gold/12 text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-ink">
                  <a.icon className="size-5.5" strokeWidth={1.8} />
                </span>
                <h3 className="font-display text-xl font-semibold text-ink">{a.t}</h3>
              </div>
              <p className="mt-4 text-[13px] leading-relaxed text-ink/55">{a.d}</p>
              <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-pine opacity-0 transition-all duration-300 group-hover:opacity-100">
                <Check className="size-3.5" /> Siap dipakai tanpa pelatihan
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// CTA BANNER
// ────────────────────────────────────────────────────────────────────────────
export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-28 md:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-[40px]">
          <Image
            src="/images/culture.jpg"
            alt="Festival budaya desa"
            width={1600}
            height={900}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/30" />
          <div className="relative px-8 py-20 md:px-16 md:py-28">
            <Eyebrow dark>Mulai Hari Ini</Eyebrow>
            <h2 className="headline-balance mt-5 max-w-2xl font-display text-4xl font-medium leading-[1.05] text-paper md:text-6xl">
              Desa Anda punya cerita. <span className="italic text-sprout">Kami bantu memetakannya.</span>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-paper/70">
              Gratis, tanpa instalasi, tanpa menunggu konsultan. Isi profil desa,
              unggah foto — dan bawa pulang dokumen strategi yang layak dipresentasikan.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/analisis"
                className="group inline-flex items-center gap-3 rounded-full bg-sprout px-8 py-4 text-sm font-bold text-ink transition-all duration-300 hover:bg-gold"
              >
                Analisis Desa Sekarang
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <span className="text-xs font-semibold text-paper/50">±5 menit sampai laporan jadi</span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
