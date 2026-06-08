import { type Order, type OrderItem } from "@prisma/client";
import { formatPrice, isLocale, type Locale } from "@/lib/i18n/config";
import { getAdminPath } from "@/lib/admin-routes";
import { prisma } from "@/lib/prisma";
import { getAbsoluteUrl, getOrderAccessPath } from "@/lib/routes";

type OrderWithItems = Order & {
  items: OrderItem[];
};

export async function sendTelegramOrderNotification(orderId: string, options: { force?: boolean } = {}) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return null;
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  });

  if (!order) {
    throw new Error(`Order ${orderId} was not found.`);
  }

  if (order.telegramNotifiedAt && !options.force) {
    return order;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        text: renderTelegramMessage(order)
      })
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Telegram API returned ${response.status}: ${body.slice(0, 500)}`);
    }

    return prisma.order.update({
      where: { id: order.id },
      data: {
        telegramNotifiedAt: new Date(),
        telegramNotifyError: null
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Telegram notification failed.";

    await prisma.order.update({
      where: { id: order.id },
      data: {
        telegramNotifyError: message.slice(0, 1000)
      }
    });

    throw error;
  }
}

function renderTelegramMessage(order: OrderWithItems) {
  const locale = parseLocale(order.locale);
  const accessUrl = getAbsoluteUrl(getOrderAccessPath(locale, order.accessToken));
  const adminUrl = getAbsoluteUrl(getAdminPath(`/orders/${order.id}`));
  const items = order.items
    .slice(0, 12)
    .map((item) => `• ${escapeHtml(item.title)} x${item.quantity}`)
    .join("\n");
  const extraItems = order.items.length > 12 ? `\n• +${order.items.length - 12} more` : "";

  return [
    "<b>Nowe zamówienie</b>",
    "",
    `<b>Numer:</b> ${escapeHtml(order.orderNumber)}`,
    `<b>Kwota:</b> ${escapeHtml(formatPrice(Number(order.totalAmount), locale))}`,
    `<b>Waluta:</b> ${escapeHtml(order.currency)}`,
    `<b>Język:</b> ${escapeHtml(order.locale)}`,
    order.discountCode ? `<b>Kod rabatowy:</b> ${escapeHtml(order.discountCode)}` : null,
    "",
    `<b>Klient:</b> ${escapeHtml(order.customerName || "-")}`,
    `<b>E-mail:</b> ${escapeHtml(order.customerEmail || "-")}`,
    "",
    "<b>Produkty:</b>",
    `${items}${extraItems}`,
    "",
    `<a href="${escapeHtml(adminUrl)}">Panel zamówienia</a>`,
    `<a href="${escapeHtml(accessUrl)}">Link klienta</a>`
  ]
    .filter(Boolean)
    .join("\n");
}

function parseLocale(locale: string): Locale {
  return isLocale(locale) ? locale : "pl";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
