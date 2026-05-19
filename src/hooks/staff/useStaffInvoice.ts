import { ROLE_NAME } from "@/common";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";
import { METHOD } from "@/hooks/global";
import { useSWRWrapper } from "@/hooks/swr";
import { useSession } from "@/hooks/useSession";
import { InvoiceResponse } from "@/interface/response";

export const useInvoiceDetailByAppointmentId = (appointmentId: string) => {
  const { accessToken } = useSession();
  const { data: currentProfileData } = useCurrentProfile();

  const role = currentProfileData?.body?.role;

  return useSWRWrapper<InvoiceResponse>(
    `/api/v1/staff/invoice/appointment/${appointmentId}?accessToken=${accessToken}`,
    {
      url: `/api/v1/staff/invoice/appointment/${appointmentId}`,
      method: METHOD.GET,
      enable: !!appointmentId && role === ROLE_NAME.STAFF, // Only staff can access invoice detail by appointment id
    }
  );
};
