import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

const Process = () => {
  const t = useTranslations("landingPage.process");

  return (
    <section className="py-20">
      <div className="max-w-400 mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("title")}</h2>
          <p className="text-xl text-gray-600">{t("description")}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              step: 1,
              title: t("steps.chooseDoctor.title"),
              desc: t("steps.chooseDoctor.description"),
            },
            {
              step: 2,
              title: t("steps.chooseTime.title"),
              desc: t("steps.chooseTime.description"),
            },
            {
              step: 3,
              title: t("steps.enterInfo.title"),
              desc: t("steps.enterInfo.description"),
            },
            {
              step: 4,
              title: t("steps.confirm.title"),
              desc: t("steps.confirm.description"),
            },
          ].map((item, index) => (
            <div key={index} className="relative">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
              {index < 3 && (
                <ChevronRight className="hidden md:block absolute top-10 -right-4 w-8 h-8 text-blue-600" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Process;
