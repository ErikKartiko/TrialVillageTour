// GET /api/analyses — daftar analisis terbaru (untuk halaman Riwayat)
import { db } from "@/db";
import { villageAnalyses, analysisPhotos } from "@/db/schema";
import { asc, desc, eq, inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db
    .select()
    .from(villageAnalyses)
    .orderBy(desc(villageAnalyses.createdAt))
    .limit(24);

  const completed = rows.filter((r) => r.status === "completed" && r.readinessScore !== null);
  const ids = completed.map((r) => r.id);

  let items: unknown[] = [];
  if (ids.length > 0) {
    const photos = await db
      .select()
      .from(analysisPhotos)
      .where(inArray(analysisPhotos.analysisId, ids))
      .orderBy(asc(analysisPhotos.analysisId), asc(analysisPhotos.createdAt));

    const byAnalysis = new Map<string, typeof photos>();
    for (const p of photos) {
      const arr = byAnalysis.get(p.analysisId) ?? [];
      arr.push(p);
      byAnalysis.set(p.analysisId, arr);
    }

    items = completed.map((r) => {
      const list = byAnalysis.get(r.id) ?? [];
      return {
        id: r.id,
        villageName: r.villageName,
        city: r.city,
        province: r.province,
        readinessScore: r.readinessScore,
        category: r.category,
        createdAt: r.createdAt,
        photoCount: list.length,
        firstPhoto: list[0]?.filePath ?? null,
      };
    });
  }

  return Response.json({ items });
}
