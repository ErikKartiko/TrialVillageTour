// ─── Analisis visual foto berbasis statistik piksel (sharp) ───────────────
import sharp from "sharp";
import type { PhotoMetric } from "@/lib/analysis/catalog";

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));

export interface ProcessedPhoto {
  metric: PhotoMetric;
  savedAs: string; // path relatif dari /public
  sizeKb: number;
}

/**
 * Menyimpan versi web (≤1400px, JPEG) dan memetakan karakter visual foto:
 * kecerahan, kekayaan warna, dominasi vegetasi (hijau), dominasi langit/air
 * (biru), serta skor kualitas komposit yang dipakai di laporan.
 */
export async function processPhoto(buffer: Buffer, savePath: string): Promise<ProcessedPhoto> {
  const base = sharp(buffer, { failOn: "none" }).rotate();

  const [saved, meta, stats] = await Promise.all([
    base.clone().resize({ width: 1400, withoutEnlargement: true }).jpeg({ quality: 84 }).toFile(savePath),
    sharp(buffer, { failOn: "none" }).metadata(),
    sharp(buffer, { failOn: "none" })
      .rotate()
      .resize(320, 320, { fit: "inside" })
      .stats(),
  ]);

  const width = meta.width ?? 1024;
  const height = meta.height ?? 768;
  const pixels = width * height;

  const ch = stats.channels;
  const r = ch[0]?.mean ?? 128;
  const g = ch[1]?.mean ?? 128;
  const b = ch[2]?.mean ?? 128;

  const brightness = clamp(((0.299 * r + 0.587 * g + 0.114 * b) / 255) * 100);

  // Colorfulness ~ Hasler-Süsstrunk sederhana dari deviasi kanal
  const rg = Math.abs((ch[0]?.stdev ?? 0) - (ch[1]?.stdev ?? 0));
  const yb = Math.abs(0.5 * ((ch[0]?.stdev ?? 0) + (ch[1]?.stdev ?? 0)) - (ch[2]?.stdev ?? 0));
  const avgStd = ((ch[0]?.stdev ?? 0) + (ch[1]?.stdev ?? 0) + (ch[2]?.stdev ?? 0)) / 3;
  const colorfulness = clamp(Math.sqrt(rg ** 2 + yb ** 2) * 0.35 + avgStd * 1.25);

  // Dominansi vegetasi & langit/air — indeks "excess channel" dinormalisasi
  // terhadap luminansi rata-rata agar tahan terhadap foto bernada hangat/dingin
  const avgLum = Math.max((r + g + b) / 3, 1);
  const greenness = clamp(((g - (r + b) / 2) / avgLum) * 400 + 12);
  const blueness = clamp(((b - (r + g) / 2) / avgLum) * 380 + 10);

  // Skor kualitas komposit
  const resolutionScore = clamp((pixels / (1200 * 900)) * 100);
  const exposureScore = clamp(100 - Math.abs(brightness - 55) * 1.8);
  const quality = clamp(resolutionScore * 0.35 + exposureScore * 0.33 + colorfulness * 0.2 + (stats.entropy / 8) * 100 * 0.12);

  const sizeKb = Math.max(1, Math.round(saved.size / 1024));

  return {
    metric: {
      filePath: "",
      width,
      height,
      brightness: Math.round(brightness),
      colorfulness: Math.round(colorfulness),
      greenness: Math.round(greenness),
      blueness: Math.round(blueness),
      quality: Math.round(quality),
    },
    savedAs: "",
    sizeKb,
  };
}
