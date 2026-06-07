import { type Locale } from "@/lib/i18n/config";
import { type Product } from "@/lib/mock-data";

export type Discount = {
  code: string;
  percentage: number;
};

const discounts: Discount[] = [
  {
    code: "START10",
    percentage: 10
  }
];

export function getDiscount(code?: string | null) {
  if (!code) return null;
  const normalizedCode = code.trim().toUpperCase();
  return discounts.find((discount) => discount.code === normalizedCode) ?? null;
}

export function calculateCartTotals(products: Product[], locale: Locale, discountCode?: string | null) {
  const regularTotal = products.reduce((sum, product) => sum + product.regularPrice[locale], 0);
  const subtotal = products.reduce((sum, product) => sum + product.price[locale], 0);
  const discount = getDiscount(discountCode);
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

export function getDiscountedUnitAmount(amount: number, discountCode?: string | null) {
  const discount = getDiscount(discountCode);
  if (!discount) return amount;

  return roundPrice(amount * (1 - discount.percentage / 100));
}

function roundPrice(amount: number) {
  return Math.round(amount * 100) / 100;
}
