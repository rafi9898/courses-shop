import { Star } from "lucide-react";
import { reviews } from "@/lib/mock-data";
import { type Locale } from "@/lib/i18n/config";
import { type Dictionary } from "@/lib/i18n/dictionaries";

export function ReviewsSection({
  locale,
  dictionary
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="container-shell">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{dictionary.home.reviewsEyebrow}</p>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl">{dictionary.home.reviewsTitle}</h2>
          <p className="mt-4 text-base italic text-slate-500">{dictionary.home.reviewsDisclaimer}</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {reviews.map((review) => (
            <article key={review.name} className="rounded-xl border border-border bg-white p-6 shadow-[0_10px_26px_rgba(15,23,42,0.05)]">
              <div className="flex text-warning">
                {Array.from({ length: review.rating }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">{review.text[locale]}</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft text-sm font-black text-primary">
                  {review.name.slice(0, 1)}
                </div>
                <div className="font-bold">{review.name}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
