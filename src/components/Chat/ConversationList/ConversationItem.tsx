"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getImageUrl, getInitials } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ConversationResponse } from "@/interface/response";
import { FileText, ImageIcon } from "lucide-react";
import { CONVERSATION_TYPE, MESSAGE_TYPE } from "@/common";
import { useDataConversation } from "@/components/Chat/hook";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";
import { useMemo } from "react";

interface ConversationItemProps {
  conversation: ConversationResponse;
  isActive: boolean;
  isOnline?: boolean;
  unreadCount?: number;
  onClick: () => void;
}

function getLastMessagePreview(lastMessage?: ConversationResponse["lastMessage"]) {
  if (!lastMessage) return null;

  switch (lastMessage.type) {
    case MESSAGE_TYPE.IMAGE:
      return (
        <span className="flex items-center gap-1">
          <ImageIcon className="w-3 h-3 shrink-0" />
          <span>Hình ảnh</span>
        </span>
      );
    case MESSAGE_TYPE.FILE:
      return (
        <span className="flex items-center gap-1">
          <FileText className="w-3 h-3 shrink-0" />
          <span>Tệp đính kèm</span>
        </span>
      );
    default:
      return <span>{lastMessage.content}</span>;
  }
}

function ConversationItem({
  conversation,
  isActive,
  isOnline = false,
  unreadCount = 0,
  onClick,
}: ConversationItemProps) {
  const { usersMap } = useDataConversation();
  const { data } = useCurrentProfile();
  const hasUnread = unreadCount > 0;

  const timeAgo = conversation.lastMessage?.sentAt
    ? (() => {
        try {
          return formatDistanceToNow(new Date(conversation.lastMessage.sentAt), {
            addSuffix: false,
          });
        } catch {
          return "";
        }
      })()
    : "";

  const preview = getLastMessagePreview(conversation.lastMessage);

  const getAvatar = () => {
    if (conversation.type === CONVERSATION_TYPE.DIRECT) {
      const targetId = data?.body?.patient?.id ?? data?.body?.doctor?.id;
      const participant = conversation.participants.find((p) => p !== targetId);
      return usersMap?.[participant!]?.user?.pathAvatar;
    }
    return conversation?.avatar;
  };

  const conversationName = useMemo(() => {
    if (conversation.type === CONVERSATION_TYPE.DIRECT) {
      const targetId = data?.body?.patient?.id ?? data?.body?.doctor?.id;
      const participant = conversation.participants.find((p) => p !== targetId);
      return usersMap?.[participant!]?.user?.fullName;
    }
    return conversation.name;
  }, [conversation, usersMap]);

  const initials = getInitials(conversationName ?? "?");

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-3 text-left transition-colors relative",
        "hover:bg-muted/60",
        isActive && "bg-muted",
        hasUnread && !isActive && "bg-primary/5"
      )}
    >
      {/* Active indicator bar */}
      {isActive && (
        <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-primary rounded-r-full" />
      )}

      {/* Avatar + online dot */}
      <div className="relative shrink-0">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={getAvatar() ? getImageUrl(getAvatar()) : undefined}
            alt={conversation.name ?? ""}
          />
          <AvatarFallback className="bg-blue-50 text-blue-600 font-semibold text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "text-sm truncate",
              hasUnread ? "font-semibold text-foreground" : "font-medium"
            )}
          >
            {conversationName}
          </span>
          {timeAgo && (
            <span
              className={cn(
                "text-[11px] shrink-0",
                hasUnread ? "text-primary font-medium" : "text-muted-foreground"
              )}
            >
              {timeAgo}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 mt-0.5">
          {preview ? (
            <p
              className={cn(
                "text-xs truncate flex items-center gap-1",
                hasUnread ? "text-foreground font-medium" : "text-muted-foreground"
              )}
            >
              {preview}
            </p>
          ) : (
            <span />
          )}

          {hasUnread && (
            <span className="shrink-0 min-w-4.5 h-4.5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export default ConversationItem;
