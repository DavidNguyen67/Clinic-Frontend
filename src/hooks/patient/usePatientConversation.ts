import { ConversationResponse } from "@/interface/response";
import { useMutation } from "@/hooks/swr";
import { ApiPagedResponse, METHOD } from "@/hooks/global";

export const usePatientConversation = () => {
  return useMutation<ApiPagedResponse<ConversationResponse>>(`/api/v1/patient/conversation`, {
    url: `/api/v1/patient/conversation`,
    method: METHOD.GET,
  });
};

export const usePatientConversationCreate = () => {
  return useMutation<ConversationResponse>(`/api/v1/patient/conversation`, {
    url: `/api/v1/patient/conversation`,
    method: METHOD.POST,
  });
};
