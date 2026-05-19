import { METHOD } from "@/hooks/global";
import { useSWRWrapper } from "@/hooks/swr";

export const usePublicUserStatistics = () => {
  return useSWRWrapper<{
    patientsCount: number;
    doctorsCount: number;
    adminsCount: number;
    staffsCount: number;
    totalCount: number;
  }>("/api/v1/public/user/statistics", {
    url: "/api/v1/public/user/statistics",
    method: METHOD.GET,
  });
};
