import { ApiPagedResponse, METHOD } from "@/hooks/global";
import { useSWRWrapper } from "@/hooks/swr";
import { AppointmentResponse, BaseFilter } from "@/interface/response";
import { buildQueryParams } from "@/lib/utils";

export const usePublicAppointment = (
  filter?: BaseFilter & {
    appointmentDate?: string;
    doctorProfileId?: string;
    fromDate?: string;
    toDate?: string;
  }
) => {
  const query = buildQueryParams(filter);

  return useSWRWrapper<ApiPagedResponse<AppointmentResponse>>(
    `/api/v1/public/appointment?${query}`,
    {
      url: `/api/v1/public/appointment?${query}`,
      method: METHOD.GET,
      enable: !!filter?.appointmentDate && !!filter?.doctorProfileId,
    }
  );
};
