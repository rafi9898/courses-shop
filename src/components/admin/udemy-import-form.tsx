"use client";

import { Download, FileUp, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type ImportResult = {
  totalRows: number;
  created: number;
  updated: number;
  missingUdemyCourseIds?: string[];
  rejected: Array<{
    rowNumber: number;
    reason: string;
  }>;
};

const sampleCsv = `course_id,coupon_type,coupon_code,start_date,start_time,custom_price
6893793,free_targeted,N4B8X1QW7R5T9Y2PL6KC,2026-06-01,00:00,`;

export function UdemyImportForm() {
  const router = useRouter();
  const [csv, setCsv] = useState("");
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setCsv(await file.text());
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);
    setIsSubmitting(true);

    const response = await fetch("/api/admin/udemy/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ csv })
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setError("Import nie powiódł się. Sprawdź format CSV i połączenie z bazą.");
      return;
    }

    setResult((await response.json()) as ImportResult);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-white p-5 shadow-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-black">Import kodów Udemy</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            CSV z Udemy obsługuje kolumny: `course_id`, `coupon_code`, `start_date`, `start_time`. Kod musi mieć 6-20 znaków: A-Z, 0-9, kropka, myślnik
            albo podkreślenie. Kurs musi mieć uzupełnione `Udemy Course ID` i `URL kursu Udemy`.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/api/admin/udemy/import"
            className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-border bg-white px-4 text-sm font-semibold hover:border-primary hover:text-primary"
          >
            <Download className="h-4 w-4" />
            Generuj CSV
          </a>
          <label className="focus-ring inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-border bg-white px-4 text-sm font-semibold hover:border-primary hover:text-primary">
            <FileUp className="h-4 w-4" />
            Wybierz CSV
            <input type="file" accept=".csv,text/csv" className="sr-only" onChange={handleFileChange} />
          </label>
        </div>
      </div>
      <textarea
        value={csv}
        onChange={(event) => setCsv(event.target.value)}
        className="focus-ring mt-4 min-h-40 w-full rounded-[10px] border border-border bg-white p-3 font-mono text-xs leading-5"
        placeholder={sampleCsv}
      />
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="ghost" className="h-10 px-4" onClick={() => setCsv(sampleCsv)}>
          Wstaw przykład
        </Button>
        <Button type="submit" className="h-10 px-4" disabled={isSubmitting || !csv.trim()}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
          Importuj
        </Button>
      </div>
      {error ? <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}
      {result ? (
        <div className="mt-3 rounded-lg bg-primary-soft px-3 py-2 text-sm text-slate-700">
          <p className="font-black text-primary">
            Wiersze: {result.totalRows}, dodane: {result.created}, zaktualizowane: {result.updated}, odrzucone: {result.rejected.length}
          </p>
          {result.rejected.length > 0 ? (
            <ul className="mt-2 space-y-1">
              {result.rejected.slice(0, 6).map((row) => (
                <li key={`${row.rowNumber}-${row.reason}`}>
                  Wiersz {row.rowNumber}: {row.reason}
                </li>
              ))}
            </ul>
          ) : null}
          {result.missingUdemyCourseIds?.length ? (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800">
              <p className="font-black">Brak mapowania Udemy Course ID:</p>
              <p className="mt-1 font-mono text-xs leading-5">
                {result.missingUdemyCourseIds.slice(0, 30).join(", ")}
                {result.missingUdemyCourseIds.length > 30 ? ` + ${result.missingUdemyCourseIds.length - 30} więcej` : ""}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
