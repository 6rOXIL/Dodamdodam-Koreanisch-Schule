import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import ClientWrapper from "@/components/ClientWrapper";
import { isLocale, type Locale } from "@/lib/i18n/config";

export function generateStaticParams() {
  return [{ locale: "ko" }, { locale: "en" }, { locale: "de" }];
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();

  return <ClientWrapper locale={params.locale as Locale}>{children}</ClientWrapper>;
}
