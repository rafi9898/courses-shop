import { notFound } from "next/navigation";
import { CheckoutStatusPage } from "@/components/checkout/checkout-status-page";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function generateStaticParams() {
  return [{ locale: "pl" }];
}

export default async function CheckoutSuccessPlPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { locale: rawLocale } = await params;
  const { session_id: sessionId } = await searchParams;
  if (!isLocale(rawLocale) || rawLocale !== "pl") notFound();

  const locale = rawLocale as Locale;
  return <CheckoutStatusPage locale={locale} dictionary={getDictionary(locale)} status="success" sessionId={sessionId} />;
}
