"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import { useNotification } from "@/components/ui/notification";
import { type Dictionary } from "@/lib/i18n/dictionaries";
import { type Product } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  product,
  dictionary,
  className,
  iconOnly = false,
  redirectToCart = false,
  variant = "primary",
  label
}: {
  product: Product;
  dictionary: Dictionary;
  className?: string;
  iconOnly?: boolean;
  redirectToCart?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  label?: string;
}) {
  const router = useRouter();
  const { addItem, isInCart } = useCart();
  const { showNotification } = useNotification();
  const inCart = isInCart(product.type, product.id);
  const buttonLabel = inCart && !redirectToCart ? dictionary.cartPage.inCart : label ?? dictionary.home.addToCart;

  return (
    <Button
      type="button"
      variant={variant}
      className={cn(iconOnly && "h-10 w-10 rounded-lg p-0", className)}
      aria-label={buttonLabel}
      title={buttonLabel}
      onClick={() => {
        if (!inCart) {
          addItem({ productId: product.id, productType: product.type });
          showNotification(dictionary.cartPage.addedToCart, "success");
        }
        if (redirectToCart) {
          router.push(dictionary.routes.cart);
        }
      }}
    >
      {inCart ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
      {iconOnly ? <span className="sr-only">{buttonLabel}</span> : buttonLabel}
    </Button>
  );
}
