"use client";

import { ChevronDown, Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "./currency-provider";
import { currencies } from "@/lib/i18n/config";

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  return (
    <details className="group relative">
      <summary className="focus-ring flex h-10 cursor-pointer list-none items-center gap-2 rounded-lg border border-border bg-white px-3 text-xs font-bold text-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.04)] [&::-webkit-details-marker]:hidden">
        <Coins className="h-4 w-4 text-slate-400" />
        {currency}
        <ChevronDown className="h-3.5 w-3.5 transition group-open:rotate-180" />
      </summary>
      <div className="z-20 mt-2 min-w-24 rounded-xl border border-border bg-white p-1 shadow-card lg:absolute lg:left-auto lg:right-0 lg:top-12 lg:mt-0">
        {currencies.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCurrency(item)}
            className={cn(
              "focus-ring flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition",
              item === currency ? "bg-primary-soft text-primary" : "text-slate-600 hover:bg-slate-50"
            )}
          >
            {item}
          </button>
        ))}
      </div>
    </details>
  );
}
