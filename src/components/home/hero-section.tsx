import { ArrowRight, BookOpen, GraduationCap, ShieldCheck, Star, Ticket, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { type Locale } from "@/lib/i18n/config";
import { type Dictionary } from "@/lib/i18n/dictionaries";

export function HeroSection({
  locale,
  dictionary
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <section className="relative border-b border-border/60 bg-gradient-to-b from-white via-white to-[#f7f5ff]">
      <div className="container-shell grid min-h-[560px] items-center gap-10 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:py-10">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
            <GraduationCap className="h-4 w-4" />
            {dictionary.home.badge}
          </span>
          <h1 className="mt-6 max-w-[680px] text-4xl font-black leading-[1.08] tracking-normal text-foreground sm:text-5xl lg:text-[58px]">
            {dictionary.home.heroTitleStart}{" "}
            <span className="text-primary">{dictionary.home.heroTitleAccent}</span>
          </h1>
          <p className="mt-6 max-w-[560px] text-base leading-8 text-slate-600 sm:text-lg">
            {dictionary.home.heroLead}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={dictionary.routes.courses} className="w-full sm:w-auto">
              {dictionary.home.primaryCta}
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href={dictionary.routes.bundles} variant="secondary" className="w-full sm:w-auto">
              {dictionary.home.secondaryCta}
            </ButtonLink>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <HeroBenefit icon={<GraduationCap className="h-5 w-5" />} title={dictionary.home.badge} text={dictionary.benefits.verified} />
            <HeroBenefit icon={<Ticket className="h-5 w-5" />} title="Premium" text={dictionary.benefits.prices} />
            <HeroBenefit icon={<ShieldCheck className="h-5 w-5" />} title="Instant" text={dictionary.benefits.access} />
          </div>
        </div>

        <HeroVisual dictionary={dictionary} locale={locale} />
      </div>
    </section>
  );
}

function HeroBenefit({
  icon,
  title,
  text
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-primary shadow-soft">
        {icon}
      </div>
      <div>
        <div className="text-sm font-bold text-foreground">{title}</div>
        <div className="mt-1 text-xs leading-5 text-muted-foreground">{text}</div>
      </div>
    </div>
  );
}

function HeroVisual({ dictionary }: { dictionary: Dictionary; locale: Locale }) {
  return (
    <div className="relative mx-auto h-[430px] w-full max-w-[560px] lg:h-[520px]" aria-hidden="true">
      <div className="absolute inset-x-8 bottom-6 top-2 rounded-full bg-primary-soft blur-3xl" />
      <div className="absolute bottom-7 left-1/2 h-[360px] w-[300px] -translate-x-1/2 rounded-[46%_46%_18%_18%] bg-gradient-to-b from-[#6d4aff] via-[#4c1d95] to-[#25105f] shadow-card sm:h-[420px] sm:w-[350px]" />
      <div className="absolute left-1/2 top-12 h-28 w-28 -translate-x-1/2 rounded-full bg-gradient-to-br from-[#f0c6a8] to-[#c98565] shadow-card sm:h-32 sm:w-32" />
      <div className="absolute left-1/2 top-8 h-16 w-32 -translate-x-1/2 rounded-t-full bg-[#5b301c] sm:w-36" />
      <div className="absolute left-1/2 top-[118px] h-5 w-16 -translate-x-1/2 rounded-full border-2 border-[#15112c]" />
      <div className="absolute bottom-20 left-1/2 h-[150px] w-[330px] -translate-x-1/2 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-100 shadow-card sm:w-[390px]">
        <div className="mx-auto mt-5 h-3 w-24 rounded-full bg-slate-200" />
        <div className="mx-auto mt-6 grid h-20 w-52 place-items-center rounded-xl bg-primary-soft text-primary sm:w-64">
          <BookOpen className="h-10 w-10" />
        </div>
      </div>

      <StatCard className="right-0 top-12" icon={<Users className="h-6 w-6" />} value="10 000+" label={dictionary.stats.students} />
      <StatCard className="right-2 top-[168px]" icon={<Star className="h-7 w-7 fill-warning text-warning" />} value="4.8/5" label={dictionary.stats.rating} />
      <StatCard className="bottom-12 right-0" icon={<BookOpen className="h-6 w-6" />} value="50+" label={dictionary.stats.courses} />
    </div>
  );
}

function StatCard({
  className,
  icon,
  value,
  label
}: {
  className: string;
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className={`absolute hidden w-48 rounded-xl border border-border bg-white/95 p-5 shadow-card sm:flex ${className}`}>
      <div className="mr-4 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
        {icon}
      </div>
      <div>
        <div className="text-lg font-black">{value}</div>
        <div className="mt-1 text-xs leading-5 text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
