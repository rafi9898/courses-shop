ALTER TABLE "Course" ADD COLUMN "udemyCourseId" TEXT;
ALTER TABLE "Course" ADD COLUMN "udemyUrl" TEXT;

CREATE INDEX "Course_udemyCourseId_idx" ON "Course"("udemyCourseId");
