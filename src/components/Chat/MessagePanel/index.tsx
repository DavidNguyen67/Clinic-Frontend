"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import EmptyConversation from "./EmptyConversation";
import { useDataConversation } from "@/components/Chat/hook";
import { getImageUrl, getInitials } from "@/lib/utils";
import { CONVERSATION_TYPE } from "@/common";

function MessagePanel() {
  const { activeConversation } = useDataConversation();

  const handleSend = async (content: string) => {};

  if (!activeConversation) {
    return <EmptyConversation />;
  }

  return (
    <div className="flex flex-col h-full flex-1 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b shrink-0">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage
            alt={activeConversation.avatar}
            src={activeConversation.avatar ? getImageUrl(activeConversation.avatar) : undefined}
          />
          <AvatarFallback className="bg-blue-50 text-blue-600 font-semibold text-sm">
            {getInitials(activeConversation?.name)}
          </AvatarFallback>
        </Avatar>

        <div>
          <p className="text-sm font-medium leading-tight">{activeConversation?.name}</p>
          {activeConversation.type === CONVERSATION_TYPE.GROUP && (
            <p className="text-xs text-muted-foreground">
              {activeConversation.participants?.length} members
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden flex flex-col h-full">
        <MessageList isTyping={true} />
      </div>

      {/* Input */}
      <MessageInput onSend={handleSend} />
    </div>
  );
}

export default MessagePanel;
