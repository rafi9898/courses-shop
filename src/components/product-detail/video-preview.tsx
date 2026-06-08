"use client";

import { Play, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { type Dictionary } from "@/lib/i18n/dictionaries";
import { type Locale } from "@/lib/i18n/config";
import { type Course } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function VideoPreview({
  course,
  dictionary,
  locale
}: {
  course: Course;
  dictionary: Dictionary;
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);
  const trailerEmbedUrl = getYoutubeEmbedUrl(course.trailerYoutubeUrl);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    if (open) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="focus-ring group relative block w-full overflow-hidden rounded-2xl shadow-card"
        aria-label={dictionary.detail.watchPreview}
      >
        <div
          className={cn(
            "relative grid h-[280px] min-h-[280px] place-items-center overflow-hidden p-8 text-white md:h-[360px] xl:h-[400px]",
            course.thumbnail.variant === "dark" &&
              "bg-[radial-gradient(circle_at_75%_44%,#ff5a2f_0_16%,transparent_17%),linear-gradient(135deg,#07111f,#111827)]",
            course.thumbnail.variant === "blue" && "bg-[linear-gradient(135deg,#073b75,#0f67b3)]",
            course.thumbnail.variant === "purple" && "bg-[linear-gradient(135deg,#24106f,#6d3df2)]",
            course.thumbnail.variant === "green" && "bg-[linear-gradient(135deg,#064e3b,#059669)]"
          )}
        >
          {course.thumbnailImageUrl ? <Image src={course.thumbnailImageUrl} alt={course.title[locale]} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" /> : null}
          {course.thumbnailImageUrl ? <div className="absolute inset-0 bg-black/25" /> : null}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />
          <div className="absolute -bottom-8 left-0 right-0 h-28 border-t border-dashed border-white/20 opacity-60" />
          {!course.thumbnailImageUrl ? (
            <div className="relative z-10 w-full text-left">
              <div className="text-4xl font-black tracking-normal md:text-5xl">{course.thumbnail.title}</div>
              <div className="mt-2 text-sm font-black uppercase text-warning md:text-lg">{course.thumbnail.subtitle}</div>
            </div>
          ) : null}
        </div>
        <span className="absolute inset-0 grid place-items-center bg-black/10 transition group-hover:bg-black/20">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-white text-primary shadow-card">
            <Play className="ml-1 h-9 w-9 fill-current" />
          </span>
        </span>
        <span className="absolute bottom-6 left-0 right-0 text-center text-sm font-bold text-white">
          {dictionary.detail.watchPreview}
        </span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={dictionary.detail.watchPreview}
        >
          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-card">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="focus-ring absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-slate-700"
              aria-label={dictionary.detail.closePreview}
            >
              <X className="h-5 w-5" />
            </button>
            {trailerEmbedUrl ? (
              <iframe
                src={trailerEmbedUrl}
                title={course.title[locale]}
                className="aspect-video w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="grid aspect-video place-items-center bg-gradient-to-br from-slate-950 to-primary text-white">
                <div className="text-center">
                  <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white text-primary">
                    <Play className="ml-1 h-9 w-9 fill-current" />
                  </div>
                  <p className="mt-5 text-xl font-black">{course.title[locale]}</p>
                  <p className="mt-2 text-sm text-white/70">{dictionary.detail.watchPreview}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

function getYoutubeEmbedUrl(value?: string | null) {
  if (!value) return null;

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    const videoId = host === "youtu.be" ? url.pathname.slice(1) : url.searchParams.get("v");

    if (!videoId || !["youtube.com", "m.youtube.com", "youtu.be"].includes(host)) {
      return null;
    }

    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return null;
  }
}
