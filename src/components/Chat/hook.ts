import useSWR from "swr";
import { CONVERSATIONS_SWR_KEY } from "@/hooks";
import {
  ConversationResponse,
  DoctorProfileResponse,
  PatientProfileResponse,
} from "@/interface/response";

interface ConversationData {
  activeConversation?: ConversationResponse;
  usersMap?: Record<string, DoctorProfileResponse | PatientProfileResponse>;
}

export const useDataConversation = () => {
  const data = useSWR<ConversationData>(CONVERSATIONS_SWR_KEY);

  const setActiveConversation = (activeConversation: ConversationResponse) => {
    data.mutate((prev) => ({
      ...prev,
      activeConversation,
    }));
  };

  const setUsersMap = (map: Record<string, DoctorProfileResponse | PatientProfileResponse>) => {
    data.mutate((prev) => ({
      ...prev,
      usersMap: map,
    }));
  };

  return {
    activeConversation: data?.data?.activeConversation,
    usersMap: data?.data?.usersMap,
    setActiveConversation,
    setUsersMap,
  };
};
