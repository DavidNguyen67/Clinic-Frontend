import { ApiResponse } from "@/hooks/global";
import type { StaticsTicsLandingResponse } from "@/interface/response";

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
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/landing/statics`, {
      next: {
        revalidate: 1800,
        tags: ["landing-statics"],
      },
    });

    if (!res.ok) return null;

    const data = (await res.json()) as ApiResponse<LandingStaticsApiBody> | LandingStaticsApiBody;
    const body = isApiResponse(data) ? data.body : data;

    return {
      trustedPatients: body.trustedPatients,
      experience: body.experience ?? body.experienceYears ?? 0,
      specialistDoctors: body.specialistDoctors,
      satisfaction: body.satisfaction ?? body.satisfactionRate ?? 0,
    };
  } catch {
    return null;
  }
}
