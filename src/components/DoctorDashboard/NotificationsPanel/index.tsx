"use client";

import { useState } from "react";
import { CalendarDays, CheckCircle2, ChevronRight, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NotifAction, NotificationItem } from "@/components/DoctorDashboard/config";

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    patient: "Emma Richardson",
    initials: "ER",
    requestedDate: "Today, 3:00 PM",
    reason: "Follow-up consultation",
    minutesAgo: 4,
  },
  {
    id: "2",
    patient: "James Thornton",
    initials: "JT",
    requestedDate: "Tomorrow, 10:30 AM",
    reason: "Chest pain evaluation",
    minutesAgo: 18,
  },
  {
    id: "3",
    patient: "Sophia Nakamura",
    initials: "SN",
    requestedDate: "Wed, 2:00 PM",
    reason: "ECG result review",
    minutesAgo: 45,
  },
  {
    id: "4",
    patient: "Carlos Mendez",
    initials: "CM",
    requestedDate: "Thu, 9:00 AM",
    reason: "Annual heart check",
    minutesAgo: 120,
  },
];

function NotificationCard({
  notif,
  action,
  onAccept,
  onDecline,
}: {
  notif: NotificationItem;
  action: NotifAction;
  onAccept: () => void;
  onDecline: () => void;
}) {
  const timeLabel =
    notif.minutesAgo < 60
      ? `${notif.minutesAgo}m ago`
      : `${Math.floor(notif.minutesAgo / 60)}h ago`;

  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-all duration-300",
        action === "accepted" && "border-emerald-200 bg-emerald-50/50",
        action === "declined" && "border-rose-100 bg-rose-50/30 opacity-60",
        !action && "border-gray-100 bg-white hover:border-blue-100 hover:shadow-sm"
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-9 w-9 shrink-0 ring-2 ring-gray-50">
          <AvatarFallback className="bg-blue-50 text-blue-600 font-semibold text-xs">
            {notif.initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-gray-900 truncate">{notif.patient}</p>
            <span className="text-[11px] text-gray-400 shrink-0">{timeLabel}</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{notif.reason}</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <CalendarDays className="w-3 h-3 text-blue-400 shrink-0" />
            <span className="text-xs font-medium text-blue-600">{notif.requestedDate}</span>
          </div>
        </div>
      </div>

      {!action && (
        <div className="flex gap-2 mt-3">
          <Button
            size="sm"
            onClick={onAccept}
            className="flex-1 h-7 text-xs rounded-lg bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-200"
          >
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onDecline}
            className="flex-1 h-7 text-xs rounded-lg text-gray-500 hover:text-rose-600 hover:border-rose-200"
          >
            Decline
          </Button>
        </div>
      )}

      {action && (
        <div
          className={cn(
            "mt-3 flex items-center gap-1.5 text-xs font-medium",
            action === "accepted" ? "text-emerald-600" : "text-rose-400"
          )}
        >
          {action === "accepted" ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
            </>
          ) : (
            <>
              <XCircle className="w-3.5 h-3.5" /> Declined
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── NotificationsPanel ────────────────────────────────────────────────────────

export function NotificationsPanel() {
  const [actions, setActions] = useState<Record<string, NotifAction>>({});

  const pendingCount = NOTIFICATIONS.filter((n) => !actions[n.id]).length;

  const handleAction = (id: string, action: "accepted" | "declined") => {
    setActions((prev) => ({ ...prev, [id]: action }));
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-gray-900">New Requests</h2>
          {pendingCount > 0 && (
            <Badge className="bg-rose-100 text-rose-600 border-0 text-[11px] px-2 py-0.5 rounded-full font-semibold">
              {pendingCount} pending
            </Badge>
          )}
        </div>
        <button className="text-xs text-blue-500 font-medium hover:text-blue-700 flex items-center gap-0.5">
          View all <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2.5">
        {NOTIFICATIONS.map((notif) => (
          <NotificationCard
            key={notif.id}
            notif={notif}
            action={actions[notif.id] ?? null}
            onAccept={() => handleAction(notif.id, "accepted")}
            onDecline={() => handleAction(notif.id, "declined")}
          />
        ))}
      </div>

      {/* All-done empty state */}
      {pendingCount === 0 && (
        <div className="mt-1 flex flex-col items-center gap-2 py-4 text-center">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-sm font-medium text-gray-600">All caught up!</p>
          <p className="text-xs text-gray-400">No pending requests.</p>
        </div>
      )}
    </div>
  );
}
