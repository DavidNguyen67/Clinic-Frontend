"use client";

import { Activity, Baby, Bone, Brain, Eye, HeartPulse } from "lucide-react";
import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";

const Specialties = () => {
  const t = useTranslations("landingPage.specialtiesPreview");
  const specialties = [
    {
      id: 1,
      icon: <HeartPulse className="w-12 h-12" />,
      name: "Tim mạch",
      desc: "Khám và điều trị bệnh tim mạch",
      color: "from-red-500 to-pink-500",
    },
    {
      id: 2,
      icon: <Baby className="w-12 h-12" />,
      name: "Nhi khoa",
      desc: "Chăm sóc sức khỏe trẻ em",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 3,
      icon: <Eye className="w-12 h-12" />,
      name: "Mắt",
      desc: "Khám và điều trị mắt",
      color: "from-purple-500 to-indigo-500",
    },
    {
      id: 4,
      icon: <Bone className="w-12 h-12" />,
      name: "Xương khớp",
      desc: "Điều trị bệnh lý xương khớp",
      color: "from-orange-500 to-amber-500",
    },
    {
      id: 5,
      icon: <Brain className="w-12 h-12" />,
      name: "Thần kinh",
      desc: "Khám và điều trị thần kinh",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: 6,
      icon: <Activity className="w-12 h-12" />,
      name: "Nội khoa",
      desc: "Khám bệnh nội tổng quát",
      color: "from-teal-500 to-cyan-500",
    },
  ];

  const router = useRouter();
  const handleDetailSpecialty = (id: number) => {
    console.log("Xem chi tiết chuyên khoa có id:", id);
    router.push(`/en/specialties/${id}`);
  };
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-[100rem] mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("title")}</h2>
          <p className="text-xl text-gray-600">{t("description")}</p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
          {specialties.map((specialty, index) => (
            <div
              key={index}
              className="relative bg-white rounded-2xl p-6 text-center shadow-base-1 transition cursor-pointer group"
              onClick={() => {
                handleDetailSpecialty(specialty.id);
              }}
            >
              <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1 text-xs font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {t("viewDetail")}
              </span>
              <div
                className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${specialty.color} flex items-center justify-center text-white group-hover:scale-110 transition`}
              >
                {specialty.icon}
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">{specialty.name}</h3>
              <p className="text-sm text-gray-600">{specialty.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Specialties;
