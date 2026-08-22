"use client";

import { ChevronDown, Menu, ShoppingCart, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { locales, localeMeta, type Locale } from "@/lib/i18n/config";
import { type Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

export function Header({
  locale,
  dictionary
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isPromotionPage = pathname === `/${locale}/promocja`;
  const navItems = [
    { label: dictionary.nav.courses, href: dictionary.routes.courses },
    { label: dictionary.nav.bundles, href: dictionary.routes.bundles },
    { label: dictionary.nav.categories, href: dictionary.routes.categories },
    { label: dictionary.nav.blog, href: dictionary.routes.blog },
    { label: dictionary.nav.about, href: dictionary.routes.about },
    { label: dictionary.nav.faq, href: dictionary.routes.faq }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-white/92 backdrop-blur-xl">
      <div className="container-shell flex h-[72px] items-center justify-between gap-4">
        <Link href={`/${locale}`} aria-label="Rafał Podraza home">
          <Logo />
        </Link>

        {isPromotionPage ? (
          <div className="flex items-center gap-4">
            <LanguageSwitcher locale={locale} />
            <CartLink href={dictionary.routes.cart} label={dictionary.nav.cart} />
          </div>
        ) : (
          <>
            <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary navigation">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="focus-ring rounded-md text-sm font-medium text-slate-700 transition hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-4 lg:flex">
              <LanguageSwitcher locale={locale} />
              <CartLink
                href={dictionary.routes.cart}
                label={dictionary.nav.cart}
                onClick={() => setOpen(false)}
              />
            </div>

            <button
              type="button"
              className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white lg:hidden"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-label="Toggle navigation"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </>
        )}
      </div>

      {!isPromotionPage && (
        <div
          className={cn(
            "grid border-t border-border bg-white transition-all duration-200 lg:hidden",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          <div className={cn(open ? "overflow-visible" : "overflow-hidden")}>
            <nav className="container-shell flex flex-col gap-2 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-primary-soft hover:text-primary"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 flex items-center justify-between border-t border-border pt-4">
                <LanguageSwitcher locale={locale} />
                <CartLink
                  href={dictionary.routes.cart}
                  label={dictionary.nav.cart}
                  onClick={() => setOpen(false)}
                />
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

function LanguageSwitcher({ locale }: { locale: Locale }) {
  return (
    <details className="group relative">
      <summary className="focus-ring flex h-10 cursor-pointer list-none items-center gap-2 rounded-lg border border-border bg-white px-3 text-xs font-bold text-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.04)] [&::-webkit-details-marker]:hidden">
        <span aria-hidden="true">{localeMeta[locale].flag}</span>
        {localeMeta[locale].label}
        <ChevronDown className="h-3.5 w-3.5 transition group-open:rotate-180" />
      </summary>
      <div className="z-20 mt-2 min-w-28 rounded-xl border border-border bg-white p-1 shadow-card lg:absolute lg:left-auto lg:right-0 lg:top-12 lg:mt-0">
        {locales.map((item) => (
          <Link
            key={item}
            href={`/${item}`}
            className={cn(
              "focus-ring flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition",
              item === locale ? "bg-primary-soft text-primary" : "text-slate-600 hover:bg-slate-50"
            )}
            aria-current={item === locale ? "page" : undefined}
          >
            <span aria-hidden="true">{localeMeta[item].flag}</span>
            {localeMeta[item].label}
          </Link>
        ))}
      </div>
    </details>
  );
}

function CartLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  const { items, customBundleCourseIds, hydrated } = useCart();
  const count = hydrated ? items.length + (customBundleCourseIds.length >= 2 ? 1 : 0) : 0;

  return (
    <Link
      href={href}
      onClick={onClick}
      className="focus-ring relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-primary-soft hover:text-primary"
      aria-label={label}
    >
      <ShoppingCart className="h-5 w-5" />
      {count > 0 ? (
        <span className="absolute right-1 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-white">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
