"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ConversationResponse } from "@/interface/response";
import { FileText, ImageIcon } from "lucide-react";
import { MESSAGE_TYPE } from "@/common";

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
  const initials = getInitials(conversation.name ?? "?");
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
          <AvatarImage src={conversation?.avatar ?? undefined} alt={conversation.name ?? ""} />
          <AvatarFallback className="text-xs font-medium">{initials}</AvatarFallback>
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
            {conversation.name}
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
            <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export default ConversationItem;
