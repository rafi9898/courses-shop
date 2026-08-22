"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { type Locale } from "@/lib/i18n/config";

export async function updatePromoBannerAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }

  const locale = formData.get("locale") as Locale;
  const isActive = formData.get("isActive") === "on";
  const text = formData.get("text") as string;
  const buttonText = formData.get("buttonText") as string;
  const buttonUrl = formData.get("buttonUrl") as string;

  if (!locale) {
    throw new Error("Locale is required");
  }

  await prisma.promoBanner.upsert({
    where: { locale },
    update: {
      isActive,
      text,
      buttonText,
      buttonUrl
    },
    create: {
      locale,
      isActive,
      text,
      buttonText,
      buttonUrl
    }
  });

  revalidatePath("/", "layout");
}
