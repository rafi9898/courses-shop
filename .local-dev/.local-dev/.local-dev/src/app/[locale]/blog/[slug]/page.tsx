import { notFound } from "next/navigation";
import { BlogPostPage } from "@/components/blog/blog-post-page";
import { JsonLd } from "@/components/seo/json-ld";
import { getPublishedBlogPostBySlug, parseBlogKeywords } from "@/lib/blog-data";
import { getPublicCatalog } from "@/lib/catalog-data";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getBlogPostPath } from "@/lib/routes";
import { createBlogPostingJsonLd, getBlogPostMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return {};

  const post = await getPublishedBlogPostBySlug(rawLocale, slug);
  if (!post) return {};

  return getBlogPostMetadata({
    locale: rawLocale,
    path: getBlogPostPath(rawLocale, post.slug),
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    imageUrl: post.thumbnailImageUrl,
    keywords: parseBlogKeywords(post.metaKeywords)
  });
}

export default async function BlogPostRoutePage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const post = await getPublishedBlogPostBySlug(locale, slug);
  if (!post) notFound();

  const dictionary = getDictionary(locale);
  const catalog = await getPublicCatalog(locale);
  const recommendedCourses = catalog.courses.slice(0, 3);

  return (
    <>
      <BlogPostPage
        locale={locale}
        post={post}
        dictionary={dictionary}
        categories={catalog.categories}
        recommendedCourses={recommendedCourses}
      />
      <JsonLd data={createBlogPostingJsonLd({
        locale,
        path: getBlogPostPath(locale, post.slug),
        title: post.title,
        description: post.metaDescription || post.excerpt,
        imageUrl: post.thumbnailImageUrl,
        publishedAt: post.publishedAt ?? post.createdAt,
        updatedAt: post.updatedAt
      })} />
    </>
  );
}
