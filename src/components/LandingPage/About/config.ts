import { ApiResponse } from "@/hooks/global";
import { LanguageCode } from "@/i18n/config";
import type { NewsResponse, StaticsTicsLandingResponse } from "@/interface/response";
import { getInternalApiBaseUrl } from "@/lib/server-api";

interface LandingStaticsApiBody {
  trustedPatients: number;
  experience?: number;
  experienceYears?: number;
  specialistDoctors: number;
  satisfaction?: number;
  satisfactionRate?: number;
}

function isApiResponse(value: unknown): value is ApiResponse<LandingStaticsApiBody> {
  return typeof value === "object" && value !== null && "body" in value;
}

export async function fetchLandingStatics(): Promise<StaticsTicsLandingResponse | null> {
  const apiBaseUrl = getInternalApiBaseUrl();
  const url = `${apiBaseUrl}/api/v1/public/landing`;
  const startedAt = Date.now();
  console.log("[fetchLandingStatics] START", { url, apiBaseUrl, time: new Date().toISOString() });
  try {
    const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(30_000) });
    console.log("[fetchLandingStatics] RESPONSE", {
      url,
      status: res.status,
      statusText: res.statusText,
      ok: res.ok,
      durationMs: Date.now() - startedAt,
      contentType: res.headers.get("content-type"),
    });
    const rawBody = await res.text();
    if (!res.ok) {
      console.error("[fetchLandingStatics] API ERROR", {
        url,
        status: res.status,
        statusText: res.statusText,
        durationMs: Date.now() - startedAt,
        body: rawBody,
      });
      return null;
    }
    let data: ApiResponse<LandingStaticsApiBody> | LandingStaticsApiBody;
    try {
      data = JSON.parse(rawBody) as ApiResponse<LandingStaticsApiBody> | LandingStaticsApiBody;
    } catch (error) {
      console.error("[fetchLandingStatics] JSON PARSE ERROR", {
        url,
        error: error instanceof Error ? { name: error.name, message: error.message } : error,
        rawBody,
      });
      return null;
    }
    const body = isApiResponse(data) ? data.body : data;
    if (!body) {
      console.error("[fetchLandingStatics] EMPTY BODY", { url, data });
      return null;
    }
    const result: StaticsTicsLandingResponse = {
      trustedPatients: body.trustedPatients,
      experience: body.experience ?? body.experienceYears ?? 0,
      specialistDoctors: body.specialistDoctors,
      satisfaction: body.satisfaction ?? body.satisfactionRate ?? 0,
    };
    console.log("[fetchLandingStatics] SUCCESS", {
      url,
      durationMs: Date.now() - startedAt,
      result,
    });
    return result;
  } catch (error) {
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
      console.error("[fetchLandingStatics] TIMEOUT", {
        url,
        durationMs: Date.now() - startedAt,
        message: "Request timed out after 30 seconds",
      });
      return null;
    }
    console.error("[fetchLandingStatics] FETCH FAILED", {
      url,
      durationMs: Date.now() - startedAt,
      error:
        error instanceof Error
          ? { name: error.name, message: error.message, stack: error.stack, cause: error.cause }
          : error,
    });
    return null;
  }
}


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

const NEWS_REVALIDATE_SECONDS = 60 * 30;
