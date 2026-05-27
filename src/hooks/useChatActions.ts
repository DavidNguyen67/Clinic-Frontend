"use client";

import { useCallback } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";
import { TypingPayloadDto } from "@/hooks/useChatMessages";
import { MESSAGE_TYPE } from "@/common";

export interface CreateMessageDto {
  conversationId: string;
  content: string;
  type?: MESSAGE_TYPE;
  tempId: string;
}

export function useChatActions() {
  const { stompClient } = useSocket();
  const { data } = useCurrentProfile();

  const sendMessage = useCallback(
    (conversationId: string, payload: CreateMessageDto) => {
      stompClient?.publish({
        destination: `/app/chat/conversation/${conversationId}`,
        body: JSON.stringify(payload),
      });
    },
    [stompClient]
  );

  const sendTyping = useCallback(
    (conversationId: string, typing: boolean) => {
      stompClient?.publish({
        destination: `/app/typing/conversation/${conversationId}`,
        body: JSON.stringify({
          userId: data?.body?.id ?? "",
          typing,
        } as TypingPayloadDto),
      });
    },
    [stompClient, data]
  );

  const markAsRead = useCallback(
    (messageId: string) => {
      if (!stompClient?.connected) return;

      stompClient.publish({
        destination: `/app/read/${messageId}`,
        body: JSON.stringify({}),
      });
    },
    [stompClient]
  );

  const recallMessage = useCallback(
    (messageId: string) => {
      if (!stompClient?.connected) return;

      stompClient.publish({
        destination: `/app/chat/message/${messageId}/recall`,
        body: JSON.stringify({}),
      });
    },
    [stompClient]
  );

  return { sendMessage, sendTyping, markAsRead, recallMessage };
}
