import { LegalRoutePage, getLegalMetadata, getLegalStaticParams } from "@/lib/legal-route";

export function generateStaticParams() {
  return getLegalStaticParams("pl");
}

export function generateMetadata() {
  return getLegalMetadata("pl", "privacy");
}

export default function PrivacyPlPage({ params }: { params: Promise<{ locale: string }> }) {
  return <LegalRoutePage params={params} locale="pl" type="privacy" />;
}
