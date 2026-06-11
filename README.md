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
- Blog w trzech językach z wpisami zarządzanymi z panelu admina.
- Trzy wersje językowe: `pl`, `de`, `en`.
- Automatyczne przekierowanie z `/` na język z nagłówka `Accept-Language`; jeśli język nie jest obsługiwany, fallback to `/en`.
- Dedykowana strona 404 z lokalizowanymi treściami.
- Koszyk i checkout przez Stripe.
- Obsługa kodów rabatowych.
- Prywatne linki dostępu do zamówień.
- Linki i kupony Udemy przypisane do kursów.
- Faktury PDF.
- Panel admina do katalogu, kuponów Udemy, rabatów i zamówień.
- Panel admina do bloga, SEO wpisów i miniaturek.

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

TELEGRAM_BOT_TOKEN=""
TELEGRAM_CHAT_ID=""

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
- `TELEGRAM_BOT_TOKEN` i `TELEGRAM_CHAT_ID` włączają powiadomienia Telegram o nowych zamówieniach.
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
- `/pl/blog`
- `/pl/o-mnie`
- `/pl/faq`
- `/pl/koszyk`

Niemiecki:

- `/de`
- `/de/kurse`
- `/de/pakete`
- `/de/kategorien`
- `/de/blog`
- `/de/uber-mich`
- `/de/faq`
- `/de/warenkorb`

Angielski:

- `/en`
- `/en/courses`
- `/en/bundles`
- `/en/categories`
- `/en/blog`
- `/en/about`
- `/en/faq`
- `/en/cart`

## Panel admina

Panel admina jest dostępny pod:

```text
/rp-panel-2026
```

Ścieżka `/admin` jest celowo zablokowana przez middleware i zwraca `404`, aby ograniczyć automatyczne próby logowania na standardowy adres panelu.

Wybrane sekcje:

- `/rp-panel-2026/catalog`
- `/rp-panel-2026/catalog/categories`
- `/rp-panel-2026/catalog/courses`
- `/rp-panel-2026/catalog/bundles`
- `/rp-panel-2026/blog`
- `/rp-panel-2026/discounts`
- `/rp-panel-2026/orders/[orderId]`

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

## Telegram

Powiadomienia Telegram o nowych zamówieniach są wysyłane po obsłużeniu zdarzenia `checkout.session.completed` ze Stripe. Do działania wymagane są:

```env
TELEGRAM_BOT_TOKEN=""
TELEGRAM_CHAT_ID=""
```

Jeśli zmienne nie są ustawione, aplikacja pomija wysyłkę powiadomienia Telegram i nie blokuje zapisu zamówienia ani wysyłki e-maila.

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

## Produkcja na VPS

Aktualna produkcja działa na VPS OVH z Ubuntu 24.04.

Podstawowy układ:

```text
/opt/courses-shop/app
  repozytorium aplikacji
  .env.production
  docker-compose.prod.yml
  Caddyfile
  public/uploads
    course-thumbnails
    bundle-thumbnails
  storage
    invoices
```

Usługi produkcyjne są uruchamiane przez `docker compose` z pliku `docker-compose.prod.yml`:

- `db` - PostgreSQL 16, dane w wolumenie `postgres_data`.
- `app` - aplikacja Next.js zbudowana z lokalnego `Dockerfile`, port wewnętrzny `3000`.
- `caddy` - reverse proxy i automatyczne certyfikaty HTTPS dla domeny.

Wolumeny i trwałe dane:

- `postgres_data` - baza PostgreSQL.
- `caddy_data` - certyfikaty i dane Caddy.
- `caddy_config` - konfiguracja Caddy.
- `./public/uploads:/app/public/uploads` - uploady miniaturek.
- `./storage:/app/storage` - wygenerowane faktury PDF.

Kontenery mają ustawione `restart: unless-stopped`, więc po restarcie VPS aplikacja, baza i Caddy uruchamiają się automatycznie.

Najważniejsze komendy produkcyjne:

```bash
cd /opt/courses-shop/app

sudo docker compose --env-file .env.production -f docker-compose.prod.yml ps
sudo docker compose --env-file .env.production -f docker-compose.prod.yml logs -f app
sudo docker compose --env-file .env.production -f docker-compose.prod.yml up -d
sudo docker compose --env-file .env.production -f docker-compose.prod.yml build app
sudo docker compose --env-file .env.production -f docker-compose.prod.yml run --rm app npm run prisma:migrate:deploy
```

Deploy produkcyjny jest obsługiwany przez GitHub Actions po merge do `main`. Workflow wykonuje preflight (`lint`, `typecheck`, `build`), pobiera najnowszy kod na VPS, buduje obraz aplikacji, uruchamia migracje Prisma i restartuje kontenery.

Plik `.env.production` jest przechowywany tylko na VPS i nie powinien być commitowany do repozytorium.

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
