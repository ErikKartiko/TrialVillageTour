// GET /api/analyses/[id] — status + hasil analisis
import { db } from "@/db";
import { villageAnalyses, analysisPhotos } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const [row] = await db.select().from(villageAnalyses).where(eq(villageAnalyses.id, id)).limit(1);
  if (!row) return Response.json({ error: "Analisis tidak ditemukan." }, { status: 404 });

  const photos = await db
    .select()
    .from(analysisPhotos)
    .where(eq(analysisPhotos.analysisId, id))
    .orderBy(asc(analysisPhotos.createdAt));

  return Response.json({ analysis: row, photos });
}
