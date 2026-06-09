import { Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/commerce/add-to-cart-button";
import { type Category, type Course } from "@/lib/mock-data";
import { formatPrice, type Locale } from "@/lib/i18n/config";
import { type Dictionary } from "@/lib/i18n/dictionaries";
import { getCoursePath } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function ProductCard({
  course,
  locale,
  dictionary,
  categories = []
}: {
  course: Course;
  locale: Locale;
  dictionary: Dictionary;
  categories?: Category[];
}) {
  const category = categories.find((item) => item.id === course.categoryId);
  const href = getCoursePath(course, locale);

  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-white shadow-[0_10px_26px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card">
      <Link href={href} aria-label={course.title[locale]}>
        <Thumbnail
          title={course.thumbnail.title}
          subtitle={course.thumbnail.subtitle}
          variant={course.thumbnail.variant}
          imageUrl={course.thumbnailImageUrl}
          showFavorite={false}
        />
      </Link>
      <div className="p-4">
        <div className="text-xs font-medium text-muted-foreground">{category?.label[locale]}</div>
        <h3 className="mt-2 min-h-10 text-base font-black leading-5">
          <Link href={href} className="hover:text-primary">
            {course.title[locale]}
          </Link>
        </h3>
        <div className="mt-3 flex items-center gap-1 text-xs">
          <span className="font-bold">{course.rating}</span>
          <span className="flex text-warning">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-3.5 w-3.5 fill-current" />
            ))}
          </span>
          <span className="text-muted-foreground">({course.reviews})</span>
        </div>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <span className="text-lg font-black">{formatPrice(course.price[locale], locale)}</span>
            <span className="ml-2 text-xs text-muted-foreground line-through">
              {formatPrice(course.regularPrice[locale], locale)}
            </span>
          </div>
          <AddToCartButton product={course} dictionary={dictionary} iconOnly />
        </div>
      </div>
    </article>
  );
}

export function Thumbnail({
  title,
  subtitle,
  variant,
  badge,
  hideText = false,
  imageUrl,
  showFavorite = true
}: {
  title: string;
  subtitle: string;
  variant: "dark" | "blue" | "purple" | "green";
  badge?: string;
  hideText?: boolean;
  imageUrl?: string | null;
  showFavorite?: boolean;
}) {
  const isUploadedImage = imageUrl?.startsWith("/uploads/");

  return (
    <div
      className={cn(
        "relative aspect-[16/9] overflow-hidden p-5 text-white",
        variant === "dark" && "bg-[radial-gradient(circle_at_78%_45%,#ff5a2f_0_15%,transparent_16%),linear-gradient(135deg,#07111f,#111827)]",
        variant === "blue" && "bg-[linear-gradient(135deg,#073b75,#0f67b3)]",
        variant === "purple" && "bg-[linear-gradient(135deg,#24106f,#6d3df2)]",
        variant === "green" && "bg-[linear-gradient(135deg,#064e3b,#059669)]"
      )}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
          unoptimized={isUploadedImage}
        />
      ) : null}
      {imageUrl ? <div className="absolute inset-0 bg-black/12" /> : null}
      {!badge && showFavorite ? (
        <button
          type="button"
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg bg-white/20 text-white backdrop-blur transition hover:bg-white/30"
          aria-label="Add to favorites"
        >
          <Heart className="h-4 w-4" />
        </button>
      ) : null}
      {badge ? (
        <div className="absolute inset-x-3 top-3 z-10 flex justify-end">
          <span className="inline-flex max-w-full whitespace-nowrap rounded-md bg-white px-2.5 py-1.5 text-xs font-black leading-none text-foreground shadow-sm">
            {badge}
          </span>
        </div>
      ) : null}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />
      {!imageUrl && !hideText ? (
        <div className="relative z-10 flex h-full flex-col justify-end">
          <div className="text-2xl font-black tracking-normal">{title}</div>
          <div className="mt-1 text-xs font-black uppercase text-warning">{subtitle}</div>
        </div>
      ) : null}
    </div>
  );
}
