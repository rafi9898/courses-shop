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

  return (
    <footer className="border-t border-border bg-white">
      <div className="container-shell flex flex-col gap-8 py-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link href={`/${locale}`} aria-label="PROJECT_NAME home">
            <Logo />
          </Link>
          <p className="mt-4 text-xs text-muted-foreground">© 2024 PROJECT_NAME. Wszelkie prawa zastrzeżone.</p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-600" aria-label="Footer navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-slate-500">
          <Link href="#" aria-label="YouTube" className="hover:text-primary">
            <Youtube className="h-5 w-5" />
          </Link>
          <Link href="#" aria-label="LinkedIn" className="hover:text-primary">
            <Linkedin className="h-5 w-5" />
          </Link>
          <Link href="#" aria-label="Facebook" className="hover:text-primary">
            <Facebook className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
