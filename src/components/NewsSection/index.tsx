import News from "@/components/News";
import { ArticlesResponse, NewsResponse } from "@/interface/response";
import { LanguageCode } from "@/i18n/config";
import { fetchNews } from "../LandingPage/About/config";

interface NewsSectionProps {
  locale: LanguageCode;
}

async function NewsSection({ locale }: NewsSectionProps) {
  let articles: ArticlesResponse[] = [];
  try {
    const data = await fetchNews(locale);
    console.log("[NewsSection]", "fetched", data?.articles?.length);
    articles = data.articles ?? [];
  } catch (err) {
    console.error("[NewsSection] fetch failed:", err);
    // Render empty state instead of crashing
  }

  return <News articles={articles} />;
}

export default NewsSection;
