"use server";

import { CategoryColor, CourseLevel, ThumbnailVariant, type Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { adminCatalogLocales, type AdminCatalogLocale } from "@/lib/admin-catalog-locales";
import { prisma } from "@/lib/prisma";

const categoryColors = Object.values(CategoryColor);
const courseLevels = Object.values(CourseLevel);
const thumbnailVariants = Object.values(ThumbnailVariant);
const maxCourseThumbnailSize = 8 * 1024 * 1024;
const allowedCourseThumbnailTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const currencyByLocale: Record<AdminCatalogLocale, string> = {
  pl: "PLN",
  de: "EUR",
  en: "USD"
};

export async function createCategoryAction(formData: FormData) {
  await ensureAdmin();
  const data = readCategoryForm(formData);

  await prisma.category.create({ data });

  revalidateCatalog();
  redirect(`/admin/catalog/categories?locale=${data.locale}`);
}

export async function updateCategoryAction(formData: FormData) {
  await ensureAdmin();
  const categoryId = requiredText(formData, "currentId");
  const data = readCategoryForm(formData);

  await prisma.category.update({
    where: { id: categoryId },
    data
  });

  revalidateCatalog();
  redirect(`/admin/catalog/categories?locale=${data.locale}`);
}

export async function deleteCategoryAction(formData: FormData) {
  await ensureAdmin();
  const categoryId = requiredText(formData, "categoryId");
  const locale = localeValue(formData);

  await prisma.category.delete({ where: { id: categoryId } });

  revalidateCatalog();
  redirect(`/admin/catalog/categories?locale=${locale}`);
}

export async function createCourseAction(formData: FormData) {
  await ensureAdmin();
  const data = await readCourseForm(formData);

  await prisma.course.create({ data });

  revalidateCatalog();
  redirect(`/admin/catalog/courses?locale=${data.locale}`);
}

export async function updateCourseAction(formData: FormData) {
  await ensureAdmin();
  const courseId = requiredText(formData, "currentId");
  const data = await readCourseForm(formData, courseId);

  await prisma.course.update({
    where: { id: courseId },
    data
  });

  revalidateCatalog();
  redirect(`/admin/catalog/courses?locale=${data.locale}`);
}

export async function deleteCourseAction(formData: FormData) {
  await ensureAdmin();
  const courseId = requiredText(formData, "courseId");
  const locale = localeValue(formData);

  await prisma.course.delete({ where: { id: courseId } });

  revalidateCatalog();
  redirect(`/admin/catalog/courses?locale=${locale}`);
}

export async function createBundleAction(formData: FormData) {
  await ensureAdmin();
  const { courseIds, data } = readBundleForm(formData);

  await prisma.bundle.create({
    data: {
      ...data,
      courseCount: courseIds.length,
      courses: {
        create: courseIds.map((courseId, position) => ({
          courseId,
          position
        }))
      }
    }
  });

  revalidateCatalog();
  redirect(`/admin/catalog/bundles?locale=${data.locale}`);
}

export async function updateBundleAction(formData: FormData) {
  await ensureAdmin();
  const bundleId = requiredText(formData, "currentId");
  const { courseIds, data } = readBundleForm(formData);

  await prisma.$transaction([
    prisma.bundle.update({
      where: { id: bundleId },
      data: {
        ...data,
        courseCount: courseIds.length
      }
    }),
    prisma.bundleCourse.deleteMany({ where: { bundleId } }),
    prisma.bundleCourse.createMany({
      data: courseIds.map((courseId, position) => ({
        bundleId,
        courseId,
        position
      }))
    })
  ]);

  revalidateCatalog();
  redirect(`/admin/catalog/bundles?locale=${data.locale}`);
}

export async function deleteBundleAction(formData: FormData) {
  await ensureAdmin();
  const bundleId = requiredText(formData, "bundleId");
  const locale = localeValue(formData);

  await prisma.bundle.delete({ where: { id: bundleId } });

  revalidateCatalog();
  redirect(`/admin/catalog/bundles?locale=${locale}`);
}

async function ensureAdmin() {
  if (!isAdminConfigured() || !(await isAdminAuthenticated())) {
    throw new Error("Brak dostępu do panelu admina.");
  }
}

function readCategoryForm(formData: FormData) {
  const locale = localeValue(formData);

  return {
    locale,
    catalogKey: requiredText(formData, "catalogKey"),
    label: requiredText(formData, "label"),
    slug: requiredText(formData, "slug"),
    description: requiredText(formData, "description"),
    color: enumValue(formData, "color", categoryColors, CategoryColor.VIOLET),
    sortOrder: intValue(formData, "sortOrder"),
    isActive: boolValue(formData, "isActive")
  };
}

async function readCourseForm(formData: FormData, currentCourseId?: string) {
  const locale = localeValue(formData);
  const title = requiredText(formData, "title");
  const requestedSlug = optionalText(formData, "slug") || slugify(title);
  const slug = await uniqueCourseSlug(locale, requestedSlug, currentCourseId);
  const thumbnailImageUrl = await saveCourseThumbnail(formData);
  const existingThumbnailImageUrl = optionalText(formData, "existingThumbnailImageUrl");

  return {
    locale,
    catalogKey: optionalText(formData, "catalogKey") || slug,
    categoryId: requiredText(formData, "categoryId"),
    title,
    subtitle: optionalText(formData, "subtitle") || null,
    slug,
    level: enumValue(formData, "level", courseLevels, CourseLevel.ALL_LEVELS),
    rating: decimalValue(formData, "rating", 4.8),
    reviews: intValue(formData, "reviews"),
    price: decimalValue(formData, "price"),
    regularPrice: decimalValue(formData, "regularPrice"),
    currency: optionalText(formData, "currency") || currencyByLocale[locale],
    durationHours: intValue(formData, "durationHours"),
    lessons: intValue(formData, "lessons"),
    highlights: linesJson(formData, "highlights"),
    outcomes: linesJson(formData, "outcomes"),
    agenda: agendaJson(formData, "agenda"),
    thumbnailImageUrl: thumbnailImageUrl || existingThumbnailImageUrl || null,
    trailerYoutubeUrl: optionalText(formData, "trailerYoutubeUrl") || null,
    sortOrder: intValue(formData, "sortOrder"),
    isActive: boolValue(formData, "isActive")
  };
}

function readBundleForm(formData: FormData) {
  const locale = localeValue(formData);
  const courseIds = formData
    .getAll("courseIds")
    .map((value) => String(value))
    .filter(Boolean);

  return {
    courseIds,
    data: {
      locale,
      catalogKey: requiredText(formData, "catalogKey"),
      categoryId: requiredText(formData, "categoryId"),
      title: requiredText(formData, "title"),
      slug: requiredText(formData, "slug"),
      description: requiredText(formData, "description"),
      courseCount: courseIds.length,
      rating: decimalValue(formData, "rating", 4.8),
      reviews: intValue(formData, "reviews"),
      price: decimalValue(formData, "price"),
      regularPrice: decimalValue(formData, "regularPrice"),
      currency: optionalText(formData, "currency") || currencyByLocale[locale],
      thumbnailTitle: requiredText(formData, "thumbnailTitle"),
      thumbnailSubtitle: requiredText(formData, "thumbnailSubtitle"),
      thumbnailVariant: enumValue(formData, "thumbnailVariant", thumbnailVariants, ThumbnailVariant.PURPLE),
      sortOrder: intValue(formData, "sortOrder"),
      isActive: boolValue(formData, "isActive")
    }
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
  return adminCatalogLocales.includes(value as AdminCatalogLocale) ? (value as AdminCatalogLocale) : "pl";
}

function intValue(formData: FormData, name: string, fallback = 0) {
  const value = Number(optionalText(formData, name));
  return Number.isFinite(value) ? Math.trunc(value) : fallback;
}

function decimalValue(formData: FormData, name: string, fallback = 0) {
  const value = Number(optionalText(formData, name).replace(",", "."));
  return Number.isFinite(value) ? value : fallback;
}

function boolValue(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function enumValue<T extends string>(formData: FormData, name: string, values: T[], fallback: T) {
  const value = optionalText(formData, name) as T;
  return values.includes(value) ? value : fallback;
}

function linesJson(formData: FormData, name: string): Prisma.InputJsonValue {
  return optionalText(formData, name)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function agendaJson(formData: FormData, name: string): Prisma.InputJsonValue {
  return optionalText(formData, name)
    .split("\n")
    .map((line) => {
      const [title = "", lessons = "0"] = line.split("|").map((value) => value.trim());

      return {
        title,
        lessons: Number.isFinite(Number(lessons)) ? Number(lessons) : 0
      };
    })
    .filter((item) => item.title);
}

async function saveCourseThumbnail(formData: FormData) {
  const file = formData.get("thumbnailImage");

  if (!(file instanceof File) || file.size === 0) {
    return null;
  }

  if (file.size > maxCourseThumbnailSize) {
    throw new Error("Miniaturka kursu może mieć maksymalnie 8 MB.");
  }

  if (!allowedCourseThumbnailTypes.includes(file.type)) {
    throw new Error("Miniaturka kursu musi być plikiem JPG, PNG, WebP albo GIF.");
  }

  const extension = getSafeImageExtension(file);
  const fileName = `${randomUUID()}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "course-thumbnails");
  const filePath = path.join(uploadDir, fileName);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  return `/uploads/course-thumbnails/${fileName}`;
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

async function uniqueCourseSlug(locale: AdminCatalogLocale, slug: string, currentCourseId?: string) {
  const baseSlug = slugify(slug) || "kurs";
  let candidate = baseSlug;
  let suffix = 2;

  while (
    await prisma.course.findFirst({
      where: {
        locale,
        slug: candidate,
        ...(currentCourseId ? { id: { not: currentCourseId } } : {})
      },
      select: { id: true }
    })
  ) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

function revalidateCatalog() {
  revalidatePath("/admin/catalog");
  revalidatePath("/admin/catalog/categories");
  revalidatePath("/admin/catalog/courses");
  revalidatePath("/admin/catalog/bundles");
  revalidatePath("/pl");
  revalidatePath("/pl/kursy");
  revalidatePath("/de");
  revalidatePath("/de/kurse");
  revalidatePath("/en");
  revalidatePath("/en/courses");
}
