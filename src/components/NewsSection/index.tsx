import News from "@/components/News";
import { ArticlesResponse, NewsResponse } from "@/interface/response";
import { LanguageCode } from "@/i18n/config";

interface NewsSectionProps {
  locale: LanguageCode;
}

const NEWS_REVALIDATE_SECONDS = 60 * 30;

export async function fetchNews(locale: LanguageCode): Promise<NewsResponse> {
  const url =
    `https://gnews.io/api/v4/top-headlines` +
    `?category=health` +
    `&lang=${locale}` +
    `&max=10` +
    `&apikey=${process.env.GNEWS_API_KEY}`;
  const safeUrl =
    `https://gnews.io/api/v4/top-headlines` +
    `?category=health` +
    `&lang=${locale}` +
    `&max=10` +
    `&apikey=***`;
  const startedAt = Date.now();
  console.log("[fetchNews] START", {
    locale,
    url: safeUrl,
    hasApiKey: Boolean(process.env.GNEWS_API_KEY),
    revalidateSeconds: NEWS_REVALIDATE_SECONDS,
    cacheTag: `news-${locale}`,
    time: new Date().toISOString(),
  });
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(30_000),
      next: { revalidate: NEWS_REVALIDATE_SECONDS, tags: [`news-${locale}`] },
    });
    console.log("[fetchNews] RESPONSE", {
      locale,
      url: safeUrl,
      status: res.status,
      statusText: res.statusText,
      ok: res.ok,
      durationMs: Date.now() - startedAt,
      contentType: res.headers.get("content-type"),
    });
    const rawBody = await res.text();
    if (!res.ok) {
      console.error("[fetchNews] API ERROR", {
        locale,
        url: safeUrl,
        status: res.status,
        statusText: res.statusText,
        durationMs: Date.now() - startedAt,
        body: rawBody,
      });
      throw new Error(`Failed to fetch news: ${res.status} ${res.statusText}`);
    }
    let data: NewsResponse;
    try {
      data = JSON.parse(rawBody) as NewsResponse;
    } catch (error) {
      console.error("[fetchNews] JSON PARSE ERROR", {
        locale,
        url: safeUrl,
        error: error instanceof Error ? { name: error.name, message: error.message } : error,
        rawBody,
      });
      throw new Error("Failed to parse GNews response");
    }
    console.log("[fetchNews] SUCCESS", {
      locale,
      durationMs: Date.now() - startedAt,
      articleCount: data.articles?.length ?? 0,
      totalArticles: data.totalArticles,
    });
    return data;
  } catch (error) {
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
      console.error("[fetchNews] TIMEOUT", {
        locale,
        url: safeUrl,
        durationMs: Date.now() - startedAt,
        message: "Request timed out after 30 seconds",
      });
      throw new Error("GNews API request timed out after 30 seconds");
    }
    console.error("[fetchNews] REQUEST FAILED", {
      locale,
      url: safeUrl,
      durationMs: Date.now() - startedAt,
      error:
        error instanceof Error
          ? { name: error.name, message: error.message, stack: error.stack, cause: error.cause }
          : error,
    });
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
