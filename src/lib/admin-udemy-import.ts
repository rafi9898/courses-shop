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
  rejected: Array<{
    rowNumber: number;
    reason: string;
  }>;
};

export async function importUdemyCouponsFromCsv(csv: string): Promise<UdemyImportResult> {
  const parsed = parseUdemyCouponCsv(csv);
  let created = 0;
  let updated = 0;

  for (const row of parsed.validRows) {
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

  return {
    totalRows: parsed.totalRows,
    created,
    updated,
    rejected: parsed.rejected
  };
}

function parseUdemyCouponCsv(csv: string) {
  const rows = parseCsv(csv, detectDelimiter(csv));
  const [headerRow, ...dataRows] = rows;
  const rejected: UdemyImportResult["rejected"] = [];
  const validRows: ParsedCouponRow[] = [];

  if (!headerRow) {
    return {
      totalRows: 0,
      validRows,
      rejected: [{ rowNumber: 1, reason: "Plik CSV jest pusty." }]
    };
  }

  const headers = headerRow.map(normalizeHeader);
  const requiredHeaders = ["courseid", "udemyurl", "couponcode", "validuntil"];
  const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));

  if (missingHeaders.length > 0) {
    return {
      totalRows: dataRows.length,
      validRows,
      rejected: [{ rowNumber: 1, reason: `Brakuje kolumn: ${missingHeaders.join(", ")}.` }]
    };
  }

  dataRows.forEach((cells, index) => {
    const rowNumber = index + 2;
    const row = Object.fromEntries(headers.map((header, cellIndex) => [header, cells[cellIndex]?.trim() ?? ""]));
    const courseId = row.courseid;
    const locale = row.locale || "pl";
    const udemyUrl = row.udemyurl;
    const couponCode = row.couponcode;
    const validUntil = parseDate(row.validuntil);

    if (!courseId) {
      rejected.push({ rowNumber, reason: "Brakuje courseId." });
      return;
    }

    if (!isLocale(locale)) {
      rejected.push({ rowNumber, reason: "Nieprawidłowy locale. Użyj pl, de albo en." });
      return;
    }

    if (!isValidUrl(udemyUrl)) {
      rejected.push({ rowNumber, reason: "Nieprawidłowy udemyUrl." });
      return;
    }

    if (!couponCode) {
      rejected.push({ rowNumber, reason: "Brakuje couponCode." });
      return;
    }

    if (!validUntil) {
      rejected.push({ rowNumber, reason: "Nieprawidłowa data validUntil. Użyj formatu YYYY-MM-DD." });
      return;
    }

    validRows.push({
      rowNumber,
      courseId,
      locale,
      courseTitle: row.coursetitle || null,
      udemyUrl,
      couponCode,
      validUntil,
      isActive: parseBoolean(row.isactive)
    });
  });

  return {
    totalRows: dataRows.length,
    validRows,
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

function parseDate(value: string) {
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
