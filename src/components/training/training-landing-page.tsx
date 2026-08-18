import {
  ArrowDownToLine,
  ArrowRight,
  Check,
  ChevronDown,
  CircleDot,
  GraduationCap,
  PieChart,
  Settings,
  UsersRound
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { formatPrice } from "@/lib/i18n/config";
import { type TrainingLanding } from "@/lib/training-landing-data";
import { cn } from "@/lib/utils";

export function TrainingLandingPage({ training }: { training: TrainingLanding }) {
  return (
    <div className="bg-white">
      <section className="overflow-hidden border-b border-border/70 bg-[linear-gradient(180deg,#ffffff_0%,#fbfbff_100%)]">
        <div className="container-shell grid gap-10 pb-10 pt-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:pb-16 lg:pt-16">
          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">{training.eyebrow}</p>
            <h1 className="mt-7 max-w-[650px] text-4xl font-black leading-[1.04] tracking-normal text-foreground sm:text-5xl lg:text-[64px]">
              {training.title}
              <span className="block text-primary">{training.titleHighlight}</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">{training.intro}</p>

            <ul className="mt-8 grid gap-4">
              {training.heroBullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3 text-sm font-bold text-slate-700">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <ButtonLink href={training.contactHref} className="h-14 px-8">
                {training.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href={training.downloadHref} variant="secondary" className="h-14 px-8">
                {training.secondaryCta}
                <ArrowDownToLine className="h-4 w-4" />
              </ButtonLink>
            </div>
          </div>

          <HeroVisual training={training} />
        </div>

        <div className="container-shell pb-10">
          <FeatureStrip features={training.featureStrip} />
        </div>
      </section>

      <SectionTitle title="Dlaczego to szkolenie?" />
      <section className="container-shell grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {training.reasons.map((reason) => (
          <InfoCard key={reason.title} icon={reason.icon} title={reason.title} description={reason.description} />
        ))}
      </section>

      <section id="program" className="container-shell pt-16">
        <SectionTitle title="Program szkolenia" compact />
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-[0_14px_40px_rgba(15,23,42,0.04)]">
          {training.agenda.map((item, index) => (
            <details key={item.title} className="group border-b border-border last:border-b-0" open={index === 0}>
              <summary className="focus-ring flex cursor-pointer list-none items-center gap-4 px-5 py-5 text-sm font-black text-foreground transition hover:bg-primary-soft/60 [&::-webkit-details-marker]:hidden">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-black text-white">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">{item.title}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-primary transition group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-5 pl-[68px] text-sm leading-7 text-slate-600">{item.description}</div>
            </details>
          ))}
        </div>
      </section>

      <section className="container-shell pt-16">
        <SectionTitle title="Dla kogo?" compact />
        <div className="grid gap-6 md:grid-cols-3">
          {training.audiences.map((audience) => (
            <HorizontalCard
              key={audience.title}
              icon={audience.icon}
              title={audience.title}
              description={audience.description}
            />
          ))}
        </div>
      </section>

      <section className="container-shell py-16">
        <FinalCta training={training} />
      </section>
    </div>
  );
}

function HeroVisual({ training }: { training: TrainingLanding }) {
  return (
    <div className="relative min-h-[500px] lg:min-h-[590px]">
      <div className="absolute left-4 top-9 hidden w-[255px] rounded-xl border border-[#d9ddff] bg-white/90 p-4 shadow-[0_22px_55px_rgba(64,42,217,0.15)] sm:block">
        <div className="mb-4 flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#9aa5ff]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#c4c9ff]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#dfe2ff]" />
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-4">
          <div className="space-y-3">
            <span className="block h-3 rounded-full bg-slate-200" />
            <span className="block h-3 w-4/5 rounded-full bg-slate-200" />
            <span className="block h-3 w-3/5 rounded-full bg-slate-200" />
          </div>
          <PieChart className="h-12 w-12 text-primary" />
        </div>
        <div className="mt-5 flex h-24 items-end gap-3">
          {[34, 56, 72, 92, 64].map((height, index) => (
            <span
              key={height}
              className={cn("w-7 rounded-t-md bg-primary", index % 2 === 0 ? "opacity-70" : "opacity-95")}
              style={{ height }}
            />
          ))}
        </div>
      </div>

      <div className="absolute left-[18%] top-[29%] z-10 rounded-xl bg-primary px-9 py-6 text-5xl font-black tracking-normal text-white shadow-[0_24px_52px_rgba(64,42,217,0.28)] sm:text-6xl">
        SAP
      </div>

      <div className="absolute right-5 top-20 hidden h-16 w-16 place-items-center rounded-2xl bg-primary-soft text-primary shadow-soft md:grid">
        <Settings className="h-9 w-9" />
      </div>
      <div className="absolute right-12 top-56 hidden h-16 w-16 place-items-center rounded-2xl bg-primary text-white shadow-soft md:grid">
        <UsersRound className="h-8 w-8" />
      </div>
      <div className="absolute bottom-32 left-3 hidden h-20 w-20 place-items-center rounded-full bg-primary-soft text-primary shadow-soft md:grid">
        <PieChart className="h-12 w-12" />
      </div>

      <Image
        src="/images/hero-instructor.png"
        alt="Rafał Podraza prowadzący szkolenie SAP"
        width={900}
        height={1000}
        priority
        className="absolute bottom-0 left-1/2 z-20 w-[82%] max-w-[610px] -translate-x-1/2 object-contain drop-shadow-[0_26px_42px_rgba(15,23,42,0.12)] sm:w-[70%] lg:left-[58%]"
      />

      <PriceCard
        className="absolute bottom-6 right-0 z-30 w-[255px] sm:w-[290px] lg:right-2"
        training={training}
      />
    </div>
  );
}

function FeatureStrip({ features }: { features: TrainingLanding["featureStrip"] }) {
  return (
    <div className="grid overflow-hidden rounded-xl border border-border bg-white shadow-[0_18px_50px_rgba(15,23,42,0.07)] md:grid-cols-3">
      {features.map((feature) => (
        <div key={feature.title} className="flex gap-5 p-6 md:border-r md:border-border md:last:border-r-0">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
            <feature.icon className="h-8 w-8" />
          </span>
          <div>
            <h2 className="text-base font-black">{feature.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionTitle({ title, compact = false }: { title: string; compact?: boolean }) {
  return (
    <div className={cn("text-center", compact ? "mb-7" : "container-shell pb-7 pt-16")}>
      <h2 className="text-3xl font-black tracking-normal text-foreground md:text-4xl">{title}</h2>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  description
}: {
  icon: TrainingLanding["reasons"][number]["icon"];
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-xl border border-border bg-white p-7 text-center shadow-[0_14px_40px_rgba(15,23,42,0.04)]">
      <Icon className="mx-auto h-10 w-10 text-primary" />
      <h3 className="mt-6 text-base font-black">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-slate-600">{description}</p>
    </article>
  );
}

function HorizontalCard({
  icon: Icon,
  title,
  description
}: {
  icon: TrainingLanding["audiences"][number]["icon"];
  title: string;
  description: string;
}) {
  return (
    <article className="flex gap-5 rounded-xl border border-border bg-white p-7 shadow-[0_14px_40px_rgba(15,23,42,0.04)]">
      <Icon className="mt-1 h-9 w-9 shrink-0 text-primary" />
      <div>
        <h3 className="font-black">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      </div>
    </article>
  );
}

function FinalCta({ training }: { training: TrainingLanding }) {
  return (
    <div className="grid gap-7 rounded-xl border border-[#ddd8ff] bg-[linear-gradient(110deg,#f0ecff_0%,#fbfaff_58%,#f5f2ff_100%)] p-7 shadow-soft md:grid-cols-[220px_1fr_300px] md:items-center lg:p-10">
      <div className="relative hidden h-44 md:block">
        <div className="absolute left-0 top-12 h-16 w-16 rotate-12 rounded-2xl bg-white/70" />
        <div className="absolute left-12 top-4 grid h-28 w-36 -rotate-12 place-items-center rounded-[18px] bg-primary text-white shadow-[0_24px_50px_rgba(64,42,217,0.23)]">
          <GraduationCap className="h-20 w-20" />
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-black leading-tight tracking-normal">
          {training.finalCta.title}
          <span className="block text-primary">{training.finalCta.highlight}</span>
        </h2>
        <ul className="mt-6 grid gap-3">
          {training.finalCta.bullets.map((bullet) => (
            <li key={bullet} className="flex items-center gap-3 text-sm text-slate-600">
              <CircleDot className="h-4 w-4 shrink-0 text-primary" />
              {bullet}
            </li>
          ))}
        </ul>
      </div>

      <PriceCard training={training} cta />
    </div>
  );
}

function PriceCard({
  training,
  cta = false,
  className
}: {
  training: TrainingLanding;
  cta?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative rounded-xl border border-border bg-white p-7 shadow-[0_20px_55px_rgba(15,23,42,0.09)]", className)}>
      <p className="text-sm font-semibold text-slate-500">Cena od</p>
      <div className="mt-1 flex items-end gap-2">
        <strong className="text-4xl font-black tracking-normal text-foreground">
          {formatPrice(training.price, "PLN").replace(",00", "")}
        </strong>
        <span className="pb-1 text-sm font-bold text-foreground">{training.priceNote}</span>
      </div>
      <p className="mt-4 flex items-center gap-2 text-sm text-slate-600">
        <span className="grid h-4 w-4 place-items-center rounded-full bg-primary text-white">
          <Check className="h-3 w-3" />
        </span>
        {training.format}
      </p>
      {cta ? (
        <Link
          href={training.contactHref}
          className="focus-ring mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-primary px-6 text-sm font-black text-white shadow-soft transition hover:bg-[#2f16d8]"
        >
          Skontaktuj się
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
      <p className={cn("text-sm text-slate-500", cta ? "mt-5 text-center" : "mt-7")}>{training.companyNote}</p>
      {!cta ? (
        <span className="absolute -bottom-6 left-1/2 hidden h-16 w-16 -translate-x-1/2 place-items-center rounded-full bg-primary-soft text-primary shadow-soft sm:grid">
          <GraduationCap className="h-8 w-8" />
        </span>
      ) : null}
    </div>
  );
}
