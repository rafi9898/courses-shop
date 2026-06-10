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
  customBundleCourseIds = [],
  dictionary,
  discountCode,
  customerEmail,
  invoiceRequested = false,
  invoiceData,
  termsAccepted,
  disabled = false
}: {
  locale: Locale;
  items: CheckoutCartItemInput[];
  customBundleCourseIds?: string[];
  dictionary: Dictionary;
  discountCode?: string | null;
  customerEmail: string;
  invoiceRequested?: boolean;
  invoiceData?: InvoiceData;
  termsAccepted: boolean;
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
        body: JSON.stringify({
          locale,
          items,
          customBundleCourseIds,
          discountCode,
          customerEmail,
          invoiceRequested,
          invoiceData: invoiceRequested ? invoiceData : undefined,
          termsAccepted
        })
      });
      const data = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;

      if (!response.ok || !data?.url) {
        throw new Error(data?.error ?? dictionary.checkoutPage.unavailable);
      }

      window.location.assign(data.url);
    } catch (error) {
      setError(error instanceof Error ? error.message : dictionary.checkoutPage.unavailable);
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
