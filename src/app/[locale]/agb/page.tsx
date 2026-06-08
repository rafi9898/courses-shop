import { LegalRoutePage, getLegalMetadata, getLegalStaticParams } from "@/lib/legal-route";

export function generateStaticParams() {
  return getLegalStaticParams("de");
}

export function generateMetadata() {
  return getLegalMetadata("de", "terms");
}

export default function TermsDePage({ params }: { params: Promise<{ locale: string }> }) {
  return <LegalRoutePage params={params} locale="de" type="terms" />;
}
