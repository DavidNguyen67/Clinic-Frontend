import { SPECIALTY_TYPE } from "@/common";
import { METHOD } from "@/hooks/global";
import { LanguageCode } from "@/i18n/config";
import { SpecialtyReviewsContent, ViLaoResponse } from "@/interface/response";
import { unstable_cache } from "next/cache";

const SPECIALTY_LABELS: Record<SPECIALTY_TYPE, Record<LanguageCode, string>> = {
  [SPECIALTY_TYPE.GENERAL]: { vi: "Da khoa", en: "General Medicine" },
  [SPECIALTY_TYPE.SURGERY]: { vi: "Ngoai khoa", en: "Surgery" },
  [SPECIALTY_TYPE.PEDIATRICS]: { vi: "Nhi khoa", en: "Pediatrics" },
  [SPECIALTY_TYPE.DERMATOLOGY]: { vi: "Da lieu", en: "Dermatology" },
  [SPECIALTY_TYPE.CARDIOLOGY]: { vi: "Tim mach", en: "Cardiology" },
  [SPECIALTY_TYPE.ORTHOPEDICS]: { vi: "Co xuong khop", en: "Orthopedics" },
  [SPECIALTY_TYPE.NEUROLOGY]: { vi: "Than kinh", en: "Neurology" },
  [SPECIALTY_TYPE.PSYCHIATRY]: { vi: "Tam than", en: "Psychiatry" },
  [SPECIALTY_TYPE.GYNECOLOGY]: { vi: "Phu khoa", en: "Gynecology" },
  [SPECIALTY_TYPE.ENDOCRINOLOGY]: { vi: "Noi tiet", en: "Endocrinology" },
};

const FALLBACK_REVIEWS_CONTENT: SpecialtyReviewsContent = {
  averageRating: 0,
  totalReviews: 0,
  reviews: [],
};

function normalizeReviewsContent(content: SpecialtyReviewsContent): SpecialtyReviewsContent {
  return {
    averageRating: Math.min(5, Math.max(0, Number(content.averageRating) || 0)),
    totalReviews: Math.max(0, Math.round(Number(content.totalReviews) || 0)),
    reviews: (content.reviews ?? []).slice(0, 3).map((review) => ({
      name: review.name ?? "",
      rating: Math.min(5, Math.max(1, Math.round(Number(review.rating) || 5))),
      date: review.date ?? "",
      verified: Boolean(review.verified),
      comment: review.comment ?? "",
      doctor: review.doctor ?? "",
      service: review.service ?? "",
      helpful: Math.max(0, Math.round(Number(review.helpful) || 0)),
    })),
  };
}

export async function _fetchSpecialtyReviews(
  specialtyType: SPECIALTY_TYPE,
  locale: LanguageCode = "vi"
): Promise<SpecialtyReviewsContent> {
  const label = SPECIALTY_LABELS[specialtyType][locale];
  const prompt =
    locale === "vi"
      ? `Create synthetic patient review content in Vietnamese for the ${label} specialty. Return only JSON with this shape:
{
  "averageRating": 4.8,
  "totalReviews": 1245,
  "reviews": [
    {
      "name": "patient display name",
      "rating": 5,
      "date": "dd/MM/yyyy",
      "verified": true,
      "comment": "2-3 natural sentences about the visit",
      "doctor": "doctor display name",
      "service": "service name",
      "helpful": 45
    }
  ]
}
Create exactly 3 reviews. Do not use markdown, backticks, or explanations.`
      : `Create synthetic patient review content in English for the ${label} specialty. Return only JSON with this shape:
{
  "averageRating": 4.8,
  "totalReviews": 1245,
  "reviews": [
    {
      "name": "patient display name",
      "rating": 5,
      "date": "dd/MM/yyyy",
      "verified": true,
      "comment": "2-3 natural sentences about the visit",
      "doctor": "doctor display name",
      "service": "service name",
      "helpful": 45
    }
  ]
}
Create exactly 3 reviews. Do not use markdown, backticks, or explanations.`;

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
          content: "Return strict JSON only. Do not include markdown, backticks, or explanations.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 900,
      temperature: 0.7,
    }),
  });

  if (!res.ok) throw new Error(`ViLao API error: ${res.status}`);

  const data: ViLaoResponse = await res.json();
  const raw = data.choices[0]?.message?.content ?? "{}";

  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return normalizeReviewsContent(JSON.parse(cleaned) as SpecialtyReviewsContent);
  } catch {
    console.error("[fetchSpecialtyReviews] JSON parse failed:", raw);
    return FALLBACK_REVIEWS_CONTENT;
  }
}

export const fetchSpecialtyReviews = unstable_cache(_fetchSpecialtyReviews, ["specialty-reviews"], {
  revalidate: 86400,
});
