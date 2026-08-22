import { notFound } from "next/navigation";
import { CheckoutStatusPage } from "@/components/checkout/checkout-status-page";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getNoIndexMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export function generateMetadata() {
  return getNoIndexMetadata("Checkout cancelled");
}

export default async function CheckoutCancelEnPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale) || rawLocale !== "en") notFound();

  const locale = rawLocale as Locale;
  return <CheckoutStatusPage locale={locale} dictionary={getDictionary(locale)} status="cancel" />;
}
