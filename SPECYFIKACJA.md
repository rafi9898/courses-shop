# Specyfikacja projektu 1.0 dla Codexa

1. Nazwa projektu
Robocza nazwa projektu:
PROJECT_NAME
Docelowa domena:
PROJECT_DOMAIN
Nazwa marki i domena zostaną uzupełnione później.
2. Cel projektu
Celem projektu jest stworzenie nowoczesnego, minimalistycznego sklepu internetowego do sprzedaży kursów online dostępnych na Udemy.
Użytkownik nie otrzymuje dostępu do własnej platformy kursowej. Po zakupie otrzymuje link do kursu Udemy z aktualnym kodem promocyjnym.
Projekt ma obsługiwać trzy wersje językowe:
polską,
niemiecką,
angielską.
Każda wersja językowa ma działać jako oddzielna część sklepu. Kursy, kategorie, wyszukiwarka, waluta, ceny, treści i SEO mają być rozdzielone według języka.
3. Główne założenia biznesowe
Sklep ma umożliwiać sprzedaż:
pojedynczych kursów,
pakietów kursów.
Po zakupie klient otrzymuje link lub linki do kursów Udemy z aktualnym kodem promocyjnym.
Nie ma kont użytkowników.
Użytkownik może dodać produkty do koszyka, zapłacić przez Stripe, otrzymać automatyczny e-mail z dostępem oraz fakturę PDF.
Administrator zarządza kursami, pakietami, kategoriami, kodami Udemy, promocjami, rabatami, opiniami, zamówieniami i fakturami z poziomu panelu admina.
4. Rekomendowana technologia
Projekt powinien zostać wykonany w technologii:
Next.js,
TypeScript,
Tailwind CSS,
PostgreSQL,
Prisma,
Stripe,
Resend albo SendGrid do wysyłki e-maili,
generator PDF do faktur,
Vercel jako hosting.
Projekt powinien być przygotowany pod SEO, szybkie ładowanie stron i łatwe zarządzanie treściami z panelu admina.
5. Struktura językowa
Aplikacja musi posiadać trzy osobne sekcje językowe:
/pl — wersja polska,
/de — wersja niemiecka,
/en — wersja angielska.
Przykładowe adresy list kursów:
/pl/kursy
/de/kurse
/en/courses
Przykładowe adresy stron kursów:
/pl/kursy/postman-od-podstaw
/de/kurse/postman-grundlagen
/en/courses/postman-fundamentals
Przykładowe adresy stron pakietów:
/pl/pakiety/qa-starter-pack
/de/pakete/qa-starter-pack
/en/bundles/qa-starter-pack
Ważne założenie:
Wyszukiwarka w wersji polskiej może przeszukiwać tylko kursy i pakiety polskie.
Wyszukiwarka w wersji niemieckiej może przeszukiwać tylko kursy i pakiety niemieckie.
Wyszukiwarka w wersji angielskiej może przeszukiwać tylko kursy i pakiety angielskie.
Nie wolno mieszać produktów z różnych wersji językowych.
6. Waluty
Sklep musi obsługiwać trzy waluty:
PLN dla wersji polskiej,
EUR dla wersji niemieckiej,
USD dla wersji angielskiej.
Każdy kurs i każdy pakiet ma mieć osobną cenę.
Przykład:
kurs polski: 39 zł,
kurs niemiecki: 12,99 EUR,
kurs angielski: 9,99 USD.
Waluta powinna być przypisana do języka:
/pl → PLN,
/de → EUR,
/en → USD.
W jednym koszyku nie wolno mieszać produktów z różnych języków i różnych walut.
7. Design
Design ma być:
minimalistyczny,
nowoczesny,
elegancki,
czytelny,
lekki,
responsywny,
dopasowany do sprzedaży kursów online.
Założenia wizualne:
dużo białej przestrzeni,
proste karty kursów,
czytelna typografia,
dobrze widoczne przyciski,
brak przeładowania elementami,
styl premium,
wygląd bardziej SaaS / edukacyjny niż typowy sklep internetowy.
Projekt nie powinien wyglądać jak ciężki marketplace. Ma być prosty, szybki i profesjonalny.
8. Strona główna
Każda wersja językowa powinna mieć własną stronę główną:
/pl,
/de,
/en.
Strona główna ma być minimalistyczna.
Powinna zawierać:
hero section,
krótki opis wartości sklepu,
najpopularniejsze kursy,
najpopularniejsze pakiety,
kategorie,
krótki blok z opiniami,
link do strony „O mnie”,
FAQ.
Newsletter nie jest wymagany w pierwszej wersji.
9. Strona „O mnie”
Projekt powinien posiadać osobną podstronę „O mnie”.
Przykładowe adresy:
/pl/o-mnie,
/de/uber-mich,
/en/about.
Na stronie powinny znaleźć się informacje budujące zaufanie:
doświadczenie autora,
liczba kursantów,
informacja o kursach online,
informacja o książkach,
informacja o YouTube,
informacja o blogu,
informacja o obecności kursów w Udemy Business,
krótka historia autora.
Treść powinna być możliwa do edycji z panelu admina osobno dla każdego języka.
10. Kategorie
Kategorie mają być tworzone i edytowane w panelu admina.
Kategorie muszą być oddzielne dla każdego języka.
Przykładowe kategorie dla wersji polskiej:
Testowanie oprogramowania,
Programowanie,
AI,
Cloud,
DevOps,
Zarządzanie projektami,
SQL i dane.
Przykładowe kategorie dla wersji niemieckiej:
Software Testing,
Programmierung,
KI,
Cloud,
DevOps,
Projektmanagement,
SQL und Daten.
Przykładowe kategorie dla wersji angielskiej:
Software Testing,
Programming,
AI,
Cloud,
DevOps,
Project Management,
SQL & Data.
Administrator powinien mieć możliwość:
dodawania kategorii,
edycji kategorii,
ustawiania języka kategorii,
przypisywania kursów do kategorii,
przypisywania pakietów do kategorii,
ukrywania kategorii,
ustawiania kolejności wyświetlania.
11. Lista kursów
Każda wersja językowa musi mieć stronę z listą kursów.
Przykładowe adresy:
/pl/kursy,
/de/kurse,
/en/courses.
Na stronie powinny znajdować się:
nagłówek,
krótki opis,
wyszukiwarka,
filtry kategorii,
lista kursów,
karty kursów.
Karta kursu powinna zawierać:
miniaturkę,
tytuł,
krótki opis,
cenę,
ewentualną cenę promocyjną,
ocenę,
liczbę opinii,
kategorię,
przycisk „Zobacz kurs”,
przycisk „Dodaj do koszyka”.
12. Lista pakietów
Każda wersja językowa powinna mieć stronę z listą pakietów.
Przykładowe adresy:
/pl/pakiety,
/de/pakete,
/en/bundles.
Karta pakietu powinna zawierać:
miniaturkę,
tytuł,
krótki opis,
liczbę kursów w pakiecie,
cenę,
ewentualną cenę promocyjną,
przycisk „Zobacz pakiet”,
przycisk „Dodaj do koszyka”.
13. Strona szczegółowa kursu
Po kliknięciu w kurs użytkownik przechodzi na dedykowaną stronę kursu.
Strona kursu powinna zawierać:
tytuł kursu,
krótki opis,
pełny opis kursu,
miniaturkę,
film promocyjny otwierany w modalu po kliknięciu w miniaturkę,
cenę,
cenę promocyjną, jeżeli promocja jest aktywna,
ocenę,
liczbę opinii,
listę najważniejszych korzyści,
agendę kursu,
opinie kursantów,
FAQ,
przycisk „Dodaj do koszyka”,
przycisk „Kup teraz” opcjonalnie jako szybkie dodanie do koszyka i przejście do checkoutu,
sekcję „Klienci kupili również” albo „Polecane kursy”.
14. Strona szczegółowa pakietu
Strona pakietu powinna zawierać:
tytuł pakietu,
krótki opis,
pełny opis pakietu,
miniaturkę,
cenę,
cenę promocyjną, jeżeli promocja jest aktywna,
listę kursów wchodzących w skład pakietu,
korzyści z zakupu pakietu,
opinie,
FAQ,
przycisk „Dodaj do koszyka”,
przycisk „Kup teraz” opcjonalnie jako szybkie dodanie do koszyka i przejście do checkoutu.
Po zakupie pakietu użytkownik otrzymuje linki Udemy do wszystkich kursów wchodzących w skład pakietu.
15. Film promocyjny
Miniaturka kursu powinna być klikalna.
Po kliknięciu otwiera się modal z filmem promocyjnym.
Administrator powinien móc dodać:
link do filmu z YouTube,
link do Vimeo,
ewentualnie bezpośredni link do pliku wideo.
16. Opinie
Opinie są dodawane ręcznie z panelu admina.
Administrator powinien móc dodać:
imię i nazwisko,
treść opinii,
ocenę,
język opinii,
przypisanie do kursu albo pakietu,
datę,
status aktywna / nieaktywna.
Opinie nie są pobierane automatycznie z Udemy.
17. Kursy pojedyncze i pakiety
Sklep musi obsługiwać dwa typy produktów:
pojedynczy kurs,
pakiet kursów.
Przykładowe pakiety:
QA Starter Pack,
ISTQB Pack,
DevOps Pack,
AI Pack,
SQL & Data Pack.
Pakiet powinien zawierać kilka kursów.
Administrator powinien mieć możliwość:
tworzenia pakietów,
dodawania kursów do pakietu,
ustawiania ceny pakietu,
ustawiania waluty,
ustawiania języka pakietu,
dodawania opisu pakietu,
dodawania miniaturki pakietu,
ustawiania promocji dla pakietu,
przypisywania pakietu do kategorii.
18. Kody Udemy
Kursy są sprzedawane jako dostęp do Udemy przez kod promocyjny.
Dla każdego kursu administrator ustawia jeden aktualny kod Udemy.
Kod jest uniwersalny dla danego kursu i działa przez określony czas, np. przez miesiąc.
Na początku kolejnego miesiąca administrator może zaktualizować kod.
Przykład:
Kurs: Postman od podstaw
Kod: CZERWIEC2026
Link:
https://www.udemy.com/course/postman-od-podstaw/?couponCode=CZERWIEC2026
System powinien pozwalać na:
dodanie aktualnego kodu dla kursu,
edycję kodu,
ustawienie daty ważności,
zapisanie pełnego linku Udemy,
oznaczenie kodu jako aktywny,
przechowywanie historii poprzednich kodów.
W danym momencie jeden kurs powinien mieć jeden aktywny kod.
Jeżeli użytkownik kupuje pakiet, system pobiera aktualne kody Udemy dla wszystkich kursów w pakiecie.
19. Koszyk
Sklep ma posiadać klasyczny koszyk zakupowy.
Użytkownik powinien móc dodać do koszyka:
pojedynczy kurs,
pakiet kursów.
Użytkownik może mieć w koszyku kilka produktów jednocześnie.
Koszyk nie wymaga logowania użytkownika.
Koszyk powinien działać na podstawie localStorage albo cookies.
20. Funkcje koszyka
Koszyk powinien umożliwiać:
dodanie produktu do koszyka,
usunięcie produktu z koszyka,
wyświetlenie ceny regularnej,
wyświetlenie ceny promocyjnej,
naliczenie rabatu,
pokazanie sumy zamówienia,
przejście do płatności Stripe.
W przypadku kursów cyfrowych domyślnie ilość produktu wynosi 1.
Ten sam kurs albo pakiet nie powinien być dodany do koszyka wielokrotnie.
Nie ma potrzeby zmiany ilości produktów, ponieważ każdy produkt cyfrowy kupowany jest pojedynczo.
21. Waluta koszyka
Koszyk musi działać osobno dla każdej wersji językowej.
Wersja polska:
waluta: PLN,
koszyk zawiera tylko polskie produkty.
Wersja niemiecka:
waluta: EUR,
koszyk zawiera tylko niemieckie produkty.
Wersja angielska:
waluta: USD,
koszyk zawiera tylko angielskie produkty.
Nie wolno mieszać w jednym koszyku produktów z różnych języków i różnych walut.
Jeżeli użytkownik przełączy język, powinien mieć osobny koszyk dla danego języka.
22. Checkout
Proces zakupu z koszykiem:
Użytkownik dodaje jeden lub wiele produktów do koszyka.
Użytkownik przechodzi do koszyka.
Użytkownik może dodać kod rabatowy.
System przelicza wartość zamówienia.
Użytkownik klika „Przejdź do płatności”.
System tworzy sesję Stripe Checkout dla całego koszyka.
Użytkownik dokonuje płatności.
Stripe wysyła webhook do aplikacji.
Aplikacja zapisuje zamówienie.
Aplikacja pobiera aktualne linki Udemy dla wszystkich zakupionych kursów.
Aplikacja generuje fakturę PDF.
Aplikacja wysyła e-mail z linkami do kursów i fakturą.
Użytkownik trafia na stronę sukcesu.
23. Zamówienie z wieloma produktami
Zamówienie musi obsługiwać wiele pozycji.
Należy użyć tabel:
orders,
order_items.
Tabela orders przechowuje dane całego zamówienia.
Tabela order_items przechowuje konkretne produkty w zamówieniu.
product_type może mieć wartość:
course,
bundle.
24. Unikanie duplikowania linków Udemy
Jeżeli użytkownik kupuje kilka kursów, system powinien wysłać link do każdego kursu.
Jeżeli użytkownik kupuje pakiet, system powinien wysłać linki do wszystkich kursów znajdujących się w pakiecie.
Jeżeli użytkownik kupi osobno kurs, który jest także w pakiecie, system powinien unikać duplikowania tego samego linku w e-mailu i na stronie sukcesu.
Przykład:
Koszyk:
Kurs Postman,
Pakiet QA Starter Pack, który też zawiera Postman.
System powinien wysłać link do Postmana tylko raz.
25. Stripe
System płatności ma być zintegrowany ze Stripe.
Stripe powinien obsługiwać płatność za cały koszyk.
Proces:
Aplikacja tworzy sesję Stripe Checkout.
Do sesji przekazywane są produkty z koszyka.
Stripe obsługuje płatność.
Po płatności Stripe wysyła webhook.
Aplikacja waliduje webhook.
Aplikacja zapisuje zamówienie.
Aplikacja generuje fakturę.
Aplikacja wysyła e-mail do klienta.
Należy obsłużyć statusy:
płatność zakończona sukcesem,
płatność anulowana,
płatność nieudana.
26. Kody rabatowe sklepu
Kody rabatowe sklepu są niezależne od kodów Udemy.
Administrator powinien mieć możliwość utworzenia kodu rabatowego i zdecydowania, czy działa:
na wszystkie kursy,
na wybrane konkretne kursy,
na wybrane pakiety.
Kod rabatowy powinien mieć:
nazwę kodu,
typ rabatu: procentowy albo kwotowy,
wartość rabatu,
datę rozpoczęcia,
datę zakończenia,
limit użyć,
status aktywny / nieaktywny,
zakres działania,
przypisane kursy lub pakiety.
Przykład:
Kod: BLACKWEEK
Rabat: 40%
Zakres: wszystkie kursy
Ważny od: 20.11.2026
Ważny do: 30.11.2026
27. Promocje czasowe
Administrator powinien mieć możliwość ustawiania promocji czasowych.
Promocja może dotyczyć:
jednego kursu,
wielu kursów,
jednego pakietu,
wielu pakietów,
całej wersji językowej,
wszystkich produktów.
Promocja powinna zawierać:
cenę regularną,
cenę promocyjną,
datę rozpoczęcia,
datę zakończenia,
status aktywna / nieaktywna,
opcjonalny licznik czasu.
Na stronie kursu lub pakietu powinna być możliwość pokazania:
ceny regularnej przekreślonej,
ceny promocyjnej,
informacji o czasie trwania promocji.
Przykład:
199 zł przekreślone
39 zł jako cena promocyjna
Administrator musi mieć możliwość samodzielnego decydowania, kiedy promocja jest aktywna.
28. Upsell
Na stronie kursu, stronie pakietu, w koszyku lub po zakupie system powinien pokazywać polecane produkty.
Przykładowe sekcje:
„Klienci kupili również”,
„Może Cię zainteresować”,
„Dobierz pakiet i oszczędź”.
Administrator powinien mieć możliwość ręcznego ustawiania produktów powiązanych.
Przykład:
Dla kursu Postman od podstaw można polecić:
Testowanie API,
Newman,
QA Starter Pack,
API Testing Bundle.
Upsell powinien działać osobno dla każdego języka.
29. Brak kont użytkowników
Użytkownik nie zakłada konta.
Nie ma logowania użytkownika.
Użytkownik podaje dane wymagane do płatności i faktury.
Po zakupie otrzymuje dostęp przez:
stronę sukcesu,
wiadomość e-mail.
Jedyny system logowania dotyczy panelu admina.
30. Dane kupującego
Przy checkout użytkownik powinien podać dane potrzebne do faktury.
Minimalne dane:
imię i nazwisko albo nazwa firmy,
e-mail,
kraj,
adres,
kod pocztowy,
miasto.
Opcjonalnie:
NIP / VAT ID,
nazwa firmy.
Formularz powinien umożliwiać zakup jako:
osoba prywatna,
firma.
31. Faktury
Sklep ma automatycznie wystawiać faktury.
Właściciel działalności jest zwolniony z VAT, dlatego system powinien umożliwiać konfigurację faktur bez VAT.
Nie używamy na start zewnętrznych integracji typu Fakturownia albo inFakt.
Projekt ma posiadać własny prosty generator faktur PDF.
Faktura powinna być generowana automatycznie po udanej płatności.
Faktura powinna zawierać:
numer faktury,
datę wystawienia,
datę sprzedaży,
dane sprzedawcy,
dane kupującego,
listę zakupionych produktów,
cenę jednostkową,
ilość,
wartość,
walutę,
sumę zamówienia,
rabat, jeżeli został użyty,
informację o zwolnieniu z VAT,
adnotację księgową ustawianą w panelu admina.
32. Numeracja faktur
Panel admina powinien umożliwiać konfigurację numeracji faktur.
Przykładowy format:
FV/{YYYY}/{MM}/{NUMBER}
Przykład:
FV/2026/06/001
Administrator powinien móc ustawić:
prefiks,
format numeracji,
numer startowy,
reset numeracji miesięcznie albo rocznie.
33. Dane sprzedawcy
W panelu admina powinna być sekcja „Dane sprzedawcy”.
Administrator powinien móc ustawić:
nazwa firmy,
imię i nazwisko,
adres,
NIP,
e-mail,
numer konta, jeżeli potrzebny,
adnotacja o zwolnieniu z VAT.
Przykład adnotacji:
Sprzedawca korzysta ze zwolnienia z VAT na podstawie art. 113 ust. 1 ustawy o VAT.
Treść tej adnotacji musi być możliwa do edycji w panelu admina.
34. Faktura dla osoby prywatnej i firmy
Dla osoby prywatnej faktura zawiera:
imię i nazwisko,
adres,
e-mail.
Dla firmy faktura zawiera:
nazwa firmy,
NIP / VAT ID,
adres,
e-mail.
35. Pobieranie faktury
Faktura powinna być:
generowana jako PDF,
zapisana w systemie,
dostępna w panelu admina przy zamówieniu,
wysłana klientowi w e-mailu,
dostępna na stronie sukcesu po zakupie.
36. E-mail po zakupie
Po udanej płatności system wysyła jeden e-mail dla całego zamówienia.
E-mail powinien zawierać:
podziękowanie za zakup,
numer zamówienia,
listę zakupionych produktów,
linki Udemy do wszystkich kursów,
informację o fakturze,
fakturę PDF jako załącznik albo link do pobrania.
Przykład:
Temat: Twoje kursy są gotowe
Dziękujemy za zakup.
Numer zamówienia: [numer zamówienia]
Twoje kursy:
[nazwa kursu]
Link: [link Udemy z kodem]
[nazwa kursu]
Link: [link Udemy z kodem]
Faktura została dołączona do wiadomości.
W razie problemów odpisz na tę wiadomość.
Wiadomości e-mail powinny być wysyłane z osobnej domeny i osobnego adresu e-mail przeznaczonego dla tego projektu.
37. Strona sukcesu po zakupie
Po udanej płatności użytkownik trafia na stronę sukcesu.
Strona powinna zawierać:
komunikat o udanym zakupie,
numer zamówienia,
listę kupionych produktów,
linki Udemy do wszystkich kursów,
informację, że linki zostały wysłane również e-mailem,
informację, że faktura została wygenerowana,
możliwość pobrania faktury PDF.
Strona sukcesu nie może być dostępna bez poprawnego zamówienia.
38. Panel admina
Panel admina będzie dostępny pod adresem:
/admin-secret-panel
Panel admina musi wymagać logowania.
Administrator powinien mieć możliwość zarządzania:
kursami,
pakietami,
kategoriami,
opiniami,
kodami Udemy,
kodami rabatowymi,
promocjami czasowymi,
zamówieniami,
fakturami,
ustawieniami SEO,
treścią strony „O mnie”,
danymi sprzedawcy,
ustawieniami faktur,
ustawieniami analityki.
39. Zarządzanie kursami w panelu admina
Administrator powinien móc:
dodać kurs,
edytować kurs,
ukryć kurs,
usunąć kurs,
ustawić język kursu,
ustawić kategorię,
ustawić tytuł,
ustawić slug,
ustawić krótki opis,
ustawić pełny opis,
dodać miniaturkę,
dodać film promocyjny,
ustawić cenę,
ustawić cenę regularną,
ustawić cenę promocyjną,
dodać agendę,
dodać opinie,
ustawić aktualny kod Udemy,
ustawić SEO title,
ustawić SEO description.
40. Zarządzanie pakietami w panelu admina
Administrator powinien móc:
dodać pakiet,
edytować pakiet,
ukryć pakiet,
usunąć pakiet,
ustawić język pakietu,
ustawić kategorię,
ustawić tytuł,
ustawić slug,
ustawić opis,
dodać miniaturkę,
dodać kursy do pakietu,
ustawić cenę,
ustawić cenę regularną,
ustawić cenę promocyjną,
ustawić SEO title,
ustawić SEO description.
41. Zamówienia w panelu admina
W panelu admina powinna być lista zamówień.
Zamówienie powinno zawierać:
ID zamówienia,
numer zamówienia,
datę,
listę produktów,
typy produktów: kurs albo pakiet,
język,
walutę,
kwotę netto / całkowitą,
rabat,
e-mail klienta,
dane klienta,
status płatności,
status wysyłki e-maila,
fakturę,
linki wysłane klientowi.
42. Analityka
Projekt powinien mieć możliwość integracji z:
Google Analytics 4,
Google Search Console,
Meta Pixel.
W panelu lub w konfiguracji środowiskowej powinny być miejsca na dodanie odpowiednich identyfikatorów.
Przykład:
NEXT_PUBLIC_GA_ID,
NEXT_PUBLIC_META_PIXEL_ID.
43. SEO
Ponieważ kursy mają być indeksowane w Google, projekt musi być przygotowany pod SEO.
Każda strona kursu i pakietu powinna mieć:
unikalny adres URL,
meta title,
meta description,
nagłówek H1,
opis,
dane strukturalne schema.org,
canonical URL,
poprawne Open Graph tags,
sitemap.xml,
robots.txt.
Każda wersja językowa powinna mieć osobną strukturę SEO.
Blog nie jest wymagany w pierwszej wersji, ale projekt powinien być przygotowany tak, aby można było go dodać w przyszłości.
44. Wymagania SEO techniczne
Projekt powinien generować:
sitemapę dla /pl,
sitemapę dla /de,
sitemapę dla /en,
poprawne canonicale,
poprawne hreflangi dla wersji językowych, jeżeli produkty mają swoje odpowiedniki w innych językach,
Open Graph title,
Open Graph description,
Open Graph image.
45. Baza danych
Proponowane tabele:
courses
id
language
title
slug
short_description
full_description
thumbnail_url
promo_video_url
price
currency
regular_price
sale_price
sale_active
sale_start
sale_end
rating
reviews_count
category_id
is_active
seo_title
seo_description
created_at
updated_at
categories
id
language
name
slug
description
sort_order
is_active
created_at
updated_at
course_agenda_items
id
course_id
title
description
sort_order
reviews
id
product_type
course_id
bundle_id
author_name
rating
content
language
is_active
created_at
course_access_codes
id
course_id
code
udemy_url
valid_from
valid_until
is_active
created_at
updated_at
bundles
id
language
title
slug
short_description
full_description
thumbnail_url
price
currency
regular_price
sale_price
sale_active
sale_start
sale_end
category_id
is_active
seo_title
seo_description
created_at
updated_at
bundle_courses
id
bundle_id
course_id
discount_codes
id
code
discount_type
discount_value
valid_from
valid_until
usage_limit
used_count
applies_to_all
is_active
created_at
updated_at
discount_code_courses
id
discount_code_id
course_id
discount_code_bundles
id
discount_code_id
bundle_id
orders
id
order_number
customer_email
customer_name
customer_type
company_name
tax_id
country
address_line_1
address_line_2
postal_code
city
language
subtotal_amount
discount_code
discount_amount
total_amount
currency
stripe_session_id
stripe_payment_intent_id
payment_status
email_sent
invoice_id
created_at
order_items
id
order_id
product_type
course_id
bundle_id
product_name
quantity
unit_price
total_price
currency
invoices
id
order_id
invoice_number
invoice_pdf_url
seller_name
seller_company_name
seller_tax_id
seller_address
buyer_name
buyer_company_name
buyer_tax_id
buyer_address
currency
subtotal_amount
discount_amount
total_amount
vat_status_note
issued_at
created_at
invoice_settings
id
seller_name
seller_company_name
seller_tax_id
seller_address
seller_email
invoice_prefix
invoice_number_format
invoice_next_number
invoice_reset_period
vat_status_note
updated_at
upsell_products
id
source_product_type
source_course_id
source_bundle_id
target_product_type
target_course_id
target_bundle_id
sort_order
admin_users
id
email
password_hash
created_at
site_settings
id
key
value
language
updated_at
46. Bezpieczeństwo
Projekt musi uwzględniać:
zabezpieczony panel admina,
hashowanie haseł admina,
walidację webhooków Stripe,
zabezpieczenie endpointów admina,
brak możliwości podejrzenia linków Udemy bez zakupu,
poprawne przechowywanie danych klientów,
obsługę błędów płatności,
zabezpieczenie przed ręcznym wejściem na stronę sukcesu bez poprawnego zamówienia,
zmienne środowiskowe dla kluczy API,
podstawową ochronę przed spamem i nadużyciami,
walidację danych formularzy.
47. Zmienne środowiskowe
Projekt powinien używać zmiennych środowiskowych.
Przykładowe zmienne:
DATABASE_URL,
NEXT_PUBLIC_SITE_URL,
STRIPE_SECRET_KEY,
STRIPE_WEBHOOK_SECRET,
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
RESEND_API_KEY albo SENDGRID_API_KEY,
EMAIL_FROM,
NEXT_PUBLIC_GA_ID,
NEXT_PUBLIC_META_PIXEL_ID,
ADMIN_SECRET_ROUTE.
48. MVP
Pierwsza wersja projektu powinna zawierać:
trzy wersje językowe,
trzy waluty,
kursy pojedyncze,
pakiety kursów,
koszyk,
Stripe Checkout dla koszyka,
kody rabatowe,
promocje czasowe,
linki Udemy po zakupie,
e-mail po zakupie,
prosty generator faktur PDF,
strona sukcesu,
panel admina,
kategorie per język,
opinie ręcznie dodawane,
upsell,
SEO,
analityka,
stronę „O mnie”,
listę zamówień,
konfigurację danych sprzedawcy.
49. Funkcje do dodania w przyszłości
W przyszłości można dodać:
blog,
newsletter,
bardziej rozbudowany system rekomendacji,
integrację z CRM,
automatyczne importowanie kursów,
panel statystyk sprzedaży,
automatyczne tłumaczenia treści,
zaawansowane kampanie promocyjne,
integrację z zewnętrznym systemem fakturowym,
automatyczne generowanie landing pages,
program afiliacyjny.
50. Priorytet implementacji
Projekt należy budować etapami.
Etap 1: Podstawy
konfiguracja Next.js,
konfiguracja TypeScript,
konfiguracja Tailwind CSS,
konfiguracja bazy danych,
modele Prisma,
layout publiczny,
routing językowy.
Etap 2: Produkty
kursy,
pakiety,
kategorie,
listy produktów,
strony szczegółowe produktów,
wyszukiwarka per język.
Etap 3: Koszyk i płatności
koszyk,
rabaty,
Stripe Checkout,
webhook Stripe,
zapis zamówienia.
Etap 4: Dostęp po zakupie
pobieranie aktywnych kodów Udemy,
strona sukcesu,
e-mail po zakupie,
unikanie duplikowania linków.
Etap 5: Faktury
dane sprzedawcy,
dane kupującego,
numeracja faktur,
generator PDF,
wysyłka faktury e-mailem,
faktura w panelu admina.
Etap 6: Panel admina
logowanie admina,
zarządzanie kursami,
zarządzanie pakietami,
zarządzanie kategoriami,
zarządzanie opiniami,
zarządzanie promocjami,
zarządzanie kodami rabatowymi,
zarządzanie zamówieniami,
zarządzanie fakturami.
Etap 7: SEO i analityka
sitemap.xml,
robots.txt,
meta tagi,
Open Graph,
schema.org,
Google Analytics,
Meta Pixel,
Search Console.
51. Najważniejsze zasady projektu
Nie tworzyć kont użytkowników.
Użytkownik kupuje kursy i pakiety przez koszyk.
Po zakupie otrzymuje linki Udemy z aktualnymi kodami.
Każdy język ma osobne produkty, kategorie, walutę i koszyk.
Nie wolno mieszać języków i walut w jednym koszyku.
Panel admina jest ukryty i zabezpieczony.
Faktury PDF są generowane automatycznie w aplikacji.
Kursy i pakiety mają być indeksowane w Google.
Design ma być minimalistyczny i profesjonalny.
Projekt ma być łatwy do rozbudowy w przyszłości.

