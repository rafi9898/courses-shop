import { LegalRoutePage, getLegalMetadata, getLegalStaticParams } from "@/lib/legal-route";

export function generateStaticParams() {
  return getLegalStaticParams("pl");
}

export function generateMetadata() {
  return getLegalMetadata("pl", "terms");
}

export default function TermsPlPage({ params }: { params: Promise<{ locale: string }> }) {
  return <LegalRoutePage params={params} locale="pl" type="terms" />;
}
