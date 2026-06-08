import Image from "next/image";
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
        <div className="relative min-h-64 bg-[#ffd51f] sm:min-h-72 lg:min-h-full">
          <Image
            src="/images/author-portrait.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 260px, 100vw"
            className="object-cover object-[50%_18%]"
          />
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
