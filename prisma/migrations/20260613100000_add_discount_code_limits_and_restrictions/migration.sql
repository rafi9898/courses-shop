-- AlterTable
ALTER TABLE "DiscountCode" ADD COLUMN     "usageLimit" INTEGER,
ADD COLUMN     "usedCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "_DiscountCourses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DiscountBundles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DiscountCourses_AB_unique" ON "_DiscountCourses"("A", "B");

-- CreateIndex
CREATE INDEX "_DiscountCourses_B_index" ON "_DiscountCourses"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DiscountBundles_AB_unique" ON "_DiscountBundles"("A", "B");

-- CreateIndex
CREATE INDEX "_DiscountBundles_B_index" ON "_DiscountBundles"("B");

-- AddForeignKey
ALTER TABLE "_DiscountCourses" ADD CONSTRAINT "_DiscountCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "DiscountCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscountCourses" ADD CONSTRAINT "_DiscountCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscountBundles" ADD CONSTRAINT "_DiscountBundles_A_fkey" FOREIGN KEY ("A") REFERENCES "Bundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscountBundles" ADD CONSTRAINT "_DiscountBundles_B_fkey" FOREIGN KEY ("B") REFERENCES "DiscountCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
