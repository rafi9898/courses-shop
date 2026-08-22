import { NextResponse, type NextRequest } from "next/server";
import { getDiscountCodeByCode } from "@/lib/discount-code-data";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ discount: null });
  }

  const discount = await getDiscountCodeByCode(code);
  return NextResponse.json({ discount });
}
