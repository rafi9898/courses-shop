"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { faq } from "@/lib/mock-data";
import { type Locale } from "@/lib/i18n/config";
import { type Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

export function FaqPreview({
  locale,
  dictionary
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const [open, setOpen] = useState(0);

  return (
    <section className="container-shell py-16 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">FAQ</p>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl">{dictionary.home.faqTitle}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Linki do kursów trafiają na stronę sukcesu i do wiadomości e-mail. Bez kont klientów i bez panelu użytkownika.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
          {faq.map((item, index) => {
            const isOpen = open === index;

            return (
              <div key={item.question[locale]} className="border-b border-border last:border-b-0">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  className="focus-ring flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-black"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-sm text-white">
                      {index + 1}
                    </span>
                    {item.question[locale]}
                  </span>
                  <ChevronDown className={cn("h-5 w-5 shrink-0 text-primary transition", isOpen && "rotate-180")} />
                </button>
                <div className={cn("grid transition-all duration-200", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden">
                    <p className="px-16 pb-5 text-sm leading-7 text-slate-600">{item.answer[locale]}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
