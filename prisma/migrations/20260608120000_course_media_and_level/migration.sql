-- AlterEnum
ALTER TYPE "CourseLevel" ADD VALUE 'ALL_LEVELS';

-- AlterTable
ALTER TABLE "Course" ADD COLUMN "thumbnailImageUrl" TEXT;
ALTER TABLE "Course" ADD COLUMN "trailerYoutubeUrl" TEXT;
ALTER TABLE "Course" DROP COLUMN "thumbnailTitle";
ALTER TABLE "Course" DROP COLUMN "thumbnailSubtitle";
ALTER TABLE "Course" DROP COLUMN "thumbnailVariant";
