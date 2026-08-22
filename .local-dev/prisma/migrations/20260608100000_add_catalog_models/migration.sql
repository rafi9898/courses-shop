-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "CategoryColor" AS ENUM ('VIOLET', 'BLUE', 'EMERALD', 'AMBER', 'SLATE');

-- CreateEnum
CREATE TYPE "ThumbnailVariant" AS ENUM ('DARK', 'BLUE', 'PURPLE', 'GREEN');

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "labelPl" TEXT NOT NULL,
    "labelDe" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "descriptionPl" TEXT NOT NULL,
    "descriptionDe" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "color" "CategoryColor" NOT NULL DEFAULT 'VIOLET',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "titlePl" TEXT NOT NULL,
    "titleDe" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "slugPl" TEXT NOT NULL,
    "slugDe" TEXT NOT NULL,
    "slugEn" TEXT NOT NULL,
    "level" "CourseLevel" NOT NULL,
    "rating" DECIMAL(3,2) NOT NULL,
    "reviews" INTEGER NOT NULL,
    "pricePl" DECIMAL(10,2) NOT NULL,
    "priceDe" DECIMAL(10,2) NOT NULL,
    "priceEn" DECIMAL(10,2) NOT NULL,
    "regularPricePl" DECIMAL(10,2) NOT NULL,
    "regularPriceDe" DECIMAL(10,2) NOT NULL,
    "regularPriceEn" DECIMAL(10,2) NOT NULL,
    "durationHours" INTEGER NOT NULL,
    "lessons" INTEGER NOT NULL,
    "highlightsPl" JSONB NOT NULL,
    "highlightsDe" JSONB NOT NULL,
    "highlightsEn" JSONB NOT NULL,
    "outcomesPl" JSONB NOT NULL,
    "outcomesDe" JSONB NOT NULL,
    "outcomesEn" JSONB NOT NULL,
    "agendaPl" JSONB NOT NULL,
    "agendaDe" JSONB NOT NULL,
    "agendaEn" JSONB NOT NULL,
    "thumbnailTitle" TEXT NOT NULL,
    "thumbnailSubtitle" TEXT NOT NULL,
    "thumbnailVariant" "ThumbnailVariant" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bundle" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "titlePl" TEXT NOT NULL,
    "titleDe" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "slugPl" TEXT NOT NULL,
    "slugDe" TEXT NOT NULL,
    "slugEn" TEXT NOT NULL,
    "descriptionPl" TEXT NOT NULL,
    "descriptionDe" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "courseCount" INTEGER NOT NULL,
    "rating" DECIMAL(3,2) NOT NULL,
    "reviews" INTEGER NOT NULL,
    "pricePl" DECIMAL(10,2) NOT NULL,
    "priceDe" DECIMAL(10,2) NOT NULL,
    "priceEn" DECIMAL(10,2) NOT NULL,
    "regularPricePl" DECIMAL(10,2) NOT NULL,
    "regularPriceDe" DECIMAL(10,2) NOT NULL,
    "regularPriceEn" DECIMAL(10,2) NOT NULL,
    "thumbnailTitle" TEXT NOT NULL,
    "thumbnailSubtitle" TEXT NOT NULL,
    "thumbnailVariant" "ThumbnailVariant" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bundle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BundleCourse" (
    "bundleId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BundleCourse_pkey" PRIMARY KEY ("bundleId","courseId")
);

-- CreateIndex
CREATE INDEX "Category_isActive_sortOrder_idx" ON "Category"("isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Course_slugPl_key" ON "Course"("slugPl");

-- CreateIndex
CREATE UNIQUE INDEX "Course_slugDe_key" ON "Course"("slugDe");

-- CreateIndex
CREATE UNIQUE INDEX "Course_slugEn_key" ON "Course"("slugEn");

-- CreateIndex
CREATE INDEX "Course_categoryId_idx" ON "Course"("categoryId");

-- CreateIndex
CREATE INDEX "Course_isActive_sortOrder_idx" ON "Course"("isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Bundle_slugPl_key" ON "Bundle"("slugPl");

-- CreateIndex
CREATE UNIQUE INDEX "Bundle_slugDe_key" ON "Bundle"("slugDe");

-- CreateIndex
CREATE UNIQUE INDEX "Bundle_slugEn_key" ON "Bundle"("slugEn");

-- CreateIndex
CREATE INDEX "Bundle_categoryId_idx" ON "Bundle"("categoryId");

-- CreateIndex
CREATE INDEX "Bundle_isActive_sortOrder_idx" ON "Bundle"("isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "BundleCourse_courseId_idx" ON "BundleCourse"("courseId");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bundle" ADD CONSTRAINT "Bundle_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BundleCourse" ADD CONSTRAINT "BundleCourse_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BundleCourse" ADD CONSTRAINT "BundleCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
