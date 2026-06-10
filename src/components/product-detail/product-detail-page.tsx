import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Globe2,
  GraduationCap,
  Layers,
  Lock,
  PackageCheck,
  PlayCircle,
  ShieldCheck,
  Star,
  Subtitles
} from "lucide-react";
import Link from "next/link";
import { AddToCartButton } from "@/components/commerce/add-to-cart-button";
import { BundleCard } from "@/components/commerce/bundle-card";
import { ProductCard, Thumbnail } from "@/components/commerce/product-card";
import { RichTextContent } from "@/components/product-detail/rich-text-content";
import { VideoPreview } from "@/components/product-detail/video-preview";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { type Bundle, type Category, type Course } from "@/lib/mock-data";
import { formatPrice, localeMeta, type Locale } from "@/lib/i18n/config";
import { type Dictionary } from "@/lib/i18n/dictionaries";
import { getBundlePath, getCoursePath } from "@/lib/routes";
import { createProductJsonLd } from "@/lib/seo";

type DetailProduct =
  | {
      kind: "course";
      product: Course;
    }
  | {
      kind: "bundle";
      product: Bundle;
    };

export function ProductDetailPage({
  locale,
  dictionary,
  detail,
  categories,
  courses,
  bundles
}: {
  locale: Locale;
  dictionary: Dictionary;
  detail: DetailProduct;
  categories: Category[];
  courses: Course[];
  bundles: Bundle[];
}) {
  const { product, kind } = detail;
  const category = categories.find((item) => item.id === product.categoryId);
  const isCourse = kind === "course";
  const title = product.title[locale];
  const heroSubtitle = isCourse ? product.subtitle?.[locale] : product.subtitle?.[locale];
  const savings = product.regularPrice[locale] - product.price[locale];
  const courseById = new Map(courses.map((course) => [course.id, course]));
  const bundleCourses = !isCourse
    ? product.courseIds.map((courseId) => courseById.get(courseId)).filter((course): course is Course => Boolean(course))
    : [];
  const containingBundles = isCourse ? bundles.filter((bundle) => bundle.courseIds.includes(product.id)).slice(0, 3) : [];
  const recommendedCourses = courses.filter((course) => course.id !== product.id && course.categoryId === product.categoryId).slice(0, 3);
  const recommendedBundles = bundles.filter((bundle) => bundle.id !== product.id && bundle.categoryId === product.categoryId).slice(0, 2);
  const productPath = isCourse ? getCoursePath(product, locale) : getBundlePath(product, locale);

  return (
    <div className="bg-gradient-to-b from-white to-[#fbfaff] pb-28 md:pb-0">
      <JsonLd
        data={createProductJsonLd({
          locale,
          path: productPath,
          name: title,
          description: heroSubtitle || title,
          price: product.price[locale],
          currency: localeMeta[locale].currency,
          imageUrl: product.thumbnailImageUrl
        })}
      />
      <section className="border-b border-border/70 bg-white">
        <div className="container-shell py-9 lg:py-12">
          <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href={`/${locale}`} className="hover:text-primary">
              {dictionary.catalog.breadcrumbsHome}
            </Link>
            <span aria-hidden="true">›</span>
            <Link href={isCourse ? dictionary.routes.courses : dictionary.routes.bundles} className="hover:text-primary">
              {isCourse ? dictionary.nav.courses : dictionary.nav.bundles}
            </Link>
            <span aria-hidden="true">›</span>
            <span className="font-semibold text-foreground">{title}</span>
          </nav>

          <div className="grid gap-8 md:grid-cols-2 md:items-start lg:gap-10">
            <div className="min-w-0">
              <Badge>{category?.label[locale]}</Badge>
              <h1 className="mt-5 text-4xl font-black leading-[1.08] tracking-normal sm:text-5xl">{title}</h1>
              {heroSubtitle ? <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{heroSubtitle}</p> : null}

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <Star className="h-5 w-5 fill-warning text-warning" />
                  <strong className="text-foreground">{product.rating}</strong> ({product.reviews})
                </span>
                <span className="inline-flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  {isCourse ? `${product.lessons} ${dictionary.detail.lessons.toLowerCase()}` : dictionary.detail.includedCourses.replace("{count}", String(product.courseCount))}
                </span>
              </div>

              <div className="mt-8 w-full max-w-[430px] space-y-4 lg:sticky lg:top-24 lg:self-start">
                <PriceCard
                  product={product}
                  price={product.price[locale]}
                  regularPrice={product.regularPrice[locale]}
                  savings={savings}
                  locale={locale}
                  dictionary={dictionary}
                />
                {isCourse ? <CourseBundleUpsell bundles={containingBundles} locale={locale} /> : null}
              </div>
            </div>

            <div className="min-w-0">
              {isCourse ? (
                <VideoPreview course={product} dictionary={dictionary} locale={locale} />
              ) : (
                <div className="overflow-hidden rounded-2xl shadow-card">
                  <div className="[&>div]:h-[280px] [&>div]:min-h-[280px] md:[&>div]:h-[360px] xl:[&>div]:h-[400px]">
                    <Thumbnail
                      title={product.thumbnail.title}
                      subtitle={product.thumbnail.subtitle}
                      variant={product.thumbnail.variant}
                      hideText
                      imageUrl={product.thumbnailImageUrl}
                      showFavorite={false}
                    />
                  </div>
                </div>
              )}

              <div className="mt-8 md:-ml-8 lg:-ml-10">
                <FeatureStrip locale={locale} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-10 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          <div className="space-y-10">
            <ContentCard title={isCourse ? dictionary.detail.aboutCourse : dictionary.detail.aboutBundle}>
              {isCourse ? (
                <RichTextContent html={courseAboutHtml(product.highlights[locale])} />
              ) : (
                <>
                  <RichTextContent html={product.description[locale]} />
                  <p>{getBundleAboutCopy(locale)}</p>
                </>
              )}
            </ContentCard>

            {isCourse ? (
              <>
                <ContentCard title={dictionary.detail.whatYouLearn}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {product.outcomes[locale].map((outcome) => (
                      <div key={outcome} className="flex items-start gap-3 text-sm leading-6 text-slate-600">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        {outcome}
                      </div>
                    ))}
                  </div>
                </ContentCard>

                <ContentCard title={dictionary.detail.courseProgram}>
                  <div className="overflow-hidden rounded-xl border border-border">
                    {product.agenda[locale].map((item, index) => (
                      <div key={item.title} className="grid gap-3 border-b border-border px-4 py-4 last:border-b-0 sm:grid-cols-[32px_1fr_auto] sm:items-center">
                        <span className="text-sm font-bold text-muted-foreground">{index + 1}.</span>
                        <span className="font-semibold">{item.title}</span>
                        <span className="text-sm text-muted-foreground">
                          {item.lessons} {dictionary.detail.lessons.toLowerCase()}
                          {item.duration ? ` · ${item.duration}` : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </ContentCard>
              </>
            ) : (
              <ContentCard title={dictionary.detail.bundleCourses}>
                <div className="grid gap-4">
                  {bundleCourses.map((course) => (
                    <Link
                      key={course.id}
                      href={getCoursePath(course, locale)}
                      className="grid gap-4 rounded-xl border border-border bg-white p-4 transition hover:border-primary/40 hover:shadow-card sm:grid-cols-[150px_1fr_auto] sm:items-center"
                    >
                      <Thumbnail
                        title={course.thumbnail.title}
                        subtitle={course.thumbnail.subtitle}
                        variant={course.thumbnail.variant}
                        imageUrl={course.thumbnailImageUrl}
                        showFavorite={false}
                      />
                      <div>
                        <h3 className="font-black">{course.title[locale]}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{categories.find((item) => item.id === course.categoryId)?.label[locale]}</p>
                      </div>
                      <span className="text-sm font-black text-primary">{formatPrice(course.price[locale], locale)}</span>
                    </Link>
                  ))}
                </div>
              </ContentCard>
            )}

            <div className="rounded-2xl border border-border bg-primary-soft p-6 shadow-soft sm:flex sm:items-center sm:gap-5">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white text-primary">
                <ShieldCheck className="h-8 w-8" />
              </span>
              <div className="mt-4 sm:mt-0">
                <h2 className="text-xl font-black">{dictionary.detail.guaranteeTitle}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{dictionary.detail.guaranteeText}</p>
              </div>
            </div>
          </div>

          {isCourse ? (
            <MetaCard course={product} locale={locale} dictionary={dictionary} />
          ) : (
            <BundleValueCard bundle={product} courses={bundleCourses} locale={locale} dictionary={dictionary} />
          )}
        </div>

        <section className="mt-14">
          <h2 className="text-3xl font-black">{dictionary.detail.recommended}</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {recommendedCourses.map((course) => (
              <ProductCard key={course.id} course={course} locale={locale} dictionary={dictionary} categories={categories} />
            ))}
            {recommendedBundles.map((bundle) => (
              <BundleCard key={bundle.id} bundle={bundle} locale={locale} dictionary={dictionary} categories={categories} />
            ))}
          </div>
        </section>
      </section>

      <StickyPurchaseBar
        product={product}
        title={title}
        price={product.price[locale]}
        regularPrice={product.regularPrice[locale]}
        locale={locale}
        dictionary={dictionary}
      />
    </div>
  );
}

function courseAboutHtml(highlights: string[]) {
  if (highlights.length === 1 && highlights[0].includes("<")) return highlights[0];
  return highlights.map((item) => `<p>${escapeHtml(item)}</p>`).join("");
}

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function PriceCard({
  product,
  price,
  regularPrice,
  savings,
  locale,
  dictionary
}: {
  product: Course | Bundle;
  price: number;
  regularPrice: number;
  savings: number;
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <aside className="w-full min-w-0 max-w-[430px] rounded-2xl border border-border bg-white p-6 shadow-card">
      <div className="flex flex-wrap items-end gap-3">
        <span className="text-4xl font-black">{formatPrice(price, locale)}</span>
        <span className="pb-1 text-sm text-muted-foreground line-through">{formatPrice(regularPrice, locale)}</span>
      </div>
      <div className="mt-3 inline-flex rounded-md bg-primary-soft px-3 py-1 text-sm font-bold text-primary">
        {dictionary.detail.savings}: {formatPrice(savings, locale)}
      </div>
      <AddToCartButton product={product} dictionary={dictionary} label={dictionary.detail.addToCart} className="mt-6 w-full" />
      <AddToCartButton
        product={product}
        dictionary={dictionary}
        label={dictionary.detail.buyNow}
        variant="secondary"
        redirectToCart
        className="mt-3 w-full"
      />
      <p className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600">
        <ShieldCheck className="h-4 w-4 text-primary" />
        {dictionary.detail.secureStripe}
      </p>
    </aside>
  );
}

function CourseBundleUpsell({ bundles, locale }: { bundles: Bundle[]; locale: Locale }) {
  if (bundles.length === 0) return null;

  const copy = getCourseBundleUpsellCopy(locale);

  return (
    <aside className="rounded-2xl border border-primary/20 bg-primary-soft p-5 shadow-soft">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-primary">
          <PackageCheck className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-base font-black">{copy.title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">{copy.lead}</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {bundles.map((bundle) => (
          <Link
            key={bundle.id}
            href={getBundlePath(bundle, locale)}
            className="group grid gap-3 rounded-xl border border-border bg-white p-4 transition hover:border-primary/40 hover:shadow-card"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-black leading-5 group-hover:text-primary">{bundle.title[locale]}</p>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">{copy.courseCount.replace("{count}", String(bundle.courseCount))}</p>
              </div>
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary transition group-hover:translate-x-0.5" />
            </div>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-lg font-black">{formatPrice(bundle.price[locale], locale)}</span>
              <span className="text-xs text-muted-foreground line-through">{formatPrice(bundle.regularPrice[locale], locale)}</span>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}

function StickyPurchaseBar({
  product,
  title,
  price,
  regularPrice,
  locale,
  dictionary
}: {
  product: Course | Bundle;
  title: string;
  price: number;
  regularPrice: number;
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-white/95 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
      <div className="container-shell flex items-center gap-3 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-600">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-foreground">{formatPrice(price, locale)}</span>
            <span className="text-xs text-muted-foreground line-through">{formatPrice(regularPrice, locale)}</span>
          </div>
        </div>
        <AddToCartButton product={product} dictionary={dictionary} label={dictionary.detail.buyNow} redirectToCart className="h-12 shrink-0 px-5" />
      </div>
    </div>
  );
}

function FeatureStrip({ locale }: { locale: Locale }) {
  const copy = getProductTrustCopy(locale);
  const features = [
    { icon: PlayCircle, title: copy.items[0].title, text: copy.items[0].text },
    { icon: BookOpen, title: copy.items[1].title, text: copy.items[1].text },
    { icon: ShieldCheck, title: copy.items[2].title, text: copy.items[2].text },
    { icon: FileText, title: copy.items[3].title, text: copy.items[3].text }
  ];

  return (
    <div className="grid w-full gap-5 rounded-2xl border border-border bg-white p-6 shadow-soft sm:grid-cols-2 md:grid-cols-4 lg:p-7">
      <div className="sm:col-span-2 md:col-span-4">
        <h2 className="text-xl font-black">{copy.title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{copy.lead}</p>
      </div>
      {features.map((feature) => (
        <div key={feature.title} className="min-w-0">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
            <feature.icon className="h-5 w-5" />
          </span>
          <span className="mt-3 block text-sm font-black leading-5">{feature.title}</span>
          <span className="mt-2 block text-xs leading-5 text-muted-foreground">{feature.text}</span>
        </div>
      ))}
    </div>
  );
}

function ContentCard({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
      <h2 className="text-2xl font-black">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">{children}</div>
    </section>
  );
}

function MetaCard({
  course,
  locale,
  dictionary
}: {
  course: Course;
  locale: Locale;
  dictionary: Dictionary;
}) {
  const levelLabel = {
    all_levels: locale === "pl" ? "Wszystkie poziomy" : locale === "de" ? "Alle Niveaus" : "All levels",
    beginner: dictionary.detail.beginner,
    intermediate: dictionary.detail.intermediate,
    advanced: dictionary.detail.advanced
  }[course.level];
  const language = locale === "pl" ? dictionary.detail.polish : locale === "de" ? dictionary.detail.german : dictionary.detail.english;

  return (
    <aside className="rounded-2xl border border-border bg-primary-soft p-6 shadow-soft lg:sticky lg:top-24">
      <dl className="space-y-4">
        <MetaRow icon={<Award className="h-5 w-5" />} label={dictionary.detail.level} value={levelLabel} />
        <MetaRow icon={<Clock className="h-5 w-5" />} label={dictionary.detail.duration} value={`${course.durationHours}h`} />
        <MetaRow icon={<Layers className="h-5 w-5" />} label={dictionary.detail.lessons} value={String(course.lessons)} />
        <MetaRow icon={<Globe2 className="h-5 w-5" />} label={dictionary.detail.language} value={language} />
        <MetaRow icon={<Subtitles className="h-5 w-5" />} label={dictionary.detail.subtitles} value={dictionary.detail.yes} />
        <MetaRow icon={<Lock className="h-5 w-5" />} label={dictionary.detail.access} value={dictionary.detail.unlimited} />
      </dl>
    </aside>
  );
}

function BundleValueCard({
  bundle,
  courses,
  locale,
  dictionary
}: {
  bundle: Bundle;
  courses: Course[];
  locale: Locale;
  dictionary: Dictionary;
}) {
  const totalHours = courses.reduce((sum, course) => sum + course.durationHours, 0);
  const lessons = courses.reduce((sum, course) => sum + course.lessons, 0);

  return (
    <aside className="rounded-2xl border border-border bg-primary-soft p-6 shadow-soft lg:sticky lg:top-24">
      <dl className="space-y-4">
        <MetaRow icon={<BookOpen className="h-5 w-5" />} label={dictionary.detail.bundleCourses} value={String(bundle.courseCount)} />
        <MetaRow icon={<Clock className="h-5 w-5" />} label={dictionary.detail.duration} value={`${totalHours}h`} />
        <MetaRow icon={<Layers className="h-5 w-5" />} label={dictionary.detail.lessons} value={String(lessons)} />
        <MetaRow icon={<ShieldCheck className="h-5 w-5" />} label={dictionary.detail.access} value={dictionary.detail.unlimited} />
        <MetaRow icon={<Award className="h-5 w-5" />} label={dictionary.detail.savings} value={formatPrice(bundle.regularPrice[locale] - bundle.price[locale], locale)} />
      </dl>
    </aside>
  );
}

function MetaRow({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <dt className="flex items-center gap-3 font-semibold text-slate-600">
        <span className="text-primary">{icon}</span>
        {label}
      </dt>
      <dd className="text-right font-black">{value}</dd>
    </div>
  );
}

function getBundleAboutCopy(locale: Locale) {
  if (locale === "de") {
    return "Nach dem Kauf erhältst du Udemy-Links zu allen Kursen im Paket. Doppelte Kurse werden nicht mehrfach angezeigt.";
  }

  if (locale === "en") {
    return "After purchase you receive Udemy links to every course in the bundle. Duplicate course access is not shown twice.";
  }

  return "Kupując pakiet otrzymujesz linki Udemy do wszystkich kursów w zestawie. System deduplikuje kursy, więc ten sam dostęp nie pojawi się dwa razy.";
}

function getCourseBundleUpsellCopy(locale: Locale) {
  if (locale === "de") {
    return {
      title: "Dieser Kurs ist in einem Paket",
      lead: "Wenn du mehr als einen Kurs planst, ist ein Paket meist die bessere Wahl.",
      courseCount: "{count} Kurse im Paket"
    };
  }

  if (locale === "en") {
    return {
      title: "This course is included in a bundle",
      lead: "If you plan to learn more than one topic, a bundle is usually the better deal.",
      courseCount: "{count} courses in the bundle"
    };
  }

  return {
    title: "Ten kurs jest w pakiecie",
    lead: "Jeśli planujesz więcej niż jeden kurs, pakiet zwykle wychodzi korzystniej.",
    courseCount: "{count} kursów w pakiecie"
  };
}

function getProductTrustCopy(locale: Locale) {
  if (locale === "de") {
    return {
      title: "Sicher kaufen und sofort lernen",
      lead: "Nach dem Kauf bekommst du direkten Zugriff, Udemy-Links und eine klare Bestätigung per E-Mail.",
      items: [
        { title: "Sofortiger Zugriff", text: "Links sind direkt nach der Zahlung verfügbar." },
        { title: "Udemy-Code", text: "Du aktivierst den Kurs in deinem Udemy-Konto." },
        { title: "Sichere Zahlung", text: "Zahlung läuft über Stripe." },
        { title: "Rechnung", text: "Rechnungsdaten kannst du beim Checkout angeben." }
      ]
    };
  }

  if (locale === "en") {
    return {
      title: "Buy safely and start learning right away",
      lead: "After purchase you get immediate access, Udemy links and a clear confirmation by e-mail.",
      items: [
        { title: "Instant access", text: "Links are available right after payment." },
        { title: "Udemy code", text: "You redeem the course in your Udemy account." },
        { title: "Secure payment", text: "Payments are handled by Stripe." },
        { title: "Invoice", text: "You can add invoice details at checkout." }
      ]
    };
  }

  return {
    title: "Kupujesz bezpiecznie i od razu zaczynasz naukę",
    lead: "Po zakupie dostajesz dostęp do kursu, link Udemy i potwierdzenie na e-mail. Bez zakładania konta w sklepie.",
    items: [
      { title: "Dostęp od razu", text: "Linki są dostępne natychmiast po płatności." },
      { title: "Kod Udemy", text: "Aktywujesz kurs na swoim koncie Udemy." },
      { title: "Płatność Stripe", text: "Transakcja przechodzi przez bezpieczną bramkę." },
      { title: "Faktura", text: "Dane do faktury podasz bezpośrednio w checkout." }
    ]
  };
}
