"use client";

import { cn, formatTime, getImageUrl, getInitials, parseDate } from "@/lib/utils";
import { Check, CheckCheck, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageResponse, UserResponse } from "@/interface/response";
import { MESSAGE_STATUS, MESSAGE_TYPE } from "@/common";

interface MessageBubbleProps {
  message: MessageResponse;
  isMine: boolean;
  sender: UserResponse | null;
  showAvatar: boolean;
}

function StatusIcon({ status, isOptimistic }: { status: MESSAGE_STATUS; isOptimistic: boolean }) {
  if (isOptimistic) {
    return <Clock className="h-3 w-3 text-muted-foreground animate-pulse" />;
  }

  switch (status) {
    case MESSAGE_STATUS.SENT:
      return <Check className="h-3 w-3 text-muted-foreground" />;
    case MESSAGE_STATUS.DELIVERED:
      return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
    case MESSAGE_STATUS.READ:
      return <CheckCheck className="h-3 w-3 text-blue-500" />;
    default:
      return null;
  }
}

function MessageBubble({ message, isMine, sender, showAvatar }: MessageBubbleProps) {
  const isOptimistic = message?.tempId?.startsWith("temp-");
  const isRecalled = message.status === MESSAGE_STATUS.RECALLED;
  const parsedDate = parseDate(message.createdAt, "HH:mm:ss dd/MM/yyyy");
  const initials = getInitials(sender?.fullName ?? "?");

  return (
    <div className={cn("flex items-end gap-2", isMine ? "flex-row-reverse" : "flex-row")}>
      {!isMine && (
        <div className="w-7 shrink-0 self-end mb-4">
          {showAvatar && (
            <Avatar className="h-7 w-7">
              <AvatarImage src={sender?.pathAvatar ? getImageUrl(sender?.pathAvatar) : undefined} />
              <AvatarFallback className="text-xs font-medium bg-muted">{initials}</AvatarFallback>
            </Avatar>
          )}
        </div>
      )}

      <div
        className={cn(
          "flex flex-col gap-0.5 max-w-[70%] sm:max-w-[60%]",
          isMine ? "items-end" : "items-start"
        )}
      >
        {/* Recalled bubble */}
        {isRecalled ? (
          <div
            className={cn(
              "rounded-2xl px-3.5 py-2 text-sm italic",
              "border border-dashed border-muted-foreground/40",
              "text-muted-foreground bg-muted/30",
              isMine ? "rounded-br-sm" : "rounded-bl-sm"
            )}
          >
            Tin nhắn đã bị thu hồi
          </div>
        ) : (
          message.type === MESSAGE_TYPE.TEXT && (
            <div
              className={cn(
                "rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                "wrap-break-word whitespace-pre-wrap",
                isMine
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted text-foreground rounded-bl-sm"
              )}
            >
              {message.content}
            </div>
          )
        )}

        {/* Timestamp + status */}
        {showAvatar && (
          <div
            className={cn("flex items-center gap-1 px-1", isMine ? "flex-row-reverse" : "flex-row")}
          >
            {isMine && !isRecalled && (
              <StatusIcon status={message.status} isOptimistic={!!isOptimistic} />
            )}
            <span className="text-[10px] text-muted-foreground tabular-nums">
              {parsedDate ? formatTime(parsedDate) : "—"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
export default MessageBubble;
