"use client";

import { cn, formatTime, getInitials, parseDate } from "@/lib/utils";
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

function StatusIcon({ status }: { status: MESSAGE_STATUS }) {
  if (status === MESSAGE_STATUS.SENT) return <Clock className="h-3 w-3 text-muted-foreground" />;
  if (status === MESSAGE_STATUS.DELIVERED)
    return <Check className="h-3 w-3 text-muted-foreground" />;
  return <CheckCheck className="h-3 w-3 text-blue-500" />;
}

function MessageBubble({ message, isMine, sender, showAvatar }: MessageBubbleProps) {
  const initials = getInitials(sender?.fullName ?? "?");
  const isOptimistic = message.id.startsWith("temp-");
  const parsedDate = parseDate(message.createdAt, "HH:mm:ss dd/MM/yyyy");

  return (
    <div className={cn("flex items-end gap-2", isMine ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar slot — always reserves space to prevent layout shift */}
      {!isMine && (
        <div className="w-7 shrink-0 self-end mb-4">
          {showAvatar && (
            <Avatar className="h-7 w-7">
              <AvatarImage src={sender?.pathAvatar ?? undefined} alt={sender?.fullName ?? "User"} />
              <AvatarFallback className="text-xs font-medium bg-muted">{initials}</AvatarFallback>
            </Avatar>
          )}
        </div>
      )}

      {/* Bubble + meta */}
      <div
        className={cn(
          "flex flex-col gap-0.5",
          "max-w-[70%] sm:max-w-[60%]",
          isMine ? "items-end" : "items-start"
        )}
      >
        {message.type === MESSAGE_TYPE.TEXT && (
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
        )}

        {/* Timestamp + status */}
        <div
          className={cn("flex items-center gap-1 px-1", isMine ? "flex-row-reverse" : "flex-row")}
        >
          {/* Status icon — shown only for mine; optimistic shows spinner */}
          {isMine && (
            <span className="flex items-center">
              {isOptimistic ? (
                <Clock className="h-3 w-3 text-muted-foreground animate-pulse" />
              ) : (
                <StatusIcon status={message.status} />
              )}
            </span>
          )}

          <span className="text-[10px] text-muted-foreground tabular-nums">
            {parsedDate ? formatTime(parsedDate) : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
