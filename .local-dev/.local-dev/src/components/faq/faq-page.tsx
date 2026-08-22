"use client";

import { ArrowRight, BookOpen, Box, CreditCard, FileText, Lock, Search, Tag, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { faq } from "@/lib/mock-data";
import { type Locale } from "@/lib/i18n/config";
import { type Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

const categoryIcons = {
  all: BookOpen,
  courses: BookOpen,
  bundles: Box,
  payments: CreditCard,
  access: Lock,
  invoices: FileText,
  discounts: Tag
};

type FaqCategory = keyof typeof categoryIcons;

const contactEmailHref = "mailto:kontakt@testowanie-oprogramowania.pl";

export function FaqPage({
  locale,
  dictionary
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FaqCategory>("all");
  const [openIndex, setOpenIndex] = useState(0);

  const categories: { id: FaqCategory; label: string }[] = [
    { id: "all", label: dictionary.faqPage.all },
    { id: "courses", label: dictionary.faqPage.courses },
    { id: "bundles", label: dictionary.faqPage.bundles },
    { id: "payments", label: dictionary.faqPage.payments },
    { id: "access", label: dictionary.faqPage.access },
    { id: "invoices", label: dictionary.faqPage.invoices },
    { id: "discounts", label: dictionary.faqPage.discounts }
  ];

  const filteredFaq = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return faq.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;
      const matchesQuery =
        !normalized ||
        `${item.question[locale]} ${item.answer[locale]}`.toLowerCase().includes(normalized);

      return matchesCategory && matchesQuery;
    });
  }, [category, locale, query]);

  return (
    <div className="bg-gradient-to-b from-white to-[#fbfaff]">
      <section className="container-shell py-10 lg:py-14">
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <a href={`/${locale}`} className="hover:text-primary">
            {dictionary.catalog.breadcrumbsHome}
          </a>
          <span aria-hidden="true">›</span>
          <span className="font-semibold text-foreground">{dictionary.nav.faq}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <h1 className="max-w-2xl text-4xl font-black leading-[1.08] sm:text-5xl lg:text-[58px]">
              {dictionary.faqPage.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{dictionary.faqPage.lead}</p>
          </div>
          <FaqIllustration />
        </div>
      </section>

      <section className="container-shell pb-16 lg:pb-20">
        <div className="rounded-2xl border border-border bg-white p-4 shadow-soft sm:p-5">
          <label className="relative block">
            <span className="sr-only">{dictionary.faqPage.searchPlaceholder}</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="focus-ring h-14 w-full rounded-xl border border-border bg-white pl-12 pr-12 text-base text-foreground placeholder:text-slate-500"
              placeholder={dictionary.faqPage.searchPlaceholder}
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:bg-slate-100"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((item) => {
            const Icon = categoryIcons[item.id];

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCategory(item.id);
                  setOpenIndex(0);
                }}
                className={cn(
                  "focus-ring inline-flex h-12 items-center gap-2 rounded-xl border px-5 text-sm font-bold transition",
                  category === item.id
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-white text-slate-600 hover:border-primary hover:text-primary"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
          {filteredFaq.length ? (
            filteredFaq.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div key={item.question[locale]} className="border-b border-border last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="focus-ring flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-center gap-4">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      <span className="text-lg font-black">{item.question[locale]}</span>
                    </span>
                    <ArrowRight className={cn("h-5 w-5 shrink-0 text-primary transition", isOpen && "rotate-90")} />
                  </button>
                  <div className={cn("grid transition-all duration-200", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                    <div className="overflow-hidden">
                      <p className="px-20 pb-6 text-sm leading-7 text-slate-600">{item.answer[locale]}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-10 text-center text-sm text-muted-foreground">{dictionary.faqPage.noResults}</div>
          )}
        </div>

        <div id="kontakt" className="mt-10 grid scroll-mt-24 gap-6 rounded-2xl border border-border bg-primary-soft p-7 shadow-soft lg:grid-cols-[220px_1fr_auto] lg:items-center">
          <div className="relative hidden h-28 lg:block">
            <div className="absolute left-10 top-2 grid h-24 w-24 place-items-center rounded-full bg-white text-primary shadow-soft">
              <BookOpen className="h-12 w-12" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black">{dictionary.faqPage.ctaTitle}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">{dictionary.faqPage.ctaText}</p>
          </div>
          <ButtonLink href={contactEmailHref} className="w-full lg:w-auto">
            {dictionary.faqPage.ctaButton}
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}

function FaqIllustration() {
  return (
    <div className="relative mx-auto hidden h-[330px] w-full max-w-[540px] lg:block" aria-hidden="true">
      <div className="absolute inset-8 rounded-full bg-primary-soft blur-3xl" />
      <div className="absolute right-4 top-4 h-72 w-96 rounded-[28px] border border-border bg-white shadow-card">
        <div className="h-12 rounded-t-[28px] bg-primary" />
        <div className="grid h-44 place-items-center">
          <div className="grid h-28 w-28 place-items-center rounded-2xl bg-primary-soft text-6xl font-black text-primary">?</div>
        </div>
      </div>
      <div className="absolute bottom-8 left-16 rounded-2xl bg-white p-5 shadow-card">
        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-primary" />
          <span className="h-3 w-3 rounded-full bg-primary/60" />
          <span className="h-3 w-3 rounded-full bg-primary/30" />
        </div>
      </div>
    </div>
  );
}
