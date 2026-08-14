import { type MetadataRoute } from "next";
import { getPublishedBlogPosts } from "@/lib/blog-data";
import { getPublicCatalog } from "@/lib/catalog-data";
import { locales } from "@/lib/i18n/config";
import { getBlogPostPath, getBundlePath, getCoursePath } from "@/lib/routes";
import { getSiteUrl, publicPagePaths } from "@/lib/seo";

export const dynamic = "force-dynamic";

function getLanguages(paths: Record<string, string>) {
  return {
    ...Object.fromEntries(Object.entries(paths).map(([locale, path]) => [locale, getSiteUrl(path)])),
    "x-default": getSiteUrl(paths.en)
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries = Object.values(publicPagePaths).flatMap((paths) => {
    const languages = getLanguages(paths);
    return locales.map((locale) => ({
      url: getSiteUrl(paths[locale]),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: paths[locale] === `/${locale}` ? 1 : 0.8,
      alternates: { languages }
    }));
  });

  const productEntries = (
    await Promise.all(
      locales.map(async (locale) => {
        const catalog = await getPublicCatalog(locale);

        return [
          ...catalog.courses.map((course) => {
            const coursePaths = {
              pl: getCoursePath(course, "pl"),
              de: getCoursePath(course, "de"),
              en: getCoursePath(course, "en")
            };
            return {
              url: getSiteUrl(coursePaths[locale]),
              lastModified: course.updatedAt || now,
              changeFrequency: "weekly" as const,
              priority: 0.9,
              alternates: { languages: getLanguages(coursePaths) }
            };
          }),
          ...catalog.bundles.map((bundle) => {
            const bundlePaths = {
              pl: getBundlePath(bundle, "pl"),
              de: getBundlePath(bundle, "de"),
              en: getBundlePath(bundle, "en")
            };
            return {
              url: getSiteUrl(bundlePaths[locale]),
              lastModified: bundle.updatedAt || now,
              changeFrequency: "weekly" as const,
              priority: 0.85,
              alternates: { languages: getLanguages(bundlePaths) }
            };
          })
        ];
      })
    )
  ).flat();

  const blogEntries = (
    await Promise.all(
      locales.map(async (locale) => {
        const posts = await getPublishedBlogPosts(locale);

        return posts.map((post) => {
          return {
            url: getSiteUrl(getBlogPostPath(locale, post.slug)),
            lastModified: post.updatedAt,
            changeFrequency: "monthly" as const,
            priority: 0.75
          };
        });
      })
    )
  ).flat();

  return [...staticEntries, ...productEntries, ...blogEntries];
}
