"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Skeleton } from "@/components/ui/skeleton";
import { MESSAGE_ESTIMATED_HEIGHT } from "@/components/Chat/config";
import { useDataConversation } from "@/components/Chat/hook";
import { MessageResponse } from "@/interface/response";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";
import TypingIndicator from "@/components/Chat/MessagePanel/TypingIndicator";
import { differenceInMinutes } from "date-fns";
import { parseDate } from "@/lib/utils";
import MessageBubble from "@/components/Chat/MessagePanel/MessageBubble";
import { useConversationMessages } from "@/hooks/useChatMessages";
import { MESSAGE_STATUS } from "@/common";
import { useMessageList } from "@/hooks/patient/useMessageList";

interface MessageListProps {
  isTyping?: boolean;
}

function MessageList({ isTyping }: MessageListProps) {
  const { activeConversation, usersMap, setItems, items } = useDataConversation();
  const { data } = useConversationMessages(activeConversation?.id!);

  // ─── Xử lý real-time message từ WebSocket ───────────────────────────────
  useEffect(() => {
    if (!data?.length) return;

    const latest = data[data.length - 1];

    setItems((prev) => {
      // Tin của mình → server confirm → replace optimistic item (clock → ✓)
      if (latest.tempId) {
        return prev.map((item) => {
          if (item.tempId === latest.tempId) {
            return { ...latest, status: MESSAGE_STATUS.DELIVERED, tempId: undefined };
          }
          return item;
        });
      }

      const alreadyExists = prev.some((p) => p.id === latest.id);
      if (alreadyExists) return prev;
      return [...prev, latest];
    });
  }, [data]);

  useEffect(() => {
    if (!data?.length) return;
    // Chỉ auto-scroll nếu đang ở gần cuối
    const el = parentRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
    if (isNearBottom) {
      virtualizer.scrollToIndex(items.length - 1, { align: "end", behavior: "smooth" });
    }
  }, [items.length]);

  const currentProfile = useCurrentProfile();
  const currentProfileId = useMemo(() => currentProfile?.data?.body?.id, [currentProfile?.data]);
  const [initialLoading, setInitialLoading] = useState(false);
  const fetchList = useMessageList();

  const hasMore = useRef(true);
  const querying = useRef(false);
  const pageRef = useRef(0);
  const isFirstLoad = useRef(true);
  const abortRef = useRef(false);

  const requestData = useCallback(async () => {
    if (querying.current || !hasMore.current || abortRef.current) return;
    querying.current = true;

    try {
      const result = await fetchList.trigger({
        conversationId: activeConversation?.id,
        page: pageRef.current,
      });

      if (abortRef.current) return;

      const newItems: MessageResponse[] = result?.body?.data ?? [];

      if (!newItems.length) {
        hasMore.current = false;
        return;
      }

      setItems((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const unique = newItems.filter((m) => !existingIds.has(m.id));
        // Tin cũ prepend lên đầu, tin mới đang ở cuối
        return [...unique, ...prev];
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

  // ─── Virtualizer ─────────────────────────────────────────────────────────
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: isTyping ? items.length + 1 : items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => MESSAGE_ESTIMATED_HEIGHT,
    overscan: 5,
  });

  // Scroll xuống cuối lần đầu load xong
  useEffect(() => {
    if (items.length > 0 && isFirstLoad.current) {
      isFirstLoad.current = false;
      virtualizer.scrollToIndex(items.length - 1, { align: "end", behavior: "auto" });
    }
  }, [items.length]);

  // Scroll đến typing indicator khi có người đang gõ
  useEffect(() => {
    if (isTyping) {
      const total = items.length + 1;
      virtualizer.scrollToIndex(total - 1, { align: "end", behavior: "smooth" });
    }
  }, [isTyping]);

  // ─── Scroll lên load thêm tin cũ, giữ nguyên scroll position ────────────
  const handleScroll = useCallback(() => {
    const el = parentRef.current;
    if (!el) return;
    if (el.scrollTop < 80 && hasMore.current && !querying.current) {
      const prevScrollHeight = el.scrollHeight;
      requestData().then(() => {
        requestAnimationFrame(() => {
          el.scrollTop += el.scrollHeight - prevScrollHeight;
        });
      });
    }
  }, [requestData]);

  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]); // ← thêm handleScroll vào deps

  // ─── Render ──────────────────────────────────────────────────────────────
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
              parseDate(nextMessage.createdAt, "HH:mm:ss dd/MM/yyyy") || new Date(),
              parseDate(message.createdAt, "HH:mm:ss dd/MM/yyyy") || new Date()
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
