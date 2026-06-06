import { ArrowRight, BookOpen } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export function CatalogCta({
  title,
  text,
  href,
  label
}: {
  title: string;
  text: string;
  href: string;
  label: string;
}) {
  return (
    <div className="mt-12 rounded-2xl border border-border bg-primary-soft p-6 shadow-soft sm:flex sm:items-center sm:justify-between sm:gap-8 lg:p-8">
      <div className="flex items-start gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-primary">
          <BookOpen className="h-7 w-7" />
        </span>
        <div>
          <h2 className="text-xl font-black sm:text-2xl">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{text}</p>
        </div>
      </div>
      <ButtonLink href={href} className="mt-6 w-full sm:mt-0 sm:w-auto">
        {label}
        <ArrowRight className="h-4 w-4" />
      </ButtonLink>
    </div>
  );
}
