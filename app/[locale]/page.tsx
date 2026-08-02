import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SBTIApp from "../sbti-client";
import { isLocale, locales, siteCopy } from "../../lib/sbti";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = siteCopy[locale];

  return {
    title: copy.meta.title,
    description: copy.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        ckb: "/ckb",
        ar: "/ar",
      },
    },
    openGraph: {
      title: copy.meta.title,
      description: copy.meta.description,
      images: ["/og.png"],
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: copy.meta.title,
      description: copy.meta.description,
      images: ["/og.png"],
    },
  };
}

export default async function LocalePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <SBTIApp initialLocale={locale} />;
}
