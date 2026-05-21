"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Skeleton } from "@/components/ui/skeleton";
import { MESSAGE_ESTIMATED_HEIGHT } from "@/components/Chat/config";
import { useDataConversation } from "@/components/Chat/hook";
import { MessageResponse } from "@/interface/response";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";
import { usePatientMessage } from "@/hooks/patient/usePatientMessage";
import TypingIndicator from "@/components/Chat/MessagePanel/TypingIndicator";
import { differenceInMinutes } from "date-fns";
import { parseDate } from "@/lib/utils";
import MessageBubble from "@/components/Chat/MessagePanel/MessageBubble";

interface MessageListProps {
  isTyping?: boolean;
}

function MessageList({ isTyping }: MessageListProps) {
  const { activeConversation, usersMap } = useDataConversation();

  const currentProfile = useCurrentProfile();
  const currentProfileId = useMemo(
    () => currentProfile?.data?.body?.doctor?.id ?? currentProfile?.data?.body?.patient?.id,
    [currentProfile?.data]
  );
  const [items, setItems] = useState<MessageResponse[]>([]);
  const [initialLoading, setInitialLoading] = useState(false);

  const fetchList = usePatientMessage();

  const hasMore = useRef(true);
  const querying = useRef(false);
  const pageRef = useRef(0);
  const isFirstLoad = useRef(true);
  const abortRef = useRef(false);

  const requestData = useCallback(async () => {
    if (querying.current || !hasMore.current || abortRef.current) return;
    querying.current = true;

    try {
      const payload = {
        conservationId: activeConversation?.id,
        page: pageRef.current,
      };

      const result = await fetchList.trigger(payload);
      if (abortRef.current) return;

      const newItems: MessageResponse[] = result?.body?.data ?? [];

      if (!newItems.length) {
        hasMore.current = false;
        return;
      }

      setItems((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const unique = newItems.filter((m) => !existingIds.has(m.id));
        return [...prev, ...unique];
      });

      pageRef.current += 1;
    } finally {
      querying.current = false;
    }
  }, [activeConversation?.id]);

  useEffect(() => {
    abortRef.current = true;

    setItems([]);
    setInitialLoading(true);
    hasMore.current = true;
    querying.current = false;
    pageRef.current = 0;
    isFirstLoad.current = true;

    const timer = setTimeout(async () => {
      abortRef.current = false;
      await requestData();
      setInitialLoading(false);
    }, 0);

    return () => {
      clearTimeout(timer);
      abortRef.current = true;
    };
  }, [activeConversation?.id]);

  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: isTyping ? items.length + 1 : items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => MESSAGE_ESTIMATED_HEIGHT,
    overscan: 5,
  });

  useEffect(() => {
    if (items.length > 0 && isFirstLoad.current) {
      isFirstLoad.current = false;
      virtualizer.scrollToIndex(items.length - 1, { align: "end", behavior: "auto" });
    }
  }, [items.length]);

  useEffect(() => {
    if (isTyping) {
      const total = isTyping ? items.length + 1 : items.length;
      virtualizer.scrollToIndex(total - 1, { align: "end", behavior: "smooth" });
    }
  }, [isTyping]);

  const handleScroll = useCallback(() => {
    const el = parentRef.current;
    if (!el) return;
    if (el.scrollTop < 80 && hasMore.current && !querying.current) {
      const prevHeight = el.scrollHeight;
      requestData().then(() => {
        requestAnimationFrame(() => {
          el.scrollTop += el.scrollHeight - prevHeight;
        });
      });
    }
  }, [requestData]);

  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  if (initialLoading) {
    return (
      <div className="flex flex-col gap-3 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`flex gap-2 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
            <Skeleton className="h-7 w-7 rounded-full shrink-0" />
            <Skeleton className="h-9 rounded-2xl" style={{ width: `${120 + (i % 3) * 40}px` }} />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">
          Chưa có tin nhắn nào. Hãy bắt đầu trò chuyện!
        </p>
      </div>
    );
  }

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className="flex-1 px-4 py-3 h-full overflow-hidden overflow-y-scroll max-h-100"
    >
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualItems.map((virtualRow) => {
          // Last virtual row = typing indicator
          const isTypingRow = isTyping && virtualRow.index === items.length;

          if (isTypingRow) {
            return (
              <div
                key="typing-indicator"
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className="absolute top-0 left-0 right-0 py-0.5"
                style={{ transform: `translateY(${virtualRow.start}px)` }}
              >
                <TypingIndicator />
              </div>
            );
          }

          const message = items[virtualRow.index];
          const isMine = message.senderId === currentProfileId;
          const sender = usersMap?.[message.senderId] ?? null;

          const nextMessage = items[virtualRow.index + 1];

          const showAvatar =
            !nextMessage ||
            nextMessage.senderId !== message.senderId ||
            differenceInMinutes(
              parseDate(nextMessage.createdAt, "HH:mm:ss dd/MM/yyyy") || new Date().getTime(),
              parseDate(message.createdAt, "HH:mm:ss dd/MM/yyyy") || new Date().getTime()
            ) > 5;
          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              className="absolute top-0 left-0 right-0 py-0.5"
              style={{ transform: `translateY(${virtualRow.start}px)` }}
            >
              <MessageBubble
                message={message}
                isMine={isMine}
                sender={sender}
                showAvatar={showAvatar}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MessageList;
