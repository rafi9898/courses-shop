import { Star } from "lucide-react";
import Link from "next/link";
import { AddToCartButton } from "@/components/commerce/add-to-cart-button";
import { Thumbnail } from "@/components/commerce/product-card";
import { type Bundle, type Category } from "@/lib/mock-data";
import { formatPrice, type Locale } from "@/lib/i18n/config";
import { type Dictionary } from "@/lib/i18n/dictionaries";
import { getBundlePath } from "@/lib/routes";

export function BundleCard({
  bundle,
  locale,
  dictionary,
  categories = []
}: {
  bundle: Bundle;
  locale: Locale;
  dictionary: Dictionary;
  categories?: Category[];
}) {
  const category = categories.find((item) => item.id === bundle.categoryId);
  const href = getBundlePath(bundle, locale);

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-white shadow-[0_10px_26px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card">
      <Link href={href} aria-label={bundle.title[locale]}>
        <Thumbnail
          title={bundle.thumbnail.title}
          subtitle={bundle.thumbnail.subtitle}
          variant={bundle.thumbnail.variant}
          hideText
          imageUrl={bundle.thumbnailImageUrl}
          showFavorite={false}
          imageFit="contain"
        />
      </Link>
      <div className="p-5">
        <h3 className="text-xl font-black">
          <Link href={href} className="hover:text-primary">
            {bundle.title[locale]}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{category?.label[locale]}</p>
        <div className="mt-3 flex items-center gap-1 text-xs">
          <span className="font-bold">{bundle.rating}</span>
          <span className="flex text-warning">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-3.5 w-3.5 fill-current" />
            ))}
          </span>
          <span className="text-muted-foreground">({bundle.reviews})</span>
        </div>
        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <span className="text-xl font-black">{formatPrice(bundle.price[locale], locale)}</span>
            <span className="ml-2 text-sm text-muted-foreground line-through">
              {formatPrice(bundle.regularPrice[locale], locale)}
            </span>
          </div>
          <AddToCartButton product={bundle} dictionary={dictionary} iconOnly />
        </div>
      </div>
    </article>
  );
}
