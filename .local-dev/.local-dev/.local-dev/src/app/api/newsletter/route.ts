import { NextResponse } from "next/server";
import { isLocale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { consumeFixedWindowRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, locale = "pl", website } = body;
    const validatedLocale = isLocale(locale) ? locale : "pl";

    // 1. Honeypot check (server-side)
    if (website) {
      return NextResponse.json(
        { success: true, code: "NEWSLETTER26" },
        { status: 201 }
      );
    }

    // 2. Rate limiting by IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { allowed } = consumeFixedWindowRateLimit(`newsletter:${ip}`, 3, 1000 * 60 * 60); // 3 per hour

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    });

    if (existing) {
      return NextResponse.json(
        { error: "already_subscribed", code: "NEWSLETTER26" },
        { status: 200 }
      );
    }

    await prisma.newsletterSubscriber.create({
      data: {
        email,
        locale: validatedLocale,
        discountCode: "NEWSLETTER26"
      }
    });

    // Send email asynchronously (disabled for now)
    // sendNewsletterSignupEmail(email, validatedLocale, "NEWSLETTER26");

    return NextResponse.json(
      { success: true, code: "NEWSLETTER26" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
