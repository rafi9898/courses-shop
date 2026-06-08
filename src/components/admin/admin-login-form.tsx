"use client";

import { LockKeyhole, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setError("Nieprawidłowy login, hasło lub brak konfiguracji panelu.");
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm rounded-xl border border-border bg-white p-6 shadow-card">
      <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary-soft text-primary">
        <LockKeyhole className="h-5 w-5" />
      </div>
      <h1 className="mt-5 text-2xl font-black">Panel admina</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">Zaloguj się danymi ustawionymi w `ADMIN_USERNAME` i `ADMIN_PASSWORD`.</p>
      <label className="mt-5 block text-sm font-semibold text-slate-700" htmlFor="admin-username">
        Login
      </label>
      <input
        id="admin-username"
        type="text"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        className="focus-ring mt-2 h-12 w-full rounded-[10px] border border-border bg-white px-4 text-sm"
        autoComplete="username"
      />
      <label className="mt-4 block text-sm font-semibold text-slate-700" htmlFor="admin-password">
        Hasło
      </label>
      <input
        id="admin-password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="focus-ring mt-2 h-12 w-full rounded-[10px] border border-border bg-white px-4 text-sm"
        autoComplete="current-password"
      />
      {error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}
      <Button type="submit" className="mt-5 w-full" disabled={isSubmitting || !username || !password}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}
        Zaloguj
      </Button>
    </form>
  );
}
