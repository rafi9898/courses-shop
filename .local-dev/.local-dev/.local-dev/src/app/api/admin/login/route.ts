import { NextResponse } from "next/server";
import { adminSessionCookie, createAdminSessionToken, getAdminSessionMaxAge, isAdminConfigured, verifyAdminCredentials } from "@/lib/admin-auth";
import { consumeFixedWindowRateLimit, resetFixedWindowRateLimit } from "@/lib/rate-limit";

const loginRateLimit = {
  limit: 10,
  windowMs: 15 * 60 * 1000
};

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Admin panel is not configured." }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as { username?: string; password?: string } | null;
  const ip = getClientIp(request);
  const limitState = consumeFixedWindowRateLimit(`admin-login:${ip}`, loginRateLimit.limit, loginRateLimit.windowMs);

  if (!limitState.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      {
        status: 429,
        headers: rateLimitHeaders(limitState.resetAt, 0, loginRateLimit.limit)
      }
    );
  }

  if (!body?.username || !body.password || !verifyAdminCredentials(body.username, body.password)) {
    return NextResponse.json(
      { error: "Invalid credentials." },
      {
        status: 401,
        headers: rateLimitHeaders(limitState.resetAt, limitState.remaining, loginRateLimit.limit)
      }
    );
  }

  resetFixedWindowRateLimit(`admin-login:${ip}`);

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

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const forwardedIp = forwardedFor?.split(",")[0]?.trim();

  return forwardedIp || request.headers.get("x-real-ip") || "unknown";
}

function rateLimitHeaders(resetAt: number, remaining: number, limit: number) {
  return {
    "X-RateLimit-Limit": String(limit),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
    "Retry-After": String(Math.max(1, Math.ceil((resetAt - Date.now()) / 1000)))
  };
}
