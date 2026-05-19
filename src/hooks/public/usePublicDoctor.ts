import { buildQueryParams } from "@/lib/utils";
import { BaseFilter, DoctorProfileResponse } from "@/interface/response";
import { ApiPagedResponse, METHOD } from "@/hooks/global";
import { useSWRWrapper } from "@/hooks/swr";

export const usePublicDoctorList = (
  filter?: BaseFilter & {
    isFeatured?: boolean;
    fullName?: string;
    specialtyId?: string;
  }
) => {
  const query = buildQueryParams(filter);

  return useSWRWrapper<ApiPagedResponse<DoctorProfileResponse>>(
    `/api/v1/public/doctor-profile?${query}`,
    {
      url: `/api/v1/public/doctor-profile?${query}`,
      method: METHOD.GET,
    }
  );
};

export const usePublicDoctorById = (id: string) => {
  return useSWRWrapper<DoctorProfileResponse>(`/api/v1/public/doctor-profile/${id}`, {
    url: `/api/v1/public/doctor-profile/${id}`,
    method: METHOD.GET,
  });
};
