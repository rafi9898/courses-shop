CREATE TABLE "UdemyCoupon" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'pl',
    "courseTitle" TEXT,
    "udemyUrl" TEXT NOT NULL,
    "couponCode" TEXT NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UdemyCoupon_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UdemyCoupon_courseId_locale_couponCode_key" ON "UdemyCoupon"("courseId", "locale", "couponCode");
CREATE INDEX "UdemyCoupon_courseId_locale_isActive_idx" ON "UdemyCoupon"("courseId", "locale", "isActive");
CREATE INDEX "UdemyCoupon_validUntil_idx" ON "UdemyCoupon"("validUntil");
