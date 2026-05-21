import { ConversationResponse } from "@/interface/response";

export const CHAT_SWR_KEYS = {
  CONVERSATIONS: "/conversations",
  MESSAGES: (conversationId: string) => `/messages?conversationId=${conversationId}`,
  ACTIVE_CONVERSATION: "chat/active-conversation",
  USERS_BY_IDS: (ids: string[]) => `/users?ids=${ids.join(",")}`,
} as const;

export const MESSAGE_INPUT_MAX_LENGTH = 2000;

export const MESSAGES_PAGE_SIZE = 30;

export const TYPING_INDICATOR_TIMEOUT_MS = 3000;

export const MESSAGE_ESTIMATED_HEIGHT = 72;

export const collectParticipantIds = (conversation?: ConversationResponse) => {
  const uniqueIds = new Set(conversation?.participants);
  return Array.from(uniqueIds);
};
