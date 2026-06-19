import { getTranslations } from "next-intl/server";
import { AboutStats } from "./AboutStats";
import { fetchLandingStatics } from "@/components/LandingPage/About/config";

export const dynamic = "force-static";

const About = async () => {
  const t = await getTranslations("landingPage.about");
  const statics = await fetchLandingStatics();

  const stats = [
    {
      icon: "users" as const,
      value: statics?.trustedPatients ?? 0,
      suffix: "+",
      label: t("stats.trustedPatients"),
    },
    {
      icon: "award" as const,
      value: statics?.experience ?? 0,
      suffix: "+",
      label: t("stats.experience"),
    },
    {
      icon: "stethoscope" as const,
      value: statics?.specialistDoctors ?? 0,
      suffix: "+",
      label: t("stats.specialistDoctors"),
    },
    {
      icon: "heart" as const,
      value: statics?.satisfaction ?? 0,
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
