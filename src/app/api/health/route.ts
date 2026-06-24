import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("reval") === "1") {
    revalidatePath("/", "layout");
    return NextResponse.json({ status: "revalidated" });
  }

  return NextResponse.json({
    status: "ok",
    version: process.env.APP_VERSION || "local",
    timestamp: new Date().toISOString()
  });
}
