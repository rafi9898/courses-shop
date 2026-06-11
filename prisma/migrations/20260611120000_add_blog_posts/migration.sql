CREATE TABLE "BlogPost" (
  "id" TEXT NOT NULL,
  "locale" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "excerpt" TEXT NOT NULL,
  "contentHtml" TEXT NOT NULL,
  "thumbnailImageUrl" TEXT,
  "metaTitle" TEXT,
  "metaDescription" TEXT,
  "metaKeywords" TEXT,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BlogPost_locale_slug_key" ON "BlogPost"("locale", "slug");
CREATE INDEX "BlogPost_locale_isPublished_publishedAt_idx" ON "BlogPost"("locale", "isPublished", "publishedAt");
CREATE INDEX "BlogPost_updatedAt_idx" ON "BlogPost"("updatedAt");
