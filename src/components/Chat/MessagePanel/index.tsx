"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import EmptyConversation from "./EmptyConversation";
import { useDataConversation } from "@/components/Chat/hook";
import { getImageUrl, getInitials } from "@/lib/utils";
import { CONVERSATION_TYPE } from "@/common";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";
import { useMemo } from "react";
import { useTypingIndicator } from "@/hooks/useChatMessages";

function MessagePanel() {
  const { activeConversation, usersMap } = useDataConversation();

  const { data } = useCurrentProfile();

  const typingIndicatorData = useTypingIndicator(activeConversation?.id!);

  const typingCount = typingIndicatorData?.data?.length ?? 0;

  const getAvatar = () => {
    if (activeConversation?.type === CONVERSATION_TYPE.DIRECT) {
      const targetId = data?.body?.id;
      const participant = activeConversation?.participants.find((p) => p !== targetId);
      return usersMap?.[participant!]?.pathAvatar;
    }
    return activeConversation?.avatar;
  };

  const conversationName = useMemo(() => {
    if (activeConversation?.type === CONVERSATION_TYPE.DIRECT) {
      const targetId = data?.body?.id;
      const participant = activeConversation?.participants.find((p) => p !== targetId);
      return usersMap?.[participant!]?.fullName;
    }
    return activeConversation?.name;
  }, [activeConversation, usersMap]);

  const initials = getInitials(conversationName ?? "?");

  if (!activeConversation) {
    return <EmptyConversation />;
  }

  return (
    <div className="flex flex-col h-full flex-1 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b shrink-0">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage
            src={getAvatar() ? getImageUrl(getAvatar()) : undefined}
            alt={activeConversation.name ?? ""}
          />
          <AvatarFallback className="bg-blue-50 text-blue-600 font-semibold text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div>
          <p className="text-sm font-medium leading-tight">{conversationName}</p>
          {activeConversation.type === CONVERSATION_TYPE.GROUP && (
            <p className="text-xs text-muted-foreground">
              {activeConversation.participants?.length} members
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden flex flex-col h-full">
        <MessageList isTyping={Boolean(typingCount)} />
      </div>

      {/* Input */}
      <MessageInput />
    </div>
  );
}

export default MessagePanel;
