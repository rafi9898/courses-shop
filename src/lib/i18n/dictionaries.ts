import { type Locale } from "@/lib/i18n/config";

export const dictionaries = {
  pl: {
    nav: {
      courses: "Kursy",
      bundles: "Pakiety",
      categories: "Kategorie",
      about: "O mnie",
      faq: "FAQ",
      cart: "Koszyk"
    },
    routes: {
      courses: "/pl/kursy",
      bundles: "/pl/pakiety",
      categories: "/pl/kategorie",
      about: "/pl/o-mnie",
      faq: "/pl/faq",
      cart: "/pl/koszyk"
    },
    home: {
      badge: "Kursy z Udemy",
      heroTitleStart: "Praktyczne kursy online, które rozwijają",
      heroTitleAccent: "Twoje umiejętności",
      heroLead:
        "Kupujesz raz, uczysz się na Udemy. Otrzymujesz aktualny kod promocyjny i dostęp do kursu.",
      primaryCta: "Przeglądaj kursy",
      secondaryCta: "Zobacz pakiety",
      searchPlaceholder: "Szukaj kursów i pakietów...",
      searchButton: "Szukaj",
      categorySelect: "Kategoria",
      popularCategories: "Popularne kategorie:",
      featuredTitle: "Najpopularniejsze kursy i pakiety",
      seeAll: "Zobacz wszystkie",
      coursesTitle: "Popularne kursy",
      bundlesTitle: "Popularne pakiety",
      reviewsTitle: "Opinie kursantów",
      authorTitle: "Cześć! Jestem autor kursów i książek.",
      authorText:
        "Tworzę praktyczne materiały, które pomagają rozwijać realne umiejętności i osiągać cele zawodowe.",
      authorCta: "Dowiedz się więcej o mnie",
      faqTitle: "Najczęściej zadawane pytania",
      addToCart: "Dodaj do koszyka",
      viewCourse: "Zobacz kurs",
      viewBundle: "Zobacz pakiet",
      noResults: "Brak wyników dla tej frazy.",
      typeCourse: "Kurs",
      typeBundle: "Pakiet"
    },
    stats: {
      students: "Zadowolonych kursantów",
      rating: "Średnia ocen na Udemy",
      courses: "Kursów online"
    },
    benefits: {
      verified: "Sprawdzone i aktualne",
      prices: "Kody rabatowe w cenie",
      access: "Otrzymujesz kod e-mailem"
    }
  },
  de: {
    nav: {
      courses: "Kurse",
      bundles: "Pakete",
      categories: "Kategorien",
      about: "Über mich",
      faq: "FAQ",
      cart: "Warenkorb"
    },
    routes: {
      courses: "/de/kurse",
      bundles: "/de/pakete",
      categories: "/de/kategorien",
      about: "/de/uber-mich",
      faq: "/de/faq",
      cart: "/de/warenkorb"
    },
    home: {
      badge: "Udemy-Kurse",
      heroTitleStart: "Praktische Online-Kurse, die",
      heroTitleAccent: "deine Fähigkeiten entwickeln",
      heroLead:
        "Du kaufst einmal und lernst auf Udemy. Du erhältst einen aktuellen Gutscheincode und Zugang zum Kurs.",
      primaryCta: "Kurse ansehen",
      secondaryCta: "Pakete ansehen",
      searchPlaceholder: "Kurse und Pakete suchen...",
      searchButton: "Suchen",
      categorySelect: "Kategorie",
      popularCategories: "Beliebte Kategorien:",
      featuredTitle: "Beliebte Kurse und Pakete",
      seeAll: "Alle ansehen",
      coursesTitle: "Beliebte Kurse",
      bundlesTitle: "Beliebte Pakete",
      reviewsTitle: "Stimmen der Lernenden",
      authorTitle: "Hallo! Ich bin Autor von Kursen und Büchern.",
      authorText:
        "Ich erstelle praktische Materialien, die reale Fähigkeiten und berufliche Ziele unterstützen.",
      authorCta: "Mehr über mich",
      faqTitle: "Häufige Fragen",
      addToCart: "In den Warenkorb",
      viewCourse: "Kurs ansehen",
      viewBundle: "Paket ansehen",
      noResults: "Keine Ergebnisse für diese Suche.",
      typeCourse: "Kurs",
      typeBundle: "Paket"
    },
    stats: {
      students: "zufriedene Teilnehmende",
      rating: "Durchschnittsbewertung",
      courses: "Online-Kurse"
    },
    benefits: {
      verified: "Geprüft und aktuell",
      prices: "Gutscheincodes inklusive",
      access: "Code per E-Mail"
    }
  },
  en: {
    nav: {
      courses: "Courses",
      bundles: "Bundles",
      categories: "Categories",
      about: "About",
      faq: "FAQ",
      cart: "Cart"
    },
    routes: {
      courses: "/en/courses",
      bundles: "/en/bundles",
      categories: "/en/categories",
      about: "/en/about",
      faq: "/en/faq",
      cart: "/en/cart"
    },
    home: {
      badge: "Udemy courses",
      heroTitleStart: "Practical online courses that grow",
      heroTitleAccent: "your skills",
      heroLead:
        "Buy once and learn on Udemy. You receive the current promo code and course access.",
      primaryCta: "Browse courses",
      secondaryCta: "View bundles",
      searchPlaceholder: "Search courses and bundles...",
      searchButton: "Search",
      categorySelect: "Category",
      popularCategories: "Popular categories:",
      featuredTitle: "Most popular courses and bundles",
      seeAll: "View all",
      coursesTitle: "Popular courses",
      bundlesTitle: "Popular bundles",
      reviewsTitle: "Student reviews",
      authorTitle: "Hi! I create courses and books.",
      authorText:
        "I create practical learning materials that help people build real skills and reach career goals.",
      authorCta: "Learn more about me",
      faqTitle: "Frequently asked questions",
      addToCart: "Add to cart",
      viewCourse: "View course",
      viewBundle: "View bundle",
      noResults: "No results for this search.",
      typeCourse: "Course",
      typeBundle: "Bundle"
    },
    stats: {
      students: "happy students",
      rating: "average Udemy rating",
      courses: "online courses"
    },
    benefits: {
      verified: "Verified and current",
      prices: "Promo codes included",
      access: "Code delivered by e-mail"
    }
  }
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
