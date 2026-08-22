import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { type Locale } from "@/lib/i18n/config";

export async function PromoBanner({ locale }: { locale: Locale }) {
  let banner = null;
  try {
    banner = await prisma.promoBanner.findUnique({
      where: { locale }
    });
  } catch (error) {
    console.error("Failed to fetch PromoBanner (this is expected during CI builds without DB):", error);
  }

  if (!banner?.isActive) {
    return null;
  }

  return (
    <div className="bg-primary px-4 py-3 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-6">
        <p className="flex items-center gap-2 text-sm font-semibold sm:text-base">
          {banner.text}
        </p>
        
        {banner.buttonText && banner.buttonUrl && (
          <Link
            href={banner.buttonUrl}
            className="group flex flex-none items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-bold text-primary transition hover:bg-white/90"
          >
            {banner.buttonText}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
