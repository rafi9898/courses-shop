"use client";

import { Check, Loader2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function OrderResendEmailButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleResend() {
    setState("loading");
    const response = await fetch(`/api/admin/orders/${orderId}/resend-email`, {
      method: "POST"
    });

    if (!response.ok) {
      setState("error");
      return;
    }

    setState("success");
    router.refresh();
    window.setTimeout(() => setState("idle"), 2200);
  }

  return (
    <div className="flex flex-col gap-2">
      <Button type="button" className="h-10 px-4" onClick={handleResend} disabled={state === "loading"}>
        {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : state === "success" ? <Check className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
        {state === "success" ? "Wysłano" : "Wyślij e-mail ponownie"}
      </Button>
      {state === "error" ? <p className="text-xs font-semibold text-red-600">Nie udało się wysłać e-maila. Sprawdź konfigurację Resend i adres klienta.</p> : null}
    </div>
  );
}
