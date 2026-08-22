import { notFound } from "next/navigation";
import { CheckoutPage } from "@/components/checkout/checkout-page";
import { getPublicCatalog } from "@/lib/catalog-data";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getNoIndexMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [{ locale: "pl" }, { locale: "de" }, { locale: "en" }];
}

export function generateMetadata() {
  return getNoIndexMetadata("Checkout");
}

export default async function CheckoutRoutePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const catalog = await getPublicCatalog(locale);
  return <CheckoutPage locale={locale} dictionary={getDictionary(locale)} courses={catalog.courses} bundles={catalog.bundles} />;
}
