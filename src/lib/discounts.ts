import { type Locale } from "@/lib/i18n/config";
import { type Product } from "@/lib/mock-data";

export type Discount = {
  code: string;
  percentage: number;
  description?: string | null;
  validFrom?: string | null;
  validUntil?: string | null;
  usageLimit?: number | null;
  usedCount?: number;
};

export const fallbackDiscounts: Discount[] = [];

export function getDiscount(code?: string | null, discounts: Discount[] = fallbackDiscounts) {
  if (!code) return null;
  const normalizedCode = code.trim().toUpperCase();
  const discount = discounts.find((discount) => discount.code === normalizedCode) ?? null;

  if (discount && !isDiscountValid(discount)) return null;

  return discount;
}

export function isDiscountValid(discount: Discount) {
  if (discount.usageLimit !== null && discount.usageLimit !== undefined && (discount.usedCount ?? 0) >= discount.usageLimit) {
    return false;
  }

  const now = new Date();
  if (discount.validFrom && new Date(discount.validFrom) > now) return false;
  if (discount.validUntil && new Date(discount.validUntil) < now) return false;

  return true;
}

export function calculateCartTotals(
  products: { id: string; type: "course" | "bundle"; price: Record<Locale, number>; regularPrice: Record<Locale, number> }[],
  locale: Locale,
  discountCode?: string | null,
  discounts: Discount[] = fallbackDiscounts
) {
  const regularTotal = products.reduce((sum, product) => sum + product.regularPrice[locale], 0);
  const subtotal = products.reduce((sum, product) => sum + product.price[locale], 0);
  const discount = getDiscount(discountCode, discounts);
  const discountAmount = discount ? roundPrice(subtotal * (discount.percentage / 100)) : 0;
  const total = Math.max(0, roundPrice(subtotal - discountAmount));

  return {
    regularTotal,
    subtotal,
    saleSavings: roundPrice(regularTotal - subtotal),
    discount,
    discountAmount,
    total
  };
}

export function getDiscountedUnitAmount(
  product: { id: string; type: "course" | "bundle"; price: number },
  discountCode?: string | null,
  discounts: Discount[] = fallbackDiscounts
) {
  const discount = getDiscount(discountCode, discounts);
  if (!discount) return product.price;

  return roundPrice(product.price * (1 - discount.percentage / 100));
}

function roundPrice(amount: number) {
  return Math.round(amount * 100) / 100;
}
