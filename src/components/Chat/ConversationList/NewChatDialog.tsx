"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useFetchPublicDoctor } from "@/hooks/public/usePublicDoctor";
import _ from "lodash";
import { DoctorProfileResponse } from "@/interface/response";
import { useDataConversation } from "@/components/Chat/hook";
import { usePatientConversationCreate } from "@/hooks/patient/usePatientConversation";
import { CONVERSATION_TYPE } from "@/common";
import { getImageUrl, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NewChatDialogProps {
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

function NewChatDialog({ onOpenChange, onSuccess }: NewChatDialogProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const [keyword, setKeyword] = useState("");

  const [items, setItems] = useState<DoctorProfileResponse[]>([]);

  const debouncedKeyword = useDebounce(keyword, 600);

  const fetchList = useFetchPublicDoctor();

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
          const inComing: DoctorProfileResponse[] = [];
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

  const { setActiveConversation } = useDataConversation();

  const conversationCreate = usePatientConversationCreate();

  const handleSelect = async (contact: DoctorProfileResponse) => {
    try {
      setLoading(contact.id);
      const response = await conversationCreate.trigger({
        type: CONVERSATION_TYPE.DIRECT,
        participants: [contact.id],
        name: null,
        avatar: null,
      });
      setActiveConversation(response?.body ?? null);
      setKeyword("");
      onOpenChange(false);
      onSuccess?.();
    } catch (e) {
    } finally {
      setLoading(null);
    }
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>New conversation</DialogTitle>
      </DialogHeader>

      <div className="relative mt-1">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search by name…"
          className="pl-8 text-sm"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          autoFocus
        />
      </div>

      <div className="mt-2 flex flex-col gap-0.5 max-h-72 overflow-y-auto">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">No contacts found</p>
        )}
        {items.map((contact) => {
          const initials = getInitials(contact?.user?.fullName);

          return (
            <button
              key={contact.id}
              disabled={loading === contact.id}
              onClick={() => handleSelect(contact)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-colors text-left disabled:opacity-60"
            >
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarImage
                  src={
                    contact?.user?.pathAvatar ? getImageUrl(contact?.user?.pathAvatar) : undefined
                  }
                  alt={contact?.user?.fullName}
                />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{contact?.user?.fullName}</p>
                {contact?.user?.role && (
                  <p className="text-xs text-muted-foreground">{contact?.user?.role}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </DialogContent>
  );
}

export default NewChatDialog;
