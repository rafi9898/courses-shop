import { type Locale } from "@/lib/i18n/config";

export type Category = {
  id: string;
  label: Record<Locale, string>;
  color: "violet" | "blue" | "emerald" | "amber" | "slate";
};

export type Course = {
  id: string;
  type: "course";
  title: Record<Locale, string>;
  slug: Record<Locale, string>;
  categoryId: string;
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

export type Bundle = {
  id: string;
  type: "bundle";
  title: Record<Locale, string>;
  slug: Record<Locale, string>;
  categoryId: string;
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
    color: "violet"
  },
  {
    id: "programming",
    label: { pl: "Programowanie", de: "Programmierung", en: "Programming" },
    color: "blue"
  },
  { id: "ai", label: { pl: "AI", de: "KI", en: "AI" }, color: "purple" as "violet" },
  { id: "cloud", label: { pl: "Cloud", de: "Cloud", en: "Cloud" }, color: "blue" },
  { id: "devops", label: { pl: "DevOps", de: "DevOps", en: "DevOps" }, color: "emerald" },
  { id: "sql", label: { pl: "SQL", de: "SQL und Daten", en: "SQL & Data" }, color: "amber" }
];

export const courses: Course[] = [
  {
    id: "postman",
    type: "course",
    title: { pl: "Postman od podstaw", de: "Postman Grundlagen", en: "Postman Fundamentals" },
    slug: { pl: "postman-od-podstaw", de: "postman-grundlagen", en: "postman-fundamentals" },
    categoryId: "testing",
    rating: 4.8,
    reviews: 1234,
    price: { pl: 39, de: 12.99, en: 9.99 },
    regularPrice: { pl: 59, de: 19.99, en: 14.99 },
    thumbnail: { title: "POSTMAN", subtitle: "OD PODSTAW", variant: "dark" }
  },
  {
    id: "docker",
    type: "course",
    title: { pl: "Docker dla początkujących", de: "Docker für Einsteiger", en: "Docker for Beginners" },
    slug: { pl: "docker-dla-poczatkujacych", de: "docker-fur-einsteiger", en: "docker-for-beginners" },
    categoryId: "devops",
    rating: 4.7,
    reviews: 987,
    price: { pl: 49, de: 14.99, en: 12.99 },
    regularPrice: { pl: 79, de: 24.99, en: 19.99 },
    thumbnail: { title: "docker", subtitle: "DLA POCZĄTKUJĄCYCH", variant: "blue" }
  },
  {
    id: "python",
    type: "course",
    title: { pl: "Python od podstaw", de: "Python Grundlagen", en: "Python Fundamentals" },
    slug: { pl: "python-od-podstaw", de: "python-grundlagen", en: "python-fundamentals" },
    categoryId: "programming",
    rating: 4.9,
    reviews: 2341,
    price: { pl: 39, de: 12.99, en: 9.99 },
    regularPrice: { pl: 59, de: 19.99, en: 14.99 },
    thumbnail: { title: "python", subtitle: "OD PODSTAW", variant: "dark" }
  },
  {
    id: "sql",
    type: "course",
    title: { pl: "SQL praktyczny kurs", de: "SQL Praxiskurs", en: "Practical SQL Course" },
    slug: { pl: "sql-praktyczny-kurs", de: "sql-praxiskurs", en: "practical-sql-course" },
    categoryId: "sql",
    rating: 4.8,
    reviews: 1102,
    price: { pl: 44, de: 13.99, en: 11.99 },
    regularPrice: { pl: 69, de: 22.99, en: 17.99 },
    thumbnail: { title: "SQL", subtitle: "PRAKTYCZNY KURS", variant: "purple" }
  },
  {
    id: "javascript",
    type: "course",
    title: { pl: "JavaScript od podstaw", de: "JavaScript Grundlagen", en: "JavaScript Fundamentals" },
    slug: { pl: "javascript-od-podstaw", de: "javascript-grundlagen", en: "javascript-fundamentals" },
    categoryId: "programming",
    rating: 4.8,
    reviews: 1789,
    price: { pl: 49, de: 14.99, en: 12.99 },
    regularPrice: { pl: 79, de: 24.99, en: 19.99 },
    thumbnail: { title: "JAVASCRIPT", subtitle: "OD PODSTAW", variant: "blue" }
  },
  {
    id: "ai",
    type: "course",
    title: { pl: "AI dla każdego", de: "KI für alle", en: "AI for Everyone" },
    slug: { pl: "ai-dla-kazdego", de: "ki-fur-alle", en: "ai-for-everyone" },
    categoryId: "ai",
    rating: 4.9,
    reviews: 713,
    price: { pl: 69, de: 19.99, en: 16.99 },
    regularPrice: { pl: 109, de: 34.99, en: 29.99 },
    thumbnail: { title: "AI", subtitle: "DLA KAŻDEGO", variant: "purple" }
  }
];

export const bundles: Bundle[] = [
  {
    id: "qa-starter",
    type: "bundle",
    title: { pl: "QA Starter Pack", de: "QA Starter Pack", en: "QA Starter Pack" },
    slug: { pl: "qa-starter-pack", de: "qa-starter-pack", en: "qa-starter-pack" },
    categoryId: "testing",
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
    courseCount: 4,
    rating: 4.9,
    reviews: 642,
    price: { pl: 179, de: 49.99, en: 39.99 },
    regularPrice: { pl: 279, de: 79.99, en: 69.99 },
    thumbnail: { title: "DEVOPS", subtitle: "ESSENTIALS", variant: "green" }
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
  }
];
