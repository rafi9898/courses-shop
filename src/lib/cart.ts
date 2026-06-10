import { type Locale } from "@/lib/i18n/config";
import { type Product } from "@/lib/mock-data";

export type CartItem = {
  productId: string;
  productType: Product["type"];
  locale: Locale;
  addedAt: string;
};

export type AddCartItemInput = {
  productId: string;
  productType: Product["type"];
};

export type CheckoutCartItemInput = AddCartItemInput;

export type CustomBundleCheckoutInput = {
  courseIds: string[];
};

export function getCartStorageKey(locale: Locale) {
  return `courses-shop:cart:${locale}`;
}

export function getDiscountStorageKey(locale: Locale) {
  return `courses-shop:discount:${locale}`;
}

export function getCartItemKey(item: Pick<CartItem, "productId" | "productType">) {
  return `${item.productType}:${item.productId}`;
}
