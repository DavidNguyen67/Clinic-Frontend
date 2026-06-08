import { Award, Heart, Users, Stethoscope } from "lucide-react";
import { useTranslations } from "next-intl";

const About = () => {
  const t = useTranslations("landingPage.about");

  return (
    <div className="py-[4rem] ">
      <div className="max-w-[100rem] mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-[2.4rem] font-700 text-gray-900 mb-[2rem]">{t("title")}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("description")}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              icon: <Users className="w-12 h-12" />,
              number: "50,000+",
              label: t("stats.trustedPatients"),
            },
            {
              icon: <Award className="w-12 h-12" />,
              number: "15+",
              label: t("stats.experience"),
            },
            {
              icon: <Stethoscope className="w-12 h-12" />,
              number: "30+",
              label: t("stats.specialistDoctors"),
            },
            {
              icon: <Heart className="w-12 h-12" />,
              number: "98%",
              label: t("stats.satisfaction"),
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-[2.4rem] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[1.6rem] transition shadow-base-1"
            >
              <div className="text-blue-600 flex justify-center mb-4">{stat.icon}</div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default About;
