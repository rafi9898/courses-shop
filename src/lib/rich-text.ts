const allowedTags = new Set(["p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li", "a", "blockquote", "h3", "h4"]);

export function sanitizeRichText(value: string) {
  return value
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<\/?([a-z0-9-]+)([^>]*)>/gi, (match, tagName: string, attributes: string) => {
      const normalizedTag = tagName.toLowerCase();

      if (!allowedTags.has(normalizedTag)) {
        return "";
      }

      if (match.startsWith("</")) {
        return `</${normalizedTag}>`;
      }

      if (normalizedTag !== "a") {
        return normalizedTag === "br" ? "<br>" : `<${normalizedTag}>`;
      }

      const href = attributes.match(/\shref=(["'])(.*?)\1/i)?.[2] ?? "";
      if (!href || href.trim().toLowerCase().startsWith("javascript:")) {
        return "<a>";
      }

      return `<a href="${escapeAttribute(href)}" target="_blank" rel="noreferrer">`;
    })
    .trim();
}

export function richTextToPlainText(value: string) {
  return sanitizeRichText(value)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function escapeAttribute(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("\"", "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
