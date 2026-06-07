import { type Order, type OrderItem } from "@prisma/client";
import { Resend } from "resend";
import { formatPrice, isLocale, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { getUdemyAccessLinks, type UdemyAccessLink } from "@/lib/udemy-access";

type OrderWithItems = Order & {
  items: OrderItem[];
};

const copy = {
  pl: {
    subject: "Twoje linki do kursów Udemy",
    greeting: "Dziękujemy za zakup",
    lead: "Poniżej znajdziesz linki do zakupionych kursów Udemy wraz z aktualnymi kodami.",
    orderNumber: "Numer zamówienia",
    total: "Kwota zamówienia",
    openCourse: "Otwórz kurs",
    couponCode: "Kod Udemy",
    validUntil: "Ważny do",
    footer: "Ten e-mail został wysłany automatycznie po zakończeniu płatności.",
    noLinks: "Nie znaleziono aktywnych linków Udemy dla tego zamówienia."
  },
  de: {
    subject: "Deine Links zu den Udemy-Kursen",
    greeting: "Danke für deinen Kauf",
    lead: "Unten findest du Links zu deinen gekauften Udemy-Kursen mit aktuellen Gutscheincodes.",
    orderNumber: "Bestellnummer",
    total: "Bestellbetrag",
    openCourse: "Kurs öffnen",
    couponCode: "Udemy-Code",
    validUntil: "Gültig bis",
    footer: "Diese E-Mail wurde nach Abschluss der Zahlung automatisch gesendet.",
    noLinks: "Für diese Bestellung wurden keine aktiven Udemy-Links gefunden."
  },
  en: {
    subject: "Your Udemy course links",
    greeting: "Thank you for your purchase",
    lead: "Below are links to your purchased Udemy courses with current coupon codes.",
    orderNumber: "Order number",
    total: "Order total",
    openCourse: "Open course",
    couponCode: "Udemy code",
    validUntil: "Valid until",
    footer: "This e-mail was sent automatically after payment was completed.",
    noLinks: "No active Udemy links were found for this order."
  }
} satisfies Record<Locale, Record<string, string>>;

export async function sendOrderAccessEmail(orderId: string) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!resendApiKey || !from) {
    throw new Error("Resend is not configured.");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  });

  if (!order) {
    throw new Error(`Order ${orderId} was not found.`);
  }

  if (order.accessEmailSentAt) {
    return order;
  }

  if (!order.customerEmail) {
    await prisma.order.update({
      where: { id: order.id },
      data: { accessEmailError: "Missing customer e-mail." }
    });
    throw new Error(`Order ${order.id} has no customer e-mail.`);
  }

  const locale = parseLocale(order.locale);
  const accessLinks = getUdemyAccessLinks(
    order.items.map((item) => ({
      productId: item.productId,
      productType: item.productType
    })),
    order.locale
  );

  const resend = new Resend(resendApiKey);

  try {
    await resend.emails.send({
      from,
      to: order.customerEmail,
      subject: `${copy[locale].subject} - ${order.orderNumber}`,
      html: renderOrderAccessEmailHtml(order, accessLinks, locale),
      text: renderOrderAccessEmailText(order, accessLinks, locale)
    });

    return prisma.order.update({
      where: { id: order.id },
      data: {
        accessEmailSentAt: new Date(),
        accessEmailError: null
      },
      include: { items: true }
    });
  } catch (error) {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        accessEmailError: error instanceof Error ? error.message : "Unknown e-mail delivery error."
      }
    });
    throw error;
  }
}

function renderOrderAccessEmailHtml(order: OrderWithItems, accessLinks: UdemyAccessLink[], locale: Locale) {
  const t = copy[locale];

  return `<!doctype html>
<html>
  <body style="margin:0;background:#f7f7fb;color:#0f172a;font-family:Arial,sans-serif;">
    <div style="max-width:680px;margin:0 auto;padding:32px 20px;">
      <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:18px;padding:28px;">
        <h1 style="margin:0;font-size:28px;line-height:1.2;">${escapeHtml(t.greeting)}</h1>
        <p style="margin:14px 0 0;color:#475569;line-height:1.6;">${escapeHtml(t.lead)}</p>
        <div style="margin:24px 0;padding:16px;border-radius:14px;background:#f5f2ff;">
          <p style="margin:0 0 8px;font-size:14px;color:#475569;">${escapeHtml(t.orderNumber)}: <strong>${escapeHtml(order.orderNumber)}</strong></p>
          <p style="margin:0;font-size:14px;color:#475569;">${escapeHtml(t.total)}: <strong>${formatOrderPrice(order, locale)}</strong></p>
        </div>
        ${accessLinks.length > 0 ? accessLinks.map((link) => renderAccessLinkHtml(link, locale)).join("") : `<p style="margin:0;color:#475569;">${escapeHtml(t.noLinks)}</p>`}
        <p style="margin:28px 0 0;color:#64748b;font-size:13px;line-height:1.6;">${escapeHtml(t.footer)}</p>
      </div>
    </div>
  </body>
</html>`;
}

function renderAccessLinkHtml(link: UdemyAccessLink, locale: Locale) {
  const t = copy[locale];

  return `<div style="border:1px solid #e5e7eb;border-radius:14px;padding:18px;margin-top:14px;">
    <h2 style="margin:0 0 10px;font-size:18px;line-height:1.3;">${escapeHtml(link.title)}</h2>
    <p style="margin:0 0 6px;color:#475569;font-size:14px;">${escapeHtml(t.couponCode)}: <strong>${escapeHtml(link.couponCode)}</strong></p>
    <p style="margin:0 0 16px;color:#475569;font-size:14px;">${escapeHtml(t.validUntil)}: <strong>${formatDate(link.validUntil, locale)}</strong></p>
    <a href="${escapeHtml(link.url)}" style="display:inline-block;background:#4218ff;color:#ffffff;text-decoration:none;font-weight:700;border-radius:10px;padding:12px 16px;">${escapeHtml(t.openCourse)}</a>
  </div>`;
}

function renderOrderAccessEmailText(order: OrderWithItems, accessLinks: UdemyAccessLink[], locale: Locale) {
  const t = copy[locale];
  const linksText = accessLinks.length
    ? accessLinks
        .map((link) => `${link.title}\n${t.couponCode}: ${link.couponCode}\n${t.validUntil}: ${formatDate(link.validUntil, locale)}\n${link.url}`)
        .join("\n\n")
    : t.noLinks;

  return `${t.greeting}

${t.lead}

${t.orderNumber}: ${order.orderNumber}
${t.total}: ${formatOrderPrice(order, locale)}

${linksText}

${t.footer}`;
}

function parseLocale(locale: string): Locale {
  return isLocale(locale) ? locale : "pl";
}

function formatOrderPrice(order: Order, locale: Locale) {
  return formatPrice(Number(order.totalAmount), locale);
}

function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "pl" ? "pl-PL" : locale === "de" ? "de-DE" : "en-US", {
    dateStyle: "medium"
  }).format(new Date(value));
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
