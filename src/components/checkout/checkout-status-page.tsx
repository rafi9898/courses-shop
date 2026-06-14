import { CheckCircle2, XCircle } from "lucide-react";
import { OrderAccessPanel } from "@/components/checkout/order-access-panel";
import { ButtonLink } from "@/components/ui/button";
import { Confetti } from "@/components/ui/confetti";
import { type Locale } from "@/lib/i18n/config";
import { type Dictionary } from "@/lib/i18n/dictionaries";

export function CheckoutStatusPage({
  locale,
  dictionary,
  status,
  sessionId
}: {
  locale: Locale;
  dictionary: Dictionary;
  status: "success" | "cancel";
  sessionId?: string;
}) {
  const isSuccess = status === "success";
  const Icon = isSuccess ? CheckCircle2 : XCircle;

  return (
    <div className="bg-gradient-to-b from-white to-[#fbfaff]">
      {isSuccess && <Confetti />}
      <section className="container-shell py-14">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-white p-8 text-center shadow-card">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary-soft text-primary">
            <Icon className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-4xl font-black leading-tight tracking-normal">
            {isSuccess ? dictionary.checkoutStatus.successTitle : dictionary.checkoutStatus.cancelTitle}
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {isSuccess ? dictionary.checkoutStatus.successLead : dictionary.checkoutStatus.cancelLead}
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href={isSuccess ? dictionary.routes.courses : dictionary.routes.cart}>
              {isSuccess ? dictionary.checkoutStatus.goToCourses : dictionary.checkoutStatus.goToCart}
            </ButtonLink>
            <ButtonLink href={`/${locale}`} variant="secondary">
              {dictionary.catalog.breadcrumbsHome}
            </ButtonLink>
          </div>
        </div>
        {isSuccess ? <OrderAccessPanel sessionId={sessionId} locale={locale} dictionary={dictionary} /> : null}
      </section>
    </div>
  );
}
