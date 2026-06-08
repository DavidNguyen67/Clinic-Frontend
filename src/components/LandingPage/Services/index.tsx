"use client";

import React from "react";

import { CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";

const Services = () => {
  const t = useTranslations("landingPage.servicesPreview");
  // Services
  const router = useRouter();

  const services = [
    {
      id: 1,
      name: "Gói khám sức khỏe tổng quát",
      price: "1.500.000đ",
      features: ["Khám lâm sàng", "Xét nghiệm máu", "Chụp X-quang"],
    },
    {
      id: 2,
      name: "Gói khám thai sản",
      price: "2.000.000đ",
      features: ["Siêu âm thai", "Xét nghiệm", "Tư vấn dinh dưỡng"],
    },
    {
      id: 3,
      name: "Gói khám nhi",
      price: "800.000đ",
      features: ["Khám tổng quát", "Tư vấn dinh dưỡng", "Tiêm chủng"],
    },
  ];
  return (
    <section
      id="services"
      className="py-20 bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
    >
      <div className="max-w-[100rem] mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{t("title")}</h2>
          <p className="text-xl text-blue-100">{t("description")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition cursor-pointer"
              onClick={() => router.push(`/service/${service.id}`)}
            >
              <h3 className="text-[2.4rem] font-bold mb-4 h-[6.4rem] leading-[3.2rem]">
                {service.name}
              </h3>
              <div className="text-4xl font-bold mb-6">{service.price}</div>
              <ul className="space-y-3 mb-8">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition">
                {t("registerNow")}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Services;
