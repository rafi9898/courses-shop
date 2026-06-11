import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { type Locale } from "@/lib/i18n/config";
import { type PublicBlogPost } from "@/lib/blog-data";
import { getBlogPostPath } from "@/lib/routes";

const copy: Record<Locale, {
  eyebrow: string;
  title: string;
  lead: string;
  empty: string;
  read: string;
  searchPlaceholder: string;
  searchButton: string;
  clearSearch: string;
  results: string;
  noResults: string;
  previous: string;
  next: string;
}> = {
  pl: {
    eyebrow: "Blog",
    title: "Praktyczne materiały o IT, testowaniu i AI",
    lead: "Notatki, poradniki i konkretne obserwacje, które pomagają szybciej uczyć się technologii i świadomie wybierać kolejne kroki.",
    empty: "Nie ma jeszcze opublikowanych wpisów w tej wersji językowej.",
    read: "Czytaj wpis",
    searchPlaceholder: "Szukaj po tytule, opisie lub słowach kluczowych",
    searchButton: "Szukaj",
    clearSearch: "Wyczyść",
    results: "Wyniki: {count}",
    noResults: "Nie znaleziono wpisów dla tej frazy.",
    previous: "Poprzednia",
    next: "Następna"
  },
  de: {
    eyebrow: "Blog",
    title: "Praktische Beiträge zu IT, Testing und KI",
    lead: "Notizen, Leitfäden und konkrete Beobachtungen, die dir helfen, Technologie schneller zu lernen und bessere nächste Schritte zu wählen.",
    empty: "In dieser Sprachversion gibt es noch keine veröffentlichten Beiträge.",
    read: "Beitrag lesen",
    searchPlaceholder: "Nach Titel, Beschreibung oder Keywords suchen",
    searchButton: "Suchen",
    clearSearch: "Zurücksetzen",
    results: "{count} Ergebnisse",
    noResults: "Keine Beiträge für diese Suche gefunden.",
    previous: "Zurück",
    next: "Weiter"
  },
  en: {
    eyebrow: "Blog",
    title: "Practical notes on IT, testing and AI",
    lead: "Guides, field notes and focused observations that help you learn technology faster and choose your next steps with more confidence.",
    empty: "There are no published posts in this language yet.",
    read: "Read post",
    searchPlaceholder: "Search by title, description or keywords",
    searchButton: "Search",
    clearSearch: "Clear",
    results: "{count} results",
    noResults: "No posts found for this search.",
    previous: "Previous",
    next: "Next"
  }
};

export function BlogListPage({
  locale,
  posts,
  query,
  page,
  totalPages,
  totalPosts,
  hasAnyPosts
}: {
  locale: Locale;
  posts: PublicBlogPost[];
  query: string;
  page: number;
  totalPages: number;
  totalPosts: number;
  hasAnyPosts: boolean;
}) {
  const texts = copy[locale];

  return (
    <div className="bg-white">
      <section className="border-b border-border bg-slate-50">
        <div className="container-shell py-14 lg:py-20">
          <p className="text-sm font-black uppercase text-primary">{texts.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-normal text-slate-950 lg:text-5xl">{texts.title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">{texts.lead}</p>
        </div>
      </section>

      <section className="container-shell py-10 lg:py-14">
        <form action={`/${locale}/blog`} className="mb-6 grid gap-3 rounded-xl border border-border bg-white p-3 shadow-card md:grid-cols-[1fr_auto_auto]">
          <label className="relative block">
            <span className="sr-only">{texts.searchPlaceholder}</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              name="q"
              defaultValue={query}
              placeholder={texts.searchPlaceholder}
              className="focus-ring h-12 w-full rounded-lg border border-border bg-white pl-12 pr-4 text-sm font-semibold outline-none placeholder:text-slate-500"
            />
          </label>
          <button type="submit" className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-black text-white transition hover:bg-[#2f16d8]">
            <Search className="h-4 w-4" />
            {texts.searchButton}
          </button>
          {query ? (
            <Link href={`/${locale}/blog`} className="focus-ring inline-flex h-12 items-center justify-center rounded-lg border border-border px-4 text-sm font-black text-slate-700 transition hover:border-primary hover:text-primary">
              {texts.clearSearch}
            </Link>
          ) : null}
        </form>

        {hasAnyPosts ? (
          <p className="mb-5 text-sm font-semibold text-slate-600">{texts.results.replace("{count}", String(totalPosts))}</p>
        ) : null}

        {posts.length > 0 ? (
          <>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.id} href={getBlogPostPath(locale, post.slug)} className="group overflow-hidden rounded-lg border border-border bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft">
                  <div className="relative aspect-[16/9] bg-slate-100">
                    {post.thumbnailImageUrl ? (
                      <Image src={post.thumbnailImageUrl} alt={post.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover" unoptimized={post.thumbnailImageUrl.startsWith("/uploads/")} />
                    ) : (
                      <div className="grid h-full place-items-center bg-primary-soft text-4xl font-black text-primary">RP</div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="inline-flex items-center gap-2 text-xs font-black uppercase text-slate-500">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(post.publishedAt ?? post.createdAt, locale)}
                    </p>
                    <h2 className="mt-3 text-xl font-black leading-7 text-slate-950 group-hover:text-primary">{post.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>
                    <p className="mt-4 text-sm font-black text-primary">{texts.read}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Pagination locale={locale} query={query} page={page} totalPages={totalPages} texts={texts} />
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-slate-50 px-5 py-10 text-center text-sm font-semibold text-slate-500">{hasAnyPosts ? texts.noResults : texts.empty}</div>
        )}
      </section>
    </div>
  );
}

function Pagination({
  locale,
  query,
  page,
  totalPages,
  texts
}: {
  locale: Locale;
  query: string;
  page: number;
  totalPages: number;
  texts: (typeof copy)[Locale];
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Blog pagination">
      <PageLink href={getBlogPageHref(locale, Math.max(1, page - 1), query)} disabled={page <= 1}>
        <ChevronLeft className="h-4 w-4" />
        {texts.previous}
      </PageLink>
      {pages.map((item) => (
        <PageLink key={item} href={getBlogPageHref(locale, item, query)} active={item === page}>
          {item}
        </PageLink>
      ))}
      <PageLink href={getBlogPageHref(locale, Math.min(totalPages, page + 1), query)} disabled={page >= totalPages}>
        {texts.next}
        <ChevronRight className="h-4 w-4" />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  active,
  disabled,
  children
}: {
  href: string;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span className="inline-flex h-10 items-center gap-1 rounded-lg border border-border bg-slate-50 px-3 text-sm font-black text-slate-400">
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`focus-ring inline-flex h-10 items-center gap-1 rounded-lg border px-3 text-sm font-black transition ${
        active ? "border-primary bg-primary text-white" : "border-border bg-white text-slate-700 hover:border-primary hover:text-primary"
      }`}
    >
      {children}
    </Link>
  );
}

function getBlogPageHref(locale: Locale, page: number, query: string) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (page > 1) params.set("page", String(page));
  const suffix = params.toString();
  return `/${locale}/blog${suffix ? `?${suffix}` : ""}`;
}

function formatDate(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "pl" ? "pl-PL" : locale === "de" ? "de-DE" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}
