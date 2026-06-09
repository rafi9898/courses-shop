"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type OrderDeleteButtonProps = {
  orderId: string;
  orderNumber: string;
  redirectTo?: string;
  className?: string;
  label?: string;
};

export function OrderDeleteButton({ orderId, orderNumber, redirectTo, className, label = "Usuń zamówienie" }: OrderDeleteButtonProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(`Usunąć zamówienie ${orderNumber}? Tej operacji nie można cofnąć.`);
    if (!confirmed) return;

    setError(null);
    setIsSubmitting(true);

    const response = await fetch(`/api/admin/orders/${orderId}`, {
      method: "DELETE"
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Nie udało się usunąć zamówienia.");
      return;
    }

    if (redirectTo) {
      router.replace(redirectTo);
    }

    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2">
      <Button type="button" variant="secondary" className={className ?? "h-9 px-3 text-red-600 hover:border-red-300 hover:text-red-700"} onClick={handleDelete} disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        {label}
      </Button>
      {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}
    </div>
  );
}

