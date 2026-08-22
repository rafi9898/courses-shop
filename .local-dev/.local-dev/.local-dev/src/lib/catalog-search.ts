import { type Product } from "@/lib/mock-data";
import { type Locale } from "@/lib/i18n/config";

export type CatalogSort = "popular" | "price-low" | "price-high";

export function normalizeCatalogSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function getCatalogItemSearchText(item: Product, categoryLabel: string, locale: Locale) {
  const values = [item.title[locale], item.subtitle?.[locale], categoryLabel].filter(Boolean);

  if ("description" in item) {
    values.push(item.description[locale]);
  }

  if ("highlights" in item) {
    values.push(...item.highlights[locale]);
  }

  return values.join(" ");
}

export function matchesCatalogItem(item: Product, categoryLabel: string, locale: Locale, query: string) {
  const normalizedQuery = normalizeCatalogSearchText(query);
  if (!normalizedQuery) return true;

  return normalizeCatalogSearchText(getCatalogItemSearchText(item, categoryLabel, locale)).includes(normalizedQuery);
}

export function getCatalogItemSearchRank(item: Product, categoryLabel: string, locale: Locale, query: string) {
  const normalizedQuery = normalizeCatalogSearchText(query);
  if (!normalizedQuery) return 0;

  const fields = [
    item.title[locale],
    item.subtitle?.[locale] ?? "",
    categoryLabel,
    "description" in item ? item.description[locale] : "",
    "highlights" in item ? item.highlights[locale].join(" ") : ""
  ];

  for (let index = 0; index < fields.length; index += 1) {
    const normalizedField = normalizeCatalogSearchText(fields[index]);
    if (normalizedField && normalizedField.includes(normalizedQuery)) {
      return index;
    }
  }

  return normalizeCatalogSearchText(getCatalogItemSearchText(item, categoryLabel, locale)).includes(normalizedQuery) ? 5 : 6;
}

