import { isLocale, type Locale } from "@/lib/i18n/config";
import { bundles, courses, type Product } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";

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

export async function getUdemyAccessLinks(purchasedProducts: PurchasedProduct[], localeValue: string): Promise<UdemyAccessLink[]> {
  const locale: Locale = isLocale(localeValue) ? localeValue : "pl";
  const courseIds = getPurchasedCourseIds(purchasedProducts);
  const now = new Date();

  try {
    const coupons = await prisma.udemyCoupon.findMany({
      where: {
        courseId: {
          in: Array.from(courseIds)
        },
        locale,
        isActive: true,
        validUntil: {
          gte: now
        }
      },
      orderBy: [{ validUntil: "desc" }, { updatedAt: "desc" }]
    });

    const couponByCourseId = new Map<string, (typeof coupons)[number]>();
    coupons.forEach((coupon) => {
      if (!couponByCourseId.has(coupon.courseId)) {
        couponByCourseId.set(coupon.courseId, coupon);
      }
    });

    return Array.from(courseIds)
      .map((courseId) => {
        const course = courses.find((item) => item.id === courseId);
        const coupon = couponByCourseId.get(courseId);

        if (!course || !coupon) return null;

        return {
          courseId,
          title: coupon.courseTitle || course.title[locale],
          url: createUdemyCouponUrl(coupon.udemyUrl, coupon.couponCode),
          couponCode: coupon.couponCode,
          validUntil: coupon.validUntil.toISOString()
        };
      })
      .filter((item): item is UdemyAccessLink => Boolean(item));
  } catch {
    return getStaticUdemyAccessLinks(courseIds, locale);
  }
}

function getPurchasedCourseIds(purchasedProducts: PurchasedProduct[]) {
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

  return courseIds;
}

function getStaticUdemyAccessLinks(courseIds: Set<string>, locale: Locale) {
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

function createUdemyCouponUrl(udemyUrl: string, couponCode: string) {
  const url = new URL(udemyUrl);
  url.searchParams.set("couponCode", couponCode);
  return url.toString();
}
