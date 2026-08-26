// POST /api/analyze — menerima data desa + foto, menjalankan analisis,
// menyimpan laporan, dan mengembalikan id hasil.
import { db } from "@/db";
import { villageAnalyses, analysisPhotos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { validatePayload, runAnalysis } from "@/lib/analysis/engine";
import { processPhoto } from "@/lib/image-metrics";
import type { PhotoMetric } from "@/lib/analysis/catalog";
import { mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_FILES = 8;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: Request) {
  let recordId: string | null = null;
  try {
    const formData = await request.formData();
    const payloadRaw = formData.get("payload");

    if (typeof payloadRaw !== "string") {
      return Response.json({ error: "Payload analisis tidak ditemukan." }, { status: 400 });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(payloadRaw);
    } catch {
      return Response.json({ error: "Format payload bukan JSON valid." }, { status: 400 });
    }

    const validated = validatePayload(parsed);
    if (!validated.ok) {
      return Response.json({ error: validated.error }, { status: 422 });
    }
    const input = validated.data;

    const files = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
    if (files.length < 3) {
      return Response.json({ error: "Unggah minimal 3 foto desa untuk analisis visual." }, { status: 422 });
    }
    if (files.length > MAX_FILES) {
      return Response.json({ error: `Maksimal ${MAX_FILES} foto per analisis.` }, { status: 422 });
    }
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        return Response.json({ error: `Berkas ${file.name} bukan gambar.` }, { status: 422 });
      }
      if (file.size > MAX_FILE_SIZE) {
        return Response.json({ error: `Foto ${file.name} melebihi 10 MB.` }, { status: 422 });
      }
    }

    // 1 · Buat catatan analisis (status: processing)
    const [record] = await db
      .insert(villageAnalyses)
      .values({
        villageName: input.villageName,
        district: input.district,
        city: input.city,
        province: input.province,
        population: input.population,
        areaHa: input.areaHa,
        contactEmail: input.contactEmail ?? null,
        formData: input,
        status: "processing",
      })
      .returning({ id: villageAnalyses.id });
    recordId = record.id;

    // 2 · Proses & simpan foto (di luar public agar langsung terlayani runtime)
    const uploadDir = path.join(process.cwd(), "uploads", record.id);
    await mkdir(uploadDir, { recursive: true });

    const metrics: PhotoMetric[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${String(i + 1).padStart(2, "0")}.jpg`;
      const savePath = path.join(uploadDir, filename);
      const processed = await processPhoto(buffer, savePath);
      const publicPath = `/media/${record.id}/${filename}`;
      metrics.push({ ...processed.metric, filePath: publicPath });
      await db.insert(analysisPhotos).values({
        analysisId: record.id,
        filePath: publicPath,
        width: processed.metric.width,
        height: processed.metric.height,
        sizeKb: processed.sizeKb,
        brightness: processed.metric.brightness,
        colorfulness: processed.metric.colorfulness,
        greenness: processed.metric.greenness,
        blueness: processed.metric.blueness,
        quality: processed.metric.quality,
      });
    }

    // 3 · Jalankan mesin analisis
    const report = runAnalysis(input, metrics);

    await db
      .update(villageAnalyses)
      .set({
        status: "completed",
        readinessScore: report.readinessScore,
        category: report.categoryShort,
        report,
      })
      .where(eq(villageAnalyses.id, record.id));

    return Response.json({
      id: record.id,
      readinessScore: report.readinessScore,
      category: report.categoryShort,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Kesalahan tak terduga.";
    if (recordId) {
      await db
        .update(villageAnalyses)
        .set({ status: "failed", error: message })
        .where(eq(villageAnalyses.id, recordId))
        .catch(() => undefined);
    }
    console.error("[analyze] gagal:", err);
    return Response.json({ error: `Analisis gagal diproses: ${message}` }, { status: 500 });
  }
}
