"use client";

import AppointmentRow from "@/components/DoctorAppointments/AppointmentList/AppointmentRow";
import {
  useFilterAppointmentsData,
  useForceRefreshAppointments,
} from "@/components/DoctorAppointments/hook";
import { useCallback, useEffect, useRef } from "react";
import { endOfDay, startOfDay } from "date-fns";
import { formatDateToApi } from "@/lib/utils";
import { AppointmentFilterFormValues } from "@/components/Appointments/TabContent";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useDoctorAppointment } from "@/hooks/doctor/useDoctorAppointment";
import AppointmentSkeleton from "@/components/Appointments/AppointmentSkeleton";
import EmptyStateList from "@/components/DoctorAppointments/AppointmentList/EmptyStateList";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";
import { ROLE_NAME } from "@/common";
import { useStaffAppointment } from "@/hooks/staff/useDoctorAppointment";

// ─── SkeletonRow ───────────────────────────────────────────────────────────────

const CARD_ESTIMATED_HEIGHT = 120;

export function AppointmentList() {
  const { swr } = useForceRefreshAppointments();

  const { data } = useFilterAppointmentsData();

  const { data: currentProfileData } = useCurrentProfile();

  const role = currentProfileData?.body?.role;

  const isFirstRender = useRef(true);

  const parentRef = useRef<HTMLDivElement>(null);

  const buildFilter = useCallback((): AppointmentFilterFormValues & {
    fromDate: string;
    toDate: string;
  } => {
    return {
      keyword: data?.keyword,
      status: data?.status as any,
      fromDate: data?.date?.from
        ? formatDateToApi(startOfDay(data?.date?.from!), "HH:mm dd/MM/yyyy")
        : "",
      toDate: data?.date?.to ? formatDateToApi(endOfDay(data?.date?.to!), "HH:mm dd/MM/yyyy") : "",
    };
  }, [data?.keyword, data?.date, data?.status]);

  const doctorAppointment =
    role === ROLE_NAME.DOCTOR
      ? useDoctorAppointment(buildFilter())
      : useStaffAppointment(buildFilter());

  const virtualizer = useVirtualizer({
    count: doctorAppointment?.data?.body?.data?.length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => CARD_ESTIMATED_HEIGHT,
    overscan: 3,
  });

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    doctorAppointment.mutate();
  }, [swr?.data]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      {doctorAppointment?.isLoading ? (
        <AppointmentSkeleton />
      ) : !doctorAppointment?.data?.body?.data?.length ? (
        <EmptyStateList status={data?.status?.[0]!} />
      ) : (
        <div ref={parentRef} className="h-full flex-1 overflow-y-auto">
          <div
            style={{
              height: virtualizer.getTotalSize(),
              position: "relative",
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                className="absolute top-0 right-0 left-0 px-1 py-2"
                ref={virtualizer.measureElement}
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <AppointmentRow apt={doctorAppointment?.data?.body?.data?.[virtualRow?.index]!} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
