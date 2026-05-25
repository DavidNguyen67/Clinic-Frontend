"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { BOOKING_TYPE } from "@/common";
import { useCallback, useRef, useState } from "react";
import { useDoctorAppointment } from "@/hooks/doctor/useDoctorAppointment";
import {
  Calendar as CalIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Hash,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { cn, formatDate, formatDateToApi, formatTime, parseDate } from "@/lib/utils";
import StatusBadge from "@/components/Appointments/StatusBadge";
import { Button } from "@/components/ui/button";
import NumberFlow from "@number-flow/react";
import usePopup from "@/hooks/useDialog";
import { Sheet } from "@/components/ui/sheet";
import AppointmentDetailDrawer from "@/components/DoctorAppointments/AppointmentList/AppointmentDetailDrawer";
import { AppointmentFormFilter } from "@/components/AppoinmentManagement/AppointmentFilterBar/config";

const BOOKING_TYPE_LABEL: Record<BOOKING_TYPE, string> = {
  [BOOKING_TYPE.ONLINE]: "Online",
  [BOOKING_TYPE.PHONE]: "Điện thoại",
  [BOOKING_TYPE.WALK_IN]: "Trực tiếp",
};

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: 6 }).map((_, j) => (
            <TableCell key={j}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

interface AppointmentTableProps {
  filter: AppointmentFormFilter;
}

export function AppointmentTable({ filter }: AppointmentTableProps) {
  const pageRef = useRef<number>(5);

  const [page, setPage] = useState(0);

  const buildFilter = useCallback(() => {
    return {
      size: pageRef.current,
      page,
      status: filter.status as any,
      fromDate: formatDateToApi(filter.dateFrom, "HH:mm dd/MM/yyyy"),
      toDate: formatDateToApi(filter.dateTo, "HH:mm dd/MM/yyyy"),
    };
  }, [page, filter]);

  const doctorAppointment = useDoctorAppointment(buildFilter());

  const sheetDetail = usePopup<{ appointmentId: string }>();

  return (
    <>
      <div className="flex flex-col h-full flex-1">
        <div className="flex-1 overflow-auto h-full">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 bg-slate-50/70 hover:bg-slate-50/70">
                <TableHead className="w-32.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Mã lịch hẹn
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Bệnh nhân
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Ngày giờ
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Chuyên khoa
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Loại đặt
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Trạng thái
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctorAppointment?.isLoading ? (
                <LoadingRows />
              ) : doctorAppointment?.data?.body?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-slate-400 text-sm">
                    <div className="flex flex-col items-center gap-2">
                      <CalIcon className="h-8 w-8 text-slate-200" />
                      Không có lịch hẹn nào
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {doctorAppointment?.data?.body?.data?.map((appt) => (
                    <TableRow
                      key={appt.id}
                      onClick={() => sheetDetail.openPopup({ appointmentId: appt.id })}
                      className={cn("cursor-pointer border-slate-100 transition-colors")}
                    >
                      <TableCell>
                        <span className="font-mono text-xs text-slate-500 flex items-center gap-1">
                          <Hash className="h-3 w-3" />
                          {appt.appointmentCode}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            <UserRound className="h-3.5 w-3.5 text-slate-400" />
                          </div>
                          <span className="text-sm font-medium text-slate-800 truncate max-w-35">
                            {appt.patientName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-medium text-slate-700 flex items-center gap-1">
                            <CalIcon className="h-3 w-3 text-slate-400" />
                            {formatDate(parseDate(appt.appointmentDate, "HH:mm:ss dd/MM/yyyy"))}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(parseDate(appt.appointmentDate, "HH:mm:ss dd/MM/yyyy"))}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-600 flex items-center gap-1">
                          <Stethoscope className="h-3.5 w-3.5 text-slate-400" />
                          {appt.specialtyName}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-slate-500">
                          {BOOKING_TYPE_LABEL[appt.bookingType]}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={appt.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-white">
          <p className="text-xs text-slate-400">
            Tổng{" "}
            <NumberFlow
              value={doctorAppointment?.data?.body?.total || 0}
              className="font-medium text-slate-600"
            />{" "}
            lịch hẹn
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 border-slate-200"
              disabled={doctorAppointment?.data?.body?.page === 0}
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs text-slate-600 px-2">
              {(doctorAppointment?.data?.body?.page ?? 0) + 1} /{" "}
              {doctorAppointment?.data?.body?.totalPages ?? 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 border-slate-200"
              disabled={
                (doctorAppointment?.data?.body?.page ?? 0) >=
                (doctorAppointment?.data?.body?.totalPages ?? 1) - 1
              }
              onClick={() => {
                setPage((prev) => prev + 1);
              }}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
      <Sheet open={sheetDetail.open} onOpenChange={sheetDetail.onOpenChange}>
        <AppointmentDetailDrawer
          appointmentId={sheetDetail.data?.appointmentId!}
          onClose={sheetDetail.closePopup}
        />
      </Sheet>
    </>
  );
}
