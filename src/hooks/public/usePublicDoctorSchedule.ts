import { buildQueryParams } from "@/lib/utils";
import { BaseFilter, DoctorScheduleExceptionResponse } from "@/interface/response";
import { ApiPagedResponse, METHOD } from "@/hooks/global";
import { useSWRWrapper } from "@/hooks/swr";

export const usePublicDoctorScheduleExceptions = (
  filter?: BaseFilter & {
    doctorId?: string;
    from?: string;
    to?: string;
  }
) => {
  const query = buildQueryParams(filter);

  return useSWRWrapper<ApiPagedResponse<DoctorScheduleExceptionResponse>>(
    `/api/v1/public/doctor-schedule-exception?${query}`,
    {
      url: `/api/v1/public/doctor-schedule-exception?${query}`,
      method: METHOD.GET,
    }
  );
};
