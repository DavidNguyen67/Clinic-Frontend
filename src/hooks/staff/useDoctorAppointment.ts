import { useSession } from "@/hooks/useSession";
import { useMutation, useSWRWrapper } from "@/hooks/swr";
import { AppointmentResponse, AppointmentStatisticsResponse } from "@/interface/response";
import { ApiPagedResponse, METHOD } from "@/hooks/global";
import { buildQueryParams } from "@/lib/utils";
import { AppointmentFilterFormValues } from "@/components/Appointments/TabContent";

export const useStaffAppointment = (filter?: AppointmentFilterFormValues) => {
  const query = buildQueryParams(filter);
  const { accessToken } = useSession();

  return useSWRWrapper<ApiPagedResponse<AppointmentResponse>>(
    `/api/v1/staff/appointment?${query}&accessToken=${accessToken}`,
    {
      url: `/api/v1/staff/appointment?${query}`,
      method: METHOD.GET,
    }
  );
};

export const useStaffAppointmentUpdate = (appointmentId: string) => {
  return useMutation<AppointmentResponse>(`/api/v1/staff/appointment/${appointmentId}`, {
    url: `/api/v1/staff/appointment/${appointmentId}`,
    method: METHOD.PATCH,
    notification: {
      message: "You have successfully updated appointment",
      title: "Appointment",
    },
  });
};

export const useStaffAppointmentDetail = (aptId: string | null) => {
  const { accessToken } = useSession();
  return useSWRWrapper<AppointmentResponse>(
    `/api/v1/staff/appointment/${aptId}?accessToken=${accessToken}`,
    {
      url: `/api/v1/staff/appointment/${aptId}`,
      method: METHOD.GET,
      enable: !!aptId,
    }
  );
};
