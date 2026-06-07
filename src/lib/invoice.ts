export type InvoiceData = {
  buyerName: string;
  buyerCompany: string;
  buyerEmail: string;
  buyerCountry: string;
  buyerTaxId: string;
  buyerAddressLine1: string;
  buyerPostalCode: string;
  buyerCity: string;
};

export const emptyInvoiceData: InvoiceData = {
  buyerName: "",
  buyerCompany: "",
  buyerEmail: "",
  buyerCountry: "",
  buyerTaxId: "",
  buyerAddressLine1: "",
  buyerPostalCode: "",
  buyerCity: ""
};

export function isInvoiceDataComplete(invoiceData: InvoiceData) {
  return Boolean(
    invoiceData.buyerName.trim() &&
      invoiceData.buyerEmail.trim() &&
      invoiceData.buyerCountry.trim() &&
      invoiceData.buyerAddressLine1.trim() &&
      invoiceData.buyerPostalCode.trim() &&
      invoiceData.buyerCity.trim()
  );
}

export function parseInvoiceData(value: unknown): InvoiceData | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Record<string, unknown>;
  const invoiceData: InvoiceData = {
    buyerName: readString(candidate.buyerName),
    buyerCompany: readString(candidate.buyerCompany),
    buyerEmail: readString(candidate.buyerEmail),
    buyerCountry: readString(candidate.buyerCountry),
    buyerTaxId: readString(candidate.buyerTaxId),
    buyerAddressLine1: readString(candidate.buyerAddressLine1),
    buyerPostalCode: readString(candidate.buyerPostalCode),
    buyerCity: readString(candidate.buyerCity)
  };

  return isInvoiceDataComplete(invoiceData) ? invoiceData : null;
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 200) : "";
}
