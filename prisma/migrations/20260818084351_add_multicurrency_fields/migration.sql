-- AlterTable
ALTER TABLE "Bundle" ADD COLUMN     "priceEur" DECIMAL(10,2),
ADD COLUMN     "pricePln" DECIMAL(10,2),
ADD COLUMN     "priceUsd" DECIMAL(10,2),
ADD COLUMN     "regularPriceEur" DECIMAL(10,2),
ADD COLUMN     "regularPricePln" DECIMAL(10,2),
ADD COLUMN     "regularPriceUsd" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "priceEur" DECIMAL(10,2),
ADD COLUMN     "pricePln" DECIMAL(10,2),
ADD COLUMN     "priceUsd" DECIMAL(10,2),
ADD COLUMN     "regularPriceEur" DECIMAL(10,2),
ADD COLUMN     "regularPricePln" DECIMAL(10,2),
ADD COLUMN     "regularPriceUsd" DECIMAL(10,2);

-- Course Data Migration
UPDATE "Course" SET
  "pricePln" = CASE
    WHEN "currency" = 'PLN' THEN "price"
    WHEN "currency" = 'EUR' THEN CEIL("price" * 4.3) - 0.01
    WHEN "currency" = 'USD' THEN CEIL("price" * 4.0) - 0.01
  END,
  "regularPricePln" = CASE
    WHEN "currency" = 'PLN' THEN "regularPrice"
    WHEN "currency" = 'EUR' THEN CEIL("regularPrice" * 4.3) - 0.01
    WHEN "currency" = 'USD' THEN CEIL("regularPrice" * 4.0) - 0.01
  END,
  "priceEur" = CASE
    WHEN "currency" = 'EUR' THEN "price"
    WHEN "currency" = 'PLN' THEN CEIL("price" / 4.3) - 0.01
    WHEN "currency" = 'USD' THEN CEIL(("price" * 4.0) / 4.3) - 0.01
  END,
  "regularPriceEur" = CASE
    WHEN "currency" = 'EUR' THEN "regularPrice"
    WHEN "currency" = 'PLN' THEN CEIL("regularPrice" / 4.3) - 0.01
    WHEN "currency" = 'USD' THEN CEIL(("regularPrice" * 4.0) / 4.3) - 0.01
  END,
  "priceUsd" = CASE
    WHEN "currency" = 'USD' THEN "price"
    WHEN "currency" = 'PLN' THEN CEIL("price" / 4.0) - 0.01
    WHEN "currency" = 'EUR' THEN CEIL(("price" * 4.3) / 4.0) - 0.01
  END,
  "regularPriceUsd" = CASE
    WHEN "currency" = 'USD' THEN "regularPrice"
    WHEN "currency" = 'PLN' THEN CEIL("regularPrice" / 4.0) - 0.01
    WHEN "currency" = 'EUR' THEN CEIL(("regularPrice" * 4.3) / 4.0) - 0.01
  END;

-- Bundle Data Migration
UPDATE "Bundle" SET
  "pricePln" = CASE
    WHEN "currency" = 'PLN' THEN "price"
    WHEN "currency" = 'EUR' THEN CEIL("price" * 4.3) - 0.01
    WHEN "currency" = 'USD' THEN CEIL("price" * 4.0) - 0.01
  END,
  "regularPricePln" = CASE
    WHEN "currency" = 'PLN' THEN "regularPrice"
    WHEN "currency" = 'EUR' THEN CEIL("regularPrice" * 4.3) - 0.01
    WHEN "currency" = 'USD' THEN CEIL("regularPrice" * 4.0) - 0.01
  END,
  "priceEur" = CASE
    WHEN "currency" = 'EUR' THEN "price"
    WHEN "currency" = 'PLN' THEN CEIL("price" / 4.3) - 0.01
    WHEN "currency" = 'USD' THEN CEIL(("price" * 4.0) / 4.3) - 0.01
  END,
  "regularPriceEur" = CASE
    WHEN "currency" = 'EUR' THEN "regularPrice"
    WHEN "currency" = 'PLN' THEN CEIL("regularPrice" / 4.3) - 0.01
    WHEN "currency" = 'USD' THEN CEIL(("regularPrice" * 4.0) / 4.3) - 0.01
  END,
  "priceUsd" = CASE
    WHEN "currency" = 'USD' THEN "price"
    WHEN "currency" = 'PLN' THEN CEIL("price" / 4.0) - 0.01
    WHEN "currency" = 'EUR' THEN CEIL(("price" * 4.3) / 4.0) - 0.01
  END,
  "regularPriceUsd" = CASE
    WHEN "currency" = 'USD' THEN "regularPrice"
    WHEN "currency" = 'PLN' THEN CEIL("regularPrice" / 4.0) - 0.01
    WHEN "currency" = 'EUR' THEN CEIL(("regularPrice" * 4.3) / 4.0) - 0.01
  END;
