"use client";

import { useState } from "react";

export function CourseTitleSlugFields({
  defaultSlug = "",
  defaultTitle = "",
  locale
}: {
  defaultSlug?: string;
  defaultTitle?: string;
  locale: string;
}) {
  const [title, setTitle] = useState(defaultTitle);
  const [slug, setSlug] = useState(defaultSlug || slugify(defaultTitle));
  const [slugTouched, setSlugTouched] = useState(Boolean(defaultSlug));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="block">
        <span className="text-xs font-black uppercase text-slate-500">Tytuł ({locale.toUpperCase()})</span>
        <span className="mt-1 block">
          <input
            className="focus-ring h-11 w-full rounded-lg border border-border bg-white px-3 text-sm font-semibold outline-none"
            name="title"
            value={title}
            required
            onChange={(event) => {
              const nextTitle = event.target.value;
              setTitle(nextTitle);

              if (!slugTouched) {
                setSlug(slugify(nextTitle));
              }
            }}
          />
        </span>
      </label>
      <label className="block">
        <span className="text-xs font-black uppercase text-slate-500">Slug URL</span>
        <span className="mt-1 block">
          <input
            className="focus-ring h-11 w-full rounded-lg border border-border bg-white px-3 text-sm font-semibold outline-none"
            name="slug"
            value={slug}
            required
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(slugify(event.target.value));
            }}
          />
        </span>
      </label>
    </div>
  );
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
