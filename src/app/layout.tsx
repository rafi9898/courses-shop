import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PROJECT_NAME Online Courses",
  description: "Minimalistyczny sklep z praktycznymi kursami online dostępnymi przez Udemy."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
