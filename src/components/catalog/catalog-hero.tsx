import { BookOpen, Boxes, Cloud, Code2, Database, GraduationCap, ShieldCheck, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { type Dictionary } from "@/lib/i18n/dictionaries";
import { type Locale } from "@/lib/i18n/config";

type HeroKind = "courses" | "bundles" | "categories";

export function CatalogHero({
  locale,
  dictionary,
  kind
}: {
  locale: Locale;
  dictionary: Dictionary;
  kind: HeroKind;
}) {
  const title =
    kind === "courses"
      ? dictionary.catalog.coursesTitle
      : kind === "bundles"
        ? dictionary.catalog.bundlesTitle
        : dictionary.catalog.categoriesTitle;
  const lead =
    kind === "courses"
      ? dictionary.catalog.coursesLead
      : kind === "bundles"
        ? dictionary.catalog.bundlesLead
        : dictionary.catalog.categoriesLead;

  return (
    <section className="border-b border-border/70 bg-gradient-to-b from-white to-[#fbfaff]">
      <div className="container-shell grid gap-10 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-12">
        <div>
          <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href={`/${locale}`} className="hover:text-primary">
              {dictionary.catalog.breadcrumbsHome}
            </Link>
            <span aria-hidden="true">›</span>
            <span className="font-semibold text-foreground">{title}</span>
          </nav>
          <h1 className="max-w-[620px] text-4xl font-black leading-[1.08] tracking-normal sm:text-5xl lg:text-[58px]">
            {title}
          </h1>
          <p className="mt-5 max-w-[560px] text-base leading-8 text-slate-600 sm:text-lg">{lead}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <HeroFact icon={<BookOpen className="h-5 w-5" />} value={kind === "bundles" ? "12+" : "50+"} label={dictionary.stats.courses} />
            <HeroFact icon={<Star className="h-5 w-5 fill-warning text-warning" />} value="10 000+" label={dictionary.stats.students} />
            <HeroFact icon={<ShieldCheck className="h-5 w-5" />} value="Instant" label={dictionary.benefits.access} />
          </div>
        </div>
        <CatalogIllustration kind={kind} />
      </div>
    </section>
  );
}

function HeroFact({
  icon,
  value,
  label
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">{icon}</span>
      <span>
        <span className="block text-sm font-black">{value}</span>
        <span className="block text-xs leading-5 text-muted-foreground">{label}</span>
      </span>
    </div>
  );
}

function CatalogIllustration({ kind }: { kind: HeroKind }) {
  const mainIcon =
    kind === "courses" ? <GraduationCap className="h-20 w-20" /> : kind === "bundles" ? <Boxes className="h-20 w-20" /> : <Sparkles className="h-20 w-20" />;

  return (
    <div className="relative mx-auto hidden h-[320px] w-full max-w-[520px] lg:block" aria-hidden="true">
      <div className="absolute inset-8 rounded-full bg-primary-soft blur-3xl" />
      <div className="absolute bottom-6 left-10 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-300 to-emerald-600 opacity-80 blur-sm" />
      <div className="absolute right-8 top-8 h-28 w-28 rounded-full bg-gradient-to-br from-blue-200 to-blue-500 opacity-80 blur-sm" />
      <div className="absolute left-1/2 top-1/2 grid h-60 w-80 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[28px] border border-border bg-white shadow-card">
        <div className="absolute left-0 top-0 h-12 w-full rounded-t-[28px] bg-primary" />
        <div className="relative mt-8 grid h-36 w-36 place-items-center rounded-3xl bg-primary-soft text-primary shadow-soft">
          {mainIcon}
        </div>
      </div>
      <div className="absolute bottom-2 right-12 grid grid-cols-3 gap-3">
        {[Code2, Cloud, Database].map((Icon) => (
          <div key={Icon.displayName ?? Icon.name} className="grid h-14 w-14 place-items-center rounded-xl border border-border bg-white text-primary shadow-soft">
            <Icon className="h-6 w-6" />
          </div>
        ))}
      </div>
    </div>
  );
}
