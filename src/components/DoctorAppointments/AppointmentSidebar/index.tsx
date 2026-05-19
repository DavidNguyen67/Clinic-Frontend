"use client";

import { Calendar } from "@/components/ui/calendar";
import { formatDate, formatDateToApi } from "@/lib/utils";
import { useFilterAppointmentsData } from "@/components/DoctorAppointments/hook";
import AppointmentSkeleton from "@/components/Appointments/AppointmentSkeleton";
import EmptyState from "@/components/Appointments/EmptyState";
import { APPOINTMENT_TAB } from "@/components/Appointments/config";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useRef } from "react";
import { useDoctorAppointment } from "@/hooks/doctor/useDoctorAppointment";
import { AppointmentFilterFormValues } from "@/components/Appointments/TabContent";
import { endOfDay, startOfDay } from "date-fns";
import { SidebarAppointmentCard } from "@/components/DoctorAppointments/AppointmentSidebar/SidebarAppointmentCard";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";
import { ROLE_NAME } from "@/common";
import { useStaffAppointment } from "@/hooks/staff/useDoctorAppointment";

const CARD_ESTIMATED_HEIGHT = 120;

export function AppointmentSidebar() {
  const { data, mutateData } = useFilterAppointmentsData();

  const { data: currentProfileData } = useCurrentProfile();

  const role = currentProfileData?.body?.role;

  const parentRef = useRef<HTMLDivElement>(null);

  const buildFilter = useCallback((): AppointmentFilterFormValues & {
    fromDate: string;
    toDate: string;
  } => {
    return {
      keyword: data?.keyword,
      fromDate: formatDateToApi(startOfDay(new Date()), "HH:mm dd/MM/yyyy"),
      toDate: formatDateToApi(endOfDay(new Date()), "HH:mm dd/MM/yyyy"),
    };
  }, [data?.keyword, data?.date, data?.status]);

  const appointments =
    role === ROLE_NAME.DOCTOR
      ? useDoctorAppointment(buildFilter())
      : useStaffAppointment(buildFilter());

  const virtualizer = useVirtualizer({
    count: appointments?.data?.body?.data?.length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => CARD_ESTIMATED_HEIGHT,
    overscan: 3,
  });

  return (
    <div className="shrink-0 border-r border-gray-100 bg-white flex flex-col overflow-y-auto">
      {/* Mini Calendar using shadcn */}
      <div className="p-3 border-b border-gray-100 w-full">
        <Calendar
          mode="range"
          selected={data?.date}
          defaultMonth={data?.date?.from}
          onSelect={(date) => {
            mutateData({ date });
          }}
          modifiers={{
            hasAppointment: (date) => {
              return false;
            },
          }}
          modifiersClassNames={{
            hasAppointment:
              "font-semibold underline decoration-blue-400 decoration-2 underline-offset-2",
          }}
        />
      </div>

      {/* Daily Timeline */}
      <div className="flex-1 p-4 h-full flex flex-col overflow-y-auto no-scrollbar">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Today's Appointments
        </p>

        {appointments?.isLoading ? (
          <AppointmentSkeleton />
        ) : !appointments?.data?.body?.data?.length ? (
          <EmptyState tab={APPOINTMENT_TAB.TODAY} />
        ) : (
          <div ref={parentRef} className="h-full flex-1 overflow-y-auto">
            <div
              style={{
                height: virtualizer.getTotalSize(),
                position: "relative",
              }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const appt = appointments.data!.body!.data[virtualRow.index];

                return <SidebarAppointmentCard appt={appt} key={virtualRow.key} />;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
