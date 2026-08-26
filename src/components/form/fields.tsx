"use client";

import { type ReactNode } from "react";
import { Check } from "lucide-react";

// ── Wrapper field ───────────────────────────────────────────────────────────
export function Field({
  label,
  hint,
  optional,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="flex items-baseline justify-between text-[13px] font-bold text-ink">
        <span>
          {label}
          {optional && <span className="ml-2 rounded-full bg-pine/8 px-2 py-0.5 text-[10px] font-semibold text-pine/60">opsional</span>}
        </span>
      </label>
      {hint && <p className="mt-0.5 text-xs text-ink/45">{hint}</p>}
      <div className="mt-2">{children}</div>
    </div>
  );
}

const inputBase =
  "w-full rounded-xl border border-ink/12 bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink/30 outline-none transition-all focus:border-pine focus:ring-4 focus:ring-pine/10";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputBase} ${props.className ?? ""}`} />;
}

export function NumberInput({
  suffix,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { suffix?: string }) {
  return (
    <div className="relative">
      <input type="number" min={0} {...props} className={`${inputBase} ${props.className ?? ""} ${suffix ? "pr-14" : ""}`} />
      {suffix && (
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-ink/40">
          {suffix}
        </span>
      )}
    </div>
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputBase} min-h-[110px] resize-y ${props.className ?? ""}`} />;
}

// ── Rating berbentuk titik (1–5) ────────────────────────────────────────────
export function Rating({
  value,
  onChange,
  labels,
}: {
  value: number;
  onChange: (v: number) => void;
  labels?: [string, string];
}) {
  return (
    <div>
      <div className="flex items-center gap-2.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`size-9 rounded-full border-2 text-[11px] font-bold transition-all duration-200 ${
              n <= value
                ? "border-pine bg-pine text-paper"
                : "border-ink/15 bg-paper text-ink/40 hover:border-pine/50"
            }`}
          >
            {n}
          </button>
        ))}
        <span className="ml-2 rounded-full bg-pine/8 px-3 py-1 text-[11px] font-bold text-pine">
          {["", "Sangat rendah", "Rendah", "Sedang", "Tinggi", "Sangat tinggi"][value]}
        </span>
      </div>
      {labels && (
        <div className="mt-1.5 flex justify-between text-[10px] font-semibold uppercase tracking-wide text-ink/35">
          <span>{labels[0]}</span>
          <span>{labels[1]}</span>
        </div>
      )}
    </div>
  );
}

// ── Radio card ──────────────────────────────────────────────────────────────
export function RadioCards<T extends string>({
  options,
  value,
  onChange,
  cols = 3,
}: {
  options: { value: T; label: string; desc?: string }[];
  value: T;
  onChange: (v: T) => void;
  cols?: 2 | 3 | 4;
}) {
  const grid = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[cols];
  return (
    <div className={`grid gap-2.5 ${grid}`}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`rounded-2xl border p-4 text-left transition-all duration-200 ${
            value === o.value
              ? "border-pine bg-pine text-paper shadow-[0_16px_36px_-18px_rgba(23,62,44,0.7)]"
              : "border-ink/12 bg-paper text-ink hover:border-pine/40"
          }`}
        >
          <span className="flex items-center justify-between gap-2">
            <span className="text-[13px] font-bold leading-snug">{o.label}</span>
            <span
              className={`grid size-4.5 shrink-0 place-items-center rounded-full border ${
                value === o.value ? "border-sprout bg-sprout text-ink" : "border-ink/20 text-transparent"
              }`}
            >
              <Check className="size-3" strokeWidth={3} />
            </span>
          </span>
          {o.desc && (
            <span className={`mt-1 block text-[11px] leading-relaxed ${value === o.value ? "text-paper/65" : "text-ink/45"}`}>
              {o.desc}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ── Chip centang (multi-select) ─────────────────────────────────────────────
export function CheckChips({
  options,
  values,
  onChange,
}: {
  options: { key: string; label: string }[];
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (k: string) =>
    onChange(values.includes(k) ? values.filter((v) => v !== k) : [...values, k]);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = values.includes(o.key);
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => toggle(o.key)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[12px] font-semibold transition-all duration-200 ${
              active
                ? "border-pine bg-pine text-paper"
                : "border-ink/12 bg-paper text-ink/60 hover:border-pine/40 hover:text-ink"
            }`}
          >
            {active && <Check className="size-3" strokeWidth={3} />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Toggle switch ───────────────────────────────────────────────────────────
export function Toggle({
  checked,
  onChange,
  label,
  desc,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  desc?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition-all duration-200 ${
        checked ? "border-pine/50 bg-pine/5" : "border-ink/12 bg-paper"
      }`}
    >
      <span>
        <span className="block text-[13px] font-bold text-ink">{label}</span>
        {desc && <span className="mt-0.5 block text-[11px] text-ink/45">{desc}</span>}
      </span>
      <span
        className={`relative h-6.5 w-11.5 shrink-0 rounded-full transition-colors duration-300 ${
          checked ? "bg-pine" : "bg-ink/15"
        }`}
      >
        <span
          className={`absolute top-0.5 size-5.5 rounded-full bg-paper shadow transition-all duration-300 ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}
