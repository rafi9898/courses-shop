"use client";

import { ArrowRight, Home, SearchX } from "lucide-react";
import { usePathname } from "next/navigation";
import { CartProvider } from "@/components/cart/cart-provider";
import { Footer } from "@/components/public/footer";
import { Header } from "@/components/public/header";
import { ButtonLink } from "@/components/ui/button";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

function getLocaleFromPath(pathname: string | null): Locale {
  const firstSegment = pathname?.split("/").filter(Boolean)[0];
  return firstSegment && isLocale(firstSegment) ? firstSegment : "pl";
}

export function NotFoundPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const dictionary = getDictionary(locale);

  return (
    <CartProvider locale={locale} discounts={[]}>
      <Header locale={locale} dictionary={dictionary} />
      <main>
        <section className="bg-gradient-to-b from-white via-white to-[#f7f5ff]">
          <div className="container-shell grid min-h-[calc(100vh-72px)] items-center gap-10 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
                <SearchX className="h-4 w-4" />
                {dictionary.notFoundPage.eyebrow}
              </span>
              <p className="mt-8 text-7xl font-black leading-none text-primary sm:text-8xl">404</p>
              <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[1.08] text-foreground sm:text-5xl lg:text-[58px]">
                {dictionary.notFoundPage.title}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                {dictionary.notFoundPage.lead}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={`/${locale}`} className="w-full sm:w-auto">
                  <Home className="h-4 w-4" />
                  {dictionary.notFoundPage.homeCta}
                </ButtonLink>
                <ButtonLink href={dictionary.routes.courses} variant="secondary" className="w-full sm:w-auto">
                  {dictionary.notFoundPage.coursesCta}
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[560px]" aria-hidden="true">
              <div className="absolute inset-8 rounded-full bg-primary-soft blur-3xl" />
              <div className="relative overflow-hidden rounded-[28px] border border-border bg-white p-6 shadow-soft sm:p-8">
                <div className="rounded-2xl border border-border bg-primary-soft p-6">
                  <div className="flex items-center gap-4">
                    <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white text-primary shadow-[0_10px_26px_rgba(15,23,42,0.06)]">
                      <SearchX className="h-8 w-8" />
                    </span>
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.22em] text-primary">
                        {dictionary.notFoundPage.codeLabel}
                      </p>
                      <p className="mt-1 text-2xl font-black text-foreground">404</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
                    <p className="text-sm font-black text-foreground">{dictionary.notFoundPage.suggestionTitle}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{dictionary.notFoundPage.suggestionText}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
                    <p className="text-sm font-black text-foreground">{dictionary.home.searchButton}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{dictionary.catalog.categoriesLead}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} dictionary={dictionary} />
    </CartProvider>
  );
}
