import { type Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { legalDocuments, legalPagePaths } from "@/lib/legal-pages";
import { getAbsoluteUrl } from "@/lib/routes";

type PublicPage = "home" | "courses" | "bundles" | "categories" | "blog" | "about" | "faq" | "terms" | "privacy";

const siteName = "Rafał Podraza";
const defaultTitle = "Rafał Podraza - praktyczne kursy online IT";
const defaultDescription =
  "Praktyczne kursy online z testowania oprogramowania, programowania, chmury, AI i nowoczesnych narzędzi IT.";
const defaultSocialImagePath = "/images/social-preview.png";
const maxDescriptionLength = 160;

export const publicPagePaths: Record<PublicPage, Record<Locale, string>> = {
  home: {
    pl: "/pl",
    de: "/de",
    en: "/en"
  },
  courses: {
    pl: "/pl/kursy",
    de: "/de/kurse",
    en: "/en/courses"
  },
  bundles: {
    pl: "/pl/pakiety",
    de: "/de/pakete",
    en: "/en/bundles"
  },
  categories: {
    pl: "/pl/kategorie",
    de: "/de/kategorien",
    en: "/en/categories"
  },
  blog: {
    pl: "/pl/blog",
    de: "/de/blog",
    en: "/en/blog"
  },
  about: {
    pl: "/pl/o-mnie",
    de: "/de/uber-mich",
    en: "/en/about"
  },
  faq: {
    pl: "/pl/faq",
    de: "/de/faq",
    en: "/en/faq"
  },
  terms: legalPagePaths.terms,
  privacy: legalPagePaths.privacy
};

const localeNames: Record<Locale, string> = {
  pl: "pl_PL",
  de: "de_DE",
  en: "en_US"
};

const publicPageTitles: Record<PublicPage, Record<Locale, string>> = {
  home: {
    pl: "Praktyczne kursy online IT",
    de: "Praktische Online-Kurse für IT",
    en: "Practical online IT courses"
  },
  courses: {
    pl: "Wszystkie kursy online",
    de: "Alle Online-Kurse",
    en: "All online courses"
  },
  bundles: {
    pl: "Pakiety kursów online",
    de: "Online-Kurspakete",
    en: "Online course bundles"
  },
  categories: {
    pl: "Kategorie kursów IT",
    de: "IT-Kurskategorien",
    en: "IT course categories"
  },
  blog: {
    pl: "Blog o IT, testowaniu i AI",
    de: "Blog über IT, Testing und KI",
    en: "Blog about IT, testing and AI"
  },
  about: {
    pl: "O mnie",
    de: "Über mich",
    en: "About"
  },
  faq: {
    pl: "FAQ",
    de: "FAQ",
    en: "FAQ"
  },
  terms: {
    pl: legalDocuments.pl.terms.title,
    de: legalDocuments.de.terms.title,
    en: legalDocuments.en.terms.title
  },
  privacy: {
    pl: legalDocuments.pl.privacy.title,
    de: legalDocuments.de.privacy.title,
    en: legalDocuments.en.privacy.title
  }
};

const defaultKeywords: Record<Locale, string[]> = {
  pl: [
    "Rafał Podraza",
    "kursy online",
    "kursy IT",
    "kursy Udemy",
    "testowanie oprogramowania",
    "programowanie",
    "automatyzacja testów",
    "AI w IT"
  ],
  de: [
    "Rafał Podraza",
    "Online-Kurse",
    "IT-Kurse",
    "Udemy-Kurse",
    "Software Testing",
    "Programmierung",
    "Testautomatisierung",
    "KI in IT"
  ],
  en: [
    "Rafał Podraza",
    "online courses",
    "IT courses",
    "Udemy courses",
    "software testing",
    "programming",
    "test automation",
    "AI in IT"
  ]
};

const publicPageKeywords: Record<PublicPage, Record<Locale, string[]>> = {
  home: {
    pl: ["praktyczne kursy online", "nauka IT online", "kursy dla testerów", "kursy programowania", "kursy chmury"],
    de: ["praktische Online-Kurse", "IT online lernen", "Kurse für Tester", "Programmierkurse", "Cloud-Kurse"],
    en: ["practical online courses", "learn IT online", "courses for testers", "programming courses", "cloud courses"]
  },
  courses: {
    pl: ["wszystkie kursy online", "kursy testowania", "kursy JavaScript", "kursy SQL", "kursy Postman"],
    de: ["alle Online-Kurse", "Testing-Kurse", "JavaScript-Kurse", "SQL-Kurse", "Postman-Kurse"],
    en: ["all online courses", "testing courses", "JavaScript courses", "SQL courses", "Postman courses"]
  },
  bundles: {
    pl: ["pakiety kursów", "pakiety Udemy", "zestawy kursów IT", "pakiet testera oprogramowania"],
    de: ["Kurspakete", "Udemy-Pakete", "IT-Kurspakete", "Software-Tester-Paket"],
    en: ["course bundles", "Udemy bundles", "IT course bundles", "software tester bundle"]
  },
  categories: {
    pl: ["kategorie kursów IT", "testowanie", "programowanie", "DevOps", "AWS", "SQL", "cyberbezpieczeństwo"],
    de: ["IT-Kurskategorien", "Testing", "Programmierung", "DevOps", "AWS", "SQL", "Cybersicherheit"],
    en: ["IT course categories", "testing", "programming", "DevOps", "AWS", "SQL", "cybersecurity"]
  },
  blog: {
    pl: ["blog IT", "poradniki IT", "testowanie oprogramowania", "AI w IT", "nauka programowania"],
    de: ["IT Blog", "IT Leitfäden", "Software Testing", "KI in IT", "Programmierung lernen"],
    en: ["IT blog", "IT guides", "software testing", "AI in IT", "learn programming"]
  },
  about: {
    pl: ["Rafał Podraza", "autor kursów online", "instruktor Udemy", "praktyczne szkolenia IT"],
    de: ["Rafał Podraza", "Online-Kursautor", "Udemy-Dozent", "praktische IT-Schulungen"],
    en: ["Rafał Podraza", "online course creator", "Udemy instructor", "practical IT training"]
  },
  faq: {
    pl: ["FAQ kursy online", "pytania o kursy", "kody Udemy", "płatności za kursy"],
    de: ["FAQ Online-Kurse", "Fragen zu Kursen", "Udemy-Codes", "Kurszahlungen"],
    en: ["online courses FAQ", "course questions", "Udemy codes", "course payments"]
  },
  terms: {
    pl: ["regulamin sklepu", "regulamin kursów online", "zakup kursów online"],
    de: ["AGB", "Online-Shop AGB", "Online-Kurse kaufen"],
    en: ["terms and conditions", "online shop terms", "buy online courses"]
  },
  privacy: {
    pl: ["polityka prywatności", "przetwarzanie danych", "cookies", "dane osobowe"],
    de: ["Datenschutzerklärung", "Datenverarbeitung", "Cookies", "personenbezogene Daten"],
    en: ["privacy policy", "data processing", "cookies", "personal data"]
  }
};

const productKeywordSeeds: Record<Locale, Record<"course" | "bundle", string[]>> = {
  pl: {
    course: ["kurs online", "kurs Udemy", "kurs IT", "praktyczny kurs", "szkolenie online"],
    bundle: ["pakiet kursów", "pakiet Udemy", "zestaw kursów", "kursy IT", "pakiet online"]
  },
  de: {
    course: ["Online-Kurs", "Udemy-Kurs", "IT-Kurs", "Praxis-Kurs", "Online-Schulung"],
    bundle: ["Kurspaket", "Udemy-Paket", "Kursbundle", "IT-Kurse", "Online-Paket"]
  },
  en: {
    course: ["online course", "Udemy course", "IT course", "practical course", "online training"],
    bundle: ["course bundle", "Udemy bundle", "IT courses", "online bundle", "course package"]
  }
};

export function getSiteUrl(path = "/") {
  return getAbsoluteUrl(path);
}

export function getPublicPageMetadata(locale: Locale, page: PublicPage): Metadata {
  const dictionary = getDictionary(locale);
  const path = publicPagePaths[page][locale];
  const title = publicPageTitles[page][locale];
  const description = getPublicPageDescription(locale, page, dictionary);

  return createMetadata({
    locale,
    path,
    title,
    description,
    keywords: createKeywords(defaultKeywords[locale], publicPageKeywords[page][locale], title, description),
    alternates: publicPagePaths[page]
  });
}

export function getNoIndexMetadata(title: string): Metadata {
  return {
    title,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false
      }
    }
  };
}

export function getProductMetadata({
  locale,
  path,
  title,
  description,
  imageUrl,
  keywords = []
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  keywords?: string[];
}): Metadata {
  const image = getMetadataImageUrl(imageUrl);

  return createMetadata({
    locale,
    path,
    title,
    description,
    keywords: createKeywords(defaultKeywords[locale], title, description, keywords),
    images: [image]
  });
}

export function getBlogPostMetadata({
  locale,
  path,
  title,
  description,
  imageUrl,
  keywords = []
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  keywords?: string[];
}): Metadata {
  const image = getMetadataImageUrl(imageUrl);

  return createMetadata({
    locale,
    path,
    title,
    description,
    keywords: createKeywords(defaultKeywords[locale], publicPageKeywords.blog[locale], title, description, keywords),
    images: [image],
    openGraphType: "article"
  });
}

export function getCatalogListingMetadata(locale: Locale, kind: "courses" | "bundles"): Metadata {
  const path = publicPagePaths[kind][locale];
  const title = catalogListingTitles[locale][kind];
  const description = catalogListingDescriptions[locale][kind];

  return createMetadata({
    locale,
    path,
    title,
    description,
    keywords: createKeywords(defaultKeywords[locale], publicPageKeywords[kind][locale], catalogListingTopics[locale][kind], title, description),
    alternates: publicPagePaths[kind]
  });
}

export function getProductKeywords({
  locale,
  kind,
  title,
  category,
  subtitle,
  highlights = [],
  outcomes = []
}: {
  locale: Locale;
  kind: "course" | "bundle";
  title: string;
  category?: string | null;
  subtitle?: string | null;
  highlights?: string[];
  outcomes?: string[];
}) {
  return createKeywords(
    productKeywordSeeds[locale][kind],
    title,
    category,
    subtitle,
    highlights.slice(0, 3),
    outcomes.slice(0, 3)
  );
}

export function createWebsiteJsonLd(locale: Locale) {
  const dictionary = getDictionary(locale);

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: getSiteUrl(publicPagePaths.home[locale]),
    inLanguage: locale,
    description: dictionary.home.heroLead,
    publisher: createPersonJsonLd(locale)
  };
}

export function createPersonJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Rafał Podraza",
    url: getSiteUrl(publicPagePaths.about[locale]),
    jobTitle: "Online course creator",
    knowsAbout: [
      "Software testing",
      "Test automation",
      "JavaScript",
      "TypeScript",
      "API",
      "Postman",
      "DevOps",
      "AWS",
      "Artificial intelligence",
      "Cybersecurity"
    ]
  };
}

export function createProductJsonLd({
  locale,
  path,
  name,
  description,
  price,
  currency,
  imageUrl
}: {
  locale: Locale;
  path: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    inLanguage: locale,
    image: imageUrl ? getSiteUrl(imageUrl) : undefined,
    brand: {
      "@type": "Brand",
      name: siteName
    },
    offers: {
      "@type": "Offer",
      url: getSiteUrl(path),
      price: price.toFixed(2),
      priceCurrency: currency,
      availability: "https://schema.org/InStock"
    }
  };
}

export function createBlogPostingJsonLd({
  locale,
  path,
  title,
  description,
  imageUrl,
  publishedAt,
  updatedAt
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  publishedAt: Date;
  updatedAt: Date;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    inLanguage: locale,
    image: imageUrl ? getSiteUrl(imageUrl) : getSiteUrl(defaultSocialImagePath),
    datePublished: publishedAt.toISOString(),
    dateModified: updatedAt.toISOString(),
    mainEntityOfPage: getSiteUrl(path),
    author: createPersonJsonLd(locale),
    publisher: createPersonJsonLd(locale)
  };
}

function createMetadata({
  locale,
  path,
  title,
  description,
  alternates,
  images,
  keywords,
  openGraphType = "website"
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  alternates?: Record<Locale, string>;
  images?: string[];
  keywords?: string[];
  openGraphType?: "website" | "article";
}): Metadata {
  const url = getSiteUrl(path);
  const metadataImages = images?.length ? images : [getSiteUrl(defaultSocialImagePath)];
  const normalizedDescription = normalizeDescription(description);

  return {
    title: `${title} | ${siteName}`,
    description: normalizedDescription,
    keywords: createKeywords(defaultKeywords[locale], keywords),
    alternates: {
      canonical: url,
      languages: alternates ? getLanguageAlternates(alternates) : undefined
    },
    openGraph: {
      type: openGraphType,
      locale: localeNames[locale],
      siteName,
      title: `${title} | ${siteName}`,
      description: normalizedDescription,
      url,
      images: metadataImages
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description: normalizedDescription,
      images: metadataImages
    }
  };
}

function getLanguageAlternates(paths: Record<Locale, string>) {
  return {
    ...Object.fromEntries(locales.map((locale) => [locale, getSiteUrl(paths[locale])])),
    "x-default": getSiteUrl(paths.en)
  };
}

function getMetadataImageUrl(imageUrl?: string | null) {
  if (!imageUrl) return getSiteUrl(defaultSocialImagePath);
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return getSiteUrl(imageUrl);
}

function createKeywords(...groups: Array<string | string[] | null | undefined>) {
  const seen = new Set<string>();
  const keywords: string[] = [];

  for (const group of groups) {
    const values = Array.isArray(group) ? group : [group];

    for (const value of values) {
      const keyword = normalizeKeyword(value);
      if (!keyword) continue;

      const key = keyword.toLocaleLowerCase();
      if (seen.has(key)) continue;

      seen.add(key);
      keywords.push(keyword);

      if (keywords.length >= 18) return keywords;
    }
  }

  return keywords;
}

function normalizeKeyword(value?: string | null) {
  if (!value) return "";
  const keyword = value.replace(/\s+/g, " ").replace(/[<>]/g, "").trim();
  if (keyword.length < 2 || keyword.length > 80) return "";
  return keyword;
}

function normalizeDescription(value: string) {
  const description = value.replace(/\s+/g, " ").trim();
  if (description.length <= maxDescriptionLength) return description;

  const shortened = description.slice(0, maxDescriptionLength - 1);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, lastSpace > 120 ? lastSpace : shortened.length).trim()}…`;
}

function getPublicPageDescription(locale: Locale, page: PublicPage, dictionary: ReturnType<typeof getDictionary>) {
  if (page === "home") return dictionary.home.heroLead;
  if (page === "courses") return dictionary.catalog.coursesLead;
  if (page === "bundles") return dictionary.catalog.bundlesLead;
  if (page === "categories") return dictionary.catalog.categoriesLead;
  if (page === "blog") {
    if (locale === "pl") return "Praktyczne wpisy o IT, testowaniu, automatyzacji, AI i nauce technologii od Rafała Podrazy.";
    if (locale === "de") return "Praktische Beiträge zu IT, Testing, Automatisierung, KI und dem Lernen neuer Technologien von Rafał Podraza.";
    return "Practical posts about IT, testing, automation, AI and learning technology from Rafał Podraza.";
  }
  if (page === "about") return dictionary.aboutPage.mission;
  if (page === "faq") return dictionary.faqPage.lead;
  if (page === "terms") return legalDocuments[locale].terms.description;
  if (page === "privacy") return legalDocuments[locale].privacy.description;

  return locale === "pl" ? defaultDescription : defaultDescription;
}

const catalogListingTitles: Record<Locale, Record<"courses" | "bundles", string>> = {
  pl: {
    courses: "Kursy online IT - testowanie, programowanie, AI i DevOps",
    bundles: "Pakiety kursów IT - zestawy do nauki w lepszej cenie"
  },
  de: {
    courses: "Online-IT-Kurse - Testing, Programmierung, KI und DevOps",
    bundles: "IT-Kurspakete - Lernpfade zum besseren Preis"
  },
  en: {
    courses: "Online IT courses - testing, programming, AI and DevOps",
    bundles: "IT course bundles - learning paths at a better price"
  }
};

const catalogListingDescriptions: Record<Locale, Record<"courses" | "bundles", string>> = {
  pl: {
    courses: "Przeglądaj praktyczne kursy online z testowania, programowania, SQL, Postman, Docker, AWS i AI. Wybierz poziom i ucz się we własnym tempie.",
    bundles: "Wybierz pakiet kursów online z testowania, programowania, DevOps, chmury albo AI. Ucz się więcej w lepszej cenie."
  },
  de: {
    courses: "Entdecke praktische Online-Kurse zu Testing, Programmierung, SQL, Postman, Docker, AWS und KI. Wähle dein Niveau und lerne in deinem Tempo.",
    bundles: "Wähle ein Online-Kurspaket für Testing, Programmierung, DevOps, Cloud oder KI und lerne mehr zum besseren Preis."
  },
  en: {
    courses: "Browse practical online courses in testing, programming, SQL, Postman, Docker, AWS and AI. Pick your level and learn at your own pace.",
    bundles: "Choose an online course bundle for testing, programming, DevOps, cloud or AI and learn more at a better price."
  }
};

const catalogListingTopics: Record<Locale, Record<"courses" | "bundles", string[]>> = {
  pl: {
    courses: ["kurs testowania online", "kurs programowania online", "kurs SQL", "kurs Postman", "kurs Docker", "kurs AWS", "kurs AI"],
    bundles: ["pakiety kursów IT", "pakiet testera", "pakiet programowania", "pakiet DevOps", "pakiet AI"]
  },
  de: {
    courses: ["Testing Online-Kurs", "Programmierkurs online", "SQL-Kurs", "Postman-Kurs", "Docker-Kurs", "AWS-Kurs", "KI-Kurs"],
    bundles: ["IT-Kurspakete", "Tester-Paket", "Programmierpaket", "DevOps-Paket", "KI-Paket"]
  },
  en: {
    courses: ["testing online course", "programming online course", "SQL course", "Postman course", "Docker course", "AWS course", "AI course"],
    bundles: ["IT course bundles", "software tester bundle", "programming bundle", "DevOps bundle", "AI bundle"]
  }
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(getSiteUrl("/")),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`
  },
  description: defaultDescription,
  keywords: defaultKeywords.pl,
  applicationName: siteName,
  authors: [{ name: "Rafał Podraza", url: getSiteUrl("/en/about") }],
  creator: "Rafał Podraza",
  publisher: "Rafał Podraza",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" }
    ],
    shortcut: "/favicon.ico",
    apple: "/icon-192.png"
  },
  openGraph: {
    type: "website",
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    url: getSiteUrl("/"),
    images: [getSiteUrl(defaultSocialImagePath)]
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [getSiteUrl(defaultSocialImagePath)]
  }
};
