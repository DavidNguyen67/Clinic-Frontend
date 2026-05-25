import { ConversationResponse } from "@/interface/response";
import { useMutation } from "@/hooks/swr";
import { ApiPagedResponse, METHOD } from "@/hooks/global";

export const useDoctorConversation = () => {
  return useMutation<ApiPagedResponse<ConversationResponse>>(`/api/v1/doctor/conversation`, {
    url: `/api/v1/doctor/conversation`,
    method: METHOD.GET,
  });
};

export const useDoctorConversationCreate = () => {
  return useMutation<ConversationResponse>(`/api/v1/doctor/conversation`, {
    url: `/api/v1/doctor/conversation`,
    method: METHOD.POST,
  });
};
