import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";
import { fallbackDiscounts, type Discount } from "@/lib/discounts";

export async function getActiveDiscountCodes(): Promise<Discount[]> {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return fallbackDiscounts;
  }

  noStore();

  const now = new Date();

  try {
    const discountCodes = await prisma.discountCode.findMany({
      where: {
        isActive: true,
        AND: [
          { OR: [{ validFrom: null }, { validFrom: { lte: now } }] },
          { OR: [{ validUntil: null }, { validUntil: { gte: now } }] }
        ]
      },
      orderBy: [{ updatedAt: "desc" }, { code: "asc" }]
    });

    return discountCodes
      .filter((discount) => discount.usageLimit === null || discount.usedCount < discount.usageLimit)
      .map((discount) => ({
        code: discount.code,
        percentage: discount.percentage,
        description: discount.description,
        validFrom: discount.validFrom?.toISOString() ?? null,
        validUntil: discount.validUntil?.toISOString() ?? null,
        usageLimit: discount.usageLimit,
        usedCount: discount.usedCount
      }));
  } catch {
    return fallbackDiscounts;
  }
}

export async function getDiscountCodeByCode(code: string) {
  const normalizedCode = code.trim().toUpperCase();
  const discountCodes = await getActiveDiscountCodes();
  return discountCodes.find((discount) => discount.code === normalizedCode) ?? null;
}

export async function getDiscountCodeForFulfillment(code: string): Promise<Discount | null> {
  const normalizedCode = code.trim().toUpperCase();

  try {
    const discount = await prisma.discountCode.findUnique({
      where: { code: normalizedCode }
    });

    if (!discount) return null;

    return {
      code: discount.code,
      percentage: discount.percentage,
      description: discount.description,
      validFrom: discount.validFrom?.toISOString() ?? null,
      validUntil: discount.validUntil?.toISOString() ?? null,
      usageLimit: discount.usageLimit,
      usedCount: discount.usedCount
    };
  } catch {
    return null;
  }
}
