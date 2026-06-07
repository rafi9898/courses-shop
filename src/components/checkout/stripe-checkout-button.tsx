"use client";

import { CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { type CheckoutCartItemInput } from "@/lib/cart";
import { type Locale } from "@/lib/i18n/config";
import { type Dictionary } from "@/lib/i18n/dictionaries";
import { type InvoiceData } from "@/lib/invoice";

export function StripeCheckoutButton({
  locale,
  items,
  dictionary,
  discountCode,
  invoiceData,
  disabled = false
}: {
  locale: Locale;
  items: CheckoutCartItemInput[];
  dictionary: Dictionary;
  discountCode?: string | null;
  invoiceData?: InvoiceData;
  disabled?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, items, discountCode, invoiceData })
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? dictionary.checkoutPage.unavailable);
      }

      window.location.assign(data.url);
    } catch {
      setError(dictionary.checkoutPage.unavailable);
      setLoading(false);
    }
  }

  return (
    <div>
      <Button type="button" className="w-full" disabled={disabled || loading} onClick={handleCheckout}>
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CreditCard className="h-5 w-5" />}
        {loading ? dictionary.checkoutPage.preparing : dictionary.checkoutPage.payWithStripe}
      </Button>
      {error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}
    </div>
  );
}
