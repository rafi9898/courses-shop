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
  const now = new Date();

  try {
    const courseIds = await getPurchasedCourseIds(purchasedProducts, locale);
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
    const courseRecords = await prisma.course.findMany({
      where: {
        id: {
          in: Array.from(courseIds)
        },
        locale
      },
      select: {
        id: true,
        title: true
      }
    });
    const courseById = new Map(courseRecords.map((course) => [course.id, course]));

    const couponByCourseId = new Map<string, (typeof coupons)[number]>();
    coupons.forEach((coupon) => {
      if (!couponByCourseId.has(coupon.courseId)) {
        couponByCourseId.set(coupon.courseId, coupon);
      }
    });

    return Array.from(courseIds)
      .map((courseId) => {
        const course = courseById.get(courseId);
        const coupon = couponByCourseId.get(courseId);

        if (!coupon) return null;

        return {
          courseId,
          title: coupon.courseTitle || course?.title || courseId,
          url: createUdemyCouponUrl(coupon.udemyUrl, coupon.couponCode),
          couponCode: coupon.couponCode,
          validUntil: coupon.validUntil.toISOString()
        };
      })
      .filter((item): item is UdemyAccessLink => Boolean(item));
  } catch {
    return getStaticUdemyAccessLinks(getStaticPurchasedCourseIds(purchasedProducts), locale);
  }
}

async function getPurchasedCourseIds(purchasedProducts: PurchasedProduct[], locale: Locale) {
  const courseIds = new Set<string>();
  const bundleIds = new Set<string>();

  for (const product of purchasedProducts) {
    const productType = product.productType.toLowerCase();

    if (productType === "course") {
      courseIds.add(product.productId);
    }

    if (productType === "bundle") {
      bundleIds.add(product.productId);
    }
  }

  if (bundleIds.size > 0) {
    const dbBundles = await prisma.bundle.findMany({
      where: {
        id: {
          in: Array.from(bundleIds)
        },
        locale
      },
      include: {
        courses: {
          select: {
            courseId: true
          }
        }
      }
    });

    dbBundles.forEach((bundle) => {
      bundle.courses.forEach((course) => courseIds.add(course.courseId));
    });
  }

  return courseIds;
}

function getStaticPurchasedCourseIds(purchasedProducts: PurchasedProduct[]) {
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
