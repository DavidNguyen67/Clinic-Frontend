import { ClinicInformationResponse } from "@/interface/response";
import { useSWRWrapper } from "@/hooks/swr";
import { METHOD } from "@/hooks/global";

export const useClinicInformation = (filters?: {}) => {
  return useSWRWrapper<ClinicInformationResponse>("/api/v1/public/clinic-information", {
    url: "/api/v1/public/clinic-information",
    method: METHOD.GET,
  });
};
