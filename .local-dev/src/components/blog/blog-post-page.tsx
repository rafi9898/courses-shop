import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Facebook, Linkedin, Mail, Twitter } from "lucide-react";
import { BlogViewTracker } from "@/components/blog/blog-view-tracker";
import { NewsletterForm } from "@/components/blog/newsletter-form";
import { ProductCard } from "@/components/commerce/product-card";
import { RichTextContent } from "@/components/product-detail/rich-text-content";
import { type PublicBlogPost } from "@/lib/blog-data";
import { type Dictionary } from "@/lib/i18n/dictionaries";
import { type Locale } from "@/lib/i18n/config";
import { type Category, type Course } from "@/lib/mock-data";
import { getAbsoluteUrl, getBlogIndexPath, getBlogPostPath } from "@/lib/routes";

const copy: Record<Locale, { back: string; share: string; recommended: string; recommendedLead: string; emailSubject: string }> = {
  pl: {
    back: "Wróć do bloga",
    share: "Udostępnij wpis",
    recommended: "Najpopularniejsze kursy",
    recommendedLead: "Jeśli ten temat jest Ci bliski, te kursy będą dobrym kolejnym krokiem.",
    emailSubject: "Polecam wpis"
  },
  de: {
    back: "Zurück zum Blog",
    share: "Beitrag teilen",
    recommended: "Beliebteste Kurse",
    recommendedLead: "Wenn dich dieses Thema interessiert, sind diese Kurse ein guter nächster Schritt.",
    emailSubject: "Empfohlener Beitrag"
  },
  en: {
    back: "Back to blog",
    share: "Share this post",
    recommended: "Most popular courses",
    recommendedLead: "If this topic is useful to you, these courses are a strong next step.",
    emailSubject: "Recommended post"
  }
};

export function BlogPostPage({
  locale,
  post,
  dictionary,
  categories,
  recommendedCourses
}: {
  locale: Locale;
  post: PublicBlogPost;
  dictionary: Dictionary;
  categories: Category[];
  recommendedCourses: Course[];
}) {
  const postPath = getBlogPostPath(locale, post.slug);
  const shareUrl = getAbsoluteUrl(postPath);
  const shareLinks = getShareLinks(shareUrl, post.title, copy[locale].emailSubject);

  return (
    <article className="bg-white">
      <BlogViewTracker postId={post.id} />
      <header className="border-b border-border bg-slate-50">
        <div className="container-shell py-8 lg:py-12">
          <Link href={getBlogIndexPath(locale)} className="focus-ring inline-flex items-center gap-2 rounded-md text-sm font-black text-primary">
            <ArrowLeft className="h-4 w-4" />
            {copy[locale].back}
          </Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-black uppercase text-slate-500">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDate(post.publishedAt ?? post.createdAt, locale)}
              </p>
              <h1 className="mt-4 text-4xl font-black tracking-normal text-slate-950 lg:text-5xl">{post.title}</h1>
              <p className="mt-5 text-lg leading-8 text-slate-600">{post.excerpt}</p>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-white">
              {post.thumbnailImageUrl ? (
                <Image
                  src={post.thumbnailImageUrl}
                  alt={post.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-contain"
                  unoptimized={post.thumbnailImageUrl.startsWith("/uploads/")}
                />
              ) : (
                <div className="grid h-full place-items-center text-5xl font-black text-primary">RP</div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container-shell py-10 lg:py-14">
        <div className="mx-auto max-w-3xl">
          <RichTextContent html={post.contentHtml} />
          <div className="mt-10 border-t border-border pt-6">
            <p className="text-sm font-black uppercase text-slate-500">{copy[locale].share}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {shareLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noreferrer" : undefined}
                    className="focus-ring inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-3 text-sm font-black text-slate-700 transition hover:border-primary hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>
          <div className="mt-12">
            <NewsletterForm locale={locale} />
          </div>
        </div>
      </div>

      {recommendedCourses.length > 0 ? (
        <section className="border-t border-border bg-slate-50">
          <div className="container-shell py-10 lg:py-14">
            <div className="mb-6 max-w-2xl">
              <h2 className="text-2xl font-black tracking-normal text-slate-950">{copy[locale].recommended}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{copy[locale].recommendedLead}</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recommendedCourses.map((course) => (
                <ProductCard key={course.id} course={course} locale={locale} dictionary={dictionary} categories={categories} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}

function getShareLinks(url: string, title: string, emailSubject: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return [
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: Linkedin,
      external: true
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: Facebook,
      external: true
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: Twitter,
      external: true
    },
    {
      label: "E-mail",
      href: `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodedTitle}%0A${encodedUrl}`,
      icon: Mail,
      external: false
    }
  ];
}

function formatDate(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "pl" ? "pl-PL" : locale === "de" ? "de-DE" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}
