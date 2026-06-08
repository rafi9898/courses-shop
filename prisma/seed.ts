import { PrismaClient } from "@prisma/client";
import { bundles, categories, courses } from "../src/lib/mock-data.ts";

const prisma = new PrismaClient();
const locales = ["pl", "de", "en"] as const;

const currencyByLocale = {
  pl: "PLN",
  de: "EUR",
  en: "USD"
} as const;

const categoryColorMap = {
  violet: "VIOLET",
  blue: "BLUE",
  emerald: "EMERALD",
  amber: "AMBER",
  slate: "SLATE"
} as const;

const courseLevelMap = {
  all_levels: "ALL_LEVELS",
  beginner: "BEGINNER",
  intermediate: "INTERMEDIATE",
  advanced: "ADVANCED"
} as const;

async function seedCategories() {
  for (const locale of locales) {
    for (const [index, category] of categories.entries()) {
      await prisma.category.upsert({
        where: {
          locale_slug: {
            locale,
            slug: category.id
          }
        },
        update: {
          catalogKey: category.id,
          label: category.label[locale],
          description: category.description[locale],
          color: categoryColorMap[category.color],
          sortOrder: index,
          isActive: true
        },
        create: {
          id: `${category.id}-${locale}`,
          locale,
          catalogKey: category.id,
          label: category.label[locale],
          slug: category.id,
          description: category.description[locale],
          color: categoryColorMap[category.color],
          sortOrder: index,
          isActive: true
        }
      });
    }
  }
}

async function seedCourses() {
  for (const locale of locales) {
    for (const [index, course] of courses.entries()) {
      await prisma.course.upsert({
        where: {
          locale_slug: {
            locale,
            slug: course.slug[locale]
          }
        },
        update: {
          catalogKey: course.id,
          categoryId: `${course.categoryId}-${locale}`,
          title: course.title[locale],
          subtitle: course.subtitle?.[locale] ?? null,
          level: courseLevelMap[course.level],
          rating: course.rating,
          reviews: course.reviews,
          price: course.price[locale],
          regularPrice: course.regularPrice[locale],
          currency: currencyByLocale[locale],
          durationHours: course.durationHours,
          lessons: course.lessons,
          highlights: course.highlights[locale],
          outcomes: course.outcomes[locale],
          agenda: course.agenda[locale],
          sortOrder: index,
          isActive: true
        },
        create: {
          id: `${course.id}-${locale}`,
          locale,
          catalogKey: course.id,
          categoryId: `${course.categoryId}-${locale}`,
          title: course.title[locale],
          subtitle: course.subtitle?.[locale] ?? null,
          slug: course.slug[locale],
          level: courseLevelMap[course.level],
          rating: course.rating,
          reviews: course.reviews,
          price: course.price[locale],
          regularPrice: course.regularPrice[locale],
          currency: currencyByLocale[locale],
          durationHours: course.durationHours,
          lessons: course.lessons,
          highlights: course.highlights[locale],
          outcomes: course.outcomes[locale],
          agenda: course.agenda[locale],
          sortOrder: index,
          isActive: true
        }
      });
    }
  }
}

async function seedBundles() {
  for (const locale of locales) {
    for (const [index, bundle] of bundles.entries()) {
      await prisma.bundle.upsert({
        where: {
          locale_slug: {
            locale,
            slug: bundle.slug[locale]
          }
        },
        update: {
          catalogKey: bundle.id,
          categoryId: `${bundle.categoryId}-${locale}`,
          title: bundle.title[locale],
          subtitle: bundle.subtitle?.[locale] ?? null,
          description: bundle.description[locale],
          courseCount: bundle.courseIds.length,
          rating: bundle.rating,
          reviews: bundle.reviews,
          price: bundle.price[locale],
          regularPrice: bundle.regularPrice[locale],
          currency: currencyByLocale[locale],
          thumbnailTitle: bundle.thumbnail.title,
          thumbnailSubtitle: bundle.thumbnail.subtitle,
          thumbnailVariant: thumbnailVariantMap(bundle.thumbnail.variant),
          thumbnailImageUrl: bundle.thumbnailImageUrl ?? null,
          sortOrder: index,
          isActive: true
        },
        create: {
          id: `${bundle.id}-${locale}`,
          locale,
          catalogKey: bundle.id,
          categoryId: `${bundle.categoryId}-${locale}`,
          title: bundle.title[locale],
          subtitle: bundle.subtitle?.[locale] ?? null,
          slug: bundle.slug[locale],
          description: bundle.description[locale],
          courseCount: bundle.courseIds.length,
          rating: bundle.rating,
          reviews: bundle.reviews,
          price: bundle.price[locale],
          regularPrice: bundle.regularPrice[locale],
          currency: currencyByLocale[locale],
          thumbnailTitle: bundle.thumbnail.title,
          thumbnailSubtitle: bundle.thumbnail.subtitle,
          thumbnailVariant: thumbnailVariantMap(bundle.thumbnail.variant),
          thumbnailImageUrl: bundle.thumbnailImageUrl ?? null,
          sortOrder: index,
          isActive: true
        }
      });

      await prisma.bundleCourse.deleteMany({ where: { bundleId: `${bundle.id}-${locale}` } });
      await prisma.bundleCourse.createMany({
        data: bundle.courseIds.map((courseId, position) => ({
          bundleId: `${bundle.id}-${locale}`,
          courseId: `${courseId}-${locale}`,
          position
        }))
      });
    }
  }
}

async function seedDiscountCodes() {
  await prisma.discountCode.upsert({
    where: { code: "START10" },
    update: {
      percentage: 10,
      description: "Kod startowy widoczny w koszyku i checkoutcie.",
      validFrom: new Date("2026-01-01T00:00:00.000Z"),
      validUntil: new Date("2026-12-31T23:59:59.000Z"),
      isActive: true
    },
    create: {
      code: "START10",
      percentage: 10,
      description: "Kod startowy widoczny w koszyku i checkoutcie.",
      validFrom: new Date("2026-01-01T00:00:00.000Z"),
      validUntil: new Date("2026-12-31T23:59:59.000Z"),
      isActive: true
    }
  });
}

function thumbnailVariantMap(variant: "dark" | "blue" | "purple" | "green") {
  const variants = {
    dark: "DARK",
    blue: "BLUE",
    purple: "PURPLE",
    green: "GREEN"
  } as const;

  return variants[variant];
}

async function main() {
  await seedCategories();
  await seedCourses();
  await seedBundles();
  await seedDiscountCodes();

  console.info(
    `Seeded locale catalog: ${categories.length * locales.length} categories, ${courses.length * locales.length} courses, ${bundles.length * locales.length} bundles, 1 discount code.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
