import LandingPage from "@/components/LandingPage";
import { LanguageCode } from "@/i18n/config";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { connection } from "next/server";
type Props = {
  params: Promise<{ locale: LanguageCode }>;
};

export const dynamic = "force-static";
export const revalidate = 1800;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Home({ params }: Props) {
  await connection();

  const { locale } = await params;

  setRequestLocale(locale);

  return <LandingPage locale={locale} />;
}
