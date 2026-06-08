"use client";

import { CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { useServicePromotions } from "@/hooks/landing/useServicePromotions";
import { useRouter } from "@/i18n/navigation";
import { usePublicServiceList } from "@/hooks/public/usePublicService";
import { formatCurrency } from "@/lib/utils";

const Services = () => {
  const t = useTranslations("landingPage.servicesPreview");
  const router = useRouter();

  const { data, isLoading } = usePublicServiceList({
    page: 1,
    size: 3,
  });

  const services = data?.body.data ?? [];
  const { data: promotionsData, isLoading: isPromotionsLoading } = useServicePromotions(services);
  const promotions = promotionsData?.body ?? {};

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
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-80 animate-pulse rounded-2xl bg-white/10" />
              ))
            : services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition cursor-pointer"
                  onClick={() => router.push(`/services`)}
                >
                  <h3 className="text-[2.4rem] font-bold mb-4 h-[6.4rem] leading-[3.2rem] line-clamp-2">
                    {service.name}
                  </h3>

                  <div className="text-4xl font-bold mb-6">
                    {formatCurrency(
                      service.promotionalPrice > 0 ? service.promotionalPrice : service.price
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {isPromotionsLoading
                      ? Array.from({ length: 3 }).map((_, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 shrink-0" />
                            <span className="h-5 w-3/4 animate-pulse rounded bg-white/20" />
                          </li>
                        ))
                      : (promotions[service.id] ?? [service.description]).map((feature) => (
                          <li key={feature} className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 shrink-0" />
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
