import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { sendOrderAccessEmail } from "@/lib/email/order-access-email";

export async function POST(
  _request: Request,
  {
    params
  }: {
    params: Promise<{ orderId: string }>;
  }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { orderId } = await params;

  try {
    await sendOrderAccessEmail(orderId, { force: true });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Order access e-mail resend failed."
      },
      { status: 503 }
    );
  }
}
