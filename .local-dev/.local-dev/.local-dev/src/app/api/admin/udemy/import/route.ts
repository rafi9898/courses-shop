import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { generateUdemyCouponsCsv, importUdemyCouponsFromCsv } from "@/lib/admin-udemy-import";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const exportFile = await generateUdemyCouponsCsv();

    return new NextResponse(exportFile.csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${exportFile.fileName}"`,
        "Cache-Control": "no-store"
      }
    });
  } catch {
    return NextResponse.json({ error: "Udemy coupon export failed." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { csv?: string } | null;

  if (!body?.csv?.trim()) {
    return NextResponse.json({ error: "CSV content is required." }, { status: 400 });
  }

  try {
    return NextResponse.json(await importUdemyCouponsFromCsv(body.csv));
  } catch {
    return NextResponse.json({ error: "Udemy coupon import failed." }, { status: 503 });
  }
}
