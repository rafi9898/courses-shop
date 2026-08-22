import { LockKeyhole } from "lucide-react";
import { OrderAccessPanel } from "@/components/checkout/order-access-panel";
import { type Locale } from "@/lib/i18n/config";
import { type Dictionary } from "@/lib/i18n/dictionaries";

export function PrivateOrderPage({
  locale,
  dictionary,
  accessToken
}: {
  locale: Locale;
  dictionary: Dictionary;
  accessToken: string;
}) {
  return (
    <div className="bg-gradient-to-b from-white to-[#fbfaff]">
      <section className="container-shell py-14">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-white p-8 text-center shadow-card">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary-soft text-primary">
            <LockKeyhole className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-4xl font-black leading-tight tracking-normal">{dictionary.checkoutStatus.privateOrderTitle}</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">{dictionary.checkoutStatus.privateOrderLead}</p>
        </div>
        <OrderAccessPanel accessToken={accessToken} locale={locale} dictionary={dictionary} />
      </section>
    </div>
  );
}
