"use client";

import { Edit3, Loader2, Power, Trash2, X } from "lucide-react";
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

type DiscountCodeValue = DiscountCodeFormValue & {
  id: string;
};

export function DiscountCodeActions({ discount }: { discount: DiscountCodeValue }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formValue, setFormValue] = useState<DiscountCodeFormValue>({
    code: discount.code,
    percentage: discount.percentage,
    description: discount.description,
    validFrom: discount.validFrom,
    validUntil: discount.validUntil,
    isActive: discount.isActive
  });

  async function handleToggle() {
    setIsSubmitting(true);
    await fetch(`/api/admin/discounts/${discount.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !discount.isActive })
    });
    setIsSubmitting(false);
    router.refresh();
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const response = await fetch(`/api/admin/discounts/${discount.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValue)
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Nie udało się zapisać kodu rabatowego.");
      return;
    }

    setIsEditing(false);
    router.refresh();
  }

  async function handleDelete() {
    const confirmed = window.confirm(`Usunąć kod ${discount.code}? Tej operacji nie można cofnąć.`);
    if (!confirmed) return;

    setIsSubmitting(true);
    const response = await fetch(`/api/admin/discounts/${discount.id}`, {
      method: "DELETE"
    });
    setIsSubmitting(false);

    if (!response.ok) {
      setError("Nie udało się usunąć kodu rabatowego.");
      return;
    }

    setIsEditing(false);
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" className="h-9 px-3" onClick={() => setIsEditing(true)}>
          <Edit3 className="h-4 w-4" />
          Edytuj
        </Button>
        <Button type="button" variant="secondary" className="h-9 px-3" onClick={handleToggle} disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Power className="h-4 w-4" />}
          {discount.isActive ? "Wyłącz" : "Włącz"}
        </Button>
      </div>

      {isEditing ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 px-4 py-6">
          <form onSubmit={handleSave} className="max-h-[calc(100vh-48px)] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-white p-5 shadow-card">
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div>
                <h2 className="text-xl font-black">Edytuj kod rabatowy</h2>
                <p className="mt-1 text-sm text-slate-600">{discount.code}</p>
              </div>
              <Button type="button" variant="ghost" className="h-9 px-3" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Kod">
                <input
                  value={formValue.code}
                  onChange={(event) => setFormValue((value) => ({ ...value, code: event.target.value.toUpperCase() }))}
                  className="focus-ring h-11 w-full rounded-[10px] border border-border px-3 text-sm font-mono uppercase"
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
            </div>

            {error ? <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}

            <div className="mt-6 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="secondary" className="h-10 px-4 text-red-600 hover:border-red-300 hover:text-red-700" onClick={handleDelete} disabled={isSubmitting}>
                <Trash2 className="h-4 w-4" />
                Usuń kod
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" className="h-10 px-4" onClick={() => setIsEditing(false)}>
                  Anuluj
                </Button>
                <Button type="submit" className="h-10 px-4" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Edit3 className="h-4 w-4" />}
                  Zapisz
                </Button>
              </div>
            </div>
          </form>
        </div>
      ) : null}
    </>
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
