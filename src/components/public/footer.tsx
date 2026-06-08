import { Linkedin, Youtube, Facebook } from "lucide-react";
import Link from "next/link";
import { type Locale } from "@/lib/i18n/config";
import { type Dictionary } from "@/lib/i18n/dictionaries";
import { Logo } from "./logo";

export function Footer({
  locale,
  dictionary
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const links = [
    { label: dictionary.nav.courses, href: dictionary.routes.courses },
    { label: dictionary.nav.bundles, href: dictionary.routes.bundles },
    { label: dictionary.nav.categories, href: dictionary.routes.categories },
    { label: dictionary.nav.about, href: dictionary.routes.about },
    { label: dictionary.nav.faq, href: dictionary.routes.faq }
  ];
  const legalLinks = [
    { label: dictionary.legal.termsLabel, href: dictionary.routes.terms },
    { label: dictionary.legal.privacyLabel, href: dictionary.routes.privacy }
  ];

  return (
    <footer className="border-t border-border bg-white">
      <div className="container-shell flex flex-col gap-8 py-8 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link href={`/${locale}`} aria-label="Rafał Podraza home">
            <Logo />
          </Link>
          <p className="mt-4 text-xs text-muted-foreground">© 2024 Rafał Podraza. Wszelkie prawa zastrzeżone.</p>
        </div>

        <div className="flex flex-col gap-4">
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-600" aria-label="Footer navigation">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-primary">
                {link.label}
              </Link>
            ))}
          </nav>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-500" aria-label="Legal navigation">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-primary">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 text-slate-500">
          <Link href="https://www.youtube.com/@RafalPodraza" aria-label="YouTube" className="hover:text-primary" target="_blank" rel="noreferrer">
            <Youtube className="h-5 w-5" />
          </Link>
          <Link href="https://www.linkedin.com/in/rafalpodraza" aria-label="LinkedIn" className="hover:text-primary" target="_blank" rel="noreferrer">
            <Linkedin className="h-5 w-5" />
          </Link>
          <Link href="https://www.facebook.com/technikaprogramowania" aria-label="Facebook" className="hover:text-primary" target="_blank" rel="noreferrer">
            <Facebook className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
