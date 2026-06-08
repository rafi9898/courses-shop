import { prisma } from "@/lib/prisma";
import { fallbackDiscounts, type Discount } from "@/lib/discounts";

export async function getActiveDiscountCodes(): Promise<Discount[]> {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return fallbackDiscounts;
  }

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

    return discountCodes.map((discount) => ({
      code: discount.code,
      percentage: discount.percentage,
      description: discount.description,
      validFrom: discount.validFrom?.toISOString() ?? null,
      validUntil: discount.validUntil?.toISOString() ?? null
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
