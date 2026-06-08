import { sanitizeRichText } from "@/lib/rich-text";

export function RichTextContent({ html }: { html: string }) {
  const sanitized = sanitizeRichText(html);

  if (!sanitized) return null;

  return (
    <div
      className="rich-text-content"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
