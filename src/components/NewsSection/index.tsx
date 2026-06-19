import News from "@/components/News";
import { ArticlesResponse, NewsResponse } from "@/interface/response";
import { LanguageCode } from "@/i18n/config";

interface NewsSectionProps {
  locale: LanguageCode;
}

const NEWS_REVALIDATE_SECONDS = 60 * 30;

export async function fetchNews(locale: LanguageCode): Promise<NewsResponse> {
  try {
    const res = await fetch(
      `https://gnews.io/api/v4/top-headlines?category=health&lang=${locale}&max=10&apikey=${process.env.GNEWS_API_KEY}`,
      {
        signal: AbortSignal.timeout(30_000),

        next: {
          revalidate: NEWS_REVALIDATE_SECONDS,
          tags: [`news-${locale}`],
        },
      }
    );

    if (!res.ok) {
      console.error("[fetchNews] failed:", res.status, res.statusText);
      throw new Error(`Failed to fetch news: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
      console.error("[fetchNews] timeout after 30 seconds");
      throw new Error("GNews API request timed out after 30 seconds");
    }

    console.error("[fetchNews] request failed:", error);
    throw error;
  }
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
