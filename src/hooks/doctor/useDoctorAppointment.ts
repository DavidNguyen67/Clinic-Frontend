import { useSession } from "@/hooks/useSession";
import { useSWRWrapper } from "@/hooks/swr";
import { AppointmentStatisticsResponse } from "@/interface/response";
import { METHOD } from "@/hooks/global";

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
