import { CategoryColor, CourseLevel, type Bundle, type Category, type Course, type UdemyCoupon } from "@prisma/client";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseThumbnailInput } from "@/components/admin/course-thumbnail-input";
import { CourseTitleSlugFields } from "@/components/admin/course-title-slug-fields";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { createBundleAction, createCategoryAction, createCourseAction, updateBundleAction, updateCategoryAction, updateCourseAction } from "@/lib/admin-catalog-actions";
import { type AdminCatalogLocale } from "@/lib/admin-catalog-locales";

const localeLabels: Record<AdminCatalogLocale, string> = {
  pl: "Polski",
  de: "Deutsch",
  en: "English"
};

const currencyByLocale: Record<AdminCatalogLocale, string> = {
  pl: "PLN",
  de: "EUR",
  en: "USD"
};

const courseLevelLabels: Record<CourseLevel, string> = {
  ALL_LEVELS: "Wszystkie poziomy",
  BEGINNER: "Początkujący",
  INTERMEDIATE: "Średniozaawansowany",
  ADVANCED: "Zaawansowany"
};

type CourseWithSelection = Pick<Course, "id" | "title" | "catalogKey" | "isActive">;

export function CategoryForm({ category, locale }: { category?: Category; locale: AdminCatalogLocale }) {
  const isEdit = Boolean(category);
  const currentLocale = (category?.locale ?? locale) as AdminCatalogLocale;

  return (
    <form action={isEdit ? updateCategoryAction : createCategoryAction} className="space-y-6 rounded-xl border border-border bg-white p-5 shadow-card">
      {category ? <input type="hidden" name="currentId" value={category.id} /> : null}
      <FormHeader title={isEdit ? "Edytuj kategorię" : "Dodaj kategorię"} description="Tworzysz kategorię tylko dla jednego wybranego języka." />
      <LocaleField locale={currentLocale} readOnly={isEdit} />
      <div className="grid gap-4 md:grid-cols-4">
        <Field label="Klucz katalogu">
          <Input name="catalogKey" defaultValue={category?.catalogKey} required />
        </Field>
        <Field label="Slug">
          <Input name="slug" defaultValue={category?.slug} required />
        </Field>
        <Field label="Kolor">
          <Select name="color" defaultValue={category?.color ?? CategoryColor.VIOLET}>
            {Object.values(CategoryColor).map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Kolejność">
          <Input name="sortOrder" type="number" defaultValue={category?.sortOrder ?? 0} />
        </Field>
      </div>
      <Field label={`Nazwa (${currentLocale.toUpperCase()})`}>
        <Input name="label" defaultValue={category?.label} required />
      </Field>
      <Field label={`Opis (${currentLocale.toUpperCase()})`}>
        <Textarea name="description" defaultValue={category?.description} required />
      </Field>
      <ActiveField defaultChecked={category?.isActive ?? true} />
      <SubmitButton label={isEdit ? "Zapisz kategorię" : "Dodaj kategorię"} />
    </form>
  );
}

export function CourseForm({
  categories,
  course,
  activeUdemyCoupon,
  locale
}: {
  categories: Category[];
  course?: Course;
  activeUdemyCoupon?: UdemyCoupon | null;
  locale: AdminCatalogLocale;
}) {
  const isEdit = Boolean(course);
  const currentLocale = (course?.locale ?? locale) as AdminCatalogLocale;

  return (
    <form action={isEdit ? updateCourseAction : createCourseAction} className="space-y-6 rounded-xl border border-border bg-white p-5 shadow-card">
      {course ? <input type="hidden" name="currentId" value={course.id} /> : null}
      <FormHeader title={isEdit ? "Edytuj kurs" : "Dodaj kurs"} description="Tworzysz kurs tylko dla jednego wybranego języka." />
      <LocaleField locale={currentLocale} readOnly={isEdit} />
      <input type="hidden" name="catalogKey" value={course?.catalogKey ?? ""} />
      {course?.thumbnailImageUrl ? <input type="hidden" name="existingThumbnailImageUrl" value={course.thumbnailImageUrl} /> : null}
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Kategoria">
          <Select name="categoryId" defaultValue={course?.categoryId ?? categories[0]?.id} required>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Poziom">
          <Select name="level" defaultValue={course?.level ?? CourseLevel.ALL_LEVELS}>
            {Object.values(CourseLevel).map((level) => (
              <option key={level} value={level}>
                {courseLevelLabels[level]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Kolejność">
          <Input name="sortOrder" type="number" defaultValue={course?.sortOrder ?? 0} />
        </Field>
      </div>
      <CourseTitleSlugFields defaultTitle={course?.title} defaultSlug={course?.slug} locale={currentLocale} />
      <Field label="Podtytuł">
        <Textarea name="subtitle" defaultValue={course?.subtitle ?? ""} />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Udemy Course ID">
          <Input name="udemyCourseId" defaultValue={course?.udemyCourseId ?? ""} placeholder="np. 6893793" />
        </Field>
        <Field label="URL kursu Udemy">
          <Input name="udemyUrl" type="url" defaultValue={course?.udemyUrl ?? ""} placeholder="https://www.udemy.com/course/..." />
        </Field>
      </div>
      <Field label="Kod">
        <Input name="udemyCouponCode" defaultValue={activeUdemyCoupon?.couponCode ?? ""} placeholder="np. A7F3D92KLM8P4QX1R0ZT" />
      </Field>
      <p className="-mt-4 text-xs font-semibold text-slate-500">Kod zaciąga się automatycznie po imporcie CSV. Ręczna zmiana tego pola aktualizuje aktywny kod Udemy dla kursu.</p>
      <PriceGrid locale={currentLocale} entity={course} />
      <div className="grid gap-4 md:grid-cols-4">
        <Field label="Ocena">
          <Input name="rating" type="number" step="0.01" min="0" max="5" defaultValue={decimalValue(course?.rating, "4.80")} required />
        </Field>
        <Field label="Recenzje">
          <Input name="reviews" type="number" min="0" defaultValue={course?.reviews ?? 0} required />
        </Field>
        <Field label="Godziny">
          <Input name="durationHours" type="number" min="0" defaultValue={course?.durationHours ?? 0} required />
        </Field>
        <Field label="Lekcje">
          <Input name="lessons" type="number" min="0" defaultValue={course?.lessons ?? 0} required />
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Miniaturka kursu">
          <CourseThumbnailInput />
        </Field>
        <Field label="Trailer YouTube">
          <Input name="trailerYoutubeUrl" type="url" defaultValue={course?.trailerYoutubeUrl ?? ""} placeholder="https://www.youtube.com/watch?v=..." />
        </Field>
      </div>
      {course?.thumbnailImageUrl ? <p className="-mt-4 text-xs font-semibold text-slate-500">Aktualna miniaturka: {course.thumbnailImageUrl}</p> : null}
      <EditorField label="O kursie">
        <RichTextEditor name="highlights" defaultValue={richTextValue(course?.highlights)} />
      </EditorField>
      <Field label="Czego się nauczysz">
        <Textarea name="outcomes" defaultValue={linesValue(course?.outcomes)} />
      </Field>
      <p className="-mt-4 text-xs font-semibold text-slate-500">Wpisz każdy punkt w osobnej linii.</p>
      <Field label="Program kursu">
        <Textarea name="agenda" defaultValue={agendaValue(course?.agenda)} />
      </Field>
      <p className="-mt-4 text-xs font-semibold text-slate-500">Program: jeden moduł na linię w formacie `nazwa modułu | liczba lekcji`.</p>
      <ActiveField defaultChecked={course?.isActive ?? true} />
      <SubmitButton label={isEdit ? "Zapisz kurs" : "Dodaj kurs"} />
    </form>
  );
}

export function BundleForm({
  bundle,
  categories,
  courses,
  locale,
  selectedCourseIds = []
}: {
  bundle?: Bundle;
  categories: Category[];
  courses: CourseWithSelection[];
  locale: AdminCatalogLocale;
  selectedCourseIds?: string[];
}) {
  const isEdit = Boolean(bundle);
  const currentLocale = (bundle?.locale ?? locale) as AdminCatalogLocale;

  return (
    <form action={isEdit ? updateBundleAction : createBundleAction} className="space-y-6 rounded-xl border border-border bg-white p-5 shadow-card">
      {bundle ? <input type="hidden" name="currentId" value={bundle.id} /> : null}
      <FormHeader title={isEdit ? "Edytuj pakiet" : "Dodaj pakiet"} description="Tworzysz pakiet tylko dla jednego wybranego języka." />
      <LocaleField locale={currentLocale} readOnly={isEdit} />
      <input type="hidden" name="catalogKey" value={bundle?.catalogKey ?? ""} />
      <input type="hidden" name="thumbnailTitle" value={bundle?.thumbnailTitle ?? ""} />
      <input type="hidden" name="thumbnailSubtitle" value={bundle?.thumbnailSubtitle ?? ""} />
      <input type="hidden" name="thumbnailVariant" value={bundle?.thumbnailVariant ?? "PURPLE"} />
      {bundle?.thumbnailImageUrl ? <input type="hidden" name="existingThumbnailImageUrl" value={bundle.thumbnailImageUrl} /> : null}
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Kategoria">
          <Select name="categoryId" defaultValue={bundle?.categoryId ?? categories[0]?.id} required>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Kolejność">
          <Input name="sortOrder" type="number" defaultValue={bundle?.sortOrder ?? 0} />
        </Field>
        <Field label="Miniaturka pakietu">
          <CourseThumbnailInput />
        </Field>
      </div>
      {bundle?.thumbnailImageUrl ? <p className="-mt-4 text-xs font-semibold text-slate-500">Aktualna miniaturka: {bundle.thumbnailImageUrl}</p> : null}
      <CourseTitleSlugFields defaultTitle={bundle?.title} defaultSlug={bundle?.slug} locale={currentLocale} />
      <Field label="Podtytuł">
        <Textarea name="subtitle" defaultValue={bundle?.subtitle ?? ""} />
      </Field>
      <EditorField label="O pakiecie">
        <RichTextEditor name="description" defaultValue={bundle?.description ?? ""} />
      </EditorField>
      <PriceGrid locale={currentLocale} entity={bundle} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Ocena">
          <Input name="rating" type="number" step="0.01" min="0" max="5" defaultValue={decimalValue(bundle?.rating, "4.80")} required />
        </Field>
        <Field label="Recenzje">
          <Input name="reviews" type="number" min="0" defaultValue={bundle?.reviews ?? 0} required />
        </Field>
      </div>
      <Field label="Kursy w pakiecie">
        <select
          name="courseIds"
          multiple
          defaultValue={selectedCourseIds}
          className="focus-ring min-h-56 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold outline-none"
          required
        >
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title} ({course.catalogKey}){course.isActive ? "" : " - nieaktywny"}
            </option>
          ))}
        </select>
      </Field>
      <ActiveField defaultChecked={bundle?.isActive ?? true} />
      <SubmitButton label={isEdit ? "Zapisz pakiet" : "Dodaj pakiet"} />
    </form>
  );
}

function FormHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="text-xl font-black">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
    </div>
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
  return <input className="focus-ring h-11 w-full rounded-lg border border-border bg-white px-3 text-sm font-semibold outline-none read-only:bg-slate-50 read-only:text-slate-500" {...props} />;
}

function Textarea(props: React.ComponentPropsWithoutRef<"textarea">) {
  return <textarea className="focus-ring min-h-28 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold leading-6 outline-none" {...props} />;
}

function Select(props: React.ComponentPropsWithoutRef<"select">) {
  return <select className="focus-ring h-11 w-full rounded-lg border border-border bg-white px-3 text-sm font-semibold outline-none" {...props} />;
}

function ActiveField({ defaultChecked }: { defaultChecked: boolean }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm font-black text-slate-700">
      <input name="isActive" type="checkbox" defaultChecked={defaultChecked} className="h-4 w-4 rounded border-border text-primary" />
      Aktywny w katalogu
    </label>
  );
}

function SubmitButton({ label }: { label: string }) {
  return (
    <Button type="submit" className="h-11 px-5">
      <Save className="h-4 w-4" />
      {label}
    </Button>
  );
}

function PriceGrid({ locale, entity }: { locale: AdminCatalogLocale; entity?: Pick<Course, "price" | "regularPrice" | "currency"> | Pick<Bundle, "price" | "regularPrice" | "currency"> }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Field label="Cena">
        <Input name="price" type="number" step="0.01" min="0" defaultValue={decimalValue(entity?.price)} required />
      </Field>
      <Field label="Cena regularna">
        <Input name="regularPrice" type="number" step="0.01" min="0" defaultValue={decimalValue(entity?.regularPrice)} required />
      </Field>
      <Field label="Waluta">
        <Input name="currency" defaultValue={entity?.currency ?? currencyByLocale[locale]} required />
      </Field>
    </div>
  );
}

function decimalValue(value: unknown, fallback = "0.00") {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function linesValue(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => String(item)).join("\n");
  return "";
}

function richTextValue(value: unknown) {
  if (!Array.isArray(value)) return "";
  if (value.length === 1 && String(value[0]).includes("<")) return String(value[0]);

  return value
    .map((item) => `<p>${escapeHtml(String(item))}</p>`)
    .join("");
}

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function agendaValue(value: unknown) {
  if (!Array.isArray(value)) return "";

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return "";
      const agendaItem = item as { title?: unknown; lessons?: unknown };
      return `${String(agendaItem.title ?? "")} | ${String(agendaItem.lessons ?? "")}`;
    })
    .filter(Boolean)
    .join("\n");
}
