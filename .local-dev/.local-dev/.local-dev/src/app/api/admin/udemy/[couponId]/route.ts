import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { isPrismaUniqueError } from "@/lib/admin-udemy-import";
import { isLocale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  {
    params
  }: {
    params: Promise<{ couponId: string }>;
  }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { couponId } = await params;
  const body = (await request.json().catch(() => null)) as {
    courseId?: string;
    locale?: string;
    courseTitle?: string | null;
    udemyUrl?: string;
    couponCode?: string;
    validUntil?: string;
    isActive?: boolean;
  } | null;
  const data = parseCouponUpdate(body);

  if (!data.ok) {
    return NextResponse.json({ error: data.error }, { status: 400 });
  }

  try {
    const coupon = await prisma.udemyCoupon.update({
      where: { id: couponId },
      data: data.value
    });

    return NextResponse.json({ coupon });
  } catch (error) {
    if (isPrismaUniqueError(error)) {
      return NextResponse.json({ error: "Coupon with this course, locale and code already exists." }, { status: 409 });
    }

    return NextResponse.json({ error: "Udemy coupon update failed." }, { status: 404 });
  }
}

export async function DELETE(
  _request: Request,
  {
    params
  }: {
    params: Promise<{ couponId: string }>;
  }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { couponId } = await params;

  try {
    await prisma.udemyCoupon.delete({
      where: { id: couponId }
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Udemy coupon delete failed." }, { status: 404 });
  }
}

function parseCouponUpdate(
  body: {
    courseId?: string;
    locale?: string;
    courseTitle?: string | null;
    udemyUrl?: string;
    couponCode?: string;
    validUntil?: string;
    isActive?: boolean;
  } | null
) {
  if (!body) {
    return { ok: false as const, error: "Request body is required." };
  }

  const update: {
    courseId?: string;
    locale?: string;
    courseTitle?: string | null;
    udemyUrl?: string;
    couponCode?: string;
    validUntil?: Date;
    isActive?: boolean;
  } = {};

  if ("courseId" in body) {
    if (!body.courseId?.trim()) return { ok: false as const, error: "courseId is required." };
    update.courseId = body.courseId.trim();
  }

  if ("locale" in body) {
    if (!body.locale || !isLocale(body.locale)) return { ok: false as const, error: "locale must be pl, de or en." };
    update.locale = body.locale;
  }

  if ("courseTitle" in body) {
    update.courseTitle = body.courseTitle?.trim() || null;
  }

  if ("udemyUrl" in body) {
    if (!body.udemyUrl || !isValidUrl(body.udemyUrl)) return { ok: false as const, error: "udemyUrl is invalid." };
    update.udemyUrl = body.udemyUrl.trim();
  }

  if ("couponCode" in body) {
    if (!body.couponCode?.trim()) return { ok: false as const, error: "couponCode is required." };
    update.couponCode = body.couponCode.trim();
  }

  if ("validUntil" in body) {
    const validUntil = parseDate(body.validUntil ?? "");
    if (!validUntil) return { ok: false as const, error: "validUntil must use YYYY-MM-DD format." };
    update.validUntil = validUntil;
  }

  if ("isActive" in body) {
    if (typeof body.isActive !== "boolean") return { ok: false as const, error: "isActive must be boolean." };
    update.isActive = body.isActive;
  }

  if (Object.keys(update).length === 0) {
    return { ok: false as const, error: "At least one field is required." };
  }

  return { ok: true as const, value: update };
}

function parseDate(value: string) {
  const parsed = new Date(`${value}T23:59:59.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
