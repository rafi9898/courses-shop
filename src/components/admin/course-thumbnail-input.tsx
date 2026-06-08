"use client";

import { useState } from "react";

const maxCourseThumbnailSize = 8 * 1024 * 1024;
const allowedCourseThumbnailTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function CourseThumbnailInput() {
  const [error, setError] = useState("");

  return (
    <div>
      <input
        name="thumbnailImage"
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="focus-ring h-11 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold outline-none file:mr-3 file:rounded-md file:border-0 file:bg-primary-soft file:px-3 file:py-1 file:text-xs file:font-black file:text-primary"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];

          if (!file) {
            setError("");
            return;
          }

          if (!allowedCourseThumbnailTypes.includes(file.type)) {
            event.currentTarget.value = "";
            setError("Wybierz miniaturkę JPG, PNG, WebP albo GIF.");
            return;
          }

          if (file.size > maxCourseThumbnailSize) {
            event.currentTarget.value = "";
            setError("Miniaturka może mieć maksymalnie 8 MB.");
            return;
          }

          setError("");
        }}
      />
      {error ? <p className="mt-2 text-xs font-bold text-red-600">{error}</p> : <p className="mt-2 text-xs font-semibold text-slate-500">Maksymalnie 8 MB.</p>}
    </div>
  );
}
