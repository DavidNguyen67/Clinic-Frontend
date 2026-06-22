import { ApiResponse } from "@/hooks/global";
import type { StaticsTicsLandingResponse } from "@/interface/response";
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
