import { StaticsTicsLandingResponse } from "@/interface/response";
import { useSWRWrapper } from "@/hooks/swr";
import { METHOD } from "@/hooks/global";

export const useLandingStatics = () => {
  return useSWRWrapper<StaticsTicsLandingResponse>(`/api/v1/landing/statics`, {
    url: `/api/v1/landing/statics`,
    method: METHOD.GET,
  });
};
