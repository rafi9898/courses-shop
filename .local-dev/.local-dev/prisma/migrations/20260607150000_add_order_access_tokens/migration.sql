ALTER TABLE "Order" ADD COLUMN "accessToken" TEXT;

UPDATE "Order"
SET "accessToken" = 'legacy_' || md5(random()::text || clock_timestamp()::text || id)
WHERE "accessToken" IS NULL;

ALTER TABLE "Order" ALTER COLUMN "accessToken" SET NOT NULL;

CREATE UNIQUE INDEX "Order_accessToken_key" ON "Order"("accessToken");
