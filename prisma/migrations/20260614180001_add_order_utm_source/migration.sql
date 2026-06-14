/*
  Warnings:

  - You are about to drop the `_DiscountBundles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DiscountCourses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DiscountBundles" DROP CONSTRAINT "_DiscountBundles_A_fkey";

-- DropForeignKey
ALTER TABLE "_DiscountBundles" DROP CONSTRAINT "_DiscountBundles_B_fkey";

-- DropForeignKey
ALTER TABLE "_DiscountCourses" DROP CONSTRAINT "_DiscountCourses_A_fkey";

-- DropForeignKey
ALTER TABLE "_DiscountCourses" DROP CONSTRAINT "_DiscountCourses_B_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "utmSource" TEXT;

-- DropTable
DROP TABLE "_DiscountBundles";

-- DropTable
DROP TABLE "_DiscountCourses";
