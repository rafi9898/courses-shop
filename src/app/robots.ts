import { type MetadataRoute } from "next";
import { adminPublicBasePath } from "@/lib/admin-routes";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        adminPublicBasePath,
        "/api",
        "/pl/checkout",
        "/de/checkout",
        "/en/checkout",
        "/pl/koszyk",
        "/de/warenkorb",
        "/en/cart",
        "/pl/zamowienie",
        "/de/bestellung",
        "/en/order"
      ]
    },
    sitemap: getSiteUrl("/sitemap.xml")
  };
}
