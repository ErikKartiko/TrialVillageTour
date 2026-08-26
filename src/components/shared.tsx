"use client";

import { motion, useInView, useMotionValue, useSpring, type MotionProps } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Sprout, ArrowRight } from "lucide-react";

// ── Logo ────────────────────────────────────────────────────────────────────
export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span
        className={`grid size-9 place-items-center rounded-xl transition-transform duration-500 group-hover:rotate-6 ${
          dark ? "bg-sprout text-ink" : "bg-pine text-paper"
        }`}
      >
        <Sprout className="size-5" strokeWidth={2.2} />
      </span>
      <span className={`font-display text-xl font-semibold tracking-tight ${dark ? "text-paper" : "text-ink"}`}>
        POTENSIA
      </span>
    </Link>
  );
}

// ── Reveal on scroll ────────────────────────────────────────────────────────
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  ...rest
}: { children: ReactNode; delay?: number; y?: number; className?: string } & MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// ── Animated counter ────────────────────────────────────────────────────────
export function CountUp({ to, suffix = "", prefix = "", duration = 1.6, className }: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: duration * 1000, bounce: 0 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (inView) mv.set(to);
  }, [inView, mv, to]);

  useEffect(() => spring.on("change", (v) => setValue(Math.round(v))), [spring]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString("id-ID")}
      {suffix}
    </span>
  );
}

// ── Section eyebrow tag ─────────────────────────────────────────────────────
export function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`h-px w-8 ${dark ? "bg-sprout/60" : "bg-pine/40"}`} />
      <span className={`eyebrow text-[11px] font-bold uppercase ${dark ? "text-sprout" : "text-pine/80"}`}>
        {children}
      </span>
    </div>
  );
}

// ── CTA button ──────────────────────────────────────────────────────────────
export function CtaButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "light";
  className?: string;
}) {
  const styles = {
    primary: "bg-pine text-paper hover:bg-forest",
    ghost: "border border-pine/25 text-pine hover:bg-pine hover:text-paper",
    light: "bg-sprout text-ink hover:bg-gold",
  }[variant];
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-sm font-bold transition-all duration-300 ${styles} ${className}`}
    >
      {children}
      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

// ── Marquee strip ───────────────────────────────────────────────────────────
export function Marquee({ items, dark = true, className = "" }: { items: string[]; dark?: boolean; className?: string }) {
  const row = [...items, ...items];
  return (
    <div className={`relative overflow-hidden py-4 ${dark ? "bg-pine text-paper" : "bg-sprout text-ink"} ${className}`}>
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap pr-8">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8 font-display text-lg italic">
            {item}
            <Sprout className="size-4 opacity-60" />
          </span>
        ))}
      </div>
    </div>
  );
}
