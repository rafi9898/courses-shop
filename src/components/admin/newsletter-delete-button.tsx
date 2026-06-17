"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function NewsletterDeleteButton({ id, email }: { id: string; email: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Czy na pewno chcesz usunąć subskrybenta ${email}?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/newsletter/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Błąd podczas usuwania subskrybenta.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Wystąpił nieoczekiwany błąd.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="focus-ring inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-white px-3 text-sm font-black text-red-600 transition hover:border-red-300 hover:text-red-700 disabled:opacity-50"
      title="Usuń subskrybenta"
    >
      <Trash2 className="h-4 w-4" />
      Usuń
    </button>
  );
}
