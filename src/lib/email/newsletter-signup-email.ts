import { Resend } from "resend";
import { type Locale } from "@/lib/i18n/config";

type NewsletterCopy = {
  subject: string;
  greeting: string;
  lead: string;
  codeLabel: string;
  cta: string;
  footer: string;
};

const copy: Record<Locale, NewsletterCopy> = {
  pl: {
    subject: "Twój kod rabatowy 25% na kursy",
    greeting: "Cześć!",
    lead: "Dziękujemy za zapis do newslettera. Zgodnie z obietnicą, przesyłamy Twój kod rabatowy na dowolny kurs w naszym sklepie.",
    codeLabel: "Twój kod rabatowy:",
    cta: "Przeglądaj kursy",
    footer: "Ten kod jest ważny bezterminowo. Do zobaczenia na kursie!"
  },
  de: {
    subject: "Dein 25% Rabattcode für Kurse",
    greeting: "Hallo!",
    lead: "Vielen Dank für deine Anmeldung zum Newsletter. Wie versprochen senden wir dir deinen Rabattcode für jeden Kurs in unserem Shop.",
    codeLabel: "Dein Rabattcode:",
    cta: "Kurse durchsuchen",
    footer: "Dieser Code ist unbegrenzt gültig. Wir sehen uns im Kurs!"
  },
  en: {
    subject: "Your 25% discount code for courses",
    greeting: "Hi there!",
    lead: "Thank you for signing up for our newsletter. As promised, here is your discount code for any course in our shop.",
    codeLabel: "Your discount code:",
    cta: "Browse courses",
    footer: "This code is valid indefinitely. See you in the course!"
  }
};

export async function sendNewsletterSignupEmail(email: string, locale: Locale, code: string) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!resendApiKey || !from) {
    console.error("Resend is not configured for newsletter emails.");
    return;
  }

  const resend = new Resend(resendApiKey);
  const t = copy[locale] || copy.pl;

  try {
    await resend.emails.send({
      from,
      to: email,
      subject: t.subject,
      html: renderNewsletterEmailHtml(t, code),
      text: renderNewsletterEmailText(t, code)
    });
  } catch (error) {
    console.error("Failed to send newsletter signup email:", error);
  }
}

function renderNewsletterEmailHtml(t: NewsletterCopy, code: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;background:#f7f7fb;color:#0f172a;font-family:Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
      <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:20px;padding:40px;text-align:center;">
        <h1 style="margin:0;font-size:24px;line-height:1.3;">${t.greeting}</h1>
        <p style="margin:20px 0 0;color:#475569;line-height:1.6;font-size:16px;">${t.lead}</p>
        
        <div style="margin:30px 0;padding:24px;border:2px dashed #d8d2ff;border-radius:14px;background:#f9f8ff;">
          <p style="margin:0 0 10px;font-size:14px;color:#6366f1;font-weight:700;text-transform:uppercase;letter-spacing:1px;">${t.codeLabel}</p>
          <p style="margin:0;font-family:monospace;font-size:32px;font-weight:900;color:#4338ca;letter-spacing:2px;">${code}</p>
        </div>
        
        <p style="margin:0 0 30px;color:#64748b;font-size:14px;">${t.footer}</p>
        
        <a href="https://rafalpodraza.com" style="display:inline-block;background:#4218ff;color:#ffffff;text-decoration:none;font-weight:700;border-radius:12px;padding:14px 28px;font-size:16px;">${t.cta}</a>
      </div>
    </div>
  </body>
</html>`;
}

function renderNewsletterEmailText(t: NewsletterCopy, code: string) {
  return `${t.greeting}

${t.lead}

${t.codeLabel} ${code}

${t.footer}

https://rafalpodraza.com`;
}
