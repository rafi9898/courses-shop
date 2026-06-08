import { type Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getAbsoluteUrl } from "@/lib/routes";

type PublicPage = "home" | "courses" | "bundles" | "categories" | "about" | "faq";

const siteName = "Rafał Podraza";
const defaultTitle = "Rafał Podraza - praktyczne kursy online IT";
const defaultDescription =
  "Praktyczne kursy online z testowania oprogramowania, programowania, chmury, AI i nowoczesnych narzędzi IT.";
const defaultSocialImagePath = "/images/social-preview.png";

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
  about: {
    pl: "/pl/o-mnie",
    de: "/de/uber-mich",
    en: "/en/about"
  },
  faq: {
    pl: "/pl/faq",
    de: "/de/faq",
    en: "/en/faq"
  }
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
  about: {
    pl: "O mnie",
    de: "Über mich",
    en: "About"
  },
  faq: {
    pl: "FAQ",
    de: "FAQ",
    en: "FAQ"
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
  imageUrl
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  imageUrl?: string | null;
}): Metadata {
  return createMetadata({
    locale,
    path,
    title,
    description,
    images: imageUrl ? [getSiteUrl(imageUrl)] : undefined
  });
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

function createMetadata({
  locale,
  path,
  title,
  description,
  alternates,
  images
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  alternates?: Record<Locale, string>;
  images?: string[];
}): Metadata {
  const url = getSiteUrl(path);
  const metadataImages = images?.length ? images : [getSiteUrl(defaultSocialImagePath)];

  return {
    title: `${title} | ${siteName}`,
    description,
    alternates: {
      canonical: url,
      languages: alternates ? getLanguageAlternates(alternates) : undefined
    },
    openGraph: {
      type: "website",
      locale: localeNames[locale],
      siteName,
      title: `${title} | ${siteName}`,
      description,
      url,
      images: metadataImages
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
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

function getPublicPageDescription(locale: Locale, page: PublicPage, dictionary: ReturnType<typeof getDictionary>) {
  if (page === "home") return dictionary.home.heroLead;
  if (page === "courses") return dictionary.catalog.coursesLead;
  if (page === "bundles") return dictionary.catalog.bundlesLead;
  if (page === "categories") return dictionary.catalog.categoriesLead;
  if (page === "about") return dictionary.aboutPage.mission;
  if (page === "faq") return dictionary.faqPage.lead;

  return locale === "pl" ? defaultDescription : defaultDescription;
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(getSiteUrl("/")),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`
  },
  description: defaultDescription,
  applicationName: siteName,
  authors: [{ name: "Rafał Podraza", url: getSiteUrl("/en/about") }],
  creator: "Rafał Podraza",
  publisher: "Rafał Podraza",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg"
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
