import { prisma } from "@/lib/prisma";
import { type Locale } from "@/lib/i18n/config";

export type BlogPost = {
  id: string;
  locale: string;
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  thumbnailImageUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  viewCount: number;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type BlogPostInput = {
  locale: string;
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  thumbnailImageUrl: string | null;
  metaTitle: string | null;
  metaDescription: string;
  metaKeywords: string | null;
  isPublished: boolean;
  publishedAt: Date | null;
};

export type PublicBlogPost = BlogPost;

export async function getAdminBlogPosts(locale: Locale, skip: number, take: number) {
  return prisma.$queryRaw<BlogPost[]>`
    SELECT
      "id",
      "locale",
      "title",
      "slug",
      "excerpt",
      "contentHtml",
      "thumbnailImageUrl",
      "metaTitle",
      "metaDescription",
      "metaKeywords",
      "viewCount",
      "isPublished",
      "publishedAt",
      "createdAt",
      "updatedAt"
    FROM "BlogPost"
    WHERE "locale" = ${locale}
    ORDER BY "publishedAt" DESC NULLS LAST, "updatedAt" DESC
    OFFSET ${skip}
    LIMIT ${take}
  `;
}

export async function countAdminBlogPosts(locale: Locale) {
  return countBlogPosts({ locale });
}

export async function countPublishedAdminBlogPosts(locale: Locale) {
  return countBlogPosts({ locale, isPublished: true });
}

export async function sumAdminBlogPostViews(locale: Locale) {
  const rows = await prisma.$queryRaw<Array<{ sum: bigint | number | null }>>`
    SELECT COALESCE(SUM("viewCount"), 0) AS "sum"
    FROM "BlogPost"
    WHERE "locale" = ${locale}
  `;

  return Number(rows[0]?.sum ?? 0);
}

export async function getPublishedBlogPosts(locale: Locale) {
  const now = new Date();

  return prisma.$queryRaw<BlogPost[]>`
    SELECT
      "id",
      "locale",
      "title",
      "slug",
      "excerpt",
      "contentHtml",
      "thumbnailImageUrl",
      "metaTitle",
      "metaDescription",
      "metaKeywords",
      "viewCount",
      "isPublished",
      "publishedAt",
      "createdAt",
      "updatedAt"
    FROM "BlogPost"
    WHERE "locale" = ${locale}
      AND "isPublished" = true
      AND "publishedAt" <= ${now}
    ORDER BY "publishedAt" DESC, "createdAt" DESC
  `;
}

export async function getPublishedBlogPostBySlug(locale: Locale, slug: string) {
  const now = new Date();

  const posts = await prisma.$queryRaw<BlogPost[]>`
    SELECT
      "id",
      "locale",
      "title",
      "slug",
      "excerpt",
      "contentHtml",
      "thumbnailImageUrl",
      "metaTitle",
      "metaDescription",
      "metaKeywords",
      "viewCount",
      "isPublished",
      "publishedAt",
      "createdAt",
      "updatedAt"
    FROM "BlogPost"
    WHERE "locale" = ${locale}
      AND "slug" = ${slug}
      AND "isPublished" = true
      AND "publishedAt" <= ${now}
    LIMIT 1
  `;

  return posts[0] ?? null;
}

export async function getBlogPostById(id: string) {
  const posts = await prisma.$queryRaw<BlogPost[]>`
    SELECT
      "id",
      "locale",
      "title",
      "slug",
      "excerpt",
      "contentHtml",
      "thumbnailImageUrl",
      "metaTitle",
      "metaDescription",
      "metaKeywords",
      "viewCount",
      "isPublished",
      "publishedAt",
      "createdAt",
      "updatedAt"
    FROM "BlogPost"
    WHERE "id" = ${id}
    LIMIT 1
  `;

  return posts[0] ?? null;
}

export async function getBlogPostSlugOwner(locale: Locale, slug: string, currentPostId?: string) {
  const posts = currentPostId
    ? await prisma.$queryRaw<Array<{ id: string }>>`
        SELECT "id"
        FROM "BlogPost"
        WHERE "locale" = ${locale}
          AND "slug" = ${slug}
          AND "id" <> ${currentPostId}
        LIMIT 1
      `
    : await prisma.$queryRaw<Array<{ id: string }>>`
        SELECT "id"
        FROM "BlogPost"
        WHERE "locale" = ${locale}
          AND "slug" = ${slug}
        LIMIT 1
      `;

  return posts[0] ?? null;
}

export async function incrementBlogPostViewCount(id: string) {
  const now = new Date();

  await prisma.$executeRaw`
    UPDATE "BlogPost"
    SET "viewCount" = "viewCount" + 1
    WHERE "id" = ${id}
      AND "isPublished" = true
      AND "publishedAt" <= ${now}
  `;
}

export async function createBlogPost(id: string, data: BlogPostInput) {
  const now = new Date();

  await prisma.$executeRaw`
    INSERT INTO "BlogPost" (
      "id",
      "locale",
      "title",
      "slug",
      "excerpt",
      "contentHtml",
      "thumbnailImageUrl",
      "metaTitle",
      "metaDescription",
      "metaKeywords",
      "isPublished",
      "publishedAt",
      "createdAt",
      "updatedAt"
    )
    VALUES (
      ${id},
      ${data.locale},
      ${data.title},
      ${data.slug},
      ${data.excerpt},
      ${data.contentHtml},
      ${data.thumbnailImageUrl},
      ${data.metaTitle},
      ${data.metaDescription},
      ${data.metaKeywords},
      ${data.isPublished},
      ${data.publishedAt},
      ${now},
      ${now}
    )
  `;
}

export async function updateBlogPost(id: string, data: BlogPostInput) {
  await prisma.$executeRaw`
    UPDATE "BlogPost"
    SET
      "locale" = ${data.locale},
      "title" = ${data.title},
      "slug" = ${data.slug},
      "excerpt" = ${data.excerpt},
      "contentHtml" = ${data.contentHtml},
      "thumbnailImageUrl" = ${data.thumbnailImageUrl},
      "metaTitle" = ${data.metaTitle},
      "metaDescription" = ${data.metaDescription},
      "metaKeywords" = ${data.metaKeywords},
      "isPublished" = ${data.isPublished},
      "publishedAt" = ${data.publishedAt},
      "updatedAt" = ${new Date()}
    WHERE "id" = ${id}
  `;
}

export async function deleteBlogPost(id: string) {
  await prisma.$executeRaw`
    DELETE FROM "BlogPost"
    WHERE "id" = ${id}
  `;
}

export function parseBlogKeywords(value?: string | null) {
  return (value ?? "")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

async function countBlogPosts({ locale, isPublished }: { locale: Locale; isPublished?: boolean }) {
  const rows = typeof isPublished === "boolean"
    ? await prisma.$queryRaw<Array<{ count: bigint | number }>>`
        SELECT COUNT(*) AS "count"
        FROM "BlogPost"
        WHERE "locale" = ${locale}
          AND "isPublished" = ${isPublished}
      `
    : await prisma.$queryRaw<Array<{ count: bigint | number }>>`
        SELECT COUNT(*) AS "count"
        FROM "BlogPost"
        WHERE "locale" = ${locale}
      `;

  return Number(rows[0]?.count ?? 0);
}
