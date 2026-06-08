import { Prisma } from "@prisma/client";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";

type ParsedCouponRow = {
  rowNumber: number;
  courseId: string;
  locale: Locale;
  courseTitle: string | null;
  udemyUrl: string;
  couponCode: string;
  validUntil: Date;
  isActive: boolean;
};

export type UdemyImportResult = {
  totalRows: number;
  created: number;
  updated: number;
  missingUdemyCourseIds: string[];
  rejected: Array<{
    rowNumber: number;
    reason: string;
  }>;
};

export async function importUdemyCouponsFromCsv(csv: string): Promise<UdemyImportResult> {
  const parsed = parseUdemyCouponCsv(csv);
  let created = 0;
  let updated = 0;
  const rejected = [...parsed.rejected];
  const missingUdemyCourseIds = new Set<string>();

  for (const rawRow of parsed.rawRows) {
    const resolvedRows = await resolveCouponRows(rawRow);

    if ("reason" in resolvedRows) {
      rejected.push({ rowNumber: rawRow.rowNumber, reason: resolvedRows.reason });
      if (resolvedRows.missingUdemyCourseId) {
        missingUdemyCourseIds.add(resolvedRows.missingUdemyCourseId);
      }
      continue;
    }

    for (const row of resolvedRows.rows) {
      const existing = await prisma.udemyCoupon.findUnique({
        where: {
          courseId_locale_couponCode: {
            courseId: row.courseId,
            locale: row.locale,
            couponCode: row.couponCode
          }
        },
        select: {
          id: true
        }
      });

      await prisma.udemyCoupon.upsert({
        where: {
          courseId_locale_couponCode: {
            courseId: row.courseId,
            locale: row.locale,
            couponCode: row.couponCode
          }
        },
        update: {
          courseTitle: row.courseTitle,
          udemyUrl: row.udemyUrl,
          validUntil: row.validUntil,
          isActive: row.isActive
        },
        create: {
          courseId: row.courseId,
          locale: row.locale,
          courseTitle: row.courseTitle,
          udemyUrl: row.udemyUrl,
          couponCode: row.couponCode,
          validUntil: row.validUntil,
          isActive: row.isActive
        }
      });

      if (existing) {
        updated += 1;
      } else {
        created += 1;
      }
    }
  }

  return {
    totalRows: parsed.totalRows,
    created,
    updated,
    missingUdemyCourseIds: Array.from(missingUdemyCourseIds).sort(),
    rejected
  };
}

async function resolveCouponRows(rawRow: RawCouponRow): Promise<{ rows: ParsedCouponRow[] } | { reason: string; missingUdemyCourseId?: string }> {
  const row = rawRow.row;
  const courseId = row.courseid;
  const couponCode = row.couponcode;
  const validUntil = parseValidUntil(row);

  if (!courseId) return { reason: "Brakuje course_id / courseId." };
  if (!couponCode) return { reason: "Brakuje coupon_code / couponCode." };
  if (!validUntil) return { reason: "Nieprawidłowa data. Użyj validUntil albo start_date w formacie YYYY-MM-DD." };

  if (row.udemyurl) {
    const locale = row.locale || "pl";

    if (!isLocale(locale)) return { reason: "Nieprawidłowy locale. Użyj pl, de albo en." };
    if (!isValidUrl(row.udemyurl)) return { reason: "Nieprawidłowy udemyUrl." };

    return {
      rows: [
        {
          rowNumber: rawRow.rowNumber,
          courseId,
          locale,
          courseTitle: row.coursetitle || null,
          udemyUrl: row.udemyurl,
          couponCode,
          validUntil,
          isActive: parseBoolean(row.isactive)
        }
      ]
    };
  }

  const courses = await prisma.course.findMany({
    where: {
      udemyCourseId: courseId,
      isActive: true
    },
    select: {
      id: true,
      locale: true,
      title: true,
      udemyUrl: true
    }
  });

  if (courses.length === 0) {
    return {
      reason: `Nie znaleziono aktywnego kursu z Udemy Course ID ${courseId}.`,
      missingUdemyCourseId: courseId
    };
  }

  const rows: ParsedCouponRow[] = [];

  for (const course of courses) {
    if (!isLocale(course.locale)) {
      return { reason: `Kurs ${course.title} ma nieprawidłowy locale ${course.locale}.` };
    }

    if (!course.udemyUrl || !isValidUrl(course.udemyUrl)) {
      return { reason: `Kurs ${course.title} nie ma poprawnego URL Udemy.` };
    }

    rows.push({
      rowNumber: rawRow.rowNumber,
      courseId: course.id,
      locale: course.locale,
      courseTitle: course.title,
      udemyUrl: course.udemyUrl,
      couponCode,
      validUntil,
      isActive: parseBoolean(row.isactive)
    });
  }

  return { rows };
}

type RawCouponRow = {
  rowNumber: number;
  row: Record<string, string>;
};

function parseUdemyCouponCsv(csv: string): {
  totalRows: number;
  rawRows: RawCouponRow[];
  rejected: UdemyImportResult["rejected"];
} {
  const rows = parseCsv(csv, detectDelimiter(csv));
  const [headerRow, ...dataRows] = rows;
  const rejected: UdemyImportResult["rejected"] = [];
  const rawRows: RawCouponRow[] = [];

  if (!headerRow) {
    return {
      totalRows: 0,
      rawRows,
      rejected: [{ rowNumber: 1, reason: "Plik CSV jest pusty." }]
    };
  }

  const headers = headerRow.map(normalizeHeader);
  const requiredHeaders = ["courseid", "couponcode"];
  const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));

  if (missingHeaders.length > 0) {
    return {
      totalRows: dataRows.length,
      rawRows,
      rejected: [{ rowNumber: 1, reason: `Brakuje kolumn: ${missingHeaders.join(", ")}.` }]
    };
  }

  dataRows.forEach((cells, index) => {
    const rowNumber = index + 2;
    const row = Object.fromEntries(headers.map((header, cellIndex) => [header, cells[cellIndex]?.trim() ?? ""]));
    rawRows.push({ rowNumber, row });
  });

  return {
    totalRows: dataRows.length,
    rawRows,
    rejected
  };
}

function parseCsv(csv: string, delimiter: "," | ";") {
  const rows: string[][] = [];
  let currentCell = "";
  let currentRow: string[] = [];
  let inQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const nextChar = csv[index + 1];

    if (char === "\"" && inQuotes && nextChar === "\"") {
      currentCell += "\"";
      index += 1;
      continue;
    }

    if (char === "\"") {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === delimiter && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") index += 1;
      currentRow.push(currentCell);
      if (currentRow.some((cell) => cell.trim())) rows.push(currentRow);
      currentRow = [];
      currentCell = "";
      continue;
    }

    currentCell += char;
  }

  currentRow.push(currentCell);
  if (currentRow.some((cell) => cell.trim())) rows.push(currentRow);

  return rows;
}

function detectDelimiter(csv: string): "," | ";" {
  const firstLine = csv.split(/\r?\n/, 1)[0] ?? "";
  const commaCount = (firstLine.match(/,/g) ?? []).length;
  const semicolonCount = (firstLine.match(/;/g) ?? []).length;

  return semicolonCount > commaCount ? ";" : ",";
}

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replaceAll("_", "");
}

function parseValidUntil(row: Record<string, string>) {
  const explicitValidUntil = parseDate(row.validuntil);
  if (explicitValidUntil) return explicitValidUntil;

  const startDate = parseDate(row.startdate);
  if (!startDate) return null;

  const startTime = row.starttime || "00:00";
  const [hours = "0", minutes = "0"] = startTime.split(":");
  const validUntil = new Date(startDate);
  validUntil.setUTCHours(Number(hours) || 0, Number(minutes) || 0, 0, 0);
  validUntil.setUTCDate(validUntil.getUTCDate() + 31);
  validUntil.setUTCHours(23, 59, 59, 999);

  return validUntil;
}

function parseDate(value: string) {
  if (!value) return null;
  const parsed = new Date(`${value}T23:59:59.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseBoolean(value: string) {
  if (!value) return true;
  return ["1", "true", "yes", "tak", "active", "aktywny"].includes(value.trim().toLowerCase());
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function isPrismaUniqueError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}
