import { type Locale } from "@/lib/i18n/config";

export type LegalDocumentType = "terms" | "privacy";

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
};

export type LegalDocument = {
  type: LegalDocumentType;
  title: string;
  description: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};

export const legalPagePaths: Record<LegalDocumentType, Record<Locale, string>> = {
  terms: {
    pl: "/pl/regulamin",
    de: "/de/agb",
    en: "/en/terms"
  },
  privacy: {
    pl: "/pl/polityka-prywatnosci",
    de: "/de/datenschutz",
    en: "/en/privacy-policy"
  }
};

export const sellerDetails = {
  name: "Rafał Podraza",
  address: "ul. Bogusza Stęczyńskiego 19/1, 58-100 Świdnica, Polska",
  taxId: "8842813624",
  regon: "522543771",
  email: "kontakt@testowanie-oprogramowania.pl",
  register: "Centralna Ewidencja i Informacja o Działalności Gospodarczej"
};

const lastUpdated = "9 czerwca 2026";

export const legalDocuments: Record<Locale, Record<LegalDocumentType, LegalDocument>> = {
  pl: {
    terms: {
      type: "terms",
      title: "Regulamin sklepu",
      description: "Regulamin sklepu internetowego Rafał Podraza z kursami online, kodami Udemy, płatnościami i zasadami obsługi zamówień.",
      lastUpdated,
      intro:
        "Regulamin określa zasady korzystania ze sklepu internetowego rafalpodraza.com, składania zamówień, płatności oraz dostarczania dostępu do kursów online.",
      sections: [
        {
          title: "1. Sprzedawca",
          paragraphs: [
            "Sprzedawcą i usługodawcą jest Rafał Podraza, prowadzący działalność gospodarczą w Polsce.",
            `Adres działalności i korespondencyjny: ${sellerDetails.address}.`,
            `NIP: ${sellerDetails.taxId}. REGON: ${sellerDetails.regon}. Wpis do CEIDG: tak. Organ rejestrowy: ${sellerDetails.register}.`,
            `Kontakt ze sprzedawcą: ${sellerDetails.email}.`
          ]
        },
        {
          title: "2. Definicje",
          items: [
            "Sklep - serwis internetowy dostępny pod adresem rafalpodraza.com.",
            "Klient - osoba fizyczna, osoba prawna albo jednostka organizacyjna korzystająca ze sklepu.",
            "Konsument - klient będący osobą fizyczną dokonującą zakupu niezwiązanego bezpośrednio z jej działalnością gospodarczą lub zawodową.",
            "Produkt cyfrowy - kurs online, pakiet kursów, kod promocyjny Udemy, link dostępowy lub inne materiały cyfrowe oferowane w sklepie.",
            "Zamówienie - oświadczenie klienta składane w sklepie, prowadzące do zawarcia umowy sprzedaży."
          ]
        },
        {
          title: "3. Zakres oferty",
          paragraphs: [
            "Sklep umożliwia zakup produktów cyfrowych związanych z edukacją IT, w szczególności kursów online, pakietów kursów oraz kodów lub linków umożliwiających dostęp do materiałów na platformie Udemy.",
            "Opisy produktów, ceny i informacje o dostępności są prezentowane na stronach produktów. Ceny są podawane w walucie właściwej dla wersji językowej sklepu."
          ]
        },
        {
          title: "4. Wymagania techniczne",
          items: [
            "urządzenie z dostępem do internetu i aktualną przeglądarką internetową,",
            "aktywne konto e-mail umożliwiające odebranie wiadomości z dostępem,",
            "w przypadku korzystania z kursów Udemy - możliwość użycia platformy Udemy zgodnie z jej zasadami."
          ]
        },
        {
          title: "5. Zamówienia i płatności",
          paragraphs: [
            "Zamówienie składa się przez dodanie produktów do koszyka, podanie wymaganych danych, zaakceptowanie regulaminu i użycie przycisku oznaczającego obowiązek zapłaty.",
            "Płatności są obsługiwane przez Stripe. Sklep nie przechowuje pełnych danych kart płatniczych.",
            "Umowa zostaje zawarta z chwilą skutecznego opłacenia zamówienia, o ile system płatności potwierdzi transakcję."
          ]
        },
        {
          title: "6. Dostarczenie produktów cyfrowych",
          paragraphs: [
            "Po zaksięgowaniu płatności sklep wysyła na adres e-mail podany w zamówieniu wiadomość z informacjami o dostępie, kodami Udemy lub linkami do zakupionych produktów.",
            "Dostęp jest realizowany automatycznie. Jeżeli wiadomość nie dotrze, klient powinien sprawdzić folder spam lub skontaktować się ze sprzedawcą."
          ]
        },
        {
          title: "7. Faktury",
          paragraphs: [
            "Klient może podać dane do faktury podczas składania zamówienia. Faktura jest przygotowywana na podstawie danych przekazanych przez klienta.",
            "Klient odpowiada za poprawność danych fakturowych podanych w formularzu."
          ]
        },
        {
          title: "8. Prawo odstąpienia od umowy",
          paragraphs: [
            "Konsument co do zasady ma prawo odstąpić od umowy zawartej na odległość w terminie 14 dni, chyba że zastosowanie ma ustawowy wyjątek.",
            "W przypadku treści cyfrowych lub usług cyfrowych dostarczanych nie na nośniku materialnym prawo odstąpienia może nie przysługiwać po rozpoczęciu spełniania świadczenia na wyraźną zgodę konsumenta oraz po poinformowaniu go o utracie prawa odstąpienia, zgodnie z obowiązującymi przepisami.",
            "W sprawach odstąpienia od umowy klient może skontaktować się ze sprzedawcą pod adresem e-mail wskazanym w regulaminie."
          ]
        },
        {
          title: "9. Reklamacje",
          paragraphs: [
            `Reklamacje można składać drogą e-mailową na adres ${sellerDetails.email}.`,
            "Reklamacja powinna zawierać dane umożliwiające identyfikację zamówienia, opis problemu oraz oczekiwany sposób rozwiązania sprawy.",
            "Sprzedawca rozpatruje reklamację w rozsądnym terminie, nie dłuższym niż 14 dni od jej otrzymania."
          ]
        },
        {
          title: "10. Odpowiedzialność i korzystanie z materiałów",
          paragraphs: [
            "Produkty cyfrowe są przeznaczone do osobistego korzystania przez klienta, chyba że opis produktu lub odrębne ustalenia stanowią inaczej.",
            "Zabronione jest bezprawne kopiowanie, rozpowszechnianie, odsprzedaż lub publiczne udostępnianie materiałów."
          ]
        },
        {
          title: "11. Postanowienia końcowe",
          paragraphs: [
            "Prawem właściwym jest prawo polskie, z zastrzeżeniem bezwzględnie obowiązujących przepisów chroniących konsumentów.",
            "Sprzedawca może zmienić regulamin z ważnych przyczyn, w szczególności z powodu zmian prawa, funkcjonalności sklepu lub sposobu świadczenia usług.",
            "Regulamin jest udostępniony nieodpłatnie w sposób umożliwiający jego pozyskanie, utrwalenie i odtworzenie."
          ]
        }
      ]
    },
    privacy: {
      type: "privacy",
      title: "Polityka prywatności",
      description: "Polityka prywatności sklepu Rafał Podraza: dane osobowe, zamówienia, płatności, e-mail, cookies i prawa użytkowników.",
      lastUpdated,
      intro:
        "Polityka prywatności wyjaśnia, jakie dane osobowe są przetwarzane w sklepie rafalpodraza.com, w jakich celach, na jakich podstawach i jakie prawa przysługują użytkownikom.",
      sections: [
        {
          title: "1. Administrator danych",
          paragraphs: [
            `Administratorem danych osobowych jest Rafał Podraza, adres: ${sellerDetails.address}.`,
            `Kontakt w sprawach danych osobowych: ${sellerDetails.email}.`
          ]
        },
        {
          title: "2. Zakres przetwarzanych danych",
          items: [
            "adres e-mail i dane potrzebne do dostarczenia dostępu do zakupionych produktów,",
            "dane zamówienia, koszyka, płatności i faktury, jeżeli klient prosi o fakturę,",
            "dane techniczne, takie jak adres IP, identyfikatory cookies, informacje o urządzeniu i przeglądarce,",
            "treść korespondencji przesłanej do sprzedawcy."
          ]
        },
        {
          title: "3. Cele i podstawy prawne",
          items: [
            "obsługa zamówienia i wykonanie umowy - art. 6 ust. 1 lit. b RODO,",
            "wystawienie i przechowywanie dokumentów księgowych - art. 6 ust. 1 lit. c RODO,",
            "obsługa reklamacji, kontaktu i dochodzenie roszczeń - art. 6 ust. 1 lit. f RODO,",
            "zapewnienie bezpieczeństwa sklepu i podstawowych funkcji technicznych - art. 6 ust. 1 lit. f RODO,",
            "działania oparte na zgodzie, jeżeli taka zgoda zostanie udzielona - art. 6 ust. 1 lit. a RODO."
          ]
        },
        {
          title: "4. Odbiorcy danych",
          paragraphs: [
            "Dane mogą być przekazywane podmiotom wspierającym działanie sklepu, w szczególności dostawcy hostingu, systemu płatności Stripe, systemu wysyłki e-mail Resend, dostawcom narzędzi IT, obsłudze księgowej oraz organom publicznym, gdy wymagają tego przepisy prawa."
          ]
        },
        {
          title: "5. Przekazywanie danych poza EOG",
          paragraphs: [
            "Niektórzy dostawcy narzędzi, w szczególności dostawcy płatności lub poczty transakcyjnej, mogą przetwarzać dane poza Europejskim Obszarem Gospodarczym. W takim przypadku stosowane są odpowiednie mechanizmy ochrony danych wymagane przez RODO."
          ]
        },
        {
          title: "6. Okres przechowywania danych",
          paragraphs: [
            "Dane związane z zamówieniami i dokumentacją księgową są przechowywane przez okres wymagany przepisami prawa.",
            "Dane przetwarzane w celu obsługi kontaktu są przechowywane przez czas potrzebny do zakończenia korespondencji, a następnie przez okres przedawnienia ewentualnych roszczeń.",
            "Dane przetwarzane na podstawie zgody są przechowywane do czasu jej wycofania, chyba że istnieje inna podstawa prawna dalszego przetwarzania."
          ]
        },
        {
          title: "7. Prawa osoby, której dane dotyczą",
          items: [
            "prawo dostępu do danych,",
            "prawo sprostowania danych,",
            "prawo usunięcia danych,",
            "prawo ograniczenia przetwarzania,",
            "prawo przenoszenia danych,",
            "prawo sprzeciwu wobec przetwarzania,",
            "prawo wycofania zgody w dowolnym momencie,",
            "prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych."
          ]
        },
        {
          title: "8. Cookies i podobne technologie",
          paragraphs: [
            "Sklep wykorzystuje pliki cookies i podobne technologie w celu zapewnienia działania strony, koszyka, sesji administracyjnej oraz bezpieczeństwa.",
            "Koszyk i kod rabatowy mogą być zapisywane lokalnie w przeglądarce użytkownika. Użytkownik może usunąć te dane w ustawieniach przeglądarki.",
            "Jeżeli w przyszłości zostaną wdrożone narzędzia analityczne lub marketingowe wymagające zgody, będą używane zgodnie z obowiązującymi przepisami."
          ]
        },
        {
          title: "9. Dobrowolność podania danych",
          paragraphs: [
            "Podanie danych jest dobrowolne, ale niezbędne do złożenia zamówienia, dokonania płatności, otrzymania dostępu do produktu lub wystawienia faktury."
          ]
        },
        {
          title: "10. Zmiany polityki prywatności",
          paragraphs: [
            "Polityka prywatności może być aktualizowana w przypadku zmian prawa, funkcji sklepu lub sposobów przetwarzania danych."
          ]
        }
      ]
    }
  },
  de: {
    terms: {
      type: "terms",
      title: "Allgemeine Geschäftsbedingungen",
      description: "AGB des Online-Shops Rafał Podraza für Online-Kurse, Udemy-Gutscheincodes, Zahlungen und Bestellungen.",
      lastUpdated: "9. Juni 2026",
      intro:
        "Diese Allgemeinen Geschäftsbedingungen regeln die Nutzung des Online-Shops rafalpodraza.com, Bestellungen, Zahlungen und die Bereitstellung digitaler Produkte.",
      sections: [
        {
          title: "1. Verkäufer",
          paragraphs: [
            "Verkäufer und Dienstanbieter ist Rafał Podraza, der eine Geschäftstätigkeit in Polen ausübt.",
            `Geschäfts- und Korrespondenzadresse: ${sellerDetails.address}.`,
            `Steuernummer NIP: ${sellerDetails.taxId}. REGON: ${sellerDetails.regon}. Eintrag in CEIDG: ja. Registerbehörde: ${sellerDetails.register}.`,
            `Kontakt: ${sellerDetails.email}.`
          ]
        },
        {
          title: "2. Begriffe",
          items: [
            "Shop - die Website rafalpodraza.com.",
            "Kunde - eine Person oder Organisation, die den Shop nutzt.",
            "Verbraucher - eine natürliche Person, die einen Kauf zu Zwecken tätigt, die nicht unmittelbar ihrer gewerblichen oder beruflichen Tätigkeit zugerechnet werden können.",
            "Digitales Produkt - Online-Kurs, Kurspaket, Udemy-Gutscheincode, Zugangslink oder anderes digitales Lernmaterial.",
            "Bestellung - eine Erklärung des Kunden im Shop, die zum Abschluss eines Kaufvertrags führt."
          ]
        },
        {
          title: "3. Angebot",
          paragraphs: [
            "Der Shop bietet digitale Lernprodukte im IT-Bereich an, insbesondere Online-Kurse, Kurspakete sowie Codes oder Links zum Zugriff auf Materialien auf Udemy.",
            "Produktbeschreibungen, Preise und Verfügbarkeit werden auf den Produktseiten angezeigt."
          ]
        },
        {
          title: "4. Technische Voraussetzungen",
          items: [
            "ein Gerät mit Internetzugang und aktuellem Browser,",
            "ein aktives E-Mail-Konto zum Empfang der Zugangsdaten,",
            "für Udemy-Kurse die Möglichkeit, Udemy gemäß den dort geltenden Regeln zu nutzen."
          ]
        },
        {
          title: "5. Bestellungen und Zahlungen",
          paragraphs: [
            "Eine Bestellung wird aufgegeben, indem Produkte in den Warenkorb gelegt, die erforderlichen Daten eingegeben, die AGB akzeptiert und der Button mit eindeutigem Zahlungshinweis verwendet wird.",
            "Zahlungen werden über Stripe abgewickelt. Der Shop speichert keine vollständigen Kartendaten.",
            "Der Vertrag kommt zustande, wenn die Bestellung erfolgreich bezahlt und die Zahlung bestätigt wurde."
          ]
        },
        {
          title: "6. Lieferung digitaler Produkte",
          paragraphs: [
            "Nach erfolgreicher Zahlung sendet der Shop eine E-Mail mit Zugangsinformationen, Udemy-Codes oder Links zu den gekauften Produkten.",
            "Wenn die E-Mail nicht ankommt, sollte der Kunde den Spam-Ordner prüfen oder den Verkäufer kontaktieren."
          ]
        },
        {
          title: "7. Rechnungen",
          paragraphs: [
            "Der Kunde kann während der Bestellung Rechnungsdaten angeben. Die Rechnung wird auf Grundlage der vom Kunden bereitgestellten Daten erstellt.",
            "Der Kunde ist für die Richtigkeit der angegebenen Rechnungsdaten verantwortlich."
          ]
        },
        {
          title: "8. Widerrufsrecht",
          paragraphs: [
            "Verbraucher haben grundsätzlich das Recht, einen Fernabsatzvertrag innerhalb von 14 Tagen zu widerrufen, sofern keine gesetzliche Ausnahme gilt.",
            "Bei digitalen Inhalten oder digitalen Dienstleistungen, die nicht auf einem körperlichen Datenträger geliefert werden, kann das Widerrufsrecht nach Beginn der Leistungserbringung entfallen, wenn der Verbraucher ausdrücklich zugestimmt und den Verlust des Widerrufsrechts zur Kenntnis genommen hat.",
            "Für Fragen zum Widerruf kann der Kunde den Verkäufer per E-Mail kontaktieren."
          ]
        },
        {
          title: "9. Beschwerden",
          paragraphs: [
            `Beschwerden können per E-Mail an ${sellerDetails.email} eingereicht werden.`,
            "Die Beschwerde sollte Angaben zur Bestellung, eine Beschreibung des Problems und die erwartete Lösung enthalten.",
            "Der Verkäufer prüft Beschwerden innerhalb einer angemessenen Frist, spätestens innerhalb von 14 Tagen."
          ]
        },
        {
          title: "10. Nutzung der Materialien",
          paragraphs: [
            "Digitale Produkte sind zur persönlichen Nutzung durch den Kunden bestimmt, sofern die Produktbeschreibung oder eine gesonderte Vereinbarung nichts anderes bestimmt.",
            "Unbefugtes Kopieren, Weitergeben, Weiterverkaufen oder öffentliches Zugänglichmachen der Materialien ist untersagt."
          ]
        },
        {
          title: "11. Schlussbestimmungen",
          paragraphs: [
            "Es gilt polnisches Recht, unbeschadet zwingender Verbraucherschutzvorschriften.",
            "Der Verkäufer kann die AGB aus wichtigen Gründen ändern, insbesondere bei Gesetzesänderungen, Änderungen der Shop-Funktionen oder der Art der Leistungserbringung."
          ]
        }
      ]
    },
    privacy: {
      type: "privacy",
      title: "Datenschutzerklärung",
      description: "Datenschutzerklärung des Shops Rafał Podraza: personenbezogene Daten, Bestellungen, Zahlungen, E-Mail, Cookies und Nutzerrechte.",
      lastUpdated: "9. Juni 2026",
      intro:
        "Diese Datenschutzerklärung erklärt, welche personenbezogenen Daten im Shop rafalpodraza.com verarbeitet werden, zu welchen Zwecken und welche Rechte den Nutzern zustehen.",
      sections: [
        {
          title: "1. Verantwortlicher",
          paragraphs: [
            `Verantwortlicher für personenbezogene Daten ist Rafał Podraza, Adresse: ${sellerDetails.address}.`,
            `Kontakt in Datenschutzfragen: ${sellerDetails.email}.`
          ]
        },
        {
          title: "2. Verarbeitete Daten",
          items: [
            "E-Mail-Adresse und Daten, die zur Bereitstellung des Zugangs erforderlich sind,",
            "Bestell-, Warenkorb-, Zahlungs- und Rechnungsdaten, sofern eine Rechnung angefordert wird,",
            "technische Daten wie IP-Adresse, Cookie-Kennungen sowie Browser- und Geräteinformationen,",
            "Inhalte der Korrespondenz mit dem Verkäufer."
          ]
        },
        {
          title: "3. Zwecke und Rechtsgrundlagen",
          items: [
            "Abwicklung der Bestellung und Vertragserfüllung - Art. 6 Abs. 1 lit. b DSGVO,",
            "Erfüllung gesetzlicher Buchhaltungs- und Steuerpflichten - Art. 6 Abs. 1 lit. c DSGVO,",
            "Bearbeitung von Beschwerden, Kontakt und Geltendmachung von Ansprüchen - Art. 6 Abs. 1 lit. f DSGVO,",
            "Sicherheit und technische Funktion des Shops - Art. 6 Abs. 1 lit. f DSGVO,",
            "Verarbeitung auf Grundlage einer Einwilligung - Art. 6 Abs. 1 lit. a DSGVO."
          ]
        },
        {
          title: "4. Empfänger der Daten",
          paragraphs: [
            "Daten können an Dienstleister weitergegeben werden, die den Shop unterstützen, insbesondere Hosting-Anbieter, Stripe, Resend, IT-Dienstleister, Buchhaltung und öffentliche Stellen, wenn dies gesetzlich erforderlich ist."
          ]
        },
        {
          title: "5. Übermittlung außerhalb des EWR",
          paragraphs: [
            "Einige Anbieter können Daten außerhalb des Europäischen Wirtschaftsraums verarbeiten. In solchen Fällen werden geeignete Schutzmechanismen nach der DSGVO eingesetzt."
          ]
        },
        {
          title: "6. Speicherdauer",
          paragraphs: [
            "Bestell- und Buchhaltungsdaten werden für den gesetzlich vorgeschriebenen Zeitraum gespeichert.",
            "Kontaktdaten werden für die Dauer der Korrespondenz und anschließend für die Verjährungsfrist möglicher Ansprüche gespeichert.",
            "Daten, die auf Grundlage einer Einwilligung verarbeitet werden, werden bis zum Widerruf der Einwilligung gespeichert, sofern keine andere Rechtsgrundlage besteht."
          ]
        },
        {
          title: "7. Rechte der betroffenen Person",
          items: [
            "Auskunft über Daten,",
            "Berichtigung von Daten,",
            "Löschung von Daten,",
            "Einschränkung der Verarbeitung,",
            "Datenübertragbarkeit,",
            "Widerspruch gegen die Verarbeitung,",
            "Widerruf einer Einwilligung,",
            "Beschwerde bei einer Datenschutzaufsichtsbehörde."
          ]
        },
        {
          title: "8. Cookies und ähnliche Technologien",
          paragraphs: [
            "Der Shop verwendet Cookies und ähnliche Technologien, um die Website, den Warenkorb, die Admin-Sitzung und die Sicherheit bereitzustellen.",
            "Warenkorb und Rabattcode können lokal im Browser gespeichert werden. Der Nutzer kann diese Daten in den Browsereinstellungen löschen.",
            "Falls künftig Analyse- oder Marketingtools eingesetzt werden, die eine Einwilligung erfordern, werden sie gemäß den geltenden Vorschriften verwendet."
          ]
        },
        {
          title: "9. Freiwilligkeit der Datenbereitstellung",
          paragraphs: [
            "Die Bereitstellung von Daten ist freiwillig, aber erforderlich, um eine Bestellung aufzugeben, eine Zahlung durchzuführen, Zugang zu erhalten oder eine Rechnung auszustellen."
          ]
        },
        {
          title: "10. Änderungen",
          paragraphs: [
            "Diese Datenschutzerklärung kann aktualisiert werden, wenn sich Gesetze, Shop-Funktionen oder Verarbeitungsprozesse ändern."
          ]
        }
      ]
    }
  },
  en: {
    terms: {
      type: "terms",
      title: "Terms and Conditions",
      description: "Terms and Conditions of the Rafał Podraza online shop for online courses, Udemy codes, payments and order handling.",
      lastUpdated: "June 9, 2026",
      intro:
        "These Terms and Conditions define the rules for using rafalpodraza.com, placing orders, making payments and receiving access to digital products.",
      sections: [
        {
          title: "1. Seller",
          paragraphs: [
            "The seller and service provider is Rafał Podraza, conducting business activity in Poland.",
            `Business and correspondence address: ${sellerDetails.address}.`,
            `Tax ID NIP: ${sellerDetails.taxId}. REGON: ${sellerDetails.regon}. CEIDG entry: yes. Registration authority: ${sellerDetails.register}.`,
            `Contact e-mail: ${sellerDetails.email}.`
          ]
        },
        {
          title: "2. Definitions",
          items: [
            "Shop - the website available at rafalpodraza.com.",
            "Customer - a person or entity using the shop.",
            "Consumer - a natural person making a purchase not directly related to their business or professional activity.",
            "Digital product - an online course, course bundle, Udemy promo code, access link or other digital learning material.",
            "Order - a declaration made by the customer in the shop leading to the conclusion of a sales contract."
          ]
        },
        {
          title: "3. Offer",
          paragraphs: [
            "The shop sells digital IT learning products, in particular online courses, course bundles and codes or links enabling access to materials on Udemy.",
            "Product descriptions, prices and availability are displayed on product pages."
          ]
        },
        {
          title: "4. Technical requirements",
          items: [
            "a device with internet access and an up-to-date browser,",
            "an active e-mail account to receive access information,",
            "for Udemy courses, the ability to use Udemy according to its rules."
          ]
        },
        {
          title: "5. Orders and payments",
          paragraphs: [
            "An order is placed by adding products to the cart, providing required data, accepting the Terms and Conditions and using the button clearly indicating the obligation to pay.",
            "Payments are processed by Stripe. The shop does not store full payment card details.",
            "The contract is concluded when the order is successfully paid and the payment is confirmed."
          ]
        },
        {
          title: "6. Delivery of digital products",
          paragraphs: [
            "After successful payment, the shop sends an e-mail with access information, Udemy codes or links to the purchased products.",
            "If the message does not arrive, the customer should check the spam folder or contact the seller."
          ]
        },
        {
          title: "7. Invoices",
          paragraphs: [
            "The customer may provide invoice details during checkout. The invoice is prepared based on the data provided by the customer.",
            "The customer is responsible for the correctness of invoice details submitted in the form."
          ]
        },
        {
          title: "8. Right of withdrawal",
          paragraphs: [
            "Consumers generally have the right to withdraw from a distance contract within 14 days unless a statutory exception applies.",
            "For digital content or digital services not supplied on a tangible medium, the right of withdrawal may be lost after performance begins if the consumer expressly consented and acknowledged the loss of that right, in accordance with applicable law.",
            "For withdrawal-related matters, the customer may contact the seller by e-mail."
          ]
        },
        {
          title: "9. Complaints",
          paragraphs: [
            `Complaints can be submitted by e-mail to ${sellerDetails.email}.`,
            "A complaint should include order identification details, a description of the problem and the expected resolution.",
            "The seller reviews complaints within a reasonable time, no later than 14 days after receipt."
          ]
        },
        {
          title: "10. Use of materials",
          paragraphs: [
            "Digital products are intended for the customer's personal use unless the product description or a separate agreement states otherwise.",
            "Unauthorised copying, distribution, resale or public sharing of materials is prohibited."
          ]
        },
        {
          title: "11. Final provisions",
          paragraphs: [
            "Polish law applies, without prejudice to mandatory consumer protection rules.",
            "The seller may amend these Terms for important reasons, including changes in law, shop functionality or the method of service provision."
          ]
        }
      ]
    },
    privacy: {
      type: "privacy",
      title: "Privacy Policy",
      description: "Privacy Policy of the Rafał Podraza shop: personal data, orders, payments, e-mail, cookies and user rights.",
      lastUpdated: "June 9, 2026",
      intro:
        "This Privacy Policy explains what personal data is processed in the rafalpodraza.com shop, for what purposes, on what legal bases and what rights users have.",
      sections: [
        {
          title: "1. Data controller",
          paragraphs: [
            `The controller of personal data is Rafał Podraza, address: ${sellerDetails.address}.`,
            `Contact for privacy matters: ${sellerDetails.email}.`
          ]
        },
        {
          title: "2. Data processed",
          items: [
            "e-mail address and data needed to provide access to purchased products,",
            "order, cart, payment and invoice data if an invoice is requested,",
            "technical data such as IP address, cookie identifiers, browser and device information,",
            "content of correspondence sent to the seller."
          ]
        },
        {
          title: "3. Purposes and legal bases",
          items: [
            "order handling and contract performance - Article 6(1)(b) GDPR,",
            "issuing and storing accounting documents - Article 6(1)(c) GDPR,",
            "complaints, contact and claims handling - Article 6(1)(f) GDPR,",
            "shop security and technical functionality - Article 6(1)(f) GDPR,",
            "processing based on consent, where consent is given - Article 6(1)(a) GDPR."
          ]
        },
        {
          title: "4. Data recipients",
          paragraphs: [
            "Data may be shared with service providers supporting the shop, in particular hosting providers, Stripe, Resend, IT providers, accounting support and public authorities where required by law."
          ]
        },
        {
          title: "5. Transfers outside the EEA",
          paragraphs: [
            "Some providers may process data outside the European Economic Area. In such cases, appropriate safeguards required by the GDPR are used."
          ]
        },
        {
          title: "6. Retention period",
          paragraphs: [
            "Order and accounting data is stored for the period required by law.",
            "Contact data is stored for the time needed to complete correspondence and then for the limitation period of possible claims.",
            "Data processed based on consent is stored until consent is withdrawn unless another legal basis applies."
          ]
        },
        {
          title: "7. User rights",
          items: [
            "right of access,",
            "right to rectification,",
            "right to erasure,",
            "right to restriction of processing,",
            "right to data portability,",
            "right to object,",
            "right to withdraw consent at any time,",
            "right to lodge a complaint with a data protection supervisory authority."
          ]
        },
        {
          title: "8. Cookies and similar technologies",
          paragraphs: [
            "The shop uses cookies and similar technologies to provide the website, cart, admin session and security.",
            "Cart contents and discount codes may be stored locally in the user's browser. The user can remove this data in browser settings.",
            "If analytics or marketing tools requiring consent are introduced in the future, they will be used in accordance with applicable law."
          ]
        },
        {
          title: "9. Voluntary provision of data",
          paragraphs: [
            "Providing data is voluntary but necessary to place an order, make a payment, receive access or obtain an invoice."
          ]
        },
        {
          title: "10. Changes to this policy",
          paragraphs: [
            "This Privacy Policy may be updated if laws, shop features or data processing practices change."
          ]
        }
      ]
    }
  }
};
