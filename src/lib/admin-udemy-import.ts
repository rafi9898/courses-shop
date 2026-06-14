import { randomInt } from "node:crypto";
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

const udemyCouponCodePattern = /^[A-Z0-9._-]{6,20}$/;
const generatedCouponAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const udemyCsvHeaders = ["course_id", "coupon_type", "coupon_code", "start_date", "start_time", "custom_price"] as const;

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

    if (resolvedRows.rejected?.length) {
      rejected.push(...resolvedRows.rejected);
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

      await prisma.$transaction([
        ...(row.isActive
          ? [
              prisma.udemyCoupon.updateMany({
                where: {
                  courseId: row.courseId,
                  locale: row.locale,
                  isActive: true,
                  couponCode: {
                    not: row.couponCode
                  }
                },
                data: {
                  isActive: false
                }
              })
            ]
          : []),
        prisma.udemyCoupon.upsert({
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
        })
      ]);

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

export async function generateUdemyCouponsCsv() {
  const [startDate, courses] = await Promise.all([
    getDatabaseMonthStartDate(),
    prisma.course.findMany({
      where: {
        isActive: true,
        udemyCourseId: {
          not: null
        },
        udemyUrl: {
          not: null
        }
      },
      select: {
        id: true,
        locale: true,
        udemyCourseId: true,
        udemyUrl: true
      },
      orderBy: [{ udemyCourseId: "asc" }, { locale: "asc" }, { id: "asc" }]
    })
  ]);
  const usedCouponCodes = new Set<string>();
  const rows = courses
    .filter((course) => course.udemyUrl && isValidUrl(course.udemyUrl))
    .map((course) => course.udemyCourseId?.trim())
    .filter((courseId): courseId is string => Boolean(courseId))
    .map((courseId) => [courseId, "free_targeted", generateUniqueCouponCode(usedCouponCodes), startDate, "00:00", ""]);
  const csv = [udemyCsvHeaders, ...rows].map((row) => row.map(escapeCsvCell).join(",")).join("\n");

  return {
    csv: `${csv}\n`,
    fileName: `udemy-coupons-${startDate}.csv`
  };
}

async function resolveCouponRows(
  rawRow: RawCouponRow
): Promise<{ rows: ParsedCouponRow[]; rejected?: UdemyImportResult["rejected"] } | { reason: string; missingUdemyCourseId?: string }> {
  const row = rawRow.row;
  const courseId = row.courseid;
  const couponCode = row.couponcode;
  const validUntil = parseValidUntil(row);

  if (!courseId) return { reason: "Brakuje course_id / courseId." };
  if (!couponCode) return { reason: "Brakuje coupon_code / couponCode." };
  if (!isValidCouponCode(couponCode)) {
    return { reason: "Kod musi mieć 6-20 znaków i zawierać tylko A-Z, 0-9, kropkę, myślnik albo podkreślenie." };
  }
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
  const rejected: UdemyImportResult["rejected"] = [];

  for (const course of courses) {
    if (!isLocale(course.locale)) {
      rejected.push({ rowNumber: rawRow.rowNumber, reason: `Kurs ${course.title} ma nieprawidłowy locale ${course.locale}.` });
      continue;
    }

    if (!course.udemyUrl || !isValidUrl(course.udemyUrl)) {
      rejected.push({ rowNumber: rawRow.rowNumber, reason: `Kurs ${course.title} nie ma poprawnego URL Udemy.` });
      continue;
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

  if (rows.length === 0) {
    return { reason: rejected[0]?.reason ?? `Nie znaleziono aktywnego kursu gotowego do importu z Udemy Course ID ${courseId}.` };
  }

  return { rows, rejected };
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
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = new Date(`${value}T23:59:59.000Z`);
  return Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value ? null : parsed;
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

function isValidCouponCode(value: string) {
  return udemyCouponCodePattern.test(value);
}

function generateUniqueCouponCode(usedCouponCodes: Set<string>) {
  let code = generateCouponCode();

  while (usedCouponCodes.has(code)) {
    code = generateCouponCode();
  }

  usedCouponCodes.add(code);

  return code;
}

function generateCouponCode() {
  let code = "";

  for (let index = 0; index < 20; index += 1) {
    code += generatedCouponAlphabet[randomInt(generatedCouponAlphabet.length)];
  }

  return code;
}

async function getDatabaseMonthStartDate() {
  const [row] = await prisma.$queryRaw<Array<{ startDate: string }>>`SELECT to_char(date_trunc('month', CURRENT_DATE), 'YYYY-MM-DD') AS "startDate"`;

  return row?.startDate ?? new Date().toISOString().slice(0, 8).concat("01");
}

function escapeCsvCell(value: string) {
  if (!/[",\n\r]/.test(value)) return value;

  return `"${value.replaceAll("\"", "\"\"")}"`;
}

export function isPrismaUniqueError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}
