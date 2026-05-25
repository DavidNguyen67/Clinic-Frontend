"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, MessageSquare } from "lucide-react";
import { APPOINTMENT_MANAGEMENT_TABS } from "@/components/AppoinmentManagement/config";
import { AppointmentStatCards } from "@/components/AppoinmentManagement/AppointmentStatCards";
import { AppointmentTable } from "@/components/AppoinmentManagement/AppointmentTable";
import { AppointmentFilterBar } from "@/components/AppoinmentManagement/AppointmentFilterBar";
import { useState } from "react";
import { AppointmentFormFilter } from "@/components/AppoinmentManagement/AppointmentFilterBar/config";
import { set } from "date-fns";
import { FILTER_ALL_VALUE } from "@/hooks/global";

export default function DoctorAppointmentsPage() {
  const [filter, setFilter] = useState<AppointmentFormFilter>({
    dateTo: set(new Date(), { hours: 0, minutes: 0, seconds: 0, date: new Date().getDate() - 7 }),
    dateFrom: set(new Date(), {
      hours: 23,
      minutes: 59,
      seconds: 59,
      date: new Date().getDate() + 7,
    }),
    status: FILTER_ALL_VALUE,
    patientName: "",
  });

  return (
    <div className="flex flex-col h-full min-h-0 flex-1">
      {/* Page header */}
      <div className="mb-1">
        <h1 className="text-xl font-semibold text-slate-900">Quản lý lịch hẹn</h1>
        <p className="text-sm text-slate-400 mt-0.5">Xem và cập nhật trạng thái lịch hẹn của bạn</p>
      </div>

      <Tabs
        defaultValue={APPOINTMENT_MANAGEMENT_TABS.APPOINTMENTS}
        className="flex flex-col flex-1 min-h-0"
      >
        <div className="px-6 pt-4 py-2 bg-white border-b border-slate-200">
          <TabsList className="h-9 bg-slate-100 rounded-lg p-1">
            <TabsTrigger
              value={APPOINTMENT_MANAGEMENT_TABS.APPOINTMENTS}
              className="h-7 text-xs px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-1.5"
            >
              <CalendarDays className="h-3.5 w-3.5" />
              Lịch hẹn
            </TabsTrigger>
            <TabsTrigger
              value={APPOINTMENT_MANAGEMENT_TABS.CHAT}
              className="h-7 text-xs px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-1.5"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Tin nhắn
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value={APPOINTMENT_MANAGEMENT_TABS.APPOINTMENTS}
          className="flex-1 min-h-0 flex flex-col mt-0 px-6 py-5 gap-4"
        >
          <AppointmentStatCards />
          <AppointmentFilterBar filter={filter} onChange={setFilter} />
          <AppointmentTable filter={filter} />
        </TabsContent>

        {/*<TabsContent*/}
        {/*  value={APPOINTMENT_MANAGEMENT_TABS.CHAT}*/}
        {/*  className="flex-1 min-h-0 mt-0 flex"*/}
        {/*></TabsContent>*/}
      </Tabs>
    </div>
  );
}
