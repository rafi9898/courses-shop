-- CreateTable
CREATE TABLE "public"."PromoBanner" (
    "id" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "text" TEXT NOT NULL DEFAULT '',
    "buttonText" TEXT NOT NULL DEFAULT '',
    "buttonUrl" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromoBanner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PromoBanner_locale_key" ON "public"."PromoBanner"("locale");

-- CreateIndex
CREATE INDEX "PromoBanner_locale_isActive_idx" ON "public"."PromoBanner"("locale", "isActive");
