"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { type AddCartItemInput, type CartItem, getCartItemKey, getCartStorageKey, getDiscountStorageKey } from "@/lib/cart";
import { getDiscount, type Discount } from "@/lib/discounts";
import { type Locale } from "@/lib/i18n/config";
import { getCustomBundleStorageKey, normalizeCustomBundleCourseIds } from "@/lib/custom-bundle";
import { type Product } from "@/lib/mock-data";

type CartContextValue = {
  items: CartItem[];
  customBundleCourseIds: string[];
  hydrated: boolean;
  discountCode: string;
  appliedDiscountCode: string | null;
  discounts: Discount[];
  addItem: (item: AddCartItemInput) => void;
  removeItem: (productType: Product["type"], productId: string) => void;
  setCustomBundleCourseIds: (courseIds: string[]) => void;
  clearCustomBundle: () => void;
  clearCart: () => void;
  setDiscountCode: (code: string) => void;
  applyDiscountCode: () => boolean;
  clearDiscountCode: () => void;
  isInCart: (productType: Product["type"], productId: string) => boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  locale,
  discounts,
  children
}: {
  locale: Locale;
  discounts?: Discount[];
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [customBundleCourseIds, setCustomBundleCourseIdsState] = useState<string[]>([]);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscountCode, setAppliedDiscountCode] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const discountList = discounts && discounts.length > 0 ? discounts : undefined;
  const storageKey = getCartStorageKey(locale);
  const discountStorageKey = getDiscountStorageKey(locale);
  const customBundleStorageKey = getCustomBundleStorageKey(locale);

  useEffect(() => {
    try {
      const rawCart = window.localStorage.getItem(storageKey);
      const parsed = rawCart ? (JSON.parse(rawCart) as CartItem[]) : [];
      const rawCustomBundle = window.localStorage.getItem(customBundleStorageKey);
      const rawDiscountCode = window.localStorage.getItem(discountStorageKey);
      setItems(parsed.filter((item) => item.locale === locale));
      setCustomBundleCourseIdsState(
        rawCustomBundle ? normalizeCustomBundleCourseIds(JSON.parse(rawCustomBundle) as string[]) : []
      );
      setDiscountCode(rawDiscountCode ?? "");
      setAppliedDiscountCode(rawDiscountCode && getDiscount(rawDiscountCode, discountList) ? rawDiscountCode : null);
    } catch {
      setItems([]);
      setCustomBundleCourseIdsState([]);
      setDiscountCode("");
      setAppliedDiscountCode(null);
    } finally {
      setHydrated(true);
    }
  }, [customBundleStorageKey, discountList, discountStorageKey, locale, storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [hydrated, items, storageKey]);

  useEffect(() => {
    if (!hydrated) return;

    if (customBundleCourseIds.length > 0) {
      window.localStorage.setItem(customBundleStorageKey, JSON.stringify(customBundleCourseIds));
    } else {
      window.localStorage.removeItem(customBundleStorageKey);
    }
  }, [customBundleCourseIds, customBundleStorageKey, hydrated]);

  useEffect(() => {
    if (!hydrated) return;

    if (appliedDiscountCode && !getDiscount(appliedDiscountCode, discountList)) {
      setAppliedDiscountCode(null);
      setDiscountCode("");
      window.localStorage.removeItem(discountStorageKey);
      return;
    }

    if (appliedDiscountCode) {
      window.localStorage.setItem(discountStorageKey, appliedDiscountCode);
    } else {
      window.localStorage.removeItem(discountStorageKey);
    }
  }, [appliedDiscountCode, discountList, discountStorageKey, hydrated]);

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

  const setCustomBundleCourseIds = useCallback((courseIds: string[]) => {
    setCustomBundleCourseIdsState(normalizeCustomBundleCourseIds(courseIds));
  }, []);

  const clearCustomBundle = useCallback(() => {
    setCustomBundleCourseIdsState([]);
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCustomBundleCourseIdsState([]);
  }, []);

  const applyDiscountCode = useCallback(() => {
    const discount = getDiscount(discountCode, discountList);
    if (!discount) {
      setAppliedDiscountCode(null);
      return false;
    }

    setAppliedDiscountCode(discount.code);
    setDiscountCode(discount.code);
    return true;
  }, [discountCode, discountList]);

  const clearDiscountCode = useCallback(() => {
    setDiscountCode("");
    setAppliedDiscountCode(null);
  }, []);

  const isInCart = useCallback(
    (productType: Product["type"], productId: string) => {
      if (items.some((item) => item.productType === productType && item.productId === productId)) {
        return true;
      }

      if (productType === "course" && customBundleCourseIds.includes(productId)) {
        return true;
      }

      return false;
    },
    [customBundleCourseIds, items]
  );

  const value = useMemo(
    () => ({
      items,
      customBundleCourseIds,
      hydrated,
      discountCode,
      appliedDiscountCode,
      discounts: discountList ?? [],
      addItem,
      removeItem,
      setCustomBundleCourseIds,
      clearCustomBundle,
      clearCart,
      setDiscountCode,
      applyDiscountCode,
      clearDiscountCode,
      isInCart
    }),
    [
      addItem,
      appliedDiscountCode,
      applyDiscountCode,
      clearCart,
      clearCustomBundle,
      clearDiscountCode,
      customBundleCourseIds,
      discountCode,
      discountList,
      hydrated,
      isInCart,
      items,
      removeItem,
      setCustomBundleCourseIds
    ]
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
