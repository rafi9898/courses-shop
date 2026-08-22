import { notFound } from "next/navigation";
import { TrainingLandingPage } from "@/components/training/training-landing-page";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getAbsoluteUrl } from "@/lib/routes";
import { getTrainingLanding, trainingLandings } from "@/lib/training-landing-data";

export function generateStaticParams() {
  return trainingLandings.map((training) => ({
    locale: training.locale,
    slug: training.slug
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return {};

  const training = getTrainingLanding(rawLocale, slug);
  if (!training) return {};

  const path = `/${rawLocale}/szkolenia/${training.slug}`;

  return {
    title: training.seo.title,
    description: training.seo.description,
    alternates: {
      canonical: getAbsoluteUrl(path)
    },
    openGraph: {
      title: training.seo.title,
      description: training.seo.description,
      url: getAbsoluteUrl(path),
      type: "website",
      images: [getAbsoluteUrl("/images/social-preview.png")]
    }
  };
}

export default async function TrainingLandingRoute({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale) || rawLocale !== "pl") notFound();

  const training = getTrainingLanding(rawLocale as Locale, slug);
  if (!training) notFound();

  return <TrainingLandingPage training={training} />;
}

