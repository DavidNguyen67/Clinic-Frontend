import { useSession } from "@/hooks/useSession";
import { useMutation, useSWRWrapper } from "@/hooks/swr";
import { AppointmentResponse, AppointmentStatisticsResponse } from "@/interface/response";
import { ApiPagedResponse, METHOD } from "@/hooks/global";
import { buildQueryParams } from "@/lib/utils";
import { AppointmentFilterFormValues } from "@/components/Appointments/TabContent";

export const useDoctorAppointmentStats = () => {
  const { accessToken } = useSession();
  return useSWRWrapper<AppointmentStatisticsResponse>(
    "/api/v1/doctor/appointment/statistics?accessToken=" + accessToken,
    {
      url: "/api/v1/doctor/appointment/statistics",
      method: METHOD.GET,
    }
  );
};

export const useDoctorAppointment = (filter?: AppointmentFilterFormValues) => {
  const query = buildQueryParams(filter);
  const { accessToken } = useSession();

  return useSWRWrapper<ApiPagedResponse<AppointmentResponse>>(
    `/api/v1/doctor/appointment?${query}&accessToken=${accessToken}`,
    {
      url: `/api/v1/doctor/appointment?${query}`,
      method: METHOD.GET,
    }
  );
};

export const useDoctorAppointmentUpdate = (appointmentId: string) => {
  return useMutation<AppointmentResponse>(`/api/v1/doctor/appointment/${appointmentId}`, {
    url: `/api/v1/doctor/appointment/${appointmentId}`,
    method: METHOD.PATCH,
    notification: {
      message: "You have successfully updated appointment",
      title: "Appointment",
    },
  });
};

export const useDoctorAppointmentDetail = (aptId: string | null) => {
  const { accessToken } = useSession();
  return useSWRWrapper<AppointmentResponse>(
    `/api/v1/doctor/appointment/${aptId}?accessToken=${accessToken}`,
    {
      url: `/api/v1/doctor/appointment/${aptId}`,
      method: METHOD.GET,
      enable: !!aptId,
    }
  );
};
