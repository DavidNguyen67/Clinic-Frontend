import { ApiPagedResponse, METHOD } from "@/hooks/global";
import { useSWRWrapper } from "@/hooks/swr";
import { BaseFilter, DoctorProfileResponse, SpecialtyResponse } from "@/interface/response";
import { buildQueryParams } from "@/lib/utils";

export const usePublicSpecialtyStatistics = () => {
  return useSWRWrapper<{
    totalSpecialties: number;
  }>("/api/v1/public/specialty/statistics", {
    url: "/api/v1/public/specialty/statistics",
    method: METHOD.GET,
  });
};

export const usePublicSpecialtyList = (
  filter?: BaseFilter & {
    isActive?: boolean;
    keyword?: string;
  }
) => {
  const query = buildQueryParams(filter);

  return useSWRWrapper<ApiPagedResponse<SpecialtyResponse>>(`/api/v1/public/specialty?${query}`, {
    url: `/api/v1/public/specialty?${query}`,
    method: METHOD.GET,
  });
};

export const usePublicSpecialtyById = (id: string) => {
  return useSWRWrapper<SpecialtyResponse>(`/api/v1/public/specialty/${id}`, {
    url: `/api/v1/public/specialty/${id}`,
    method: METHOD.GET,
  });
};
