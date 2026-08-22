import {
  Award,
  BriefcaseBusiness,
  Clock3,
  Monitor,
  Puzzle,
  Target,
  Users,
  type LucideIcon
} from "lucide-react";
import { type Locale } from "@/lib/i18n/config";

export type TrainingLanding = {
  slug: string;
  locale: Locale;
  eyebrow: string;
  title: string;
  titleHighlight: string;
  intro: string;
  price: number;
  priceNote: string;
  format: string;
  companyNote: string;
  primaryCta: string;
  secondaryCta: string;
  contactHref: string;
  downloadHref: string;
  heroBullets: string[];
  featureStrip: {
    icon: LucideIcon;
    title: string;
    description: string;
  }[];
  reasons: {
    icon: LucideIcon;
    title: string;
    description: string;
  }[];
  agenda: {
    title: string;
    description: string;
  }[];
  audiences: {
    icon: LucideIcon;
    title: string;
    description: string;
  }[];
  finalCta: {
    title: string;
    highlight: string;
    bullets: string[];
  };
  seo: {
    title: string;
    description: string;
  };
};

export const trainingLandings: TrainingLanding[] = [
  {
    slug: "szkolenie-sap-dla-firm-i-osob-poczatkujacych",
    locale: "pl",
    eyebrow: "Szkolenia",
    title: "Szkolenie SAP",
    titleHighlight: "dla firm i osób początkujących",
    intro:
      "Praktyczne szkolenie SAP S/4HANA od podstaw. Zdobądź umiejętności, które realnie wykorzystasz w pracy i otwórz drzwi do nowych możliwości w IT.",
    price: 1999,
    priceNote: "netto",
    format: "szkolenie offline",
    companyNote: "Wycena indywidualna dla firm",
    primaryCta: "Zamów szkolenie",
    secondaryCta: "Pobierz program",
    contactHref: "mailto:kontakt@rafalpodraza.pl?subject=Szkolenie%20SAP",
    downloadHref: "#program",
    heroBullets: [
      "Nauka od praktyka z doświadczeniem w SAP",
      "Ćwiczenia na rzeczywistych przykładach",
      "Materiał wideo i wsparcie po szkoleniu",
      "Certyfikat ukończenia po zakończeniu szkolenia"
    ],
    featureStrip: [
      {
        icon: Monitor,
        title: "Online i stacjonarnie",
        description: "Ucz się wygodnie: zdalnie lub na sali szkoleniowej."
      },
      {
        icon: Puzzle,
        title: "Program dopasowany",
        description: "Praktyczne moduły dostosowane do Twoich potrzeb."
      },
      {
        icon: Award,
        title: "Certyfikat ukończenia",
        description: "Potwierdzenie zdobytej wiedzy i umiejętności."
      }
    ],
    reasons: [
      {
        icon: BriefcaseBusiness,
        title: "Praktyczna wiedza",
        description: "Nauczysz się SAP poprzez realne procesy i przykłady z życia firm."
      },
      {
        icon: Target,
        title: "Od podstaw do praktyki",
        description: "Zaczynasz od zera i krok po kroku budujesz pewność w działaniu na systemie."
      },
      {
        icon: Users,
        title: "Doświadczony trener",
        description: "Szkolenie prowadzi praktyk SAP z wieloletnim doświadczeniem wdrożeniowym."
      },
      {
        icon: Clock3,
        title: "Elastyczna forma",
        description: "Wybierz tryb online lub stacjonarnie i dopasuj go do siebie."
      }
    ],
    agenda: [
      {
        title: "Wprowadzenie do SAP S/4HANA",
        description: "Architektura systemu, podstawowe pojęcia oraz rola SAP w codziennej pracy firm."
      },
      {
        title: "Nawigacja i podstawy pracy w systemie",
        description: "Logowanie, menu, wyszukiwanie transakcji, personalizacja widoków i dobre nawyki pracy."
      },
      {
        title: "Kluczowe procesy biznesowe w SAP",
        description: "Przegląd najważniejszych obszarów: sprzedaż, zakupy, magazyn, finanse i controlling."
      },
      {
        title: "Dane podstawowe i dokumenty",
        description: "Praca z danymi kontrahentów, materiałów, dokumentami operacyjnymi i ich przepływem."
      },
      {
        title: "Raportowanie i analiza danych",
        description: "Podstawowe raporty, filtry, eksport danych oraz interpretacja wyników w praktyce."
      }
    ],
    audiences: [
      {
        icon: Users,
        title: "Osoby początkujące",
        description: "Chcesz wejść do świata SAP i rozpocząć karierę w IT."
      },
      {
        icon: Users,
        title: "Pracownicy działów",
        description: "Finansów, logistyki, produkcji i controllingu."
      },
      {
        icon: BriefcaseBusiness,
        title: "Firmy i zespoły",
        description: "Szukające praktycznego szkolenia dla swoich pracowników."
      }
    ],
    finalCta: {
      title: "Rozwijaj się z SAP.",
      highlight: "Zdobądź praktyczne umiejętności.",
      bullets: [
        "Praktyczne szkolenie od podstaw",
        "Elastyczne terminy i forma nauki",
        "Certyfikat po ukończeniu szkolenia",
        "Wsparcie trenera i materiały w cenie"
      ]
    },
    seo: {
      title: "Szkolenie SAP dla firm i osób początkujących | Rafał Podraza",
      description:
        "Praktyczne szkolenie SAP S/4HANA od podstaw dla firm, zespołów i osób początkujących. Online lub stacjonarnie, z programem dopasowanym do potrzeb."
    }
  }
];

export function getTrainingLanding(locale: Locale, slug: string) {
  return trainingLandings.find((training) => training.locale === locale && training.slug === slug) ?? null;
}
