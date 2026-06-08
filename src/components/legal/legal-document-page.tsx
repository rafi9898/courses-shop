import Link from "next/link";
import { FileText } from "lucide-react";
import { type Locale } from "@/lib/i18n/config";
import { type Dictionary } from "@/lib/i18n/dictionaries";
import { type LegalDocument, sellerDetails } from "@/lib/legal-pages";

export function LegalDocumentPage({
  locale,
  dictionary,
  document
}: {
  locale: Locale;
  dictionary: Dictionary;
  document: LegalDocument;
}) {
  const labels = getLegalLabels(locale);

  return (
    <div className="bg-gradient-to-b from-white to-[#fbfaff]" lang={locale}>
      <section className="border-b border-border/70 bg-white">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-9 sm:px-8 lg:py-12">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href={`/${locale}`} className="hover:text-primary">
              {dictionary.catalog.breadcrumbsHome}
            </Link>
            <span aria-hidden="true">›</span>
            <span className="font-semibold text-foreground">{document.title}</span>
          </nav>
          <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
            <div className="min-w-0">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">rafalpodraza.com</p>
              <h1 className="mt-4 max-w-3xl break-words text-4xl font-black leading-tight tracking-normal [overflow-wrap:anywhere] sm:text-5xl">{document.title}</h1>
              <p className="mt-5 max-w-3xl break-words text-base leading-7 text-slate-600 [overflow-wrap:anywhere]">{document.intro}</p>
            </div>
            <aside className="rounded-2xl border border-border bg-white p-5 shadow-card">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
                  <FileText className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">{labels.lastUpdated}</p>
                  <p className="font-black">{document.lastUpdated}</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start">
          <aside className="rounded-2xl border border-border bg-white p-5 shadow-card lg:sticky lg:top-24">
            <p className="text-sm font-black text-slate-950">Rafał Podraza</p>
            <dl className="mt-4 space-y-3 text-sm text-slate-600">
              <InfoLine label={labels.email} value={sellerDetails.email} />
              <InfoLine label="NIP" value={sellerDetails.taxId} />
              <InfoLine label="REGON" value={sellerDetails.regon} />
              <InfoLine label={labels.address} value={sellerDetails.address} />
            </dl>
          </aside>

          <article className="min-w-0 rounded-2xl border border-border bg-white p-6 shadow-soft sm:p-8 lg:p-10">
            <div className="space-y-10">
              {document.sections.map((section) => (
                <section key={section.title} className="scroll-mt-28">
                  <h2 className="break-words text-2xl font-black tracking-normal [overflow-wrap:anywhere]">{section.title}</h2>
                  {section.paragraphs ? (
                    <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph} className="break-words [overflow-wrap:anywhere]">{paragraph}</p>
                      ))}
                    </div>
                  ) : null}
                  {section.items ? (
                    <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 sm:text-base">
                      {section.items.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                          <span className="min-w-0 break-words [overflow-wrap:anywhere]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

function getLegalLabels(locale: Locale) {
  if (locale === "de") {
    return {
      lastUpdated: "Aktualisiert",
      email: "E-Mail",
      address: "Adresse"
    };
  }

  if (locale === "en") {
    return {
      lastUpdated: "Last update",
      email: "E-mail",
      address: "Address"
    };
  }

  return {
    lastUpdated: "Aktualizacja",
    email: "E-mail",
    address: "Adres"
  };
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-black uppercase text-slate-500">{label}</dt>
      <dd className="mt-1 break-words leading-6 text-slate-700">{value}</dd>
    </div>
  );
}
