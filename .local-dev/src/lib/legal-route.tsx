import { notFound } from "next/navigation";
import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { legalDocuments, type LegalDocumentType } from "@/lib/legal-pages";
import { getPublicPageMetadata } from "@/lib/seo";

export function getLegalStaticParams(locale: Locale) {
  return [{ locale }];
}

export function getLegalMetadata(locale: Locale, type: LegalDocumentType) {
  return getPublicPageMetadata(locale, type);
}

export async function LegalRoutePage({
  params,
  locale,
  type
}: {
  params: Promise<{ locale: string }>;
  locale: Locale;
  type: LegalDocumentType;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale) || rawLocale !== locale) notFound();

  return <LegalDocumentPage locale={locale} dictionary={getDictionary(locale)} document={legalDocuments[locale][type]} />;
}
