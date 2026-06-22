import { SPECIALTY_TYPE } from "@/common";
import { LanguageCode } from "@/i18n/config";
import { SpecialtyOverviewContent, SpecialtyResponse, ViLaoResponse } from "@/interface/response";
import { ApiResponse, METHOD } from "@/hooks/global";
import { unstable_cache } from "next/cache";

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
  const label = SPECIALTY_LABELS[specialtyType][locale];

  const prompt =
    locale === "vi"
      ? `Bạn là chuyên gia y tế. Hãy tạo nội dung giới thiệu chuyên khoa ${label} theo định dạng JSON sau, KHÔNG có markdown hay backtick:
    {
      "intro": "đoạn giới thiệu 100-120 từ, thân thiện, dễ hiểu",
      "treatments": ["tên bệnh 1", "tên bệnh 2", ...], (8 bệnh phổ biến nhất)
      "symptoms": [
        { "text": "triệu chứng", "severity": "high" | "medium" | "low" }
      ], (6 triệu chứng, severity: high=cần khám ngay, medium=nên khám, low=theo dõi)
      "riskFactors": ["yếu tố 1", "yếu tố 2", ...] (8 yếu tố nguy cơ)
    }`
      : `You are a medical expert. Generate introduction content for the ${label} specialty in JSON format below, NO markdown or backticks:
    {
      "intro": "100-120 word introduction, friendly tone",
      "treatments": ["condition 1", "condition 2", ...], (8 most common conditions)
      "symptoms": [
        { "text": "symptom", "severity": "high" | "medium" | "low" }
      ], (6 symptoms, severity: high=urgent, medium=should visit, low=monitor)
      "riskFactors": ["factor 1", "factor 2", ...] (8 risk factors)
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
          content:
            "Chỉ trả về JSON thuần, không có markdown, không có backtick, không có giải thích.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 800,
      temperature: 0.7,
    }),
  });

  if (!res.ok) throw new Error(`ViLao API error: ${res.status}`);

  const data: ViLaoResponse = await res.json();
  console.log("Response vilao", data);
  const raw = data.choices[0]?.message?.content ?? "{}";

  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned) as SpecialtyOverviewContent;
  } catch {
    console.error("[fetchSpecialtyIntro] JSON parse failed:", raw);
    return { intro: raw, treatments: [], symptoms: [], riskFactors: [] };
  }
}

export async function fetchSpecialtyById(id: string): Promise<SpecialtyResponse | null> {
  if (!id) return null;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/public/specialty/${id}`, {
    cache: "no-store",
  });
  const data: ApiResponse<SpecialtyResponse> = await res.json();
  return data?.body ?? null;
}

export const fetchSpecialtyIntro = unstable_cache(_fetchSpecialtyIntro, ["specialty-intro"], {
  revalidate: 86400,
});
