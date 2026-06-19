import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { METHOD } from "@/hooks/global";
import type {
  LandingServicePromotionResponse,
  ServicePromotionInput,
  ViLaoResponse,
} from "@/interface/response";
import { LanguageCode } from "@/i18n/config";
import { fallbackPromotions, normalizePromotions, normalizeServices } from "@/lib/utils";

async function _fetchServicePromotions(
  services: ServicePromotionInput[],
  locale: LanguageCode
): Promise<LandingServicePromotionResponse> {
  if (!process.env.VILAO_API_KEY || services.length === 0) {
    return fallbackPromotions(services);
  }

  const isVi = locale === "vi";

  const prompt = isVi
    ? `Bạn là chuyên gia marketing cho phòng khám. Hãy viết các bullet PR ngắn, đáng tin cậy cho từng dịch vụ dưới đây.

Dịch vụ:
${services
  .map(
    (service) =>
      `- id: ${service.id}
  name: ${service.name}
  description: ${service.description}`
  )
  .join("\n")}

Chỉ trả về JSON object thuần, key là id dịch vụ, value là array 3 bullet tiếng Việt.
Mỗi bullet tối đa 8 từ, giọng chuyên nghiệp, không phóng đại quá mức.
Ví dụ:
{
  "service-id": ["Tầm soát toàn diện", "Quy trình nhanh gọn", "Tư vấn rõ ràng"]
}`
    : `You are a marketing specialist for a medical clinic. Write short, trustworthy PR bullets for each service below.

Services:
${services
  .map(
    (service) =>
      `- id: ${service.id}
  name: ${service.name}
  description: ${service.description}`
  )
  .join("\n")}

Return only a plain JSON object, where each key is the service id and each value is an array of 3 English bullets.
Each bullet must be 8 words or fewer, professional in tone, and not overly exaggerated.
Example:
{
  "service-id": ["Comprehensive screening", "Efficient care process", "Clear medical guidance"]
}`;

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
          content: isVi
            ? "Chỉ trả về JSON thuần, không markdown, không backtick, không giải thích."
            : "Return only plain JSON, no markdown, no backticks, no explanation.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 500,
      temperature: 0.6,
    }),
  });

  if (!res.ok) return fallbackPromotions(services);

  const data: ViLaoResponse = await res.json();
  const raw = data.choices[0]?.message?.content ?? "{}";

  try {
    return normalizePromotions(JSON.parse(raw.replace(/```json|```/g, "").trim()), services);
  } catch {
    return fallbackPromotions(services);
  }
}

const fetchServicePromotions = unstable_cache(_fetchServicePromotions, ["service-promotions"], {
  revalidate: 86400,
});

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { services?: unknown; locale: LanguageCode };
  const services = normalizeServices(body.services);
  const locale = body.locale;
  const promotions = await fetchServicePromotions(services, locale);

  return NextResponse.json({
    headers: {},
    body: promotions,
    statusCode: "OK",
    statusCodeValue: 200,
  });
}
