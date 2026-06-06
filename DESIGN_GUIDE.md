# DESIGN_GUIDE.md

## 1. Cel dokumentu

Ten dokument opisuje wymagania wizualne i zasady projektowania interfejsu dla sklepu internetowego z kursami online.

Dokument uzupełnia plik `SPECYFIKACJA.md` i powinien być traktowany przez Codexa jako źródło prawdy w zakresie:

- wyglądu interfejsu,
- układu stron,
- typografii,
- kolorystyki,
- komponentów UI,
- responsywności,
- animacji,
- dostępności,
- sposobu odwzorowania dostarczonych projektów graficznych.

Jeżeli dostarczony projekt graficzny różni się od ogólnych zasad opisanych w tym dokumencie, należy zachować układ i styl projektu graficznego, o ile nie narusza on funkcjonalności opisanych w `SPECYFIKACJA.md`.

---

## 2. Charakter projektu

Sklep ma wyglądać jak nowoczesna, minimalistyczna platforma edukacyjna klasy premium.

Design powinien łączyć cechy:

- nowoczesnej aplikacji SaaS,
- profesjonalnej platformy edukacyjnej,
- prostego i szybkiego sklepu internetowego,
- marki eksperckiej prowadzonej przez jednego autora.

Projekt nie powinien wyglądać jak rozbudowany marketplace z setkami sprzedawców.

Najważniejsze wrażenie:

- profesjonalnie,
- nowocześnie,
- wiarygodnie,
- lekko,
- przejrzyście,
- bez wizualnego chaosu.

---

## 3. Główne zasady wizualne

### 3.1. Minimalizm

Interfejs powinien zawierać tylko elementy potrzebne użytkownikowi do:

- znalezienia kursu,
- sprawdzenia szczegółów,
- dodania produktu do koszyka,
- zakupu,
- poznania autora.

Nie należy dodawać zbędnych sekcji, liczników, bannerów, karuzel ani dekoracji bez konkretnego celu.

### 3.2. Dużo wolnej przestrzeni

Należy stosować:

- duże odstępy pomiędzy sekcjami,
- czytelne marginesy,
- ograniczoną liczbę elementów w jednym widoku,
- wyraźne oddzielenie treści.

### 3.3. Czytelna hierarchia

Użytkownik powinien od razu widzieć:

1. główny nagłówek,
2. wyszukiwarkę,
3. najważniejsze kursy lub pakiety,
4. główny przycisk CTA,
5. opinie i elementy budujące zaufanie.

### 3.4. Styl premium

Styl premium należy osiągnąć przez:

- dobrą typografię,
- spójne odstępy,
- delikatne obramowania,
- subtelne cienie,
- ograniczoną paletę kolorów,
- wysokiej jakości grafiki,
- brak agresywnych efektów.

---

## 4. Projekty graficzne

Dostarczone projekty graficzne powinny znajdować się w katalogu:

```text
/design
```

Przykładowa struktura:

```text
/design
├── homepage-desktop.png
├── homepage-mobile.png
├── course-list-desktop.png
├── course-detail-desktop.png
├── cart-desktop.png
├── admin-dashboard.png
└── assets
    ├── hero-illustration.png
    ├── logo.svg
    └── icons
```

Codex powinien:

- przeanalizować wszystkie pliki w katalogu `/design`,
- odwzorować ich układ możliwie dokładnie,
- zachować spójność między podstronami,
- nie kopiować przypadkowych elementów spoza projektu,
- nie zmieniać samodzielnie głównej kompozycji bez uzasadnienia,
- stosować komponenty wielokrotnego użytku.

Jeżeli brakuje projektu konkretnej podstrony, należy oprzeć ją na stylu strony głównej i istniejących komponentach.

---

## 5. Strona główna — wersja docelowa

Strona główna ma być minimalistyczna i krótsza niż typowy landing page.

Główne sekcje:

1. Header
2. Kompaktowy Hero
3. Dynamiczna wyszukiwarka kursów i pakietów
4. Popularne kursy
5. Popularne pakiety
6. Opinie kursantów
7. Krótka sekcja autora
8. FAQ
9. Footer

Nie należy dodawać newslettera w pierwszej wersji.

---

## 6. Header

Header powinien być prosty, lekki i czytelny.

Powinien zawierać:

- logo marki,
- link do kursów,
- link do pakietów,
- link „O mnie”,
- przełącznik języka,
- ikonę koszyka,
- opcjonalny główny przycisk CTA.

Przykładowe etykiety:

### Polska wersja

- Kursy
- Pakiety
- O mnie
- Koszyk

### Niemiecka wersja

- Kurse
- Pakete
- Über mich
- Warenkorb

### Angielska wersja

- Courses
- Bundles
- About
- Cart

Header może być przyklejony do górnej części ekranu.

Po przewinięciu może otrzymać:

- białe tło,
- delikatne rozmycie,
- cienką dolną linię,
- subtelny cień.

Header nie powinien być wysoki ani dominować nad stroną.

---

## 7. Hero

Hero ma być kompaktowy.

Nie powinien zajmować całego ekranu i nie powinien być przesadnie wysoki.

Rekomendowana wysokość na desktopie:

- około 420–560 px wraz z wewnętrznymi odstępami.

Układ desktopowy:

- lewa kolumna: tekst i CTA,
- prawa kolumna: grafika lub kompozycja kart kursowych.

Układ mobilny:

- tekst,
- CTA,
- grafika poniżej.

Hero powinien zawierać:

- mały badge lub krótką informację nad nagłówkiem,
- jeden mocny nagłówek H1,
- krótki opis,
- jeden główny przycisk CTA,
- opcjonalny drugi link tekstowy,
- grafikę budującą charakter marki.

Hero nie może zawierać kilku konkurujących ze sobą przycisków.

Przykładowy nagłówek:

> Rozwijaj praktyczne umiejętności IT z kursami tworzonymi przez eksperta

Przykładowy opis:

> Ucz się testowania, programowania, AI, Cloud i DevOps w swoim tempie. Wybieraj pojedyncze kursy lub kompletne pakiety.

Główne CTA:

> Przeglądaj kursy

Drugie CTA, jeżeli występuje:

> Zobacz pakiety

---

## 8. Grafika w Hero

Hero powinien zawierać grafikę.

Nie może być pustym blokiem tekstowym.

Grafika może przedstawiać:

- autora kursów,
- ekran platformy edukacyjnej,
- karty kursów,
- abstrakcyjną ilustrację edukacyjną,
- połączenie laptopa, kodu, chmury i elementów IT.

Grafika powinna być:

- nowoczesna,
- lekka,
- spójna kolorystycznie,
- czytelna również na mniejszych ekranach,
- bez nadmiernej liczby szczegółów.

Jeżeli w katalogu `/design` znajduje się gotowa grafika Hero, należy użyć jej bez zmiany głównej kompozycji.

---

## 9. Dynamiczna wyszukiwarka

Wyszukiwarka jest jednym z najważniejszych elementów strony głównej.

Powinna znajdować się:

- w dolnej części Hero,
- bezpośrednio pod Hero,
- albo częściowo nachodzić na dolną krawędź Hero.

Pole wyszukiwania powinno być duże, czytelne i wyraźnie widoczne.

Powinno zawierać:

- ikonę wyszukiwania,
- placeholder,
- przycisk czyszczenia,
- dynamiczną listę wyników.

Przykładowe placeholdery:

- PL: „Szukaj kursów i pakietów”
- DE: „Kurse und Pakete suchen”
- EN: „Search courses and bundles”

Wyniki powinny pojawiać się podczas wpisywania.

Każdy wynik może zawierać:

- miniaturkę,
- typ produktu,
- tytuł,
- kategorię,
- cenę,
- link do strony szczegółowej.

Wyniki muszą być filtrowane według aktualnego języka.

Wyszukiwarka nie może mieszać produktów z różnych wersji językowych.

---

## 10. Karty kursów

Karty kursów mają być proste i nowoczesne.

Karta powinna zawierać:

- miniaturkę,
- badge kategorii,
- tytuł,
- krótki opis,
- ocenę,
- liczbę opinii,
- cenę,
- cenę promocyjną, jeżeli występuje,
- przycisk „Zobacz kurs”,
- przycisk lub ikonę dodania do koszyka.

Układ karty:

- miniaturka u góry,
- treść poniżej,
- cena i CTA w dolnej części.

Karty powinny mieć podobną wysokość.

Tytuł może zajmować maksymalnie 2–3 linie.

Opis powinien być krótki i przycięty.

Hover na desktopie:

- delikatne uniesienie,
- subtelnie mocniejszy cień,
- lekkie podkreślenie obramowania.

Nie należy stosować mocnego skalowania ani agresywnych animacji.

---

## 11. Karty pakietów

Karty pakietów powinny być wizualnie odróżnione od kart kursów.

Mogą zawierać:

- badge „Pakiet”,
- informację o liczbie kursów,
- informację o oszczędności,
- miniaturki kilku kursów,
- cenę regularną i promocyjną.

Pakiety nie powinny wyglądać jak zwykły pojedynczy kurs.

Przykładowe oznaczenia:

- Pakiet
- 5 kursów
- Oszczędzasz 120 zł

---

## 12. Sekcja opinii

Sekcja opinii powinna być krótka i wiarygodna.

Nie należy tworzyć bardzo długiej karuzeli.

Rekomendowany układ:

- 3 opinie na desktopie,
- 1 opinia na mobile,
- możliwość przesuwania poziomego na urządzeniach mobilnych.

Karta opinii powinna zawierać:

- imię i nazwisko,
- ocenę,
- treść opinii,
- opcjonalny avatar,
- opcjonalną nazwę kursu.

Treść opinii powinna być czytelna i nieprzesadnie długa.

---

## 13. Sekcja „O mnie”

Na stronie głównej powinna znajdować się krótka sekcja autora.

Sekcja może zawierać:

- zdjęcie autora,
- imię i nazwisko,
- krótki opis,
- informacje o doświadczeniu,
- liczbę kursantów,
- informację o książkach,
- informację o YouTube,
- informację o Udemy Business,
- link do pełnej strony „O mnie”.

Sekcja powinna budować zaufanie, ale nie dominować nad ofertą kursów.

---

## 14. FAQ

FAQ powinno używać komponentu accordion.

Każde pytanie powinno być rozwijane osobno.

Przykładowe pytania:

- Jak otrzymam dostęp do kursu?
- Czy potrzebuję konta w tym sklepie?
- Gdzie będę oglądać kurs?
- Czy otrzymam fakturę?
- Czy kod Udemy ma termin ważności?
- Czy mogę kupić kilka kursów jednocześnie?

Accordion powinien być prosty, bez ciężkich animacji.

---

## 15. Footer

Footer powinien być prosty i uporządkowany.

Powinien zawierać:

- logo,
- krótki opis marki,
- linki do kursów,
- linki do pakietów,
- link „O mnie”,
- kontakt,
- politykę prywatności,
- regulamin,
- informacje o płatnościach,
- linki społecznościowe,
- copyright.

Footer nie powinien być przeładowany.

---

## 16. Lista kursów

Strona listy kursów powinna zawierać:

- nagłówek H1,
- krótki opis,
- wyszukiwarkę,
- filtry kategorii,
- opcjonalne sortowanie,
- siatkę kart kursów,
- stan pusty, jeśli brak wyników.

Filtry powinny być:

- czytelne,
- proste,
- łatwe do użycia na mobile.

Na urządzeniach mobilnych filtry mogą być otwierane w drawerze lub modalu.

---

## 17. Strona szczegółowa kursu

Górna część strony powinna zawierać:

- tytuł,
- krótki opis,
- ocenę,
- liczbę opinii,
- kategorię,
- miniaturkę lub wideo,
- cenę,
- CTA zakupu.

Na desktopie rekomendowany jest układ dwóch kolumn:

- lewa: treść,
- prawa: karta zakupowa sticky.

Karta zakupowa może zawierać:

- miniaturkę,
- przycisk odtworzenia filmu,
- cenę,
- cenę regularną,
- informację o promocji,
- „Dodaj do koszyka”,
- „Kup teraz”,
- informację o dostępie przez Udemy,
- informację o fakturze.

Dalsze sekcje:

- czego nauczysz się w kursie,
- opis,
- agenda,
- wymagania,
- dla kogo jest kurs,
- opinie,
- FAQ,
- polecane kursy.

---

## 18. Strona szczegółowa pakietu

Strona pakietu powinna być podobna do strony kursu, ale wyraźnie podkreślać wartość zestawu.

Powinna zawierać:

- tytuł,
- liczbę kursów,
- cenę pakietu,
- cenę regularną produktów,
- informację o oszczędności,
- listę kursów w pakiecie,
- korzyści,
- opinie,
- FAQ,
- CTA zakupu.

Lista kursów w pakiecie powinna być czytelna i zawierać miniaturki lub ikony.

---

## 19. Koszyk

Koszyk powinien być prosty i pozbawiony zbędnych elementów.

Każda pozycja powinna zawierać:

- miniaturkę,
- nazwę,
- typ produktu,
- cenę,
- przycisk usuwania.

Nie należy pokazywać zmiany ilości.

Podsumowanie powinno zawierać:

- wartość produktów,
- rabat,
- pole kodu rabatowego,
- sumę,
- walutę,
- przycisk przejścia do płatności.

Na desktopie podsumowanie może być sticky.

---

## 20. Checkout

Checkout powinien być maksymalnie prosty.

Nie należy dodawać bocznych treści marketingowych.

Układ:

- dane kupującego,
- typ zakupu: osoba prywatna lub firma,
- dane do faktury,
- podsumowanie zamówienia,
- przycisk płatności.

Formularz powinien mieć:

- widoczne etykiety,
- jasne komunikaty błędów,
- odpowiednie typy pól,
- czytelne stany focus,
- walidację po stronie klienta i serwera.

---

## 21. Strona sukcesu

Strona sukcesu powinna wyraźnie potwierdzać zakup.

Powinna zawierać:

- ikonę sukcesu,
- komunikat,
- numer zamówienia,
- zakupione produkty,
- linki Udemy,
- informację o e-mailu,
- link do pobrania faktury,
- przycisk powrotu do sklepu.

Linki Udemy powinny być dobrze widoczne, ale dostępne wyłącznie po poprawnym zakupie.

---

## 22. Panel admina

Panel admina może mieć bardziej funkcjonalny wygląd niż część publiczna.

Powinien zawierać:

- boczne menu,
- górny pasek,
- dashboard,
- tabele,
- formularze,
- filtry,
- statusy,
- komunikaty sukcesu i błędu.

Menu powinno zawierać:

- Dashboard
- Kursy
- Pakiety
- Kategorie
- Opinie
- Kody Udemy
- Rabaty
- Promocje
- Zamówienia
- Faktury
- O mnie
- SEO
- Ustawienia

Panel powinien być czytelny na desktopie.

Na mobile menu może być ukrywane w drawerze.

---

## 23. Typografia

Rekomendowany font:

- Inter
- Geist
- Manrope

Należy wybrać jeden główny font i stosować go konsekwentnie.

Przykładowa hierarchia:

- H1 desktop: 48–64 px
- H1 mobile: 36–44 px
- H2 desktop: 36–44 px
- H2 mobile: 28–34 px
- H3: 22–28 px
- Body: 16–18 px
- Small: 13–14 px

Nagłówki powinny mieć dobrą czytelność i niezbyt mały line-height.

Nie należy używać wielu różnych krojów pisma.

---

## 24. Kolorystyka

Kolorystyka powinna być ograniczona.

Rekomendowana baza:

- tło główne: białe,
- tło sekcji: bardzo jasny szary lub delikatny odcień koloru marki,
- tekst główny: ciemny granat lub grafit,
- tekst pomocniczy: szary,
- kolor CTA: jeden główny kolor marki,
- sukces: zielony,
- błąd: czerwony,
- ostrzeżenie: bursztynowy.

Przykładowa paleta startowa:

```text
Primary: #2563EB
Primary hover: #1D4ED8
Text: #0F172A
Muted text: #64748B
Background: #FFFFFF
Section background: #F8FAFC
Border: #E2E8F0
Success: #16A34A
Error: #DC2626
Warning: #D97706
```

Kolory mogą zostać zmienione po ustaleniu finalnego brandingu.

Nie należy dodawać wielu jaskrawych kolorów.

---

## 25. Przyciski

Podstawowe warianty:

- primary,
- secondary,
- ghost,
- destructive.

Przycisk primary:

- wypełniony kolorem marki,
- biały tekst,
- czytelny hover,
- widoczny focus.

Przycisk secondary:

- jasne tło lub białe tło,
- obramowanie,
- ciemny tekst.

Wysokość przycisków:

- standard: 44–48 px,
- duży CTA: 48–56 px.

Zaokrąglenie:

- 8–12 px.

Nie należy stosować bardzo dużych, „pigułkowych” przycisków wszędzie.

---

## 26. Pola formularzy

Pola powinny mieć:

- wysokość 44–48 px,
- widoczną etykietę,
- placeholder,
- stan focus,
- stan błędu,
- komunikat walidacyjny.

Zaokrąglenie:

- 8–10 px.

Obramowanie powinno być delikatne, ale czytelne.

---

## 27. Siatka i szerokość treści

Maksymalna szerokość głównego kontenera:

```text
1200–1280 px
```

Rekomendowane boczne odstępy:

- desktop: 32 px,
- tablet: 24 px,
- mobile: 16–20 px.

Siatka kart:

- desktop: 3–4 kolumny,
- tablet: 2 kolumny,
- mobile: 1 kolumna.

---

## 28. Odstępy

Należy stosować spójny system odstępów oparty na wielokrotnościach 4 lub 8 px.

Przykładowe wartości:

```text
4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 120
```

Odstęp między dużymi sekcjami:

- desktop: 80–120 px,
- mobile: 56–80 px.

---

## 29. Zaokrąglenia i cienie

Rekomendowane zaokrąglenia:

- małe elementy: 6–8 px,
- pola i przyciski: 8–12 px,
- karty: 12–16 px,
- duże sekcje: 16–24 px.

Cienie powinny być delikatne.

Nie należy stosować mocnych, ciemnych cieni.

---

## 30. Ikony

Należy używać jednego zestawu ikon.

Rekomendowane:

- Lucide Icons,
- Heroicons.

Ikony powinny mieć spójny styl i podobną grubość linii.

Nie należy mieszać kilku bibliotek ikon.

---

## 31. Animacje

Animacje powinny być subtelne.

Dozwolone:

- fade-in,
- delikatny slide-up,
- hover,
- zmiana koloru,
- niewielkie uniesienie karty,
- otwieranie accordiona,
- modal z lekkim przejściem.

Czas animacji:

```text
150–300 ms
```

Nie należy stosować:

- parallax,
- ciągłych animacji,
- migających elementów,
- agresywnych skalowań,
- ciężkich animacji 3D.

Należy respektować `prefers-reduced-motion`.

---

## 32. Responsywność

Projekt musi być w pełni responsywny.

Priorytetowe szerokości:

- mobile: 360–480 px,
- tablet: 768–1024 px,
- desktop: 1280 px i więcej.

Na mobile:

- menu powinno być uproszczone,
- karty powinny mieć pełną szerokość,
- przyciski CTA mogą zajmować pełną szerokość,
- wyszukiwarka musi być łatwa do użycia,
- sticky elementy nie mogą zasłaniać treści,
- tabele w panelu admina mogą przewijać się poziomo.

---

## 33. Dostępność

Projekt powinien spełniać podstawowe wymagania WCAG.

Należy zapewnić:

- poprawny kontrast,
- obsługę klawiatury,
- widoczne focus states,
- etykiety formularzy,
- teksty alternatywne obrazów,
- poprawną hierarchię nagłówków,
- odpowiednie atrybuty ARIA,
- czytelne komunikaty błędów,
- przyciski i linki o odpowiednio dużym obszarze kliknięcia.

Nie należy polegać wyłącznie na kolorze do przekazywania statusu.

---

## 34. Obrazy i miniaturki

Obrazy powinny być:

- zoptymalizowane,
- ładowane przez `next/image`,
- responsywne,
- posiadać sensowne `alt`,
- zapisane w WebP lub AVIF, jeśli to możliwe.

Miniaturki kursów powinny mieć spójne proporcje.

Rekomendowana proporcja:

```text
16:9
```

Nie należy rozciągać obrazów.

---

## 35. Stany interfejsu

Każdy komponent danych powinien uwzględniać:

- loading,
- empty state,
- error state,
- success state.

Przykłady:

- skeleton kart podczas ładowania,
- komunikat „Brak wyników”,
- komunikat błędu API,
- potwierdzenie dodania do koszyka.

---

## 36. Powiadomienia

Do krótkich komunikatów należy stosować toast.

Przykłady:

- Produkt dodany do koszyka
- Kod rabatowy został zastosowany
- Nie udało się pobrać danych
- Zmiany zostały zapisane

Toasty nie powinny blokować interfejsu.

---

## 37. Modale i drawery

Modal może być używany do:

- filmu promocyjnego,
- potwierdzenia usunięcia,
- formularza pomocniczego,
- podglądu faktury.

Drawer może być używany do:

- menu mobilnego,
- filtrów,
- koszyka bocznego.

Modal musi mieć:

- zamknięcie ikoną,
- zamknięcie klawiszem Escape,
- focus trap,
- poprawne ARIA.

---

## 38. SEO i widoczna treść

Treści ważne dla SEO nie powinny być ukrywane wyłącznie w JavaScript.

Nagłówki, opisy kursów i główne informacje powinny być renderowane po stronie serwera, jeśli to możliwe.

Każda strona powinna mieć jeden główny H1.

---

## 39. Zasady implementacji w Tailwind CSS

Należy:

- używać spójnych klas,
- tworzyć komponenty wielokrotnego użytku,
- unikać duplikowania długich zestawów klas,
- korzystać z CSS variables dla kolorów i tokenów,
- zdefiniować podstawowe tokeny design systemu.

Przykładowe zmienne:

```css
--background
--foreground
--primary
--primary-foreground
--muted
--muted-foreground
--border
--success
--error
--radius
```

---

## 40. Komponenty wymagane w projekcie

Należy przygotować między innymi:

- `Header`
- `Footer`
- `LanguageSwitcher`
- `CartButton`
- `HeroSection`
- `SearchBox`
- `SearchResults`
- `CourseCard`
- `BundleCard`
- `CategoryFilter`
- `ProductGrid`
- `ReviewCard`
- `FAQAccordion`
- `AuthorSection`
- `PriceDisplay`
- `SaleBadge`
- `AddToCartButton`
- `BuyNowButton`
- `PromoVideoModal`
- `CartDrawer`
- `EmptyState`
- `LoadingSkeleton`
- `Toast`
- `Pagination`
- `AdminSidebar`
- `AdminTable`
- `AdminForm`

Komponenty powinny być możliwie niezależne od konkretnego języka.

Teksty powinny pochodzić z systemu tłumaczeń.

---

## 41. Zasady odwzorowania projektu graficznego

Codex powinien:

1. najpierw przeanalizować projekt graficzny,
2. zidentyfikować sekcje,
3. rozpoznać powtarzalne komponenty,
4. utworzyć tokeny kolorów i odstępów,
5. wdrożyć layout desktopowy,
6. wdrożyć wersję mobilną,
7. porównać rezultat z projektem,
8. poprawić różnice w odstępach, typografii i proporcjach.

Nie należy:

- generować przypadkowego UI,
- zastępować projektu domyślnymi komponentami,
- dodawać gradientów, których nie ma w projekcie,
- dodawać zbędnych sekcji,
- zmieniać kolejności sekcji bez potrzeby.

---

## 42. Priorytety projektowe

Kolejność priorytetów:

1. funkcjonalność,
2. czytelność,
3. zgodność z projektem graficznym,
4. responsywność,
5. dostępność,
6. wydajność,
7. animacje i dekoracje.

Jeżeli efekt wizualny pogarsza użyteczność, należy wybrać użyteczność.

---

## 43. Kryteria akceptacji frontendu

Frontend można uznać za poprawnie wdrożony, jeżeli:

- odwzorowuje dostarczone projekty,
- działa na desktopie, tablecie i mobile,
- ma spójne komponenty,
- strona główna nie jest przeładowana,
- Hero jest kompaktowy,
- Hero zawiera grafikę,
- wyszukiwarka jest wyraźnie widoczna,
- karty kursów i pakietów są czytelne,
- koszyk jest prosty,
- wszystkie interaktywne elementy mają stany hover, focus i disabled,
- interfejs działa w języku polskim, niemieckim i angielskim,
- kolory i odstępy są spójne,
- layout nie przesuwa się podczas ładowania,
- obrazy są zoptymalizowane,
- interfejs nie zawiera zbędnych elementów.

---

## 44. Ważne instrukcje dla Codexa

Przed rozpoczęciem implementacji:

1. przeczytaj cały plik `SPECYFIKACJA.md`,
2. przeczytaj cały plik `DESIGN_GUIDE.md`,
3. przeanalizuj pliki w katalogu `/design`,
4. nie implementuj całej aplikacji w jednym kroku,
5. dziel pracę na logiczne etapy,
6. po każdym etapie uruchom lint, typecheck i testy,
7. nie zmieniaj wymagań biznesowych bez wyraźnej instrukcji,
8. nie dodawaj kont użytkowników,
9. nie mieszaj języków i walut,
10. nie ujawniaj linków Udemy przed zakupem.

---

## 45. Pierwszy etap implementacji designu

Pierwszy etap powinien obejmować wyłącznie:

- layout publiczny,
- Header,
- Footer,
- Hero,
- grafikę Hero,
- wyszukiwarkę w wersji wizualnej,
- sekcję kursów,
- sekcję pakietów,
- sekcję opinii,
- sekcję autora,
- FAQ,
- responsywność strony głównej.

Na tym etapie można użyć danych mockowych.

Nie należy jeszcze wdrażać:

- Stripe,
- webhooków,
- faktur,
- e-maili,
- panelu admina,
- pełnego checkoutu.

Po zaakceptowaniu wyglądu strony głównej można przejść do kolejnych podstron.
