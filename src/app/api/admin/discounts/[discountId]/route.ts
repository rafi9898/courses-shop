import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  {
    params
  }: {
    params: Promise<{ discountId: string }>;
  }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { discountId } = await params;
  const body = (await request.json().catch(() => null)) as DiscountPayload | null;
  const data = parseDiscountPayload(body);

  if (!data.ok) {
    return NextResponse.json({ error: data.error }, { status: 400 });
  }

  try {
    const discount = await prisma.discountCode.update({
      where: { id: discountId },
      data: data.value
    });

    return NextResponse.json({ discount });
  } catch (error) {
    if (isUniqueError(error)) {
      return NextResponse.json({ error: "Discount code already exists." }, { status: 409 });
    }

    return NextResponse.json({ error: "Discount update failed." }, { status: 404 });
  }
}

export async function DELETE(
  _request: Request,
  {
    params
  }: {
    params: Promise<{ discountId: string }>;
  }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { discountId } = await params;

  try {
    await prisma.discountCode.delete({
      where: { id: discountId }
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Discount delete failed." }, { status: 404 });
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

  const update: {
    code?: string;
    percentage?: number;
    description?: string | null;
    validFrom?: Date | null;
    validUntil?: Date | null;
    usageLimit?: number | null;
    isActive?: boolean;
  } = {};

  if ("code" in body) {
    const code = body.code?.trim().toUpperCase();
    if (!code) return { ok: false as const, error: "code is required." };
    update.code = code;
  }

  if ("percentage" in body) {
    const percentage = Number(body.percentage);
    if (!Number.isFinite(percentage) || percentage <= 0 || percentage > 100) {
      return { ok: false as const, error: "percentage must be between 1 and 100." };
    }
    update.percentage = Math.trunc(percentage);
  }

  if ("description" in body) {
    update.description = body.description?.trim() || null;
  }

  if ("validFrom" in body) {
    const validFrom = parseDate(body.validFrom ?? "", false);
    if (body.validFrom && !validFrom) return { ok: false as const, error: "validFrom must use YYYY-MM-DD format." };
    update.validFrom = validFrom;
  }

  if ("validUntil" in body) {
    const validUntil = parseDate(body.validUntil ?? "", true);
    if (body.validUntil && !validUntil) return { ok: false as const, error: "validUntil must use YYYY-MM-DD format." };
    update.validUntil = validUntil;
  }

  if (update.validFrom && update.validUntil && update.validFrom > update.validUntil) {
    return { ok: false as const, error: "validFrom must be before validUntil." };
  }

  if ("usageLimit" in body) {
    const usageLimit = body.usageLimit !== undefined && body.usageLimit !== null && body.usageLimit !== "" ? Number(body.usageLimit) : null;
    if (usageLimit !== null && (!Number.isInteger(usageLimit) || usageLimit < 0)) {
      return { ok: false as const, error: "usageLimit must be a non-negative integer." };
    }
    update.usageLimit = usageLimit;
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

function parseDate(value: string, endOfDay: boolean) {
  if (!value) return null;
  const parsed = new Date(`${value}T${endOfDay ? "23:59:59.000Z" : "00:00:00.000Z"}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isUniqueError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}
