import { CategoryColor, CourseLevel, ThumbnailVariant, type Bundle as DbBundle, type Category as DbCategory, type Course as DbCourse } from "@prisma/client";
import { type Locale } from "@/lib/i18n/config";
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

    const localeCourses = dbCourses.filter(c => c.locale === locale);
    const localeBundles = dbBundles.filter(b => b.locale === locale);

    return {
      categories: dbCategories.map((category) => mapCategory(category, locale)),
      courses: dbCourses.map((course) => {
        const localCourse = localeCourses.find(c => c.catalogKey === course.catalogKey);
        return mapCourse(course, locale, localCourse);
      }),
      bundles: dbBundles.map((bundle) => {
        const localBundle = localeBundles.find(b => b.catalogKey === bundle.catalogKey);
        return mapBundle(bundle, locale, localBundle);
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

function mapCourse(course: DbCourse, locale: Locale, localCourse?: DbCourse): Course {
  const price = localCourse ? Number(localCourse.price) : Number(course.price);
  const regularPrice = localCourse ? Number(localCourse.regularPrice) : Number(course.regularPrice);

  return {
    id: course.id,
    type: "course",
    title: localized(locale, course.title),
    subtitle: localized(locale, course.subtitle),
    slug: localized(locale, course.slug),
    categoryId: course.categoryId.replace(/-[a-z]{2}$/, `-${locale}`),
    level: mapCourseLevel(course.level),
    rating: Number(course.rating),
    reviews: course.reviews,
    price: localized(locale, price),
    regularPrice: localized(locale, regularPrice),
    durationHours: course.durationHours,
    lessons: course.lessons,
    highlights: localized(locale, stringArray(course.highlights)),
    outcomes: localized(locale, stringArray(course.outcomes)),
    agenda: localized(locale, agendaArray(course.agenda)),
    thumbnail: {
      title: course.title,
      subtitle: "",
      variant: "dark"
    },
    thumbnailImageUrl: course.thumbnailImageUrl,
    trailerYoutubeUrl: course.trailerYoutubeUrl,
    isBestseller: course.isBestseller,
    contentLocale: course.locale as Locale
  };
}

function mapBundle(bundle: DbBundleWithCourses, locale: Locale, localBundle?: DbBundleWithCourses): Bundle {
  const price = localBundle ? Number(localBundle.price) : Number(bundle.price);
  const regularPrice = localBundle ? Number(localBundle.regularPrice) : Number(bundle.regularPrice);

  return {
    id: bundle.id,
    type: "bundle",
    title: localized(locale, bundle.title),
    subtitle: localized(locale, bundle.subtitle),
    slug: localized(locale, bundle.slug),
    categoryId: bundle.categoryId.replace(/-[a-z]{2}$/, `-${locale}`),
    description: localized(locale, bundle.description),
    courseIds: bundle.courses.map((course) => course.courseId),
    courseCount: bundle.courseCount,
    rating: Number(bundle.rating),
    reviews: bundle.reviews,
    price: localized(locale, price),
    regularPrice: localized(locale, regularPrice),
    thumbnail: {
      title: bundle.thumbnailTitle,
      subtitle: bundle.thumbnailSubtitle,
      variant: mapThumbnailVariant(bundle.thumbnailVariant)
    },
    thumbnailImageUrl: bundle.thumbnailImageUrl,
    contentLocale: bundle.locale as Locale
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
