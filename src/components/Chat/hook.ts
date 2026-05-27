import useSWR from "swr";
import { CONVERSATIONS_SWR_KEY } from "@/hooks";
import { ConversationResponse, MessageResponse, UserResponse } from "@/interface/response";

interface ConversationData {
  activeConversation?: ConversationResponse;
  usersMap?: Record<string, UserResponse>;
  items?: MessageResponse[];
}

export const useDataConversation = () => {
  const data = useSWR<ConversationData>(CONVERSATIONS_SWR_KEY);

  const setActiveConversation = (activeConversation: ConversationResponse) => {
    data.mutate((prev) => ({ ...prev, activeConversation }));
  };

  const setUsersMap = (map: Record<string, UserResponse>) => {
    data.mutate((prev) => ({ ...prev, usersMap: map }));
  };

  const setItems = (
    itemsOrUpdater: MessageResponse[] | ((prev: MessageResponse[]) => MessageResponse[])
  ) => {
    data.mutate((prev) => ({
      ...prev,
      items:
        typeof itemsOrUpdater === "function" ? itemsOrUpdater(prev?.items ?? []) : itemsOrUpdater,
    }));
  };

  return {
    activeConversation: data?.data?.activeConversation,
    usersMap: data?.data?.usersMap,
    items: data?.data?.items ?? [],
    setActiveConversation,
    setUsersMap,
    setItems,
  };
};
