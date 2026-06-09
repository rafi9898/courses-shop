"use client";

import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type DiscountCodeFormValue = {
  code: string;
  percentage: number;
  description: string;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
};

export function DiscountCodeForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formValue, setFormValue] = useState<DiscountCodeFormValue>({
    code: "",
    percentage: 10,
    description: "",
    validFrom: "",
    validUntil: "",
    isActive: true
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/admin/discounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValue)
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Nie udało się utworzyć kodu rabatowego.");
      return;
    }

    setFormValue({
      code: "",
      percentage: 10,
      description: "",
      validFrom: "",
      validUntil: "",
      isActive: true
    });
    router.refresh();
  }

  return (
    <section className="rounded-xl border border-border bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-black">Dodaj kod rabatowy</h2>
          <p className="mt-1 text-sm text-slate-600">Kod działa w koszyku, checkoutcie i po stronie zamówień.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Kod">
          <input
            value={formValue.code}
            onChange={(event) => setFormValue((value) => ({ ...value, code: event.target.value.toUpperCase() }))}
            className="focus-ring h-11 w-full rounded-[10px] border border-border px-3 text-sm font-mono uppercase"
            placeholder="KOD10"
            required
          />
        </Field>
        <Field label="Rabat %">
          <input
            type="number"
            min={1}
            max={100}
            value={formValue.percentage}
            onChange={(event) => setFormValue((value) => ({ ...value, percentage: Number(event.target.value) }))}
            className="focus-ring h-11 w-full rounded-[10px] border border-border px-3 text-sm"
            required
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Opis">
            <input
              value={formValue.description}
              onChange={(event) => setFormValue((value) => ({ ...value, description: event.target.value }))}
              className="focus-ring h-11 w-full rounded-[10px] border border-border px-3 text-sm"
              placeholder="Wpisz opis rabatu"
            />
          </Field>
        </div>
        <Field label="Ważny od">
          <input
            type="date"
            value={formValue.validFrom}
            onChange={(event) => setFormValue((value) => ({ ...value, validFrom: event.target.value }))}
            className="focus-ring h-11 w-full rounded-[10px] border border-border px-3 text-sm"
          />
        </Field>
        <Field label="Ważny do">
          <input
            type="date"
            value={formValue.validUntil}
            onChange={(event) => setFormValue((value) => ({ ...value, validUntil: event.target.value }))}
            className="focus-ring h-11 w-full rounded-[10px] border border-border px-3 text-sm"
          />
        </Field>
        <label className="flex items-center gap-3 rounded-[10px] border border-border px-3 py-3 text-sm font-semibold">
          <input
            type="checkbox"
            checked={formValue.isActive}
            onChange={(event) => setFormValue((value) => ({ ...value, isActive: event.target.checked }))}
            className="h-4 w-4"
          />
          Aktywny
        </label>
        <div className="flex items-end justify-end">
          <Button type="submit" className="h-11 px-4" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Dodaj kod
          </Button>
        </div>
      </form>

      {error ? <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}
