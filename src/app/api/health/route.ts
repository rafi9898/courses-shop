import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      ok: true,
      version: process.env.APP_VERSION || "unknown"
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Expires: "0",
        Pragma: "no-cache",
        "X-App-Version": process.env.APP_VERSION || "unknown"
      }
    }
  );
}
