"use server";

import { CategoryColor, CourseLevel, ThumbnailVariant, type Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { adminCatalogLocales, type AdminCatalogLocale } from "@/lib/admin-catalog-locales";
import { getAdminPath } from "@/lib/admin-routes";
import { prisma } from "@/lib/prisma";
import { sanitizeRichText } from "@/lib/rich-text";

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

type CategoryFormData = {
  locale: AdminCatalogLocale;
  label: string;
  slug: string;
  description: string;
  color: CategoryColor;
  sortOrder: number;
  isActive: boolean;
};

export async function createCategoryAction(formData: FormData) {
  await ensureAdmin();
  const data = await readCreateCategoryForm(formData);

  await prisma.category.create({ data });

  revalidateCatalog();
  redirect(getAdminPath(`/catalog/categories?locale=${data.locale}`));
}

export async function updateCategoryAction(formData: FormData) {
  await ensureAdmin();
  const categoryId = requiredText(formData, "currentId");
  const data = await readCategoryForm(formData, categoryId);

  await prisma.category.update({
    where: { id: categoryId },
    data
  });

  revalidateCatalog();
  redirect(getAdminPath(`/catalog/categories?locale=${data.locale}`));
}

export async function deleteCategoryAction(formData: FormData) {
  await ensureAdmin();
  const categoryId = requiredText(formData, "categoryId");
  const locale = localeValue(formData);

  await prisma.category.delete({ where: { id: categoryId } });

  revalidateCatalog();
  redirect(getAdminPath(`/catalog/categories?locale=${locale}`));
}

export async function createCourseAction(formData: FormData) {
  await ensureAdmin();
  const data = await readCourseForm(formData);
  const udemyCouponCode = optionalText(formData, "udemyCouponCode");

  const course = await prisma.course.create({ data });
  await syncCourseUdemyCoupon({
    courseId: course.id,
    locale: course.locale,
    title: course.title,
    udemyUrl: course.udemyUrl,
    couponCode: udemyCouponCode
  });

  revalidateCatalog();
  redirect(getAdminPath(`/catalog/courses?locale=${data.locale}`));
}

export async function updateCourseAction(formData: FormData) {
  await ensureAdmin();
  const courseId = requiredText(formData, "currentId");
  const data = await readCourseForm(formData, courseId);
  const udemyCouponCode = optionalText(formData, "udemyCouponCode");

  const course = await prisma.course.update({
    where: { id: courseId },
    data
  });
  await syncCourseUdemyCoupon({
    courseId: course.id,
    locale: course.locale,
    title: course.title,
    udemyUrl: course.udemyUrl,
    couponCode: udemyCouponCode
  });

  revalidateCatalog();
  redirect(getAdminPath(`/catalog/courses?locale=${data.locale}`));
}

export async function deleteCourseAction(formData: FormData) {
  await ensureAdmin();
  const courseId = requiredText(formData, "courseId");
  const locale = localeValue(formData);

  await prisma.course.delete({ where: { id: courseId } });

  revalidateCatalog();
  redirect(getAdminPath(`/catalog/courses?locale=${locale}`));
}

export async function createBundleAction(formData: FormData) {
  await ensureAdmin();
  const { courseIds, data } = await readBundleForm(formData);

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
  redirect(getAdminPath(`/catalog/bundles?locale=${data.locale}`));
}

export async function updateBundleAction(formData: FormData) {
  await ensureAdmin();
  const bundleId = requiredText(formData, "currentId");
  const { courseIds, data } = await readBundleForm(formData, bundleId);

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
  redirect(getAdminPath(`/catalog/bundles?locale=${data.locale}`));
}

export async function deleteBundleAction(formData: FormData) {
  await ensureAdmin();
  const bundleId = requiredText(formData, "bundleId");
  const locale = localeValue(formData);

  await prisma.bundle.delete({ where: { id: bundleId } });

  revalidateCatalog();
  redirect(getAdminPath(`/catalog/bundles?locale=${locale}`));
}

async function ensureAdmin() {
  if (!isAdminConfigured() || !(await isAdminAuthenticated())) {
    throw new Error("Brak dostępu do panelu admina.");
  }
}

async function readCreateCategoryForm(formData: FormData): Promise<Prisma.CategoryCreateInput> {
  const locale = localeValue(formData);
  const label = requiredText(formData, "label");
  const slug = await uniqueCategorySlug(locale, label);

  return {
    locale,
    catalogKey: slug,
    label,
    slug,
    description: requiredText(formData, "description"),
    color: enumValue(formData, "color", categoryColors, CategoryColor.VIOLET),
    sortOrder: intValue(formData, "sortOrder"),
    isActive: boolValue(formData, "isActive")
  };
}

async function readCategoryForm(formData: FormData, currentCategoryId?: string): Promise<CategoryFormData> {
  const locale = localeValue(formData);
  const label = requiredText(formData, "label");
  const requestedSlug = optionalText(formData, "slug") || label;
  const slug = await uniqueCategorySlug(locale, requestedSlug, currentCategoryId);

  return {
    locale,
    label,
    slug,
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
  const thumbnailImageUrl = await saveThumbnail(formData, "course-thumbnails", "Miniaturka kursu");
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
    highlights: richTextJson(formData, "highlights"),
    outcomes: linesJson(formData, "outcomes"),
    agenda: agendaJson(formData, "agenda"),
    udemyCourseId: optionalText(formData, "udemyCourseId") || null,
    udemyUrl: optionalText(formData, "udemyUrl") || null,
    thumbnailImageUrl: thumbnailImageUrl || existingThumbnailImageUrl || null,
    trailerYoutubeUrl: optionalText(formData, "trailerYoutubeUrl") || null,
    sortOrder: intValue(formData, "sortOrder"),
    isActive: boolValue(formData, "isActive")
  };
}

async function readBundleForm(formData: FormData, currentBundleId?: string) {
  const locale = localeValue(formData);
  const title = requiredText(formData, "title");
  const requestedSlug = optionalText(formData, "slug") || slugify(title);
  const slug = await uniqueBundleSlug(locale, requestedSlug, currentBundleId);
  const thumbnailImageUrl = await saveThumbnail(formData, "bundle-thumbnails", "Miniaturka pakietu");
  const existingThumbnailImageUrl = optionalText(formData, "existingThumbnailImageUrl");
  const courseIds = formData
    .getAll("courseIds")
    .map((value) => String(value))
    .filter(Boolean);

  return {
    courseIds,
    data: {
      locale,
      catalogKey: optionalText(formData, "catalogKey") || slug,
      categoryId: requiredText(formData, "categoryId"),
      title,
      subtitle: optionalText(formData, "subtitle") || null,
      slug,
      description: requiredText(formData, "description"),
      courseCount: courseIds.length,
      rating: decimalValue(formData, "rating", 4.8),
      reviews: intValue(formData, "reviews"),
      price: decimalValue(formData, "price"),
      regularPrice: decimalValue(formData, "regularPrice"),
      currency: optionalText(formData, "currency") || currencyByLocale[locale],
      thumbnailTitle: optionalText(formData, "thumbnailTitle") || title,
      thumbnailSubtitle: optionalText(formData, "thumbnailSubtitle"),
      thumbnailVariant: enumValue(formData, "thumbnailVariant", thumbnailVariants, ThumbnailVariant.PURPLE),
      thumbnailImageUrl: thumbnailImageUrl || existingThumbnailImageUrl || null,
      sortOrder: intValue(formData, "sortOrder"),
      isActive: boolValue(formData, "isActive")
    }
  };
}

async function syncCourseUdemyCoupon({
  courseId,
  locale,
  title,
  udemyUrl,
  couponCode
}: {
  courseId: string;
  locale: string;
  title: string;
  udemyUrl: string | null;
  couponCode: string;
}) {
  const normalizedCode = couponCode.trim();

  if (!normalizedCode) {
    await prisma.udemyCoupon.updateMany({
      where: {
        courseId,
        locale,
        isActive: true
      },
      data: {
        isActive: false
      }
    });
    return;
  }

  if (!udemyUrl) {
    throw new Error("Aby zapisać kod, uzupełnij URL kursu Udemy.");
  }

  const activeCoupon = await prisma.udemyCoupon.findFirst({
    where: {
      courseId,
      locale,
      isActive: true
    },
    orderBy: [{ validUntil: "desc" }, { updatedAt: "desc" }]
  });

  if (activeCoupon && activeCoupon.couponCode !== normalizedCode) {
    await prisma.udemyCoupon.updateMany({
      where: {
        courseId,
        locale,
        isActive: true
      },
      data: {
        isActive: false
      }
    });
  }

  await prisma.udemyCoupon.upsert({
    where: {
      courseId_locale_couponCode: {
        courseId,
        locale,
        couponCode: normalizedCode
      }
    },
    update: {
      courseTitle: title,
      udemyUrl,
      validUntil: activeCoupon?.validUntil ?? defaultCouponValidUntil(),
      isActive: true
    },
    create: {
      courseId,
      locale,
      courseTitle: title,
      udemyUrl,
      couponCode: normalizedCode,
      validUntil: defaultCouponValidUntil(),
      isActive: true
    }
  });
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

function defaultCouponValidUntil() {
  const value = new Date();
  value.setUTCDate(value.getUTCDate() + 31);
  value.setUTCHours(23, 59, 59, 999);

  return value;
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

function richTextJson(formData: FormData, name: string): Prisma.InputJsonValue {
  const html = sanitizeRichText(optionalText(formData, name));

  if (!html) return [];

  return [html];
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

async function saveThumbnail(formData: FormData, folderName: string, label: string) {
  const file = formData.get("thumbnailImage");

  if (!(file instanceof File) || file.size === 0) {
    return null;
  }

  if (file.size > maxCourseThumbnailSize) {
    throw new Error(`${label} może mieć maksymalnie 8 MB.`);
  }

  if (!allowedCourseThumbnailTypes.includes(file.type)) {
    throw new Error(`${label} musi być plikiem JPG, PNG, WebP albo GIF.`);
  }

  const extension = getSafeImageExtension(file);
  const fileName = `${randomUUID()}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", folderName);
  const filePath = path.join(uploadDir, fileName);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  return `/uploads/${folderName}/${fileName}`;
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

async function uniqueCategorySlug(locale: AdminCatalogLocale, slug: string, currentCategoryId?: string) {
  const baseSlug = slugify(slug) || "kategoria";
  let candidate = baseSlug;
  let suffix = 2;

  while (
    await prisma.category.findFirst({
      where: {
        locale,
        slug: candidate,
        ...(currentCategoryId ? { id: { not: currentCategoryId } } : {})
      },
      select: { id: true }
    })
  ) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
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

async function uniqueBundleSlug(locale: AdminCatalogLocale, slug: string, currentBundleId?: string) {
  const baseSlug = slugify(slug) || "pakiet";
  let candidate = baseSlug;
  let suffix = 2;

  while (
    await prisma.bundle.findFirst({
      where: {
        locale,
        slug: candidate,
        ...(currentBundleId ? { id: { not: currentBundleId } } : {})
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
  revalidatePath(getAdminPath("/catalog"));
  revalidatePath(getAdminPath("/catalog/categories"));
  revalidatePath(getAdminPath("/catalog/courses"));
  revalidatePath(getAdminPath("/catalog/bundles"));
  revalidatePath("/pl");
  revalidatePath("/pl/kategorie");
  revalidatePath("/pl/kursy");
  revalidatePath("/pl/pakiety");
  revalidatePath("/de");
  revalidatePath("/de/kategorien");
  revalidatePath("/de/kurse");
  revalidatePath("/de/pakete");
  revalidatePath("/en");
  revalidatePath("/en/categories");
  revalidatePath("/en/courses");
  revalidatePath("/en/bundles");
}
