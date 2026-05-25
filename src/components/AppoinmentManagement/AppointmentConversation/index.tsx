"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, SquarePen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import useDialog from "@/hooks/useDialog";
import { useDataConversation } from "@/components/Chat/hook";
import { Dialog } from "@/components/ui/dialog";
import ConversationSkeleton from "@/components/Chat/ConversationList/ConversationSkeleton";
import { ConversationResponse, UserResponse } from "@/interface/response";
import ConversationItem from "@/components/Chat/ConversationList/ConversationItem";
import _ from "lodash";
import { useUsersByProfileIds } from "@/hooks/useUsersByIds";
import { useDoctorConversation } from "@/hooks/doctor/useDoctorConversation";
import NewChatAppointmentDialog
  from "@/components/AppoinmentManagement/AppointmentConversation/NewChatAppoinmentDialog";

function AppointmentConversation() {
  const [items, setItems] = useState<ConversationResponse[]>([]);

  const { activeConversation, setActiveConversation, setUsersMap } = useDataConversation();

  const [keyword, setKeyword] = useState("");

  const debouncedKeyword = useDebounce(keyword, 600);

  const userIds: string[] = useMemo(() => {
    const unique = new Set(items.flatMap((c) => c.participants));

    return Array.from(unique);
  }, [items]);

  const { data } = useUsersByProfileIds({ ids: userIds });

  const userMap = useMemo(() => {
    const newMap: Record<string, UserResponse> = {};

    data?.body?.forEach((user) => {
      newMap[user.id] = user;
    });

    return newMap;
  }, [data?.body]);

  useEffect(() => {
    setUsersMap(userMap);
  }, [userMap]);

  const fetchList = useDoctorConversation();

  const dialog = useDialog();

  const hasMore = useRef<boolean>(true);
  const querying = useRef<boolean>(false);
  const pageRef = useRef<number>(0);

  const requestData = async () => {
    if (querying.current || !hasMore.current) return;
    querying.current = true;

    try {
      const filter = {
        keyword: debouncedKeyword,
      };
      const payload = _.merge({}, filter, { page: pageRef.current });
      const pageNewItems = await fetchList.trigger(payload);
      const newItems = pageNewItems?.body?.data;

      if (!newItems?.length) {
        hasMore.current = false;
      } else {
        setItems((prev) => {
          const inComing: ConversationResponse[] = [];
          const unique = new Set([...prev, ...newItems].map((c) => c.id));

          [...prev, ...newItems].filter((c) => {
            if (unique.has(c.id)) {
              inComing.push(c);
              unique.delete(c.id);
              return true;
            }
            return false;
          });

          return inComing;
        });
        pageRef.current += 1;
      }
    } finally {
      querying.current = false;
    }
  };

  const refreshData = async () => {
    setItems([]);
    hasMore.current = true;
    querying.current = false;
    pageRef.current = 0;
    await requestData();
  };

  useEffect(() => {
    refreshData();
  }, [debouncedKeyword]);

  return (
    <div className="flex flex-col h-full flex-1 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <h2 className="text-base font-semibold">Messages</h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => dialog.openPopup()}
          title="New conversation"
        >
          <SquarePen className="h-4 w-4" />
        </Button>
      </div>
      {/* Search */}
      <div className="px-3 pb-2 shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search conversations…"
            className="pl-8 text-sm h-8"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-hidden px-2 h-full flex flex-col">
        {fetchList?.isMutating ? (
          <ConversationSkeleton />
        ) : fetchList?.error ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Failed to load conversations
          </p>
        ) : !items?.length ? (
          <p className="text-sm text-muted-foreground text-center py-8">No conversations yet</p>
        ) : (
          <div className="flex flex-col gap-0.5">
            {items.map((conv) => {
              const raw = items.find((c) => c.id === conv.id)!;
              return (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={activeConversation?.id === conv.id}
                  onClick={() => setActiveConversation(raw)}
                />
              );
            })}
          </div>
        )}
      </div>
      <Dialog open={dialog.open} onOpenChange={dialog.onOpenChange}>
        <NewChatAppointmentDialog onOpenChange={dialog.onOpenChange} onSuccess={refreshData} />
      </Dialog>
    </div>
  );
}

export default AppointmentConversation;
