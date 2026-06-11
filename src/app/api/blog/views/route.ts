import { NextResponse, type NextRequest } from "next/server";
import { incrementBlogPostViewCount } from "@/lib/blog-data";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const postId = typeof body?.postId === "string" ? body.postId.trim() : "";

  if (!postId) {
    return NextResponse.json({ error: "postId is required." }, { status: 400 });
  }

  await incrementBlogPostViewCount(postId).catch(() => undefined);

  return NextResponse.json({ ok: true });
}
