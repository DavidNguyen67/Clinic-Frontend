import { AppointmentFilterFormValues } from "@/components/Appointments/TabContent";
import { ApiPagedResponse, METHOD } from "@/hooks/global";
import { useMutation, useSWRWrapper } from "@/hooks/swr";
import { useSession } from "@/hooks/useSession";
import { AppointmentResponse, AppointmentStatisticsResponse } from "@/interface/response";
import { buildQueryParams } from "@/lib/utils";

export const usePatientAppointment = (filter?: AppointmentFilterFormValues) => {
  const query = buildQueryParams(filter);
  const { accessToken } = useSession();

  return useSWRWrapper<ApiPagedResponse<AppointmentResponse>>(
    `/api/v1/patient/appointment?${query}&accessToken=${accessToken}`,
    {
      url: `/api/v1/patient/appointment?${query}`,
      method: METHOD.GET,
    }
  );
};

export const usePatientAppointmentDetail = (aptId: string | null) => {
  const { accessToken } = useSession();
  return useSWRWrapper<AppointmentResponse>(
    `/api/v1/patient/appointment/${aptId}?accessToken=${accessToken}`,
    {
      url: `/api/v1/patient/appointment/${aptId}`,
      method: METHOD.GET,
      enable: !!aptId,
    }
  );
};

export const usePatientAppointmentCreate = () => {
  return useMutation<AppointmentResponse>("/api/v1/patient/appointment", {
    url: "/api/v1/patient/appointment",
    method: METHOD.POST,
    notification: {
      message: "You have successfully booked an appointment",
      title: "Appointment",
    },
  });
};

export const usePatientAppointmentUpdate = (appointmentId: string) => {
  return useMutation<AppointmentResponse>(`/api/v1/patient/appointment/${appointmentId}`, {
    url: `/api/v1/patient/appointment/${appointmentId}`,
    method: METHOD.PATCH,
    notification: {
      message: "You have successfully updated your appointment",
      title: "Appointment",
    },
  });
};

export const usePatientAppointmentStats = () => {
  const { accessToken } = useSession();
  return useSWRWrapper<AppointmentStatisticsResponse>(
    "/api/v1/patient/appointment/statistics?accessToken=" + accessToken,
    {
      url: "/api/v1/patient/appointment/statistics",
      method: METHOD.GET,
    }
  );
};

export const usePatientNextAppointment = () => {
  const { accessToken } = useSession();
  return useSWRWrapper<AppointmentResponse>(
    "/api/v1/patient/appointment/next?accessToken=" + accessToken,
    {
      url: "/api/v1/patient/appointment/next",
      method: METHOD.GET,
    }
  );
};
