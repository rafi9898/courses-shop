import { notFound } from "next/navigation";
import { BlogListPage } from "@/components/blog/blog-list-page";
import { getPublishedBlogPosts, type PublicBlogPost } from "@/lib/blog-data";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getPublicPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
const BLOG_POSTS_PER_PAGE = 12;

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return isLocale(locale) ? getPublicPageMetadata(locale, "blog") : {};
}

export default async function BlogPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const { q, page: rawPage } = await searchParams;
  const query = normalizeSearchQuery(q);
  const page = parsePage(rawPage);
  const allPosts = await getPublishedBlogPosts(locale);
  const filteredPosts = query ? allPosts.filter((post) => matchesBlogQuery(post, query)) : allPosts;
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / BLOG_POSTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const posts = filteredPosts.slice((currentPage - 1) * BLOG_POSTS_PER_PAGE, currentPage * BLOG_POSTS_PER_PAGE);

  return (
    <BlogListPage
      locale={locale}
      posts={posts}
      query={query}
      page={currentPage}
      totalPages={totalPages}
      totalPosts={filteredPosts.length}
      hasAnyPosts={allPosts.length > 0}
    />
  );
}

function normalizeSearchQuery(value?: string) {
  return (value ?? "").replace(/\s+/g, " ").trim().slice(0, 80);
}

function parsePage(value?: string) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function matchesBlogQuery(post: PublicBlogPost, query: string) {
  const haystack = [
    post.title,
    post.excerpt,
    post.metaTitle,
    post.metaDescription,
    post.metaKeywords
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase();

  return query
    .toLocaleLowerCase()
    .split(" ")
    .every((term) => haystack.includes(term));
}
