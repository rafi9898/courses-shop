import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { type Locale } from "@/lib/i18n/config";
import { type Dictionary } from "@/lib/i18n/dictionaries";

export function AuthorStrip({
  dictionary
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <section className="container-shell py-8">
      <div className="grid overflow-hidden rounded-2xl border border-border bg-primary-soft shadow-soft lg:grid-cols-[260px_1fr_auto] lg:items-center">
        <div className="relative min-h-48 bg-gradient-to-br from-white to-primary-soft">
          <div className="absolute bottom-0 left-1/2 h-40 w-32 -translate-x-1/2 rounded-t-full bg-gradient-to-b from-[#6d4aff] to-[#26107a]" />
          <div className="absolute left-1/2 top-10 h-20 w-20 -translate-x-1/2 rounded-full bg-gradient-to-br from-[#f1c6a6] to-[#c98766]" />
          <div className="absolute left-1/2 top-8 h-10 w-24 -translate-x-1/2 rounded-t-full bg-[#5b301c]" />
        </div>
        <div className="p-7 lg:p-8">
          <h2 className="text-2xl font-black sm:text-3xl">{dictionary.home.authorTitle}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{dictionary.home.authorText}</p>
        </div>
        <div className="px-7 pb-7 lg:p-8">
          <ButtonLink href={dictionary.routes.about} className="w-full whitespace-nowrap lg:w-auto">
            {dictionary.home.authorCta}
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
