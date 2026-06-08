# Courses Shop

Minimalistyczny, wielojęzyczny sklep z kursami online Rafała Podrazy. Aplikacja sprzedaje dostęp do kursów i pakietów, obsługuje kody rabatowe, zamówienia, linki Udemy, faktury PDF oraz prosty panel administracyjny do zarządzania katalogiem.

## Stack

- Next.js 15 z App Routerem
- React 19
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Stripe Checkout
- Resend
- PDFKit
- lucide-react

## Najważniejsze funkcje

- Publiczny katalog kursów, pakietów i kategorii.
- Trzy wersje językowe: `pl`, `de`, `en`.
- Automatyczne przekierowanie z `/` na język z nagłówka `Accept-Language`; jeśli język nie jest obsługiwany, fallback to `/en`.
- Dedykowana strona 404 z lokalizowanymi treściami.
- Koszyk i checkout przez Stripe.
- Obsługa kodów rabatowych.
- Prywatne linki dostępu do zamówień.
- Linki i kupony Udemy przypisane do kursów.
- Faktury PDF.
- Panel admina do katalogu, kuponów Udemy, rabatów i zamówień.

## Wymagania

- Node.js zgodny z Next.js 15
- npm
- Docker, jeśli baza lokalna ma działać z `docker compose`
- PostgreSQL 16 lub kompatybilny

## Szybki start

```bash
npm install
npm run db:up
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Domyślny adres lokalny:

```text
http://localhost:3000
```

Jeśli port `3000` jest zajęty, Next.js uruchomi aplikację na kolejnym wolnym porcie.

## Konfiguracja środowiska

Utwórz plik `.env` w katalogu głównym projektu. Minimalna lokalna konfiguracja bazy dla `docker-compose.yml`:

```env
DATABASE_URL="postgresql://courses_shop:courses_shop@localhost:5432/courses_shop?schema=public"
```

Zmienne używane przez aplikację:

```env
DATABASE_URL=""

ADMIN_USERNAME=""
ADMIN_PASSWORD=""

STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

NEXT_PUBLIC_APP_URL=""
NEXT_PUBLIC_SITE_URL=""
SITE_URL=""

RESEND_API_KEY=""
EMAIL_FROM=""

SELLER_NAME=""
SELLER_ADDRESS=""
SELLER_TAX_ID=""

INVOICE_FONT_REGULAR_PATH=""
INVOICE_FONT_BOLD_PATH=""
```

Uwagi:

- `DATABASE_URL` jest wymagana przez Prisma.
- `ADMIN_USERNAME` i `ADMIN_PASSWORD` włączają logowanie do panelu admina.
- `STRIPE_SECRET_KEY` jest wymagany do tworzenia sesji checkout.
- `STRIPE_WEBHOOK_SECRET` jest wymagany do obsługi webhooków Stripe.
- `RESEND_API_KEY` i `EMAIL_FROM` są potrzebne do wysyłki maili z dostępem.
- `NEXT_PUBLIC_APP_URL` jest używany do budowania adresów absolutnych, np. w mailach i Stripe.
- Pliki `.env*` nie powinny trafiać do repozytorium.

## Skrypty

```bash
npm run dev
```

Uruchamia aplikację w trybie developerskim.

```bash
npm run build
```

Buduje aplikację produkcyjnie. Jeśli lokalna baza PostgreSQL nie działa, w logach mogą pojawić się błędy Prismy o `localhost:5432`; część publicznych danych ma fallback, ale produkcyjnie baza powinna być dostępna.

```bash
npm run lint
```

Uruchamia ESLint.

```bash
npm run typecheck
```

Uruchamia TypeScript bez emitowania plików.

```bash
npm run db:up
npm run db:down
```

Uruchamia lub zatrzymuje lokalnego Postgresa z Dockera.

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

Generuje klienta Prisma, wykonuje migracje developerskie i seeduje dane.

## Struktura projektu

```text
src/app
  App Router, strony publiczne, panel admina i API routes

src/components
  Komponenty UI, publiczne sekcje, katalog, koszyk, checkout, admin

src/lib
  Dane katalogu, i18n, Prisma, zamówienia, rabaty, faktury, Stripe, Udemy

prisma
  Schema, migracje i seed

public
  Statyczne obrazy i uploady miniaturek
```

## Główne ścieżki publiczne

Polski:

- `/pl`
- `/pl/kursy`
- `/pl/pakiety`
- `/pl/kategorie`
- `/pl/o-mnie`
- `/pl/faq`
- `/pl/koszyk`

Niemiecki:

- `/de`
- `/de/kurse`
- `/de/pakete`
- `/de/kategorien`
- `/de/uber-mich`
- `/de/faq`
- `/de/warenkorb`

Angielski:

- `/en`
- `/en/courses`
- `/en/bundles`
- `/en/categories`
- `/en/about`
- `/en/faq`
- `/en/cart`

## Panel admina

Panel admina jest dostępny pod:

```text
/admin
```

Wybrane sekcje:

- `/admin/catalog`
- `/admin/catalog/categories`
- `/admin/catalog/courses`
- `/admin/catalog/bundles`
- `/admin/discounts`
- `/admin/orders/[orderId]`

Logowanie działa tylko wtedy, gdy ustawione są `ADMIN_USERNAME` i `ADMIN_PASSWORD`.

## API

Najważniejsze endpointy:

- `POST /api/checkout/session`
- `POST /api/stripe/webhook`
- `GET /api/orders/access/[token]`
- `GET /api/orders/session/[sessionId]`
- `GET /api/invoices/[invoiceId]/pdf`
- `POST /api/admin/login`
- `POST /api/admin/logout`
- `POST /api/admin/udemy/import`
- `POST /api/admin/discounts`

## Dane i model domenowy

Prisma definiuje m.in.:

- `Category`
- `Course`
- `Bundle`
- `BundleCourse`
- `Order`
- `OrderItem`
- `Invoice`
- `DiscountCode`
- `UdemyCoupon`

Katalog jest lokalizowany przez pole `locale`. Obsługiwane wartości to:

```text
pl, de, en
```

## Płatności Stripe

Checkout korzysta ze Stripe Checkout. Po udanej płatności webhook zapisuje status zamówienia i przygotowuje dostęp do zakupionych produktów.

Do lokalnych testów webhooków możesz użyć Stripe CLI i przekierować zdarzenia na:

```text
/api/stripe/webhook
```

## E-maile

Wysyłka maili z dostępem korzysta z Resend. Do działania wymagane są:

```env
RESEND_API_KEY=""
EMAIL_FROM=""
```

Jeśli te zmienne nie są ustawione, aplikacja nie wyśle wiadomości, ale zamówienie może nadal istnieć w bazie.

## Faktury

Faktury PDF są generowane przy użyciu PDFKit. Dane sprzedawcy pochodzą ze zmiennych:

```env
SELLER_NAME=""
SELLER_ADDRESS=""
SELLER_TAX_ID=""
```

Opcjonalnie można wskazać własne fonty:

```env
INVOICE_FONT_REGULAR_PATH=""
INVOICE_FONT_BOLD_PATH=""
```

## Uploady

Miniaturki kursów i pakietów są przechowywane w:

```text
public/uploads/course-thumbnails
public/uploads/bundle-thumbnails
```

Repozytorium zawiera pliki `.gitkeep`, aby katalogi istniały po klonowaniu.

## Znane zachowania

- `/` przekierowuje według języka przeglądarki: `pl`, `de`, `en`; każdy inny język trafia na `/en`.
- Aplikacja ma fallback danych katalogu, ale panel admina, zamówienia, rabaty i importy wymagają działającej bazy.
- Przy buildzie bez lokalnej bazy mogą pojawić się logi Prismy o niedostępnym `localhost:5432`; sam build może się zakończyć sukcesem, jeśli ścieżki publiczne skorzystają z fallbacku.
- Link kontaktowy w FAQ otwiera klienta pocztowego z adresem `contact@rafalpodraza.com`.

## Przydatne linki

- [Next.js Environment Variables](https://nextjs.org/docs/15/app/guides/environment-variables)
- [Prisma Docs](https://www.prisma.io/docs)
- [Stripe Checkout Docs](https://docs.stripe.com/checkout)
- [Resend Docs](https://resend.com/docs)
