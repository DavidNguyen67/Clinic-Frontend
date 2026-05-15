import { AppointmentResponse, BaseFilter } from "@/interface/response";
import { ApiPagedResponse, METHOD } from "../global";
import { useMutation, useSWRWrapper } from "../swr";
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

export const usePublicAppointmentCreate = () => {
  return useMutation<AppointmentResponse>("/api/v1/patient/appointment", {
    url: "/api/v1/patient/appointment",
    method: METHOD.POST,
    notification: {
      message: "You have successfully booked an appointment",
      title: "Appointment",
    },
  });
};
