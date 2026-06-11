import { Eye, Save } from "lucide-react";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { CourseThumbnailInput } from "@/components/admin/course-thumbnail-input";
import { CourseTitleSlugFields } from "@/components/admin/course-title-slug-fields";
import { Button } from "@/components/ui/button";
import { createBlogPostAction, updateBlogPostAction } from "@/lib/admin-blog-actions";
import { type AdminCatalogLocale } from "@/lib/admin-catalog-locales";
import { type BlogPost } from "@/lib/blog-data";

const localeLabels: Record<AdminCatalogLocale, string> = {
  pl: "Polski",
  de: "Deutsch",
  en: "English"
};

export function BlogPostForm({ post, locale }: { post?: BlogPost; locale: AdminCatalogLocale }) {
  const isEdit = Boolean(post);
  const currentLocale = (post?.locale ?? locale) as AdminCatalogLocale;

  return (
    <form action={isEdit ? updateBlogPostAction : createBlogPostAction} className="space-y-6 rounded-xl border border-border bg-white p-5 shadow-card">
      {post ? <input type="hidden" name="currentId" value={post.id} /> : null}
      {post?.thumbnailImageUrl ? <input type="hidden" name="existingThumbnailImageUrl" value={post.thumbnailImageUrl} /> : null}
      <div>
        <h1 className="text-2xl font-black">{isEdit ? "Edytuj wpis" : "Dodaj wpis"}</h1>
        <p className="mt-1 text-sm leading-6 text-slate-600">Wpis tworzysz dla jednego wybranego języka. SEO możesz dopisać ręcznie albo zostawić sensowne fallbacki.</p>
        {post ? (
          <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-black text-slate-800">
            <Eye className="h-4 w-4 text-primary" />
            Wyświetlenia: {new Intl.NumberFormat("pl-PL").format(post.viewCount)}
          </p>
        ) : null}
      </div>

      <LocaleField locale={currentLocale} readOnly={isEdit} />
      <CourseTitleSlugFields defaultTitle={post?.title} defaultSlug={post?.slug} locale={currentLocale} />

      <Field label="Zajawka / opis w listingu">
        <Textarea name="excerpt" defaultValue={post?.excerpt ?? ""} placeholder="Krótki opis wpisu widoczny na liście i jako fallback dla meta description." />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Miniaturka wpisu">
          <CourseThumbnailInput />
        </Field>
        <Field label="Data publikacji">
          <Input name="publishedAt" type="datetime-local" defaultValue={dateTimeLocalValue(post?.publishedAt)} />
        </Field>
      </div>
      {post?.thumbnailImageUrl ? <p className="-mt-4 text-xs font-semibold text-slate-500">Aktualna miniaturka: {post.thumbnailImageUrl}</p> : null}

      <EditorField label="Treść wpisu">
        <RichTextEditor name="contentHtml" defaultValue={post?.contentHtml ?? ""} minHeight="min-h-[420px]" />
      </EditorField>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Meta title">
          <Input name="metaTitle" defaultValue={post?.metaTitle ?? ""} placeholder="Opcjonalnie, domyślnie tytuł wpisu" />
        </Field>
        <Field label="Meta keywords">
          <Input name="metaKeywords" defaultValue={post?.metaKeywords ?? ""} placeholder="np. testowanie, AI, automatyzacja" />
        </Field>
      </div>
      <Field label="Meta description">
        <Textarea name="metaDescription" defaultValue={post?.metaDescription ?? ""} placeholder="Najlepiej 140-160 znaków. Jeśli puste, użyjemy zajawki." />
      </Field>

      <label className="inline-flex items-center gap-2 text-sm font-black text-slate-700">
        <input name="isPublished" type="checkbox" defaultChecked={post?.isPublished ?? false} className="h-4 w-4 rounded border-border text-primary" />
        Opublikowany
      </label>

      <Button type="submit" className="h-11 px-5">
        <Save className="h-4 w-4" />
        {isEdit ? "Zapisz wpis" : "Dodaj wpis"}
      </Button>
    </form>
  );
}

function LocaleField({ locale, readOnly }: { locale: AdminCatalogLocale; readOnly: boolean }) {
  if (readOnly) {
    return (
      <div>
        <input type="hidden" name="locale" value={locale} />
        <p className="text-xs font-black uppercase text-slate-500">Język</p>
        <p className="mt-1 inline-flex rounded-full bg-primary-soft px-3 py-1 text-sm font-black text-primary">{localeLabels[locale]}</p>
      </div>
    );
  }

  return (
    <Field label="Język">
      <Select name="locale" defaultValue={locale}>
        {Object.entries(localeLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
    </Field>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-slate-500">{label}</span>
      <span className="mt-1 block">{children}</span>
    </label>
  );
}

function EditorField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="block">
      <span className="text-xs font-black uppercase text-slate-500">{label}</span>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Input(props: React.ComponentPropsWithoutRef<"input">) {
  return <input className="focus-ring h-11 w-full rounded-lg border border-border bg-white px-3 text-sm font-semibold outline-none" {...props} />;
}

function Textarea(props: React.ComponentPropsWithoutRef<"textarea">) {
  return <textarea className="focus-ring min-h-28 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold leading-6 outline-none" {...props} />;
}

function Select(props: React.ComponentPropsWithoutRef<"select">) {
  return <select className="focus-ring h-11 w-full rounded-lg border border-border bg-white px-3 text-sm font-semibold outline-none" {...props} />;
}

function dateTimeLocalValue(value?: Date | null) {
  if (!value) return "";

  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}
