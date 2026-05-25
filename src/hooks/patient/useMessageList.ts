import { MessageResponse } from "@/interface/response";
import { useMutation } from "@/hooks/swr";
import { ApiPagedResponse, METHOD } from "@/hooks/global";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";

export const useMessageList = () => {
  const { data } = useCurrentProfile();

  const key = data?.body?.patient ? "/api/v1/patient/message" : "/api/v1/doctor/message";

  return useMutation<ApiPagedResponse<MessageResponse>>(key, {
    url: key,
    method: METHOD.GET,
  });
};

export const usePatientMessageCreate = () => {
  return useMutation<MessageResponse>(`/api/v1/patient/message`, {
    url: `/api/v1/patient/message`,
    method: METHOD.POST,
  });
};
