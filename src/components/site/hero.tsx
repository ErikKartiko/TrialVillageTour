"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Camera, Gauge } from "lucide-react";
import { CountUp } from "@/components/shared";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section ref={ref} className="relative overflow-hidden pt-[72px]">
      {/* backdrop dekor */}
      <div className="dot-grid absolute inset-0 text-pine opacity-[0.05]" />
      <div className="absolute -left-40 top-24 size-[540px] rounded-full bg-fern/25 blur-[120px]" />
      <div className="absolute -right-32 bottom-0 size-[480px] rounded-full bg-gold/20 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-5 pb-20 pt-12 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-20">
        {/* ── Kolom teks ─────────────────────────────── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-pine/15 bg-paper/70 px-4 py-1.5 backdrop-blur"
          >
            <Sparkles className="size-3.5 text-gold" />
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-pine">
              Analisis AI untuk Desa Wisata
            </span>
          </motion.div>

          <h1 className="headline-balance mt-6 font-display text-[clamp(2.6rem,6.2vw,4.9rem)] font-medium leading-[1.02] tracking-tight text-ink">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease }}
            >
              Petakan Potensi
            </motion.span>
            <motion.span
              className="block italic text-pine"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.18, ease }}
            >
              Desa Wisata Anda
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.28, ease }}
            >
              dalam <span className="italic text-clay">hitungan menit.</span>
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
            className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink/60"
          >
            Unggah informasi desa dan beberapa foto — POTENSIA membaca daya tarik,
            menimbang kesiapan, lalu menyusun strategi pengembangan yang siap
            dipresentasikan hari ini juga.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.52, ease }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/analisis"
              className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-sm font-bold text-paper transition-all duration-300 hover:bg-pine"
            >
              Analisis Desa Saya — Gratis
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="#pratinjau"
              className="inline-flex items-center gap-2 rounded-full border border-pine/20 px-7 py-4 text-sm font-bold text-pine transition-colors hover:bg-pine hover:text-paper"
            >
              Lihat Contoh Hasil
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.75 }}
            className="mt-12 grid grid-cols-3 gap-6 border-t border-ink/10 pt-8"
          >
            {[
              { v: 9, s: " dimensi", l: "Analisis terpadu per laporan" },
              { v: 6, s: "A", l: "Kerangka pariwisata teruji" },
              { v: 5, s: " mnt", l: "Dari unggah hingga laporan" },
            ].map((it) => (
              <div key={it.l}>
                <p className="font-display text-3xl font-semibold text-pine md:text-4xl">
                  <CountUp to={it.v} suffix={it.s} />
                </p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-ink/45">{it.l}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Kolom visual ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.3, ease }}
          className="relative mx-auto w-full max-w-[520px]"
        >
          {/* Bingkai melengkung */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-t-[999px] rounded-b-[36px] border border-pine/15" />
            <motion.div style={{ y: imgY }} className="relative overflow-hidden rounded-t-[999px] rounded-b-[28px]">
              <Image
                src="/images/hero-village.jpg"
                alt="Desa di antara terasering saat matahari terbit"
                width={1040}
                height={1300}
                className="h-[440px] w-full object-cover sm:h-[540px]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pine/45 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <p className="max-w-[220px] font-display text-sm italic text-paper/90">
                  “Setiap desa menyimpan cerita — data hanya membantu membacanya.”
                </p>
              </div>
            </motion.div>
          </div>

          {/* Kartu 1 · Skor kesiapan */}
          <motion.div
            style={{ y: cardY }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.9, ease }}
            className="absolute -left-6 top-16 animate-float-slow rounded-2xl border border-ink/8 bg-paper/95 p-4 shadow-[0_20px_50px_-20px_rgba(15,36,26,0.45)] backdrop-blur sm:-left-12"
          >
            <div className="flex items-center gap-3">
              <div
                className="grid size-14 place-items-center rounded-full"
                style={{ background: "conic-gradient(#1e5138 0 86%, #e7e0cd 86% 100%)" }}
              >
                <div className="grid size-11 place-items-center rounded-full bg-paper">
                  <span className="font-display text-base font-bold text-pine">86</span>
                </div>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-ink/45">
                  <Gauge className="size-3" /> Skor Kesiapan
                </p>
                <p className="mt-0.5 text-sm font-bold text-pine">Sangat Siap</p>
              </div>
            </div>
          </motion.div>

          {/* Kartu 2 · Pendapatan */}
          <motion.div
            style={{ y: cardY }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 1.05, ease }}
            className="absolute -right-4 bottom-24 animate-float-med rounded-2xl border border-ink/8 bg-ink/95 p-4 text-paper shadow-[0_20px_50px_-20px_rgba(15,36,26,0.6)] backdrop-blur sm:-right-10"
          >
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-paper/50">
              <TrendingUp className="size-3 text-sprout" /> Simulasi Tahun-1
            </p>
            <p className="mt-1 font-display text-xl font-semibold text-sprout">Rp 412 jt</p>
            <p className="text-[10px] text-paper/50">skenario moderat · 18 lapangan kerja</p>
          </motion.div>

          {/* Kartu 3 · Foto AI */}
          <motion.div
            style={{ y: cardY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.2, ease }}
            className="absolute -bottom-6 left-8 flex animate-float-slow items-center gap-3 rounded-2xl border border-ink/8 bg-paper/95 p-3.5 shadow-[0_20px_50px_-20px_rgba(15,36,26,0.45)] backdrop-blur"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-gold/15 text-gold">
              <Camera className="size-4.5" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink/45">Analisis Visual</p>
              <p className="text-xs font-bold text-ink">Vegetasi dominan 78%</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
