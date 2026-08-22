import { LegalRoutePage, getLegalMetadata, getLegalStaticParams } from "@/lib/legal-route";

export function generateStaticParams() {
  return getLegalStaticParams("de");
}

export function generateMetadata() {
  return getLegalMetadata("de", "privacy");
}

export default function PrivacyDePage({ params }: { params: Promise<{ locale: string }> }) {
  return <LegalRoutePage params={params} locale="de" type="privacy" />;
}
