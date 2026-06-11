import { type MetadataRoute } from "next";
import { getPublishedBlogPosts } from "@/lib/blog-data";
import { getPublicCatalog } from "@/lib/catalog-data";
import { locales } from "@/lib/i18n/config";
import { getBlogPostPath, getBundlePath, getCoursePath } from "@/lib/routes";
import { getSiteUrl, publicPagePaths } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries = Object.values(publicPagePaths).flatMap((paths) =>
    locales.map((locale) => ({
      url: getSiteUrl(paths[locale]),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: paths[locale] === `/${locale}` ? 1 : 0.8
    }))
  );

  const productEntries = (
    await Promise.all(
      locales.map(async (locale) => {
        const catalog = await getPublicCatalog(locale);

        return [
          ...catalog.courses.map((course) => ({
            url: getSiteUrl(getCoursePath(course, locale)),
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: 0.9
          })),
          ...catalog.bundles.map((bundle) => ({
            url: getSiteUrl(getBundlePath(bundle, locale)),
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: 0.85
          }))
        ];
      })
    )
  ).flat();

  const blogEntries = (
    await Promise.all(
      locales.map(async (locale) => {
        const posts = await getPublishedBlogPosts(locale);

        return posts.map((post) => ({
          url: getSiteUrl(getBlogPostPath(locale, post.slug)),
          lastModified: post.updatedAt,
          changeFrequency: "monthly" as const,
          priority: 0.75
        }));
      })
    )
  ).flat();

  return [...staticEntries, ...productEntries, ...blogEntries];
}
