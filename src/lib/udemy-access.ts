import { isLocale, type Locale } from "@/lib/i18n/config";
import { bundles, courses, type Product } from "@/lib/mock-data";

type PurchasedProduct = {
  productId: string;
  productType: Product["type"] | Uppercase<Product["type"]>;
};

export type UdemyAccessLink = {
  courseId: string;
  title: string;
  url: string;
  couponCode: string;
  validUntil: string;
};

const activeUdemyCoupons: Record<string, { couponCode: string; validUntil: string }> = {
  postman: { couponCode: "CZERWIEC2026", validUntil: "2026-06-30" },
  docker: { couponCode: "DOCKER2026", validUntil: "2026-06-30" },
  python: { couponCode: "PYTHON2026", validUntil: "2026-06-30" },
  sql: { couponCode: "SQL2026", validUntil: "2026-06-30" },
  javascript: { couponCode: "JS2026", validUntil: "2026-06-30" },
  ai: { couponCode: "AI2026", validUntil: "2026-06-30" },
  api: { couponCode: "API2026", validUntil: "2026-06-30" },
  aws: { couponCode: "AWS2026", validUntil: "2026-06-30" },
  cicd: { couponCode: "CICD2026", validUntil: "2026-06-30" },
  typescript: { couponCode: "TS2026", validUntil: "2026-06-30" }
};

export function getUdemyAccessLinks(purchasedProducts: PurchasedProduct[], localeValue: string): UdemyAccessLink[] {
  const locale: Locale = isLocale(localeValue) ? localeValue : "pl";
  const courseIds = new Set<string>();

  for (const product of purchasedProducts) {
    const productType = product.productType.toLowerCase();

    if (productType === "course") {
      courseIds.add(product.productId);
    }

    if (productType === "bundle") {
      const bundle = bundles.find((item) => item.id === product.productId);
      bundle?.courseIds.forEach((courseId) => courseIds.add(courseId));
    }
  }

  return Array.from(courseIds)
    .map((courseId) => {
      const course = courses.find((item) => item.id === courseId);
      const coupon = activeUdemyCoupons[courseId];

      if (!course || !coupon) return null;

      return {
        courseId,
        title: course.title[locale],
        url: `https://www.udemy.com/course/${course.slug[locale]}/?couponCode=${coupon.couponCode}`,
        couponCode: coupon.couponCode,
        validUntil: coupon.validUntil
      };
    })
    .filter((item): item is UdemyAccessLink => Boolean(item));
}
