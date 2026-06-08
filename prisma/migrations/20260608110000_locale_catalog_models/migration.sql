-- Rename old multilingual catalog tables.
ALTER TABLE "BundleCourse" RENAME TO "BundleCourseLegacy";
ALTER TABLE "Bundle" RENAME TO "BundleLegacy";
ALTER TABLE "Course" RENAME TO "CourseLegacy";
ALTER TABLE "Category" RENAME TO "CategoryLegacy";

-- Drop old constraints that keep their original names after table rename.
ALTER TABLE "BundleCourseLegacy" DROP CONSTRAINT IF EXISTS "BundleCourse_pkey";
ALTER TABLE "BundleCourseLegacy" DROP CONSTRAINT IF EXISTS "BundleCourse_bundleId_fkey";
ALTER TABLE "BundleCourseLegacy" DROP CONSTRAINT IF EXISTS "BundleCourse_courseId_fkey";
ALTER TABLE "BundleLegacy" DROP CONSTRAINT IF EXISTS "Bundle_pkey";
ALTER TABLE "BundleLegacy" DROP CONSTRAINT IF EXISTS "Bundle_categoryId_fkey";
ALTER TABLE "CourseLegacy" DROP CONSTRAINT IF EXISTS "Course_pkey";
ALTER TABLE "CourseLegacy" DROP CONSTRAINT IF EXISTS "Course_categoryId_fkey";
ALTER TABLE "CategoryLegacy" DROP CONSTRAINT IF EXISTS "Category_pkey";

-- Drop old indexes renamed together with tables.
DROP INDEX IF EXISTS "BundleCourse_courseId_idx";
DROP INDEX IF EXISTS "Bundle_categoryId_idx";
DROP INDEX IF EXISTS "Bundle_isActive_sortOrder_idx";
DROP INDEX IF EXISTS "Bundle_slugDe_key";
DROP INDEX IF EXISTS "Bundle_slugEn_key";
DROP INDEX IF EXISTS "Bundle_slugPl_key";
DROP INDEX IF EXISTS "Category_isActive_sortOrder_idx";
DROP INDEX IF EXISTS "Course_categoryId_idx";
DROP INDEX IF EXISTS "Course_isActive_sortOrder_idx";
DROP INDEX IF EXISTS "Course_slugDe_key";
DROP INDEX IF EXISTS "Course_slugEn_key";
DROP INDEX IF EXISTS "Course_slugPl_key";

-- Create locale-aware catalog tables.
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "catalogKey" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "color" "CategoryColor" NOT NULL DEFAULT 'VIOLET',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "catalogKey" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "level" "CourseLevel" NOT NULL,
    "rating" DECIMAL(3,2) NOT NULL,
    "reviews" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "regularPrice" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "durationHours" INTEGER NOT NULL,
    "lessons" INTEGER NOT NULL,
    "highlights" JSONB NOT NULL,
    "outcomes" JSONB NOT NULL,
    "agenda" JSONB NOT NULL,
    "thumbnailTitle" TEXT NOT NULL,
    "thumbnailSubtitle" TEXT NOT NULL,
    "thumbnailVariant" "ThumbnailVariant" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Bundle" (
    "id" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "catalogKey" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "courseCount" INTEGER NOT NULL,
    "rating" DECIMAL(3,2) NOT NULL,
    "reviews" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "regularPrice" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "thumbnailTitle" TEXT NOT NULL,
    "thumbnailSubtitle" TEXT NOT NULL,
    "thumbnailVariant" "ThumbnailVariant" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bundle_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BundleCourse" (
    "bundleId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BundleCourse_pkey" PRIMARY KEY ("bundleId","courseId")
);

-- Preserve existing seeded/current catalog data as separate locale records.
INSERT INTO "Category" ("id", "locale", "catalogKey", "label", "slug", "description", "color", "sortOrder", "isActive", "createdAt", "updatedAt")
SELECT "id" || '-pl', 'pl', "id", "labelPl", "id", "descriptionPl", "color", "sortOrder", "isActive", "createdAt", "updatedAt" FROM "CategoryLegacy"
UNION ALL
SELECT "id" || '-de', 'de', "id", "labelDe", "id", "descriptionDe", "color", "sortOrder", "isActive", "createdAt", "updatedAt" FROM "CategoryLegacy"
UNION ALL
SELECT "id" || '-en', 'en', "id", "labelEn", "id", "descriptionEn", "color", "sortOrder", "isActive", "createdAt", "updatedAt" FROM "CategoryLegacy";

INSERT INTO "Course" ("id", "locale", "catalogKey", "categoryId", "title", "slug", "level", "rating", "reviews", "price", "regularPrice", "currency", "durationHours", "lessons", "highlights", "outcomes", "agenda", "thumbnailTitle", "thumbnailSubtitle", "thumbnailVariant", "sortOrder", "isActive", "createdAt", "updatedAt")
SELECT "id" || '-pl', 'pl', "id", "categoryId" || '-pl', "titlePl", "slugPl", "level", "rating", "reviews", "pricePl", "regularPricePl", 'PLN', "durationHours", "lessons", "highlightsPl", "outcomesPl", "agendaPl", "thumbnailTitle", "thumbnailSubtitle", "thumbnailVariant", "sortOrder", "isActive", "createdAt", "updatedAt" FROM "CourseLegacy"
UNION ALL
SELECT "id" || '-de', 'de', "id", "categoryId" || '-de', "titleDe", "slugDe", "level", "rating", "reviews", "priceDe", "regularPriceDe", 'EUR', "durationHours", "lessons", "highlightsDe", "outcomesDe", "agendaDe", "thumbnailTitle", "thumbnailSubtitle", "thumbnailVariant", "sortOrder", "isActive", "createdAt", "updatedAt" FROM "CourseLegacy"
UNION ALL
SELECT "id" || '-en', 'en', "id", "categoryId" || '-en', "titleEn", "slugEn", "level", "rating", "reviews", "priceEn", "regularPriceEn", 'USD', "durationHours", "lessons", "highlightsEn", "outcomesEn", "agendaEn", "thumbnailTitle", "thumbnailSubtitle", "thumbnailVariant", "sortOrder", "isActive", "createdAt", "updatedAt" FROM "CourseLegacy";

INSERT INTO "Bundle" ("id", "locale", "catalogKey", "categoryId", "title", "slug", "description", "courseCount", "rating", "reviews", "price", "regularPrice", "currency", "thumbnailTitle", "thumbnailSubtitle", "thumbnailVariant", "sortOrder", "isActive", "createdAt", "updatedAt")
SELECT "id" || '-pl', 'pl', "id", "categoryId" || '-pl', "titlePl", "slugPl", "descriptionPl", "courseCount", "rating", "reviews", "pricePl", "regularPricePl", 'PLN', "thumbnailTitle", "thumbnailSubtitle", "thumbnailVariant", "sortOrder", "isActive", "createdAt", "updatedAt" FROM "BundleLegacy"
UNION ALL
SELECT "id" || '-de', 'de', "id", "categoryId" || '-de', "titleDe", "slugDe", "descriptionDe", "courseCount", "rating", "reviews", "priceDe", "regularPriceDe", 'EUR', "thumbnailTitle", "thumbnailSubtitle", "thumbnailVariant", "sortOrder", "isActive", "createdAt", "updatedAt" FROM "BundleLegacy"
UNION ALL
SELECT "id" || '-en', 'en', "id", "categoryId" || '-en', "titleEn", "slugEn", "descriptionEn", "courseCount", "rating", "reviews", "priceEn", "regularPriceEn", 'USD', "thumbnailTitle", "thumbnailSubtitle", "thumbnailVariant", "sortOrder", "isActive", "createdAt", "updatedAt" FROM "BundleLegacy";

INSERT INTO "BundleCourse" ("bundleId", "courseId", "position", "createdAt")
SELECT "bundleId" || '-pl', "courseId" || '-pl', "position", "createdAt" FROM "BundleCourseLegacy"
UNION ALL
SELECT "bundleId" || '-de', "courseId" || '-de', "position", "createdAt" FROM "BundleCourseLegacy"
UNION ALL
SELECT "bundleId" || '-en', "courseId" || '-en', "position", "createdAt" FROM "BundleCourseLegacy";

-- Create indexes and constraints.
CREATE UNIQUE INDEX "Category_locale_slug_key" ON "Category"("locale", "slug");
CREATE INDEX "Category_locale_catalogKey_idx" ON "Category"("locale", "catalogKey");
CREATE INDEX "Category_isActive_sortOrder_idx" ON "Category"("isActive", "sortOrder");

CREATE UNIQUE INDEX "Course_locale_slug_key" ON "Course"("locale", "slug");
CREATE INDEX "Course_locale_catalogKey_idx" ON "Course"("locale", "catalogKey");
CREATE INDEX "Course_categoryId_idx" ON "Course"("categoryId");
CREATE INDEX "Course_isActive_sortOrder_idx" ON "Course"("isActive", "sortOrder");

CREATE UNIQUE INDEX "Bundle_locale_slug_key" ON "Bundle"("locale", "slug");
CREATE INDEX "Bundle_locale_catalogKey_idx" ON "Bundle"("locale", "catalogKey");
CREATE INDEX "Bundle_categoryId_idx" ON "Bundle"("categoryId");
CREATE INDEX "Bundle_isActive_sortOrder_idx" ON "Bundle"("isActive", "sortOrder");

CREATE INDEX "BundleCourse_courseId_idx" ON "BundleCourse"("courseId");

ALTER TABLE "Course" ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Bundle" ADD CONSTRAINT "Bundle_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BundleCourse" ADD CONSTRAINT "BundleCourse_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BundleCourse" ADD CONSTRAINT "BundleCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Drop legacy tables.
DROP TABLE "BundleCourseLegacy";
DROP TABLE "BundleLegacy";
DROP TABLE "CourseLegacy";
DROP TABLE "CategoryLegacy";
