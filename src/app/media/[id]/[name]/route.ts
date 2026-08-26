// GET /media/[id]/[name] — menyajikan foto unggahan runtime dari <cwd>/uploads
import { createReadStream, existsSync, statSync } from "fs";
import path from "path";
import { Readable } from "stream";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string; name: string }> }
) {
  const { id, name } = await ctx.params;

  // Cegah path traversal & karakter tak aman
  const safe = /^[a-zA-Z0-9\-_.]+$/;
  if (!safe.test(id) || !safe.test(name)) return new Response("Forbidden", { status: 403 });

  const filePath = path.join(UPLOAD_ROOT, id, name);
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    return new Response("Not found", { status: 404 });
  }

  const ext = path.extname(filePath).toLowerCase();
  const type =
    ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : ext === ".gif" ? "image/gif" : "image/jpeg";

  const stream = Readable.toWeb(createReadStream(filePath)) as ReadableStream;
  return new Response(stream, {
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
