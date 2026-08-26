"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Check, LoaderCircle, ScanEye, Layers, Grid3x3, TrendingUp,
  Megaphone, Map as MapIcon, Compass, Camera, AlertTriangle, FileText,
} from "lucide-react";

const LOG_STEPS = [
  { icon: FileText, text: "Membaca profil & struktur sosial desa…", delay: 400 },
  { icon: Camera, text: "Memindai karakter visual tiap foto desa…", delay: 2400 },
  { icon: ScanEye, text: "Mengukur vegetasi, warna & kualitas gambar…", delay: 4400 },
  { icon: Layers, text: "Menghitung skor 6A Pariwisata…", delay: 6400 },
  { icon: Grid3x3, text: "Menyusun matriks SWOT kontekstual…", delay: 8400 },
  { icon: TrendingUp, text: "Menjalankan simulasi pendapatan 12 bulan…", delay: 10400 },
  { icon: Megaphone, text: "Meracik ide branding & segmen target pasar…", delay: 12400 },
  { icon: MapIcon, text: "Menyusun prioritas & roadmap 3 fase…", delay: 14400 },
  { icon: Compass, text: "Menulis rekomendasi strategis akhir…", delay: 16400 },
];

const TOTAL_DURATION = 18500;

export function ProcessRunner({ id }: { id: string }) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [failed, setFailed] = useState<string | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const completedRef = useRef(false);

  // Animasi progres — menunggu analisis selesai DAN animasi tuntas
  useEffect(() => {
    const start = Date.now();
    let finished = false;
    const t = setInterval(() => {
      const elapsed = Date.now() - start;
      const raw = Math.min(elapsed / TOTAL_DURATION, 1);
      const eased = raw < 0.92 ? raw : 0.92 + (raw - 0.92) * 0.25;
      const canFinish = elapsed >= TOTAL_DURATION && completedRef.current && !finished;
      setProgress(canFinish ? 1 : Math.min(eased, 0.97));
      setDoneCount(
        canFinish || completedRef.current
          ? LOG_STEPS.length
          : LOG_STEPS.filter((s) => elapsed >= s.delay).length
      );
      if (canFinish) {
        finished = true;
        clearInterval(t);
        setTimeout(() => router.replace(`/hasil/${id}`), 1100);
      }
    }, 90);
    return () => clearInterval(t);
  }, [id, router]);

  // Polling status analisis
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/analyses/${id}`, { cache: "no-store" });
        const json = await res.json();
        if (json?.analysis?.status === "completed") {
          completedRef.current = true;
          if (pollRef.current) clearInterval(pollRef.current);
        } else if (json?.analysis?.status === "failed") {
          if (pollRef.current) clearInterval(pollRef.current);
          setFailed(json.analysis.error || "Analisis gagal diproses.");
        }
      } catch {
        // abaikan kesalahan jaringan sementara, lanjut polling
      }
    };
    const start = setTimeout(() => {
      poll();
      pollRef.current = setInterval(poll, 1500);
    }, 4000);
    return () => {
      clearTimeout(start);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [id, router]);

  const pct = Math.round(progress * 100);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink px-5 py-20 text-paper">
      <div className="dot-grid absolute inset-0 text-sprout opacity-[0.05]" />
      <div className="absolute left-1/2 top-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-forest/50 blur-[140px]" />

      {/* Scanner rings */}
      <div className="relative mb-10 grid size-40 place-items-center">
        <motion.div
          className="absolute inset-0 rounded-full border border-sprout/25"
          animate={{ scale: [1, 1.35], opacity: [0.8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border border-sprout/20"
          animate={{ scale: [1, 1.35], opacity: [0.8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
        />
        <div className="grid size-32 place-items-center rounded-full border border-sprout/30 bg-forest/40">
          <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90">
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(185,217,137,0.15)" strokeWidth="3.5" />
            <motion.circle
              cx="50" cy="50" r="44" fill="none" stroke="#b9d989" strokeWidth="3.5" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 44}
              animate={{ strokeDashoffset: 2 * Math.PI * 44 * (1 - progress) }}
              transition={{ duration: 0.25 }}
            />
          </svg>
          <span className="font-display text-3xl font-bold text-sprout">{pct}<span className="text-base">%</span></span>
        </div>
      </div>

      <div className="relative text-center">
        <p className="eyebrow text-[10px] font-bold uppercase text-sprout/80">AI sedang bekerja</p>
        <h1 className="headline-balance mt-3 font-display text-3xl font-medium md:text-4xl">
          Meramu laporan desa wisata Anda…
        </h1>
      </div>

      {/* Log terminal */}
      <div className="relative mt-9 w-full max-w-md">
        <AnimatePresence>
          {failed ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-rust/40 bg-rust/15 p-5 text-center"
            >
              <AlertTriangle className="mx-auto size-6 text-[#e0836a]" />
              <p className="mt-2 text-sm font-bold">Analisis terhenti</p>
              <p className="mt-1 text-xs text-paper/60">{failed}</p>
              <Link
                href="/analisis"
                className="mt-4 inline-flex rounded-full bg-sprout px-5 py-2.5 text-[12px] font-bold text-ink hover:bg-gold"
              >
                Coba Lagi
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-2">
              {LOG_STEPS.map((s, i) => {
                const done = i < doneCount;
                const active = !failed && i === Math.min(doneCount, LOG_STEPS.length - 1);
                if (i > doneCount) return null;
                return (
                  <motion.div
                    key={s.text}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: done ? 0.55 : 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-3 rounded-xl border border-paper/10 bg-paper/[0.04] px-4 py-2.5"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-sprout/10 text-sprout">
                      <s.icon className="size-3.5" />
                    </span>
                    <p className="flex-1 text-[13px] font-medium text-paper/85">{s.text}</p>
                    {active && progress < 1 ? (
                      <LoaderCircle className="size-4 animate-spin text-sprout" />
                    ) : (
                      <Check className="size-4 text-sprout" strokeWidth={3} />
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      <p className="absolute bottom-8 text-center text-[11px] text-paper/35">
        Sembilan dimensi analisis sedang disusun menjadi satu dokumen strategi.
      </p>
    </div>
  );
}
