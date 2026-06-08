import { ButtonLink } from "@/components/ui/button";
import { adminCatalogLocales, type AdminCatalogLocale } from "@/lib/admin-catalog-locales";

const localeLabels: Record<AdminCatalogLocale, string> = {
  pl: "Polski",
  de: "Deutsch",
  en: "English"
};

export function parseAdminLocale(value: unknown): AdminCatalogLocale {
  const locale = typeof value === "string" ? value : "";
  return adminCatalogLocales.includes(locale as AdminCatalogLocale) ? (locale as AdminCatalogLocale) : "pl";
}

export function CatalogLocaleSwitcher({ activeLocale, basePath }: { activeLocale: AdminCatalogLocale; basePath: string }) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {adminCatalogLocales.map((locale) => (
        <ButtonLink key={locale} href={`${basePath}?locale=${locale}`} variant={locale === activeLocale ? "primary" : "secondary"} className="h-10 px-4">
          {localeLabels[locale]}
        </ButtonLink>
      ))}
    </div>
  );
}
