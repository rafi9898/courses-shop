"use client";

import { Check, Copy, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getAdminPath } from "@/lib/admin-routes";

export function CopyLinkButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Button type="button" variant="secondary" className="h-9 px-3" onClick={handleCopy}>
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Skopiowano" : "Kopiuj link"}
    </Button>
  );
}

export function AdminLogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace(getAdminPath());
    router.refresh();
  }

  return (
    <Button type="button" variant="secondary" className="h-10 px-4" onClick={handleLogout} disabled={isSubmitting}>
      <LogOut className="h-4 w-4" />
      Wyloguj
    </Button>
  );
}
