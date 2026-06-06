import { notFound } from "next/navigation";
import { Footer } from "@/components/public/footer";
import { Header } from "@/components/public/header";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";

export function generateStaticParams() {
  return [{ locale: "pl" }, { locale: "de" }, { locale: "en" }];
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const dictionary = getDictionary(locale);

  return (
    <>
      <Header locale={locale} dictionary={dictionary} />
      <main>{children}</main>
      <Footer locale={locale} dictionary={dictionary} />
    </>
  );
}
