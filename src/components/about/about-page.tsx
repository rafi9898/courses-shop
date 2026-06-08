import Image from "next/image";
import { ArrowRight, CheckCircle2, Clock, Code2, Database, Github, PlayCircle, Star, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { type Locale } from "@/lib/i18n/config";
import { type Dictionary } from "@/lib/i18n/dictionaries";

const technologies = ["JavaScript", "TypeScript", "React", "Node.js", "Next.js", "Tailwind CSS", "API", "SQL", "Git"];

export function AboutPage({
  locale,
  dictionary
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <div className="bg-gradient-to-b from-white to-[#fbfaff]">
      <section className="container-shell py-10 lg:py-14">
        <nav className="mb-10 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <a href={`/${locale}`} className="hover:text-primary">
            {dictionary.catalog.breadcrumbsHome}
          </a>
          <span aria-hidden="true">›</span>
          <span className="font-semibold text-foreground">{dictionary.nav.about}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-primary">{dictionary.aboutPage.eyebrow}</p>
            <h1 className="mt-6 text-4xl font-black leading-[1.08] sm:text-5xl lg:text-[58px]">
              {dictionary.aboutPage.titleStart}{" "}
              <br />
              <span className="text-primary">{dictionary.aboutPage.authorName}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">{dictionary.aboutPage.lead}</p>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">{dictionary.aboutPage.mission}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={dictionary.routes.courses} className="w-full sm:w-auto">
                {dictionary.aboutPage.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href={dictionary.routes.faq} variant="secondary" className="w-full sm:w-auto">
                {dictionary.aboutPage.secondaryCta}
              </ButtonLink>
            </div>
          </div>

          <AuthorPortrait />
        </div>

        <StatsStrip dictionary={dictionary} />
      </section>

      <section className="container-shell py-10 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-primary">{dictionary.aboutPage.approachEyebrow}</p>
            <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">{dictionary.aboutPage.approachTitle}</h2>
            <p className="mt-5 text-base leading-8 text-slate-600">{dictionary.aboutPage.approachText}</p>
            <ul className="mt-8 grid gap-4">
              {dictionary.aboutPage.bullets.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                  <CheckCircle2 className="h-5 w-5 shrink-0 fill-primary text-white" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-soft lg:p-8">
            <h2 className="text-2xl font-black">{dictionary.aboutPage.technologiesTitle}</h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {technologies.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-border bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
                  <TechnologyIcon name={item} />
                  <span className="text-sm font-black">{item}</span>
                </div>
              ))}
            </div>
            <ButtonLink href={dictionary.routes.courses} variant="secondary" className="mt-8 w-full sm:w-auto">
              {dictionary.aboutPage.primaryCta}
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="container-shell pb-16 lg:pb-20">
        <div className="grid overflow-hidden rounded-2xl border border-border bg-primary-soft shadow-soft lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div className="relative min-h-56 bg-gradient-to-br from-white to-primary-soft">
            <div className="absolute left-16 top-12 h-28 w-40 rounded-2xl border border-border bg-white shadow-card">
              <div className="h-8 rounded-t-2xl bg-primary" />
              <div className="grid h-20 place-items-center text-primary">
                <PlayCircle className="h-12 w-12" />
              </div>
            </div>
          </div>
          <div className="p-8 lg:p-10">
            <h2 className="text-3xl font-black">{dictionary.aboutPage.finalTitle}</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">{dictionary.aboutPage.finalText}</p>
            <ButtonLink href={dictionary.routes.courses} className="mt-7">
              {dictionary.aboutPage.finalCta}
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}

function AuthorPortrait() {
  return (
    <div className="relative mx-auto h-[420px] w-full max-w-[560px] overflow-hidden rounded-[28px] bg-primary-soft shadow-soft" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_42%_28%,rgba(79,70,229,0.14),transparent_18rem)]" />
      <Image
        src="/images/about-hero-author.png"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 45vw, 100vw"
        className="translate-y-4 object-contain object-bottom"
      />
    </div>
  );
}

function StatsStrip({ dictionary }: { dictionary: Dictionary }) {
  const stats = [
    { icon: PlayCircle, value: "50+", label: dictionary.stats.courses },
    { icon: Users, value: "10 000+", label: dictionary.stats.students },
    { icon: Clock, value: "1200+", label: dictionary.stats.hours },
    { icon: Star, value: "4.9 / 5", label: dictionary.stats.rating }
  ];

  return (
    <div className="mt-12 grid gap-4 rounded-2xl border border-border bg-white p-6 shadow-soft sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => (
        <div key={item.value} className="flex items-center gap-4 lg:border-r lg:border-border lg:last:border-r-0">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
            <item.icon className="h-7 w-7" />
          </span>
          <span>
            <span className="block text-2xl font-black">{item.value}</span>
            <span className="mt-1 block text-sm text-muted-foreground">{item.label}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function TechnologyIcon({ name }: { name: string }) {
  if (name === "SQL") return <Database className="h-6 w-6 text-primary" />;
  if (name === "Git") return <Github className="h-6 w-6 text-[#f04f33]" />;
  return <Code2 className="h-6 w-6 text-primary" />;
}
