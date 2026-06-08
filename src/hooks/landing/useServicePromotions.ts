import { METHOD } from "@/hooks/global";
import { useSWRWrapper } from "@/hooks/swr";
import type { ServiceResponse, LandingServicePromotionResponse } from "@/interface/response";
import { useLocale } from "next-intl";

export const useServicePromotions = (services: ServiceResponse[]) => {
  const locale = useLocale();

  const servicePayload = services.map((service) => ({
    id: service.id,
    name: service.name,
    description: service.description,
  }));
  const key = `/api/landing/service-promotions?locale=${locale}&ids=${services.map((service) => service.id).join(",")}`;

  return useSWRWrapper<LandingServicePromotionResponse>(key, {
    url: "/api/landing/service-promotions",
    method: METHOD.POST,
    body: {
      services: servicePayload,
      locale,
    },
    auth: false,
    enable: services.length > 0,
    noEndPoint: true,
  });
};
