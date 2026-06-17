import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" }
    });

    const csvRows = [
      ["Email", "Locale", "Discount Code", "Created At"].join(",")
    ];

    for (const sub of subscribers) {
      csvRows.push(
        [
          sub.email,
          sub.locale,
          sub.discountCode || "",
          sub.createdAt.toISOString()
        ].join(",")
      );
    }

    const csvString = csvRows.join("\n");

    return new NextResponse(csvString, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="newsletter_subscribers_${new Date().toISOString().slice(0, 10)}.csv"`
      }
    });
  } catch (error) {
    console.error("Newsletter export error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
