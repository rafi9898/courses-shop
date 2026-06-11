"use server";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { adminCatalogLocales, type AdminCatalogLocale } from "@/lib/admin-catalog-locales";
import { getAdminPath } from "@/lib/admin-routes";
import { createBlogPost, deleteBlogPost, getBlogPostById, getBlogPostSlugOwner, updateBlogPost } from "@/lib/blog-data";
import { getBlogIndexPath, getBlogPostPath } from "@/lib/routes";
import { richTextToPlainText, sanitizeRichText } from "@/lib/rich-text";

const maxBlogThumbnailSize = 8 * 1024 * 1024;
const allowedBlogThumbnailTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function createBlogPostAction(formData: FormData) {
  await ensureAdmin();
  const data = await readBlogPostForm(formData);

  await createBlogPost(randomUUID(), data);

  revalidateBlog(data.locale as AdminCatalogLocale, data.slug);
  redirect(getAdminPath(`/blog?locale=${data.locale}`));
}

export async function updateBlogPostAction(formData: FormData) {
  await ensureAdmin();
  const postId = requiredText(formData, "currentId");
  const existingPost = await getBlogPostById(postId);
  const data = await readBlogPostForm(formData, postId);

  await updateBlogPost(postId, data);

  revalidateBlog(data.locale as AdminCatalogLocale, data.slug);
  if (existingPost && (existingPost.locale !== data.locale || existingPost.slug !== data.slug)) {
    revalidateBlog(localeFromString(existingPost.locale), existingPost.slug);
  }
  redirect(getAdminPath(`/blog?locale=${data.locale}`));
}

export async function deleteBlogPostAction(formData: FormData) {
  await ensureAdmin();
  const postId = requiredText(formData, "postId");
  const locale = localeValue(formData);
  const slug = optionalText(formData, "slug");

  await deleteBlogPost(postId);

  revalidateBlog(locale, slug);
  redirect(getAdminPath(`/blog?locale=${locale}`));
}

async function ensureAdmin() {
  if (!isAdminConfigured() || !(await isAdminAuthenticated())) {
    throw new Error("Brak dostępu do panelu admina.");
  }
}

async function readBlogPostForm(formData: FormData, currentPostId?: string) {
  const locale = localeValue(formData);
  const title = requiredText(formData, "title");
  const requestedSlug = optionalText(formData, "slug") || title;
  const slug = await uniqueBlogSlug(locale, requestedSlug, currentPostId);
  const contentHtml = sanitizeRichText(requiredText(formData, "contentHtml"));
  const plainText = richTextToPlainText(contentHtml);
  const excerpt = optionalText(formData, "excerpt") || trimText(plainText, 220) || title;
  const metaTitle = optionalText(formData, "metaTitle") || null;
  const metaDescription = optionalText(formData, "metaDescription") || excerpt;
  const metaKeywords = optionalText(formData, "metaKeywords") || null;
  const thumbnailImageUrl = await saveThumbnail(formData);
  const existingThumbnailImageUrl = optionalText(formData, "existingThumbnailImageUrl");
  const isPublished = boolValue(formData, "isPublished");
  const publishedAt = isPublished ? dateValue(formData, "publishedAt") ?? new Date() : null;

  return {
    locale,
    title,
    slug,
    excerpt,
    contentHtml,
    thumbnailImageUrl: thumbnailImageUrl || existingThumbnailImageUrl || null,
    metaTitle,
    metaDescription,
    metaKeywords,
    isPublished,
    publishedAt
  };
}

function requiredText(formData: FormData, name: string) {
  const value = optionalText(formData, name);

  if (!value) {
    throw new Error(`Pole ${name} jest wymagane.`);
  }

  return value;
}

function optionalText(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function localeValue(formData: FormData): AdminCatalogLocale {
  const value = optionalText(formData, "locale");
  return localeFromString(value);
}

function localeFromString(value: string): AdminCatalogLocale {
  return adminCatalogLocales.includes(value as AdminCatalogLocale) ? (value as AdminCatalogLocale) : "pl";
}

function boolValue(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function dateValue(formData: FormData, name: string) {
  const value = optionalText(formData, name);
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function saveThumbnail(formData: FormData) {
  const file = formData.get("thumbnailImage");

  if (!(file instanceof File) || file.size === 0) {
    return null;
  }

  if (file.size > maxBlogThumbnailSize) {
    throw new Error("Miniaturka wpisu może mieć maksymalnie 8 MB.");
  }

  if (!allowedBlogThumbnailTypes.includes(file.type)) {
    throw new Error("Miniaturka wpisu musi być plikiem JPG, PNG, WebP albo GIF.");
  }

  const extension = getSafeImageExtension(file);
  const fileName = `${randomUUID()}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "blog-thumbnails");
  const filePath = path.join(uploadDir, fileName);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  return `/uploads/blog-thumbnails/${fileName}`;
}

function getSafeImageExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const mimeExtensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif"
  };

  if (extension && ["jpg", "jpeg", "png", "webp", "gif"].includes(extension)) {
    return extension === "jpeg" ? "jpg" : extension;
  }

  return mimeExtensions[file.type] ?? "jpg";
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function uniqueBlogSlug(locale: AdminCatalogLocale, slug: string, currentPostId?: string) {
  const baseSlug = slugify(slug) || "wpis";
  let candidate = baseSlug;
  let suffix = 2;

  while (
    await getBlogPostSlugOwner(locale, candidate, currentPostId)
  ) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

function trimText(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;

  const shortened = normalized.slice(0, maxLength - 1);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, lastSpace > 120 ? lastSpace : shortened.length).trim()}...`;
}

function revalidateBlog(locale: AdminCatalogLocale, slug?: string) {
  revalidatePath("/admin/blog");
  revalidatePath(getAdminPath("/blog"));
  revalidatePath(getBlogIndexPath(locale));

  if (slug) {
    revalidatePath(getBlogPostPath(locale, slug));
  }
}
