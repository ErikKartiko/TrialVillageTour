"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Printer, TrendingUp, Users, Landmark, Wallet } from "lucide-react";
import type { RevenueScenario, SpendItem } from "@/lib/analysis/catalog";

const ease = [0.22, 1, 0.36, 1] as const;

// ─── Gauge skor kesiapan ────────────────────────────────────────────────────
export function ScoreGauge({ score, dark = true, size = 200 }: { score: number; dark?: boolean; size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1600;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      setVal(Math.round(score * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, score]);

  const R = 44;
  const C = 2 * Math.PI * R;
  const p = val / 100;

  return (
    <div ref={ref} className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle cx="50" cy="50" r={R} fill="none" stroke={dark ? "rgba(244,239,227,0.12)" : "rgba(15,36,26,0.1)"} strokeWidth="6" />
        <circle
          cx="50" cy="50" r={R} fill="none"
          stroke="url(#gaugeGrad)" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - p)}
          style={{ transition: "stroke-dashoffset 0.15s linear" }}
        />
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#b9d989" />
            <stop offset="100%" stopColor="#e2932c" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <p className="font-display text-5xl font-bold leading-none">{val}</p>
          <p className={`mt-1 text-[9px] font-bold uppercase tracking-[0.25em] ${dark ? "text-paper/40" : "text-ink/40"}`}>
            dari 100
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Radar 6A ───────────────────────────────────────────────────────────────
export function RadarChart({ values, labels }: { values: number[]; labels: string[] }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const cx = 150;
  const cy = 132;
  const maxR = 96;
  const n = 6;

  const pt = (i: number, r: number): [number, number] => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };

  const gridPoly = (frac: number) =>
    Array.from({ length: n }, (_, i) => pt(i, maxR * frac).join(",")).join(" ");
  const dataPoly = Array.from({ length: n }, (_, i) => pt(i, Math.max(maxR * (values[i] / 100), 6)).join(",")).join(" ");

  return (
    <svg ref={ref} viewBox="0 0 300 264" className="w-full">
      {[1, 0.75, 0.5, 0.25].map((f) => (
        <polygon key={f} points={gridPoly(f)} fill="none" stroke="rgba(15,36,26,0.12)" strokeWidth="1" />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const [x, y] = pt(i, maxR);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(15,36,26,0.1)" strokeWidth="1" />;
      })}
      <motion.polygon
        points={dataPoly}
        fill="rgba(63,125,82,0.28)"
        stroke="#3f7d52"
        strokeWidth="2.2"
        strokeLinejoin="round"
        style={{ transformOrigin: `${cx}px ${cy}px` }}
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 1.1, ease, delay: 0.2 }}
      />
      {Array.from({ length: n }, (_, i) => {
        const [x, y] = pt(i, Math.max(maxR * (values[i] / 100), 6));
        return (
          <motion.circle
            key={i}
            cx={x} cy={y} r="4"
            fill="#e2932c" stroke="#f4efe3" strokeWidth="2"
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
            style={{ transformOrigin: `${x}px ${y}px` }}
          />
        );
      })}
      {labels.map((l, i) => {
        const [x, y] = pt(i, maxR + 22);
        return (
          <text
            key={l}
            x={x} y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-ink/60 text-[9.5px] font-bold uppercase tracking-wide"
          >
            {l}
          </text>
        );
      })}
    </svg>
  );
}

// ─── Batang horizontal animasi ──────────────────────────────────────────────
export function AnimBar({ pct, tone = "pine", className = "" }: { pct: number; tone?: "pine" | "gold" | "clay" | "sprout"; className?: string }) {
  const colors = {
    pine: "from-pine to-moss",
    gold: "from-gold to-[#f0b45c]",
    clay: "from-clay to-[#dd8557]",
    sprout: "from-fern to-sprout",
  }[tone];
  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full bg-ink/8 ${className}`}>
      <motion.div
        className={`h-full rounded-full bg-gradient-to-r ${colors}`}
        initial={{ width: 0 }}
        whileInView={{ width: `${Math.max(pct, 2)}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease }}
      />
    </div>
  );
}

// ─── Panel pendapatan (tab skenario + grafik SVG) ───────────────────────────
function fmtMiliar(n: number): string {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toLocaleString("id-ID", { maximumFractionDigits: 2 })} miliar`;
  return `Rp ${(n / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} juta`;
}

export function RevenuePanel({ scenarios, spendBreakdown }: { scenarios: RevenueScenario[]; spendBreakdown: SpendItem[] }) {
  const [active, setActive] = useState(1);
  const s = scenarios[active];

  const W = 640;
  const H = 190;
  const pad = 8;
  const maxV = Math.max(...s.monthly.map((m) => m.visitors), 1);
  const pts = s.monthly.map((m, i) => {
    const x = pad + (i / (s.monthly.length - 1)) * (W - pad * 2);
    const y = H - pad - (m.visitors / maxV) * (H - pad * 2 - 50);
    return [x, y] as [number, number];
  });
  const line = pts.map((p) => p.join(",")).join(" ");
  const area = `${pad},${H - pad} ${line} ${W - pad},${H - pad}`;

  return (
    <div>
      {/* Tab skenario */}
      <div className="flex flex-wrap gap-2">
        {scenarios.map((sc, i) => (
          <button
            key={sc.key}
            onClick={() => setActive(i)}
            className={`rounded-full px-5 py-2.5 text-[12px] font-bold transition-all duration-300 ${
              i === active ? "bg-pine text-paper shadow-[0_12px_28px_-12px_rgba(23,62,44,0.7)]" : "border border-ink/12 text-ink/55 hover:border-pine/40"
            }`}
          >
            {sc.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-[12px] italic text-ink/45">{s.growthNote}</p>

      {/* Grafik */}
      <div key={s.key} className="mt-6 overflow-hidden rounded-3xl border border-ink/8 bg-parchment/50 p-5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/45">Kunjungan per bulan — Tahun 1</p>
          <p className="font-display text-sm font-semibold text-pine">{s.totalVisitors.toLocaleString("id-ID")} pengunjung</p>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3f7d52" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3f7d52" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {[0.33, 0.66].map((f) => (
            <line key={f} x1={pad} x2={W - pad} y1={H * f} y2={H * f} stroke="rgba(15,36,26,0.08)" strokeDasharray="4 6" />
          ))}
          <motion.polygon
            points={area} fill="url(#areaGrad)"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
          />
          <motion.polyline
            points={line} fill="none" stroke="#1e5138" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeInOut" }}
          />
          {pts.map((p, i) => (
            <g key={i}>
              <circle cx={p[0]} cy={p[1]} r="3.4" fill="#e2932c" stroke="#f4efe3" strokeWidth="1.6" />
              <text x={p[0]} y={H + 0} textAnchor="middle" className="fill-ink/40 text-[9px] font-bold" dy={-2}>
                {s.monthly[i].month}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Statistik + rincian belanja */}
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <StatCard icon={TrendingUp} label={`Peredaran tahun-1 (${s.label})`} value={fmtMiliar(s.totalRevenue)} note="seluruh ekonomi desa wisata" />
        <StatCard icon={Landmark} label="Potensi porsi BUMDes" value={fmtMiliar(s.bumdesRevenue)} note="asumsi margin bersih 32%" />
        <StatCard icon={Users} label="Lapangan kerja terdukung" value={`±${s.jobsEstimate} orang`} note="pemandu, warung, homestay, dll." />
      </div>

      <div className="mt-5 rounded-3xl border border-ink/8 bg-paper p-6">
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ink/45">
          <Wallet className="size-4 text-gold" /> Komposisi belanja rata-rata per pengunjung
        </p>
        <div className="mt-4 space-y-3">
          {spendBreakdown.filter((b) => b.amount > 0).map((b) => {
            const total = spendBreakdown.reduce((a, x) => a + x.amount, 0);
            return (
              <div key={b.label} className="grid grid-cols-[1fr_auto] items-center gap-3">
                <div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-semibold text-ink/75">{b.label}</span>
                  </div>
                  <AnimBar pct={(b.amount / total) * 100} tone="gold" className="mt-1.5" />
                </div>
                <span className="whitespace-nowrap font-display text-sm font-bold text-pine">
                  Rp {b.amount.toLocaleString("id-ID")}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, note }: { icon: React.ElementType; label: string; value: string; note: string }) {
  return (
    <div className="rounded-3xl border border-ink/8 bg-paper p-5">
      <Icon className="size-5 text-moss" strokeWidth={1.9} />
      <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-ink/45">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-ink">{value}</p>
      <p className="mt-0.5 text-[11px] text-ink/45">{note}</p>
    </div>
  );
}

// ─── Tombol cetak ───────────────────────────────────────────────────────────
export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2.5 rounded-full border border-paper/25 px-6 py-3 text-[13px] font-bold text-paper transition-all hover:bg-paper hover:text-ink"
    >
      <Printer className="size-4" /> Cetak / Simpan PDF
    </button>
  );
}
