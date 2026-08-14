import { CategoryColor, CourseLevel, ThumbnailVariant, type Bundle as DbBundle, type Category as DbCategory, type Course as DbCourse } from "@prisma/client";
import { localeMeta, type Locale } from "@/lib/i18n/config";
import { type Bundle, type Category, type Course } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";

type DbBundleWithCourses = DbBundle & {
  courses: {
    courseId: string;
  }[];
};

export type PublicCatalog = {
  categories: Category[];
  courses: Course[];
  bundles: Bundle[];
};

const locales: Locale[] = ["pl", "de", "en"];

const exchangeRates: Record<string, number> = {
  PLN: 1,
  EUR: 4.3,
  USD: 4.0
};

function convertPrice(amount: number, fromCurrency: string, toCurrency: string) {
  if (fromCurrency === toCurrency) return amount;
  const amountInPln = amount * (exchangeRates[fromCurrency] || 1);
  const converted = amountInPln / (exchangeRates[toCurrency] || 1);
  // Round to nearest .99
  return Math.max(0.99, Math.ceil(converted) - 0.01);
}

export async function getPublicCatalog(locale: Locale): Promise<PublicCatalog> {
  try {
    const [dbCategories, dbCourses, dbBundles] = await Promise.all([
      prisma.category.findMany({
        where: { locale, isActive: true },
        orderBy: [{ sortOrder: "asc" }, { label: "asc" }]
      }),
      prisma.course.findMany({
        where: { isActive: true },
        orderBy: [{ reviews: "desc" }, { sortOrder: "asc" }, { title: "asc" }]
      }),
      prisma.bundle.findMany({
        where: { isActive: true },
        include: {
          courses: {
            select: { courseId: true },
            orderBy: { position: "asc" }
          }
        },
        orderBy: [{ reviews: "desc" }, { sortOrder: "asc" }, { title: "asc" }]
      })
    ]);

    const uniqueCourseKeys = Array.from(new Set(dbCourses.map(c => c.catalogKey)));
    const uniqueBundleKeys = Array.from(new Set(dbBundles.map(b => b.catalogKey)));

    return {
      categories: dbCategories.map((category) => mapCategory(category, locale)),
      courses: uniqueCourseKeys
        .filter(catalogKey => dbCourses.some(c => c.catalogKey === catalogKey && c.locale === locale))
        .map(catalogKey => {
          const courseVersions = dbCourses.filter(c => c.catalogKey === catalogKey);
          return mapCourse(courseVersions, locale);
        }),
      bundles: uniqueBundleKeys
        .filter(catalogKey => dbBundles.some(b => b.catalogKey === catalogKey && b.locale === locale))
        .map(catalogKey => {
          const bundleVersions = dbBundles.filter(b => b.catalogKey === catalogKey);
          return mapBundle(bundleVersions, locale);
        })
    };
  } catch {
    return {
      categories: [],
      courses: [],
      bundles: []
    };
  }
}

export async function getPublicCourseBySlug(locale: Locale, slug: string) {
  const catalog = await getPublicCatalog(locale);
  return {
    catalog,
    course: catalog.courses.find((course) => course.slug[locale] === slug) ?? null
  };
}

export async function getPublicBundleBySlug(locale: Locale, slug: string) {
  const catalog = await getPublicCatalog(locale);
  return {
    catalog,
    bundle: catalog.bundles.find((bundle) => bundle.slug[locale] === slug) ?? null
  };
}

function mapCategory(category: DbCategory, locale: Locale): Category {
  return {
    id: category.id,
    label: localized(locale, category.label),
    description: localized(locale, category.description),
    color: mapCategoryColor(category.color)
  };
}

function mapCourse(courseVersions: DbCourse[], locale: Locale): Course {
  const localCourse = courseVersions.find(c => c.locale === locale);
  const primaryCourse = localCourse || courseVersions[0];

  let price = Number(primaryCourse.price);
  let regularPrice = Number(primaryCourse.regularPrice);

  if (!localCourse && primaryCourse.locale !== locale) {
    const targetCurrency = localeMeta[locale].currency;
    price = convertPrice(price, primaryCourse.currency, targetCurrency);
    regularPrice = convertPrice(regularPrice, primaryCourse.currency, targetCurrency);
  }

  const getLocalized = <T extends keyof DbCourse>(field: T): Record<Locale, DbCourse[T]> => {
    return locales.reduce((acc, loc) => {
      const version = courseVersions.find(c => c.locale === loc) || primaryCourse;
      acc[loc] = version[field];
      return acc;
    }, {} as Record<Locale, DbCourse[T]>);
  };

  return {
    id: primaryCourse.id,
    type: "course",
    title: getLocalized("title"),
    subtitle: getLocalized("subtitle"),
    slug: getLocalized("slug"),
    categoryId: primaryCourse.categoryId.replace(/-[a-z]{2}$/, `-${locale}`),
    level: mapCourseLevel(primaryCourse.level),
    rating: Number(primaryCourse.rating),
    reviews: primaryCourse.reviews,
    price: localized(locale, price),
    regularPrice: localized(locale, regularPrice),
    durationHours: primaryCourse.durationHours,
    lessons: primaryCourse.lessons,
    highlights: localized(locale, stringArray(primaryCourse.highlights)),
    outcomes: localized(locale, stringArray(primaryCourse.outcomes)),
    agenda: localized(locale, agendaArray(primaryCourse.agenda)),
    thumbnail: {
      title: primaryCourse.title,
      subtitle: "",
      variant: "dark"
    },
    thumbnailImageUrl: primaryCourse.thumbnailImageUrl,
    trailerYoutubeUrl: primaryCourse.trailerYoutubeUrl,
    isBestseller: primaryCourse.isBestseller,
    contentLocale: primaryCourse.locale as Locale,
    updatedAt: primaryCourse.updatedAt
  };
}

function mapBundle(bundleVersions: DbBundleWithCourses[], locale: Locale): Bundle {
  const localBundle = bundleVersions.find(b => b.locale === locale);
  const primaryBundle = localBundle || bundleVersions[0];

  let price = Number(primaryBundle.price);
  let regularPrice = Number(primaryBundle.regularPrice);

  if (!localBundle && primaryBundle.locale !== locale) {
    const targetCurrency = localeMeta[locale].currency;
    price = convertPrice(price, primaryBundle.currency, targetCurrency);
    regularPrice = convertPrice(regularPrice, primaryBundle.currency, targetCurrency);
  }

  const getLocalized = <T extends keyof DbBundleWithCourses>(field: T): Record<Locale, DbBundleWithCourses[T]> => {
    return locales.reduce((acc, loc) => {
      const version = bundleVersions.find(b => b.locale === loc) || primaryBundle;
      acc[loc] = version[field];
      return acc;
    }, {} as Record<Locale, DbBundleWithCourses[T]>);
  };

  return {
    id: primaryBundle.id,
    type: "bundle",
    title: getLocalized("title"),
    subtitle: getLocalized("subtitle"),
    slug: getLocalized("slug"),
    categoryId: primaryBundle.categoryId.replace(/-[a-z]{2}$/, `-${locale}`),
    description: getLocalized("description"),
    courseIds: primaryBundle.courses.map((course) => course.courseId),
    courseCount: primaryBundle.courseCount,
    rating: Number(primaryBundle.rating),
    reviews: primaryBundle.reviews,
    price: localized(locale, price),
    regularPrice: localized(locale, regularPrice),
    thumbnail: {
      title: primaryBundle.thumbnailTitle,
      subtitle: primaryBundle.thumbnailSubtitle,
      variant: mapThumbnailVariant(primaryBundle.thumbnailVariant)
    },
    thumbnailImageUrl: primaryBundle.thumbnailImageUrl,
    contentLocale: primaryBundle.locale as Locale,
    updatedAt: primaryBundle.updatedAt
  };
}

function localized<T>(locale: Locale, value: T): Record<Locale, T> {
  return locales.reduce(
    (result, item) => ({
      ...result,
      [item]: item === locale ? value : value
    }),
    {} as Record<Locale, T>
  );
}

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean) : [];
}

function agendaArray(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .reduce<{ title: string; lessons: number; duration?: string }[]>((items, item) => {
      if (!item || typeof item !== "object") return items;
      const agendaItem = item as { title?: unknown; lessons?: unknown; duration?: unknown };
      const title = String(agendaItem.title ?? "");

      if (!title) return items;

      items.push({
        title,
        lessons: Number(agendaItem.lessons ?? 0),
        duration: agendaItem.duration ? String(agendaItem.duration) : undefined
      });

      return items;
    }, []);
}

function mapCourseLevel(level: CourseLevel): Course["level"] {
  if (level === CourseLevel.ALL_LEVELS) return "all_levels";
  if (level === CourseLevel.INTERMEDIATE) return "intermediate";
  if (level === CourseLevel.ADVANCED) return "advanced";
  return "beginner";
}

function mapCategoryColor(color: CategoryColor): Category["color"] {
  if (color === CategoryColor.BLUE) return "blue";
  if (color === CategoryColor.EMERALD) return "emerald";
  if (color === CategoryColor.AMBER) return "amber";
  if (color === CategoryColor.SLATE) return "slate";
  return "violet";
}

function mapThumbnailVariant(variant: ThumbnailVariant): Bundle["thumbnail"]["variant"] {
  if (variant === ThumbnailVariant.BLUE) return "blue";
  if (variant === ThumbnailVariant.GREEN) return "green";
  if (variant === ThumbnailVariant.PURPLE) return "purple";
  return "dark";
}
