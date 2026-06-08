import { getTranslations } from "next-intl/server";
import type { StaticsTicsLandingResponse } from "@/interface/response";
import { AboutStats } from "./AboutStats";
import { ApiResponse } from "@/hooks/global";

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

async function fetchLandingStatics(): Promise<StaticsTicsLandingResponse | null> {
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
  } catch (error) {
    console.error("Error fetching landing statics:", error);
    return null;
  }
}
export const dynamic = "force-static";

const About = async () => {
  const t = await getTranslations("landingPage.about");
  const statics = await fetchLandingStatics();

  const stats = [
    {
      icon: "users" as const,
      value: statics?.trustedPatients ?? 50000,
      suffix: "+",
      label: t("stats.trustedPatients"),
    },
    {
      icon: "award" as const,
      value: statics?.experience ?? 15,
      suffix: "+",
      label: t("stats.experience"),
    },
    {
      icon: "stethoscope" as const,
      value: statics?.specialistDoctors ?? 30,
      suffix: "+",
      label: t("stats.specialistDoctors"),
    },
    {
      icon: "heart" as const,
      value: statics?.satisfaction ?? 98,
      suffix: "%",
      label: t("stats.satisfaction"),
    },
  ];

  return (
    <div className="py-16 ">
      <div className="max-w-400 mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-[2.4rem] font-700 text-gray-900 mb-8">{t("title")}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("description")}</p>
        </div>

        <AboutStats stats={stats} />
      </div>
    </div>
  );
};

export default About;
