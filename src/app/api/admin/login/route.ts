import { NextResponse } from "next/server";
import { adminSessionCookie, createAdminSessionToken, getAdminSessionMaxAge, isAdminConfigured, verifyAdminCredentials } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Admin panel is not configured." }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as { username?: string; password?: string } | null;

  if (!body?.username || !body.password || !verifyAdminCredentials(body.username, body.password)) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminSessionCookie, createAdminSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getAdminSessionMaxAge()
  });

  return response;
}
