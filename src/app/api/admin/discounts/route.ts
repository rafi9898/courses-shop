import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as DiscountPayload | null;
  const data = parseDiscountPayload(body);

  if (!data.ok) {
    return NextResponse.json({ error: data.error }, { status: 400 });
  }

  try {
    const discount = await prisma.discountCode.create({
      data: data.value
    });

    return NextResponse.json({ discount });
  } catch (error) {
    if (isUniqueError(error)) {
      return NextResponse.json({ error: "Discount code already exists." }, { status: 409 });
    }

    return NextResponse.json({ error: "Discount create failed." }, { status: 503 });
  }
}

type DiscountPayload = {
  code?: string;
  percentage?: number;
  description?: string | null;
  validFrom?: string | null;
  validUntil?: string | null;
  usageLimit?: number | null;
  isActive?: boolean;
};

function parseDiscountPayload(body: DiscountPayload | null) {
  if (!body) return { ok: false as const, error: "Request body is required." };

  const code = body.code?.trim().toUpperCase();
  if (!code) return { ok: false as const, error: "code is required." };

  const percentage = Number(body.percentage);
  if (!Number.isFinite(percentage) || percentage <= 0 || percentage > 100) {
    return { ok: false as const, error: "percentage must be between 1 and 100." };
  }

  const validFrom = parseDate(body.validFrom ?? "", false);
  const validUntil = parseDate(body.validUntil ?? "", true);

  if (body.validFrom && !validFrom) return { ok: false as const, error: "validFrom must use YYYY-MM-DD format." };
  if (body.validUntil && !validUntil) return { ok: false as const, error: "validUntil must use YYYY-MM-DD format." };
  if (validFrom && validUntil && validFrom > validUntil) {
    return { ok: false as const, error: "validFrom must be before validUntil." };
  }

  const usageLimit = body.usageLimit !== undefined && body.usageLimit !== null && body.usageLimit !== "" ? Number(body.usageLimit) : null;
  if (usageLimit !== null && (!Number.isInteger(usageLimit) || usageLimit < 0)) {
    return { ok: false as const, error: "usageLimit must be a non-negative integer." };
  }

  if (typeof body.isActive !== "boolean") return { ok: false as const, error: "isActive must be boolean." };

  return {
    ok: true as const,
    value: {
      code,
      percentage: Math.trunc(percentage),
      description: body.description?.trim() || null,
      validFrom,
      validUntil,
      usageLimit,
      isActive: body.isActive
    }
  };
}

function parseDate(value: string, endOfDay: boolean) {
  if (!value) return null;
  const parsed = new Date(`${value}T${endOfDay ? "23:59:59.000Z" : "00:00:00.000Z"}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isUniqueError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}
