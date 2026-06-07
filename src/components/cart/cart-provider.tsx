"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { type AddCartItemInput, type CartItem, getCartItemKey, getCartStorageKey, getDiscountStorageKey } from "@/lib/cart";
import { getDiscount } from "@/lib/discounts";
import { type Locale } from "@/lib/i18n/config";
import { type Product } from "@/lib/mock-data";

type CartContextValue = {
  items: CartItem[];
  hydrated: boolean;
  discountCode: string;
  appliedDiscountCode: string | null;
  addItem: (item: AddCartItemInput) => void;
  removeItem: (productType: Product["type"], productId: string) => void;
  clearCart: () => void;
  setDiscountCode: (code: string) => void;
  applyDiscountCode: () => boolean;
  clearDiscountCode: () => void;
  isInCart: (productType: Product["type"], productId: string) => boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  locale,
  children
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscountCode, setAppliedDiscountCode] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const storageKey = getCartStorageKey(locale);
  const discountStorageKey = getDiscountStorageKey(locale);

  useEffect(() => {
    try {
      const rawCart = window.localStorage.getItem(storageKey);
      const parsed = rawCart ? (JSON.parse(rawCart) as CartItem[]) : [];
      const rawDiscountCode = window.localStorage.getItem(discountStorageKey);
      setItems(parsed.filter((item) => item.locale === locale));
      setDiscountCode(rawDiscountCode ?? "");
      setAppliedDiscountCode(rawDiscountCode && getDiscount(rawDiscountCode) ? rawDiscountCode : null);
    } catch {
      setItems([]);
      setDiscountCode("");
      setAppliedDiscountCode(null);
    } finally {
      setHydrated(true);
    }
  }, [discountStorageKey, locale, storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [hydrated, items, storageKey]);

  useEffect(() => {
    if (!hydrated) return;

    if (appliedDiscountCode) {
      window.localStorage.setItem(discountStorageKey, appliedDiscountCode);
    } else {
      window.localStorage.removeItem(discountStorageKey);
    }
  }, [appliedDiscountCode, discountStorageKey, hydrated]);

  const addItem = useCallback(
    (item: AddCartItemInput) => {
      setItems((currentItems) => {
        const exists = currentItems.some((currentItem) => getCartItemKey(currentItem) === getCartItemKey(item));
        if (exists) return currentItems;

        return [
          ...currentItems,
          {
            productId: item.productId,
            productType: item.productType,
            locale,
            addedAt: new Date().toISOString()
          }
        ];
      });
    },
    [locale]
  );

  const removeItem = useCallback((productType: Product["type"], productId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.productType !== productType || item.productId !== productId)
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const applyDiscountCode = useCallback(() => {
    const discount = getDiscount(discountCode);
    if (!discount) {
      setAppliedDiscountCode(null);
      return false;
    }

    setAppliedDiscountCode(discount.code);
    setDiscountCode(discount.code);
    return true;
  }, [discountCode]);

  const clearDiscountCode = useCallback(() => {
    setDiscountCode("");
    setAppliedDiscountCode(null);
  }, []);

  const isInCart = useCallback(
    (productType: Product["type"], productId: string) =>
      items.some((item) => item.productType === productType && item.productId === productId),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      hydrated,
      discountCode,
      appliedDiscountCode,
      addItem,
      removeItem,
      clearCart,
      setDiscountCode,
      applyDiscountCode,
      clearDiscountCode,
      isInCart
    }),
    [addItem, appliedDiscountCode, applyDiscountCode, clearCart, clearDiscountCode, discountCode, hydrated, isInCart, items, removeItem]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
