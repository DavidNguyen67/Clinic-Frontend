import { LucideIcon } from "lucide-react";

export interface StatItem {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  icon: LucideIcon;
  color: "blue" | "amber" | "emerald" | "rose";
  sub: string;
}

export interface NotificationItem {
  id: string;
  patient: string;
  initials: string;
  requestedDate: string;
  reason: string;
  minutesAgo: number;
}

export interface WeeklyDataItem {
  day: string;
  appointments: number;
  completed: number;
}

export type NotifAction = "accepted" | "declined" | null;

export const COLOR_MAP: Record<string, { bg: string; text: string; icon: string; ring: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", icon: "text-blue-500", ring: "ring-blue-100" },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    icon: "text-amber-500",
    ring: "ring-amber-100",
  },
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    icon: "text-emerald-500",
    ring: "ring-emerald-100",
  },
  rose: { bg: "bg-rose-50", text: "text-rose-600", icon: "text-rose-500", ring: "ring-rose-100" },
};
