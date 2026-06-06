import { type Locale } from "@/lib/i18n/config";

export type Category = {
  id: string;
  label: Record<Locale, string>;
  description: Record<Locale, string>;
  color: "violet" | "blue" | "emerald" | "amber" | "slate";
};

export type Course = {
  id: string;
  type: "course";
  title: Record<Locale, string>;
  slug: Record<Locale, string>;
  categoryId: string;
  level: "beginner" | "intermediate" | "advanced";
  rating: number;
  reviews: number;
  price: Record<Locale, number>;
  regularPrice: Record<Locale, number>;
  durationHours: number;
  lessons: number;
  highlights: Record<Locale, string[]>;
  outcomes: Record<Locale, string[]>;
  agenda: Record<Locale, { title: string; lessons: number; duration: string }[]>;
  thumbnail: {
    title: string;
    subtitle: string;
    variant: "dark" | "blue" | "purple" | "green";
  };
};

export type Bundle = {
  id: string;
  type: "bundle";
  title: Record<Locale, string>;
  slug: Record<Locale, string>;
  categoryId: string;
  description: Record<Locale, string>;
  courseIds: string[];
  courseCount: number;
  rating: number;
  reviews: number;
  price: Record<Locale, number>;
  regularPrice: Record<Locale, number>;
  thumbnail: {
    title: string;
    subtitle: string;
    variant: "dark" | "blue" | "purple" | "green";
  };
};

export type Product = Course | Bundle;

export const categories: Category[] = [
  {
    id: "testing",
    label: { pl: "Testowanie", de: "Software Testing", en: "Software Testing" },
    description: {
      pl: "Naucz się testować oprogramowanie i zapewniać jakość produktów.",
      de: "Lerne Software zu testen und Produktqualität sicherzustellen.",
      en: "Learn to test software and improve product quality."
    },
    color: "violet"
  },
  {
    id: "programming",
    label: { pl: "Programowanie", de: "Programmierung", en: "Programming" },
    description: {
      pl: "Poznaj języki programowania i twórz nowoczesne aplikacje.",
      de: "Lerne Programmiersprachen und entwickle moderne Anwendungen.",
      en: "Learn programming languages and build modern applications."
    },
    color: "blue"
  },
  {
    id: "ai",
    label: { pl: "AI", de: "KI", en: "AI" },
    description: {
      pl: "Sztuczna inteligencja i uczenie maszynowe w praktyce.",
      de: "Künstliche Intelligenz und Machine Learning in der Praxis.",
      en: "Artificial intelligence and machine learning in practice."
    },
    color: "violet"
  },
  {
    id: "cloud",
    label: { pl: "Cloud", de: "Cloud", en: "Cloud" },
    description: {
      pl: "Technologie chmurowe i projektowanie rozwiązań w chmurze.",
      de: "Cloud-Technologien und Entwurf von Cloud-Lösungen.",
      en: "Cloud technologies and cloud solution design."
    },
    color: "blue"
  },
  {
    id: "devops",
    label: { pl: "DevOps", de: "DevOps", en: "DevOps" },
    description: {
      pl: "Automatyzacja, CI/CD i narzędzia DevOps w codziennej pracy.",
      de: "Automatisierung, CI/CD und DevOps-Werkzeuge für den Alltag.",
      en: "Automation, CI/CD and DevOps tools for everyday work."
    },
    color: "emerald"
  },
  {
    id: "sql",
    label: { pl: "SQL i dane", de: "SQL und Daten", en: "SQL & Data" },
    description: {
      pl: "Bazy danych, SQL i analiza danych od praktycznej strony.",
      de: "Datenbanken, SQL und Datenanalyse aus praktischer Sicht.",
      en: "Databases, SQL and data analysis from a practical angle."
    },
    color: "amber"
  }
];

export const courses: Course[] = [
  {
    id: "postman",
    type: "course",
    title: { pl: "Postman od podstaw", de: "Postman Grundlagen", en: "Postman Fundamentals" },
    slug: { pl: "postman-od-podstaw", de: "postman-grundlagen", en: "postman-fundamentals" },
    categoryId: "testing",
    level: "beginner",
    rating: 4.8,
    reviews: 1234,
    price: { pl: 39, de: 12.99, en: 9.99 },
    regularPrice: { pl: 59, de: 19.99, en: 14.99 },
    durationHours: 7,
    lessons: 65,
    highlights: courseHighlights("Postman", "Postman", "Postman"),
    outcomes: courseOutcomes("Postman", "Postman", "Postman"),
    agenda: courseAgenda("Postman", "Postman", "Postman"),
    thumbnail: { title: "POSTMAN", subtitle: "OD PODSTAW", variant: "dark" }
  },
  {
    id: "docker",
    type: "course",
    title: { pl: "Docker dla początkujących", de: "Docker für Einsteiger", en: "Docker for Beginners" },
    slug: { pl: "docker-dla-poczatkujacych", de: "docker-fur-einsteiger", en: "docker-for-beginners" },
    categoryId: "devops",
    level: "beginner",
    rating: 4.7,
    reviews: 987,
    price: { pl: 49, de: 14.99, en: 12.99 },
    regularPrice: { pl: 79, de: 24.99, en: 19.99 },
    durationHours: 8,
    lessons: 58,
    highlights: courseHighlights("Docker", "Docker", "Docker"),
    outcomes: courseOutcomes("Docker", "Docker", "Docker"),
    agenda: courseAgenda("Docker", "Docker", "Docker"),
    thumbnail: { title: "docker", subtitle: "DLA POCZĄTKUJĄCYCH", variant: "blue" }
  },
  {
    id: "python",
    type: "course",
    title: { pl: "Python od podstaw", de: "Python Grundlagen", en: "Python Fundamentals" },
    slug: { pl: "python-od-podstaw", de: "python-grundlagen", en: "python-fundamentals" },
    categoryId: "programming",
    level: "beginner",
    rating: 4.9,
    reviews: 2341,
    price: { pl: 39, de: 12.99, en: 9.99 },
    regularPrice: { pl: 59, de: 19.99, en: 14.99 },
    durationHours: 9,
    lessons: 72,
    highlights: courseHighlights("Python", "Python", "Python"),
    outcomes: courseOutcomes("Python", "Python", "Python"),
    agenda: courseAgenda("Python", "Python", "Python"),
    thumbnail: { title: "python", subtitle: "OD PODSTAW", variant: "dark" }
  },
  {
    id: "sql",
    type: "course",
    title: { pl: "SQL praktyczny kurs", de: "SQL Praxiskurs", en: "Practical SQL Course" },
    slug: { pl: "sql-praktyczny-kurs", de: "sql-praxiskurs", en: "practical-sql-course" },
    categoryId: "sql",
    level: "intermediate",
    rating: 4.8,
    reviews: 1102,
    price: { pl: 44, de: 13.99, en: 11.99 },
    regularPrice: { pl: 69, de: 22.99, en: 17.99 },
    durationHours: 6,
    lessons: 48,
    highlights: courseHighlights("SQL", "SQL", "SQL"),
    outcomes: courseOutcomes("SQL", "SQL", "SQL"),
    agenda: courseAgenda("SQL", "SQL", "SQL"),
    thumbnail: { title: "SQL", subtitle: "PRAKTYCZNY KURS", variant: "purple" }
  },
  {
    id: "javascript",
    type: "course",
    title: { pl: "JavaScript od podstaw", de: "JavaScript Grundlagen", en: "JavaScript Fundamentals" },
    slug: { pl: "javascript-od-podstaw", de: "javascript-grundlagen", en: "javascript-fundamentals" },
    categoryId: "programming",
    level: "beginner",
    rating: 4.8,
    reviews: 1789,
    price: { pl: 49, de: 14.99, en: 12.99 },
    regularPrice: { pl: 79, de: 24.99, en: 19.99 },
    durationHours: 8,
    lessons: 61,
    highlights: courseHighlights("JavaScript", "JavaScript", "JavaScript"),
    outcomes: courseOutcomes("JavaScript", "JavaScript", "JavaScript"),
    agenda: courseAgenda("JavaScript", "JavaScript", "JavaScript"),
    thumbnail: { title: "JAVASCRIPT", subtitle: "OD PODSTAW", variant: "blue" }
  },
  {
    id: "ai",
    type: "course",
    title: { pl: "AI dla każdego", de: "KI für alle", en: "AI for Everyone" },
    slug: { pl: "ai-dla-kazdego", de: "ki-fur-alle", en: "ai-for-everyone" },
    categoryId: "ai",
    level: "beginner",
    rating: 4.9,
    reviews: 713,
    price: { pl: 69, de: 19.99, en: 16.99 },
    regularPrice: { pl: 109, de: 34.99, en: 29.99 },
    durationHours: 5,
    lessons: 42,
    highlights: courseHighlights("AI", "KI", "AI"),
    outcomes: courseOutcomes("AI", "KI", "AI"),
    agenda: courseAgenda("AI", "KI", "AI"),
    thumbnail: { title: "AI", subtitle: "DLA KAŻDEGO", variant: "purple" }
  },
  {
    id: "api",
    type: "course",
    title: { pl: "API od podstaw", de: "API Grundlagen", en: "API Fundamentals" },
    slug: { pl: "api-od-podstaw", de: "api-grundlagen", en: "api-fundamentals" },
    categoryId: "programming",
    level: "intermediate",
    rating: 4.7,
    reviews: 743,
    price: { pl: 59, de: 17.99, en: 14.99 },
    regularPrice: { pl: 89, de: 29.99, en: 24.99 },
    durationHours: 6,
    lessons: 54,
    highlights: courseHighlights("API", "API", "API"),
    outcomes: courseOutcomes("API", "API", "API"),
    agenda: courseAgenda("API", "API", "API"),
    thumbnail: { title: "API", subtitle: "OD PODSTAW", variant: "green" }
  },
  {
    id: "aws",
    type: "course",
    title: { pl: "AWS praktycznie", de: "AWS praktisch", en: "Practical AWS" },
    slug: { pl: "aws-praktycznie", de: "aws-praktisch", en: "practical-aws" },
    categoryId: "cloud",
    level: "intermediate",
    rating: 4.7,
    reviews: 812,
    price: { pl: 79, de: 22.99, en: 19.99 },
    regularPrice: { pl: 119, de: 39.99, en: 34.99 },
    durationHours: 7,
    lessons: 53,
    highlights: courseHighlights("AWS", "AWS", "AWS"),
    outcomes: courseOutcomes("AWS", "AWS", "AWS"),
    agenda: courseAgenda("AWS", "AWS", "AWS"),
    thumbnail: { title: "AWS", subtitle: "PRAKTYCZNIE", variant: "blue" }
  },
  {
    id: "cicd",
    type: "course",
    title: { pl: "CI/CD w praktyce", de: "CI/CD in der Praxis", en: "Practical CI/CD" },
    slug: { pl: "cicd-w-praktyce", de: "cicd-in-der-praxis", en: "practical-cicd" },
    categoryId: "devops",
    level: "advanced",
    rating: 4.9,
    reviews: 634,
    price: { pl: 69, de: 19.99, en: 16.99 },
    regularPrice: { pl: 99, de: 32.99, en: 27.99 },
    durationHours: 6,
    lessons: 47,
    highlights: courseHighlights("CI/CD", "CI/CD", "CI/CD"),
    outcomes: courseOutcomes("CI/CD", "CI/CD", "CI/CD"),
    agenda: courseAgenda("CI/CD", "CI/CD", "CI/CD"),
    thumbnail: { title: "CI/CD", subtitle: "W PRAKTYCE", variant: "green" }
  },
  {
    id: "typescript",
    type: "course",
    title: { pl: "TypeScript od podstaw", de: "TypeScript Grundlagen", en: "TypeScript Fundamentals" },
    slug: { pl: "typescript-od-podstaw", de: "typescript-grundlagen", en: "typescript-fundamentals" },
    categoryId: "programming",
    level: "intermediate",
    rating: 4.8,
    reviews: 932,
    price: { pl: 64, de: 18.99, en: 15.99 },
    regularPrice: { pl: 94, de: 29.99, en: 24.99 },
    durationHours: 6,
    lessons: 50,
    highlights: courseHighlights("TypeScript", "TypeScript", "TypeScript"),
    outcomes: courseOutcomes("TypeScript", "TypeScript", "TypeScript"),
    agenda: courseAgenda("TypeScript", "TypeScript", "TypeScript"),
    thumbnail: { title: "TYPESCRIPT", subtitle: "OD PODSTAW", variant: "blue" }
  }
];

export const bundles: Bundle[] = [
  {
    id: "qa-starter",
    type: "bundle",
    title: { pl: "QA Starter Pack", de: "QA Starter Pack", en: "QA Starter Pack" },
    slug: { pl: "qa-starter-pack", de: "qa-starter-pack", en: "qa-starter-pack" },
    categoryId: "testing",
    description: {
      pl: "Kompleksowy zestaw kursów dla testerów na każdym poziomie.",
      de: "Ein komplettes Kurspaket für Testerinnen und Tester auf jedem Niveau.",
      en: "A complete course bundle for testers at every level."
    },
    courseIds: ["postman", "api", "sql", "python", "typescript"],
    courseCount: 5,
    rating: 4.9,
    reviews: 856,
    price: { pl: 149, de: 39.99, en: 34.99 },
    regularPrice: { pl: 249, de: 69.99, en: 59.99 },
    thumbnail: { title: "QA", subtitle: "STARTER PACK", variant: "purple" }
  },
  {
    id: "devops",
    type: "bundle",
    title: { pl: "DevOps Essentials", de: "DevOps Essentials", en: "DevOps Essentials" },
    slug: { pl: "devops-essentials", de: "devops-essentials", en: "devops-essentials" },
    categoryId: "devops",
    description: {
      pl: "Narzędzia i praktyki DevOps w jednym kompletnym zestawie.",
      de: "DevOps-Werkzeuge und Praktiken in einem kompletten Paket.",
      en: "DevOps tools and practices in one complete bundle."
    },
    courseIds: ["docker", "cicd", "aws", "api"],
    courseCount: 4,
    rating: 4.9,
    reviews: 642,
    price: { pl: 179, de: 49.99, en: 39.99 },
    regularPrice: { pl: 279, de: 79.99, en: 69.99 },
    thumbnail: { title: "DEVOPS", subtitle: "ESSENTIALS", variant: "green" }
  },
  {
    id: "python-pack",
    type: "bundle",
    title: { pl: "Python Developer Pack", de: "Python Developer Pack", en: "Python Developer Pack" },
    slug: { pl: "python-developer-pack", de: "python-developer-pack", en: "python-developer-pack" },
    categoryId: "programming",
    description: {
      pl: "Zostań pewnym siebie programistą Python krok po kroku.",
      de: "Werde Schritt für Schritt sicherer in Python.",
      en: "Become a confident Python developer step by step."
    },
    courseIds: ["python", "api", "javascript", "typescript", "sql", "aws"],
    courseCount: 6,
    rating: 4.9,
    reviews: 1234,
    price: { pl: 219, de: 59.99, en: 49.99 },
    regularPrice: { pl: 329, de: 99.99, en: 84.99 },
    thumbnail: { title: "PYTHON", subtitle: "DEVELOPER PACK", variant: "blue" }
  },
  {
    id: "sql-data-pack",
    type: "bundle",
    title: { pl: "SQL & Data Pack", de: "SQL & Data Pack", en: "SQL & Data Pack" },
    slug: { pl: "sql-data-pack", de: "sql-data-pack", en: "sql-data-pack" },
    categoryId: "sql",
    description: {
      pl: "SQL, analiza danych i wizualizacja w praktyce.",
      de: "SQL, Datenanalyse und Visualisierung in der Praxis.",
      en: "SQL, data analysis and visualization in practice."
    },
    courseIds: ["sql", "python", "api", "typescript", "ai"],
    courseCount: 5,
    rating: 4.8,
    reviews: 812,
    price: { pl: 179, de: 49.99, en: 39.99 },
    regularPrice: { pl: 279, de: 79.99, en: 69.99 },
    thumbnail: { title: "SQL", subtitle: "DATA PACK", variant: "purple" }
  },
  {
    id: "ai-pack",
    type: "bundle",
    title: { pl: "AI Pack", de: "KI Pack", en: "AI Pack" },
    slug: { pl: "ai-pack", de: "ki-pack", en: "ai-pack" },
    categoryId: "ai",
    description: {
      pl: "Sztuczna inteligencja od podstaw po praktyczne zastosowania.",
      de: "Künstliche Intelligenz von Grundlagen bis Praxis.",
      en: "Artificial intelligence from fundamentals to practical use."
    },
    courseIds: ["ai", "python", "api", "sql", "typescript"],
    courseCount: 5,
    rating: 4.9,
    reviews: 721,
    price: { pl: 249, de: 69.99, en: 59.99 },
    regularPrice: { pl: 399, de: 119.99, en: 99.99 },
    thumbnail: { title: "AI", subtitle: "PACK", variant: "purple" }
  }
];

export const products: Product[] = [...courses, ...bundles];

export const reviews = [
  {
    name: "Anna Kowalska",
    rating: 5,
    text: {
      pl: "Kursy są konkretne, praktyczne i bardzo dobrze uporządkowane. Od razu mogłam wykorzystać materiał w pracy.",
      de: "Die Kurse sind konkret, praktisch und sehr gut strukturiert. Ich konnte das Wissen sofort anwenden.",
      en: "The courses are practical, focused and well structured. I could apply the material right away."
    }
  },
  {
    name: "Michał Nowak",
    rating: 5,
    text: {
      pl: "Świetne tempo, jasne przykłady i uczciwy opis tego, czego naprawdę trzeba się nauczyć.",
      de: "Gutes Tempo, klare Beispiele und ein ehrlicher Blick auf das, was wirklich wichtig ist.",
      en: "Great pacing, clear examples and an honest focus on what really matters."
    }
  },
  {
    name: "Julia Wiśniewska",
    rating: 5,
    text: {
      pl: "Pakiet pomógł mi szybko połączyć kilka tematów i przygotować się do nowych zadań.",
      de: "Das Paket half mir, mehrere Themen schnell zu verbinden und mich auf neue Aufgaben vorzubereiten.",
      en: "The bundle helped me connect several topics quickly and prepare for new tasks."
    }
  }
];

export const faq = [
  {
    category: "access",
    question: {
      pl: "Jak otrzymam dostęp do kursu?",
      de: "Wie erhalte ich Zugang zum Kurs?",
      en: "How do I get access to the course?"
    },
    answer: {
      pl: "Po zakupie zobaczysz linki na stronie sukcesu i otrzymasz je również w wiadomości e-mail.",
      de: "Nach dem Kauf siehst du die Links auf der Erfolgsseite und erhältst sie zusätzlich per E-Mail.",
      en: "After purchase you will see the links on the success page and receive them by e-mail."
    }
  },
  {
    category: "access",
    question: {
      pl: "Czy potrzebuję konta w sklepie?",
      de: "Brauche ich ein Konto im Shop?",
      en: "Do I need a shop account?"
    },
    answer: {
      pl: "Nie. Sklep nie wymaga kont klientów ani logowania.",
      de: "Nein. Der Shop benötigt keine Kundenkonten und kein Kundenlogin.",
      en: "No. The shop does not require customer accounts or login."
    }
  },
  {
    category: "courses",
    question: {
      pl: "Gdzie będę oglądać kurs?",
      de: "Wo sehe ich den Kurs?",
      en: "Where will I watch the course?"
    },
    answer: {
      pl: "Kurs oglądasz na Udemy, korzystając z aktualnego linku z kodem promocyjnym.",
      de: "Du lernst auf Udemy über den aktuellen Link mit Gutscheincode.",
      en: "You watch the course on Udemy using the current promo-code link."
    }
  },
  {
    category: "bundles",
    question: {
      pl: "Czy pakiety zawierają kilka kursów?",
      de: "Enthalten Pakete mehrere Kurse?",
      en: "Do bundles include multiple courses?"
    },
    answer: {
      pl: "Tak. Po zakupie pakietu otrzymasz linki Udemy do wszystkich kursów wchodzących w skład zestawu.",
      de: "Ja. Nach dem Kauf erhältst du Udemy-Links zu allen Kursen im Paket.",
      en: "Yes. After buying a bundle you receive Udemy links to every course included in it."
    }
  },
  {
    category: "invoices",
    question: {
      pl: "Czy otrzymam fakturę?",
      de: "Erhalte ich eine Rechnung?",
      en: "Will I receive an invoice?"
    },
    answer: {
      pl: "Tak. Faktura bez VAT zostanie wygenerowana po płatności i wysłana na adres e-mail.",
      de: "Ja. Eine Rechnung ohne MwSt. wird nach der Zahlung erstellt und per E-Mail gesendet.",
      en: "Yes. An invoice without VAT is generated after payment and sent by e-mail."
    }
  },
  {
    category: "discounts",
    question: {
      pl: "Jak działa kod rabatowy?",
      de: "Wie funktioniert ein Gutscheincode?",
      en: "How does a discount code work?"
    },
    answer: {
      pl: "Kod rabatowy sklepu obniża cenę zamówienia. Jest niezależny od kodu promocyjnego Udemy.",
      de: "Ein Shop-Gutscheincode reduziert den Bestellpreis. Er ist unabhängig vom Udemy-Gutscheincode.",
      en: "A shop discount code lowers the order price. It is separate from the Udemy promo code."
    }
  },
  {
    category: "payments",
    question: {
      pl: "Czy płatność jest bezpieczna?",
      de: "Ist die Zahlung sicher?",
      en: "Is payment secure?"
    },
    answer: {
      pl: "Tak. Płatności będą realizowane przez Stripe Checkout, bez własnego formularza karty w sklepie.",
      de: "Ja. Zahlungen werden über Stripe Checkout abgewickelt, ohne eigenes Kartenformular im Shop.",
      en: "Yes. Payments will be handled by Stripe Checkout, without a custom card form in the shop."
    }
  }
];

function courseHighlights(plTopic: string, deTopic: string, enTopic: string): Record<Locale, string[]> {
  return {
    pl: [
      `Ponad 5 godzin praktycznego materiału o ${plTopic}`,
      "Praktyczne przykłady i ćwiczenia",
      "Materiały do pobrania",
      "Certyfikat ukończenia na Udemy",
      "Dostęp do kursu bezterminowy"
    ],
    de: [
      `Mehr als 5 Stunden praktisches Material zu ${deTopic}`,
      "Praktische Beispiele und Übungen",
      "Materialien zum Herunterladen",
      "Abschlusszertifikat auf Udemy",
      "Unbefristeter Kurszugang"
    ],
    en: [
      `More than 5 hours of practical ${enTopic} material`,
      "Practical examples and exercises",
      "Downloadable materials",
      "Udemy completion certificate",
      "Lifetime course access"
    ]
  };
}

function courseOutcomes(plTopic: string, deTopic: string, enTopic: string): Record<Locale, string[]> {
  return {
    pl: [
      `Pracować z ${plTopic} w praktycznych scenariuszach`,
      "Organizować projekty i środowiska pracy",
      "Rozwiązywać typowe problemy krok po kroku",
      "Budować dobre nawyki techniczne",
      "Używać narzędzi w codziennej pracy",
      "Przygotować się do kolejnego poziomu nauki"
    ],
    de: [
      `${deTopic} in praktischen Szenarien einsetzen`,
      "Projekte und Arbeitsumgebungen organisieren",
      "Typische Probleme Schritt für Schritt lösen",
      "Gute technische Gewohnheiten aufbauen",
      "Werkzeuge im Alltag sicher verwenden",
      "Dich auf die nächste Lernstufe vorbereiten"
    ],
    en: [
      `Use ${enTopic} in practical scenarios`,
      "Organize projects and working environments",
      "Solve common problems step by step",
      "Build solid technical habits",
      "Use tools in everyday work",
      "Prepare for the next learning level"
    ]
  };
}

function courseAgenda(plTopic: string, deTopic: string, enTopic: string): Record<Locale, { title: string; lessons: number; duration: string }[]> {
  return {
    pl: [
      { title: `Wprowadzenie do ${plTopic}`, lessons: 6, duration: "35 min" },
      { title: "Podstawy i konfiguracja", lessons: 10, duration: "1h 10min" },
      { title: "Praktyczne scenariusze", lessons: 12, duration: "1h 25min" },
      { title: "Automatyzacja i dobre praktyki", lessons: 14, duration: "1h 45min" },
      { title: "Podsumowanie i kolejne kroki", lessons: 8, duration: "55 min" }
    ],
    de: [
      { title: `Einführung in ${deTopic}`, lessons: 6, duration: "35 min" },
      { title: "Grundlagen und Einrichtung", lessons: 10, duration: "1h 10min" },
      { title: "Praktische Szenarien", lessons: 12, duration: "1h 25min" },
      { title: "Automatisierung und Best Practices", lessons: 14, duration: "1h 45min" },
      { title: "Zusammenfassung und nächste Schritte", lessons: 8, duration: "55 min" }
    ],
    en: [
      { title: `Introduction to ${enTopic}`, lessons: 6, duration: "35 min" },
      { title: "Fundamentals and setup", lessons: 10, duration: "1h 10min" },
      { title: "Practical scenarios", lessons: 12, duration: "1h 25min" },
      { title: "Automation and best practices", lessons: 14, duration: "1h 45min" },
      { title: "Summary and next steps", lessons: 8, duration: "55 min" }
    ]
  };
}
