"use client";

import { useStaffAppointmentStats } from "@/hooks/staff/useStaffAppointmentStats";
import { useStaffInvoice } from "@/hooks/staff/useStaffInvoice";
import { CalendarCheck, UserCheck, FileText, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { APPOINTMENT_STATUS, INVOICE_STATUS } from "@/common";
import { buildQueryParams } from "@/lib/utils";

const TODAY = new Date();
const TODAY_START = `${String(TODAY.getHours()).padStart(2, "0")}:00:00 ${String(TODAY.getDate()).padStart(2, "0")}/${String(TODAY.getMonth() + 1).padStart(2, "0")}/${TODAY.getFullYear()}`;
const TODAY_END = `${String(TODAY.getHours()).padStart(2, "0")}:59:59 ${String(TODAY.getDate()).padStart(2, "0")}/${String(TODAY.getMonth() + 1).padStart(2, "0")}/${TODAY.getFullYear()}`;

function useTodayAppointments() {
  const params = buildQueryParams({
    fromDate: TODAY_START,
    toDate: TODAY_END,
    page: 1,
    size: 1,
  });
  const { accessToken } = { accessToken: "" as string | undefined };
  return useStaffAppointmentStats();
}

export function StaffStatsGrid() {
  const t = useTranslations("staff.dashboard");
  const { data: statsData } = useStaffAppointmentStats();
  const { data: invoiceData } = useStaffInvoice({
    status: INVOICE_STATUS.PENDING,
    page: 1,
    size: 1,
  });

  const stats = statsData?.body;
  const pendingInvoicesCount = invoiceData?.body?.total ?? 0;

  const todayCount = stats?.todayCount ?? 0;
  const checkedInCount = stats?.checkedInCount ?? 0;
  const completedCount = stats?.completedCount ?? 0;

  const items = [
    {
      label: t("todayAppointments"),
      value: String(todayCount),
      icon: CalendarCheck,
      color: "blue",
    },
    {
      label: t("checkedIn"),
      value: String(checkedInCount),
      icon: UserCheck,
      color: "emerald",
    },
    {
      label: t("pendingInvoices"),
      value: String(pendingInvoicesCount),
      icon: FileText,
      color: "amber",
    },
    {
      label: t("completedToday"),
      value: String(completedCount),
      icon: CheckCircle2,
      color: "violet",
    },
  ];

  const colorMap: Record<
    string,
    { bg: string; ring: string; icon: string }
  > = {
    blue: { bg: "bg-blue-50", ring: "ring-blue-100", icon: "text-blue-600" },
    emerald: {
      bg: "bg-emerald-50",
      ring: "ring-emerald-100",
      icon: "text-emerald-600",
    },
    amber: { bg: "bg-amber-50", ring: "ring-amber-100", icon: "text-amber-600" },
    violet: {
      bg: "bg-violet-50",
      ring: "ring-violet-100",
      icon: "text-violet-600",
    },
  };

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {items.map((stat) => {
        const c = colorMap[stat.color];
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center ring-4",
                  c.bg,
                  c.ring
                )}
              >
                <Icon className={cn("w-4 h-4", c.icon)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
