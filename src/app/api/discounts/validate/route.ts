import { NextResponse } from "next/server";
import { getDiscountCodeByCode } from "@/lib/discount-code-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ discount: null });
  }

  const discount = await getDiscountCodeByCode(code);
  return NextResponse.json({ discount });
}
