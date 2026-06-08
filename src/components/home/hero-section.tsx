import Image from "next/image";
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
  const benefits = getBenefitCopy(locale);

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

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <HeroBenefit icon={<GraduationCap className="h-5 w-5" />} title={dictionary.home.badge} text={dictionary.benefits.verified} />
            <HeroBenefit icon={<Ticket className="h-5 w-5" />} title={benefits.pricesTitle} text={dictionary.benefits.prices} />
            <HeroBenefit icon={<ShieldCheck className="h-5 w-5" />} title={benefits.accessTitle} text={dictionary.benefits.access} />
          </div>
        </div>

        <HeroVisual dictionary={dictionary} />
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
    <div className="flex items-center gap-4">
      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="whitespace-nowrap text-sm font-bold text-foreground">{title}</div>
        <div className="mt-1 text-xs leading-5 text-muted-foreground">{text}</div>
      </div>
    </div>
  );
}

function getBenefitCopy(locale: Locale) {
  if (locale === "de") {
    return {
      pricesTitle: "Beste Preise",
      accessTitle: "Sofortzugang"
    };
  }

  if (locale === "en") {
    return {
      pricesTitle: "Best prices",
      accessTitle: "Instant access"
    };
  }

  return {
    pricesTitle: "Najlepsze ceny",
    accessTitle: "Natychmiastowy dostęp"
  };
}

function HeroVisual({ dictionary }: { dictionary: Dictionary }) {
  return (
    <div className="relative mx-auto hidden h-[560px] w-full max-w-[540px] lg:block" aria-hidden="true">
      <div className="absolute inset-x-8 bottom-4 top-20 rounded-full bg-primary-soft blur-3xl" />
      <Image
        src="/images/hero-instructor.png"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 45vw, 100vw"
        className="-translate-x-5 object-contain object-bottom sm:-translate-x-16 lg:-translate-x-24"
      />
      <div className="absolute right-0 top-10 hidden flex-col gap-4 sm:flex">
        <StatCard icon={<Users className="h-6 w-6" />} value="70 000+" label={dictionary.stats.students} />
        <StatCard icon={<Star className="h-7 w-7 fill-warning text-warning" />} value="4.8/5" label={dictionary.stats.rating} />
        <StatCard icon={<BookOpen className="h-6 w-6" />} value="70+" label={dictionary.stats.courses} />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex w-64 rounded-xl border border-border bg-white/95 p-5 shadow-card">
      <div className="mr-4 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-lg font-black">{value}</div>
        <div className="mt-1 break-words text-xs leading-5 text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
