"use client";

import { useTransition, useRef, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { updatePromoBannerAction } from "@/app/admin/settings/actions";
import { type PromoBanner } from "@prisma/client";
import { type Locale } from "@/lib/i18n/config";

interface PromoBannerFormProps {
  banner: PromoBanner | null;
  locale: Locale;
}

export function PromoBannerForm({ banner, locale }: PromoBannerFormProps) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    
    setSuccess(false);
    setError(false);

    const formData = new FormData(formRef.current);
    formData.append("locale", locale);

    startTransition(async () => {
      try {
        await updatePromoBannerAction(formData);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (e) {
        setError(true);
      }
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-white p-6 shadow-card">
      <div className="flex items-center gap-3">
        <label className="relative inline-flex cursor-pointer items-center">
          <input 
            type="checkbox" 
            name="isActive" 
            defaultChecked={banner?.isActive ?? false} 
            className="peer sr-only" 
          />
          <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700"></div>
          <span className="ml-3 text-sm font-semibold text-slate-900">Pasek aktywny ({locale.toUpperCase()})</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700">Treść ogłoszenia</label>
        <input
          type="text"
          name="text"
          defaultValue={banner?.text ?? ""}
          className="focus-ring mt-1 h-11 w-full rounded-[10px] border border-border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400"
          placeholder="np. Letnia promocja na kursy online – zyskaj do -40% tylko do końca miesiąca!"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-slate-700">Tekst na przycisku</label>
          <input
            type="text"
            name="buttonText"
            defaultValue={banner?.buttonText ?? ""}
            className="focus-ring mt-1 h-11 w-full rounded-[10px] border border-border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400"
            placeholder="np. Sprawdź promocje"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700">Link do przekierowania</label>
          <input
            type="text"
            name="buttonUrl"
            defaultValue={banner?.buttonUrl ?? ""}
            className="focus-ring mt-1 h-11 w-full rounded-[10px] border border-border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400"
            placeholder="np. /pakiety"
          />
        </div>
      </div>

      <div className="pt-2 flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft transition duration-200 hover:bg-[#2f16d8] disabled:opacity-50"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Zapisz ustawienia dla {locale.toUpperCase()}
        </button>
        {success && <p className="text-sm font-bold text-emerald-600">Zapisano pomyślnie!</p>}
        {error && <p className="text-sm font-bold text-red-600">Wystąpił błąd zapisu.</p>}
      </div>
    </form>
  );
}
