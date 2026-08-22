import { LegalRoutePage, getLegalMetadata, getLegalStaticParams } from "@/lib/legal-route";

export function generateStaticParams() {
  return getLegalStaticParams("en");
}

export function generateMetadata() {
  return getLegalMetadata("en", "privacy");
}

export default function PrivacyEnPage({ params }: { params: Promise<{ locale: string }> }) {
  return <LegalRoutePage params={params} locale="en" type="privacy" />;
}
