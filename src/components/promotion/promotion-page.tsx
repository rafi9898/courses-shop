"use client";

import "./promotion-page.css";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ShoppingCart,
  Star,
  Check,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { useNotification } from "@/components/ui/notification";
import { type Category, type Course } from "@/lib/mock-data";
import { formatPrice, type Locale } from "@/lib/i18n/config";
import { type Dictionary } from "@/lib/i18n/dictionaries";
import { getCoursePath } from "@/lib/routes";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 8;

/* ─── search helpers ─────────────────────────────────────────────── */

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .trim();
}

function matchesCourse(course: Course, locale: Locale, catLabel: string, q: string) {
  const h = normalize([course.title[locale], catLabel, course.thumbnail.title].join(" "));
  return h.includes(q);
}

/* ─── countdown ──────────────────────────────────────────────────── */

function getPromoEnd() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1, 0);
  d.setHours(23, 59, 59, 999);
  return d;
}

function calcLeft(end: Date) {
  const diff = Math.max(0, end.getTime() - Date.now());
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60)
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */

export function PromotionPage({
  locale,
  dictionary,
  categories,
  courses
}: {
  locale: Locale;
  dictionary: Dictionary;
  categories: Category[];
  courses: Course[];
}) {
  const [query,      setQuery]   = useState("");
  const [categoryId, setCatId]   = useState("all");
  const [page,       setPage]    = useState(1);
  const resultsRef               = useRef<HTMLDivElement>(null);
  const [promoEnd]               = useState(getPromoEnd);
  const [timeLeft, setTimeLeft]  = useState(calcLeft(promoEnd));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcLeft(promoEnd)), 1000);
    return () => clearInterval(id);
  }, [promoEnd]);

  const catLabels = useMemo(
    () => new Map(categories.map((c) => [c.id, c.label[locale]])),
    [categories, locale]
  );

  const filtered = useMemo(() => {
    const nq = normalize(query);
    return courses.filter((c) => {
      const ok1 = categoryId === "all" || c.categoryId === categoryId;
      const ok2 = !nq || matchesCourse(c, locale, catLabels.get(c.categoryId) ?? "", nq);
      return ok1 && ok2;
    });
  }, [categoryId, catLabels, courses, locale, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => { setPage(1); }, [categoryId, query]);
  useEffect(() => { setPage((p) => Math.min(p, totalPages)); }, [totalPages]);

  const changePage = useCallback((next: number) => {
    if (next === page) return;
    setPage(next);
    requestAnimationFrame(() =>
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  }, [page]);

  return (
    <div className="pp">

      {/* ════════════════════════════════════════════════════════════
          HERO CARD
      ════════════════════════════════════════════════════════════ */}
      <div className="pp-hero-wrap container-shell">
        <section className="pp-hero">

          {/* ── LEFT COLUMN ──────────────────────────────────────── */}
          <div className="pp-hero__left">

            {/* badge */}
            <span className="pp-hero__badge">
              🔥 PROMOCJA
            </span>

            {/* headline */}
            <h1 className="pp-hero__title">
              Promocja na<br />
              <span className="pp-hero__title-purple">wszystkie kursy!</span>
            </h1>

            <p className="pp-hero__sub">
              Skorzystaj z niższych cen przez ograniczony czas.
            </p>

            <div className="pp-hero__cta-row">
              <a className="pp-hero__cta" href="#pp-search">Zobacz kursy w promocji</a>
              <span className="pp-hero__cta-note">Promocja obejmuje wszystkie kursy</span>
            </div>

          </div>

          {/* ── RIGHT COLUMN ─────────────────────────────────────── */}
          <div className="pp-hero__right">

            {/* author photo */}
            <div className="pp-hero__photo-wrap">
              <div className="pp-hero__orb" aria-hidden="true" />
              <Image
                src="/images/hero-instructor.png"
                alt="Rafał Podraza"
                width={300}
                height={310}
                className="pp-hero__photo"
                priority
              />

              {/* floating white card — "Niższe ceny" */}
              <div className="pp-hero__badge-card">
                <span className="pp-hero__badge-card-icon">%</span>
                <div>
                  <strong>Niższe ceny</strong>
                  <span>na wszystkie kursy<br />tylko teraz!</span>
                </div>
              </div>
            </div>

          </div>

          <div className="pp-hero__bottom">
            <div className="pp-countdown">
              <p className="pp-countdown__intro"><span>Promocja</span> kończy się za:</p>
              <div className="pp-countdown__units">
                <CountUnit value={pad(timeLeft.days)}    label="DNI" />
                <CountUnit value={pad(timeLeft.hours)}   label="GODZ." />
                <CountUnit value={pad(timeLeft.minutes)} label="MIN." />
                <CountUnit value={pad(timeLeft.seconds)} label="SEK." />
              </div>
            </div>
            <p className="pp-hero__note">Nie przegap okazji!</p>
          </div>
        </section>
      </div>

      {/* ════════════════════════════════════════════════════════════
          SEARCH BAR (standalone row below hero)
      ════════════════════════════════════════════════════════════ */}
      <div id="pp-search" className="pp-search-wrap container-shell">
        <div className="pp-search">
          <label className="pp-search__field">
            <Search className="pp-search__ico" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pp-search__input"
              placeholder="Szukaj kursów, pakietów, technologii..."
            />
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCatId(e.target.value)}
            className="pp-search__select"
            aria-label="Kategoria"
          >
            <option value="all">Wszystkie kategorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.label[locale]}</option>
            ))}
          </select>
          <button
            type="button"
            className="pp-search__btn"
            onClick={() => setPage(1)}
          >
            Szukaj
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          COURSE GRID
      ════════════════════════════════════════════════════════════ */}
      <div className="pp-catalog container-shell" ref={resultsRef}>
        {paginated.length > 0 ? (
          <div className="pp-grid">
            {paginated.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                locale={locale}
                dictionary={dictionary}
                catLabel={catLabels.get(course.categoryId) ?? ""}
              />
            ))}
          </div>
        ) : (
          <div className="pp-empty">
            Nie znaleziono kursów spełniających kryteria wyszukiwania.
          </div>
        )}

        <Pagination page={page} total={totalPages} onChange={changePage} />
      </div>

      {/* ════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════ */}
      <footer className="pp-footer">
        <div className="container-shell">
          <p>© {new Date().getFullYear()} Rafał Podraza. Wszelkie prawa zastrzeżone.</p>
        </div>
      </footer>

    </div>
  );
}

/* ─── CountUnit ──────────────────────────────────────────────────── */

function CountUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="pp-countdown__unit">
      <span className="pp-countdown__num">{value}</span>
      <span className="pp-countdown__lbl">{label}</span>
    </div>
  );
}

/* ─── CourseCard ─────────────────────────────────────────────────── */

function CourseCard({
  course, locale, dictionary, catLabel
}: {
  course: Course;
  locale: Locale;
  dictionary: Dictionary;
  catLabel: string;
}) {
  const href = getCoursePath(course, locale);
  const { addItem, isInCart } = useCart();
  const { showNotification }  = useNotification();
  const inCart = isInCart("course", course.id);

  return (
    <article className="pp-card">
      <Link href={href} className="pp-card__thumb-link" aria-label={course.title[locale]}>
        <div className={cn("pp-card__thumb", `pp-card__thumb--${course.thumbnail.variant}`)}>
          {course.thumbnailImageUrl ? (
            <>
              <Image
                src={course.thumbnailImageUrl}
                alt={course.title[locale]}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                className="pp-card__thumb-img"
                unoptimized={course.thumbnailImageUrl.startsWith("/uploads/")}
              />
              <div className="pp-card__thumb-overlay" />
            </>
          ) : (
            <div className="pp-card__thumb-text">
              <div className="pp-card__thumb-title">{course.thumbnail.title}</div>
              <div className="pp-card__thumb-sub">{course.thumbnail.subtitle}</div>
            </div>
          )}
          {course.isBestseller && (
            <span className="pp-card__badge">Bestseller</span>
          )}
          <div className="pp-card__thumb-grad" />
        </div>
      </Link>

      <div className="pp-card__body">
        <div className="pp-card__cat">{catLabel}</div>
        <h3 className="pp-card__title">
          <Link href={href} className="pp-card__title-a">{course.title[locale]}</Link>
        </h3>
        <div className="pp-card__rating">
          <span className="pp-card__rating-n">{course.rating}</span>
          <span className="pp-card__stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="pp-card__star" />
            ))}
          </span>
          <span className="pp-card__reviews">({course.reviews.toLocaleString("pl-PL")})</span>
        </div>
        <div className="pp-card__footer">
          <div>
            <span className="pp-card__price">{formatPrice(course.price[locale], locale)}</span>
            <span className="pp-card__price-old">{formatPrice(course.regularPrice[locale], locale)}</span>
          </div>
          <button
            type="button"
            className={cn("pp-card__cart", inCart && "pp-card__cart--done")}
            aria-label={inCart ? "W koszyku" : "Dodaj do koszyka"}
            onClick={() => {
              if (!inCart) {
                addItem({ productId: course.id, productType: "course" });
                showNotification(dictionary.cartPage.addedToCart, "success");
              }
            }}
          >
            {inCart ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </article>
  );
}

/* ─── Pagination ─────────────────────────────────────────────────── */

function Pagination({ page, total, onChange }: {
  page: number; total: number; onChange: (p: number) => void;
}) {
  if (total <= 1) return null;

  const items: (number | "…")[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= page - 1 && i <= page + 1)) {
      items.push(i);
    } else if (items[items.length - 1] !== "…") {
      items.push("…");
    }
  }

  return (
    <div className="pp-pag">
      <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)} className="pp-pag__nav" aria-label="Poprzednia">
        <ChevronLeft className="h-4 w-4" />
      </button>
      {items.map((item, i) =>
        item === "…"
          ? <span key={`e${i}`} className="pp-pag__dots">…</span>
          : <button key={item} type="button" onClick={() => onChange(item)}
              className={cn("pp-pag__page", item === page && "pp-pag__page--on")}
              aria-current={item === page ? "page" : undefined}>
              {item}
            </button>
      )}
      <button type="button" disabled={page === total} onClick={() => onChange(page + 1)} className="pp-pag__nav" aria-label="Następna">
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
