import { SPECIALTY_TYPE } from "@/common";
import { LanguageCode } from "@/i18n/config";
import { SpecialtyOverviewContent, SpecialtyResponse, ViLaoResponse } from "@/interface/response";
import { ApiResponse, METHOD } from "@/hooks/global";
import { unstable_cache } from "next/cache";
import { getInternalApiBaseUrl } from "@/lib/server-api";


const SPECIALTY_LABELS: Record<SPECIALTY_TYPE, Record<LanguageCode, string>> = {
  [SPECIALTY_TYPE.GENERAL]: { vi: "Đa khoa", en: "General Medicine" },
  [SPECIALTY_TYPE.SURGERY]: { vi: "Ngoại khoa", en: "Surgery" },
  [SPECIALTY_TYPE.PEDIATRICS]: { vi: "Nhi khoa", en: "Pediatrics" },
  [SPECIALTY_TYPE.DERMATOLOGY]: { vi: "Da liễu", en: "Dermatology" },
  [SPECIALTY_TYPE.CARDIOLOGY]: { vi: "Tim mạch", en: "Cardiology" },
  [SPECIALTY_TYPE.ORTHOPEDICS]: { vi: "Cơ xương khớp", en: "Orthopedics" },
  [SPECIALTY_TYPE.NEUROLOGY]: { vi: "Thần kinh", en: "Neurology" },
  [SPECIALTY_TYPE.PSYCHIATRY]: { vi: "Tâm thần", en: "Psychiatry" },
  [SPECIALTY_TYPE.GYNECOLOGY]: { vi: "Phụ khoa", en: "Gynecology" },
  [SPECIALTY_TYPE.ENDOCRINOLOGY]: { vi: "Nội tiết", en: "Endocrinology" },
};

export async function _fetchSpecialtyIntro(
  specialtyType: SPECIALTY_TYPE,
  locale: LanguageCode = "vi"
): Promise<SpecialtyOverviewContent> {
  console.log("[fetchSpecialtyIntro] START", {
    specialtyType,
    locale,
    time: new Date().toISOString(),
    hasApiKey: Boolean(process.env.VILAO_API_KEY),
    model: process.env.VILAO_AI_MODEL,
  });

  try {
    console.log("[fetchSpecialtyIntro] Calling ViLao...");

    const res = await fetch("https://api.vilao.ai/v1/chat/completions", {
      method: METHOD.POST,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.VILAO_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.VILAO_AI_MODEL,
        messages: [
          {
            role: "system",
            content:
              "Chỉ trả về JSON thuần, không có markdown, không có backtick, không có giải thích.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    });

    console.log("[fetchSpecialtyIntro] ViLao status:", res.status);

    if (!res.ok) {
      const errorBody = await res.text();

      console.error("[fetchSpecialtyIntro] ViLao error:", {
        status: res.status,
        body: errorBody,
      });

      throw new Error(`ViLao API error: ${res.status}`);
    }

    const data: ViLaoResponse = await res.json();

    console.log("[fetchSpecialtyIntro] ViLao success:", {
      choices: data.choices?.length,
      hasContent: Boolean(data.choices?.[0]?.message?.content),
    });

    const raw = data.choices?.[0]?.message?.content ?? "{}";
    const cleaned = raw.replace(/```json|```/g, "").trim();

    return JSON.parse(cleaned) as SpecialtyOverviewContent;
  } catch (error) {
    console.error("[fetchSpecialtyIntro] FAILED:", error);

    return {
      intro: "",
      treatments: [],
      symptoms: [],
      riskFactors: [],
    };
  }
}

export async function fetchSpecialtyById(
  id: string
): Promise<SpecialtyResponse | null> {
  if (!id) {
    console.error("[fetchSpecialtyById] Invalid ID:", id);
    return null;
  }

  const apiBaseUrl = getInternalApiBaseUrl();
  const url = `${apiBaseUrl}/api/v1/public/specialty/${id}`;

  console.log("[fetchSpecialtyById] START", {
    id,
    apiBaseUrl,
    url,
    time: new Date().toISOString(),
  });

  try {
    const startedAt = Date.now();

    const res = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    });

    console.log("[fetchSpecialtyById] RESPONSE", {
      id,
      url,
      status: res.status,
      statusText: res.statusText,
      ok: res.ok,
      durationMs: Date.now() - startedAt,
      contentType: res.headers.get("content-type"),
    });

    const rawBody = await res.text();

    if (!res.ok) {
      console.error("[fetchSpecialtyById] API ERROR", {
        id,
        url,
        status: res.status,
        statusText: res.statusText,
        body: rawBody,
      });

      return null;
    }

    let data: ApiResponse<SpecialtyResponse>;

    try {
      data = JSON.parse(rawBody) as ApiResponse<SpecialtyResponse>;
    } catch (error) {
      console.error("[fetchSpecialtyById] JSON PARSE ERROR", {
        id,
        url,
        error,
        rawBody,
      });

      return null;
    }

    console.log("[fetchSpecialtyById] SUCCESS", {
      id,
      hasBody: Boolean(data?.body),
    });

    return data?.body ?? null;
  } catch (error) {
    console.error("[fetchSpecialtyById] FETCH FAILED", {
      id,
      url,
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
    });

    return null;
  }
}

export const fetchSpecialtyIntro = unstable_cache(_fetchSpecialtyIntro, ["specialty-intro"], {
  revalidate: 86400,
});
