"use client";

import { DAY_STATUS, EXCEPTION_TYPE } from "@/common";
import {
  RescheduleFormValues,
  rescheduleSchema,
} from "@/components/Appointments/RescheduleSheet/config";
import { useForceRefreshAppointment } from "@/components/Appointments/TabContent/hook";
import CalendarLegend from "@/components/Booking/StepSchedule/CalendarLegend";
import DayButton from "@/components/Booking/StepSchedule/DayButton";
import {
  AFTERNOON_SLOTS,
  MORNING_SLOTS,
  Slot,
} from "@/components/Booking/StepSchedule/TimePicker/config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  usePatientAppointmentDetail,
  usePatientAppointmentUpdate,
} from "@/hooks/patient/usePatientAppointment";
import { usePublicAppointment } from "@/hooks/public/usePublicAppointment";
import { usePublicDoctorScheduleExceptions } from "@/hooks/public/usePublicDoctorSchedule";
import { formatDate, formatDateToApi, formatTime, getInitials, parseDate } from "@/lib/utils";
import { isBefore, isSameDay, startOfDay } from "date-fns";
import { useFormik } from "formik";
import { CalendarClock, CalendarDays, Clock, Loader2 } from "lucide-react";
import { useRef, useState } from "react";

interface RescheduleSheetProps {
  appointmentId: string;
  onClose?: () => void;
}

export function RescheduleSheet({ appointmentId, onClose }: RescheduleSheetProps) {
  const patientAppointment = usePatientAppointmentDetail(appointmentId);
  const apt = patientAppointment.data?.body;
  const { forceMutate } = useForceRefreshAppointment();

  const today = useRef(startOfDay(new Date()));
  const [displayMonth, setDisplayMonth] = useState(today.current);

  const startOfMonth = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), 1);
  const endOfMonth = new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 0);

  const scheduleExceptions = usePublicDoctorScheduleExceptions({
    doctorId: apt?.doctorProfileId,
    from: formatDateToApi(startOfMonth),
    to: formatDateToApi(endOfMonth),
  });

  const patientAppointmentUpdate = usePatientAppointmentUpdate(apt?.id!);

  const initialValues = useRef<RescheduleFormValues>({
    date: new Date(),
    time: "",
  });

  const formik = useFormik<RescheduleFormValues>({
    initialValues: initialValues.current,
    validationSchema: rescheduleSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log("[RescheduleSheet] submit →", {
          appointmentId: apt?.id,
          newDate: formatDateToApi(values.date!),
          newTime: values.time,
        });
        onClose?.();
        forceMutate();
      } catch (error) {
        // TODO: show toast on error
      } finally {
        setSubmitting(false);
      }
    },
  });

  const publicAppointment = usePublicAppointment({
    doctorProfileId: apt?.doctorProfileId,
    appointmentDate: formik.values.date ? formatDateToApi(formik.values.date) : undefined,
  });

  const takenSlots: string[] = (publicAppointment.data?.body?.data ?? []).map((a) =>
    a.appointmentTime.substring(0, 5)
  );

  const getDayStatus = (date: Date): DAY_STATUS => {
    if (isBefore(date, today.current)) return DAY_STATUS.DISABLED;

    const exception = scheduleExceptions.data?.body?.data?.find((e) =>
      isSameDay(parseDate(e.exceptionDate, "dd/MM/yyyy")!, date)
    );

    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    if (isWeekend) {
      return exception?.type === EXCEPTION_TYPE.EXTRA ? DAY_STATUS.OVERTIME : DAY_STATUS.DISABLED;
    }

    return exception?.type === EXCEPTION_TYPE.LEAVE ? DAY_STATUS.LEAVE : DAY_STATUS.AVAILABLE;
  };

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    const status = getDayStatus(date);
    if (status === DAY_STATUS.DISABLED || status === DAY_STATUS.FULL || status === DAY_STATUS.LEAVE)
      return;
    // Reset time whenever date changes so user picks a fresh slot
    formik.setValues({ date, time: undefined as any });
  };

  const handleSelectTime = (slotStart: string) => {
    formik.setFieldValue("time", slotStart);
    // Mark touched so validation error can show if needed
    formik.setFieldTouched("time", true, false);
  };

  const renderSlotGroup = (label: string, slots: Slot[]) => (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {slots.map((slot) => {
          const isUnavail = takenSlots.includes(slot.start);
          const isSelected = formik.values.time === slot.start;
          return (
            <button
              key={slot.start}
              type="button"
              disabled={isUnavail || formik.isSubmitting}
              onClick={() => handleSelectTime(slot.start)}
              className={[
                "py-2 px-3 rounded-lg text-xs font-medium border-2 transition-all duration-150 text-left",
                isUnavail
                  ? "border-muted bg-muted/50 text-muted-foreground/50 cursor-not-allowed line-through"
                  : isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-background text-foreground hover:border-primary/50 hover:text-primary",
              ].join(" ")}
            >
              <Clock
                className={[
                  "inline w-3 h-3 mr-1.5 mb-0.5",
                  isSelected ? "text-primary-foreground" : "text-muted-foreground",
                ].join(" ")}
              />
              {slot.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  const currentParsedDate = parseDate(apt?.appointmentDate, "HH:mm:ss dd/MM/yyyy");
  const canConfirm = !!formik.values.date && !!formik.values.time;
  const isPending = formik.isSubmitting || patientAppointmentUpdate?.isMutating;

  return (
    <SheetContent
      side="right"
      className="w-full sm:max-w-2xl flex flex-col p-0 gap-0 overflow-hidden"
    >
      <SheetHeader className="px-5 py-4 border-b shrink-0">
        <SheetTitle className="text-base font-medium flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
          Reschedule appointment
        </SheetTitle>
      </SheetHeader>

      {/* Wrap scrollable body + footer in form so Enter / submit works naturally */}
      <form onSubmit={formik.handleSubmit} className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {/* ── Current appointment ── */}
          <div className="px-5 py-4 bg-muted/30 border-b">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-3">
              Current appointment
            </p>
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 shrink-0">
                {apt?.doctorPathAvatar && (
                  <AvatarImage src={apt.doctorPathAvatar} alt={apt.doctorName} />
                )}
                <AvatarFallback className="bg-blue-50 text-blue-700 text-xs font-medium">
                  {getInitials(apt?.doctorName!)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{apt?.doctorName}</p>
                <p className="text-xs text-muted-foreground">{apt?.specialtyName}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-medium flex items-center gap-1 justify-end">
                  <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                  {formatDate(currentParsedDate)}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end mt-0.5">
                  <Clock className="h-3 w-3" />
                  {formatTime(currentParsedDate)}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* ── New schedule picker ── */}
          <div className="px-5 py-5 space-y-5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Choose new schedule
            </p>

            <div className="flex flex-col gap-4 lg:items-start lg:gap-6">
              {/* Calendar */}
              <Card className="mx-auto w-fit p-0 shrink-0">
                <CardContent className="p-0 flex flex-col">
                  <Calendar
                    mode="single"
                    month={displayMonth}
                    selected={formik.values.date}
                    onSelect={handleSelectDate}
                    onMonthChange={setDisplayMonth}
                    disabled={(date) => isBefore(date, today.current) || formik.isSubmitting}
                    numberOfMonths={1}
                    captionLayout="dropdown"
                    className="[--cell-size:--spacing(10)]"
                    formatters={{
                      formatMonthDropdown: (date) =>
                        date.toLocaleString("default", { month: "long" }),
                    }}
                    components={{
                      DayButton: (props) => (
                        <DayButton {...props} dayStatus={getDayStatus(props.day.date)} />
                      ),
                    }}
                  />
                  <div className="border-t border-border mt-auto">
                    <CalendarLegend />
                  </div>
                </CardContent>
              </Card>

              {/* Time slots */}
              <div className="flex-1 min-w-0">
                {!formik.values.date ? (
                  <div className="h-full flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border py-10">
                    <CalendarDays className="w-7 h-7 text-muted-foreground/30" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        Select a date first
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        Available slots will appear here
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Slots for{" "}
                        <span className="font-semibold text-foreground">
                          {formatDate(formik.values.date)}
                        </span>
                      </span>
                    </div>

                    {publicAppointment.isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <>
                        {renderSlotGroup("Morning", MORNING_SLOTS)}
                        {renderSlotGroup("Afternoon", AFTERNOON_SLOTS)}
                      </>
                    )}

                    {/* Validation error for time — only after user has touched the field */}
                    {formik.touched.time && formik.errors.time && (
                      <p className="text-xs text-destructive">{formik.errors.time}</p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded border-2 border-primary bg-primary inline-block" />
                        Selected
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded border-2 border-border inline-block" />
                        Available
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded border-2 border-muted bg-muted/50 inline-block" />
                        Booked
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* New schedule preview */}
            {canConfirm && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 flex items-center gap-3">
                <CalendarClock className="h-4 w-4 text-primary shrink-0" />
                <div className="text-sm">
                  <span className="text-muted-foreground">New schedule: </span>
                  <span className="font-semibold text-foreground">
                    {formatDate(formik.values.date!)}
                  </span>
                  <span className="text-muted-foreground mx-1.5">at</span>
                  <span className="font-semibold text-foreground">{formik.values.time}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <SheetFooter className="border-t px-5 py-4 flex-row gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1 gap-1.5" disabled={!canConfirm || isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? "Rescheduling…" : "Confirm reschedule"}
          </Button>
        </SheetFooter>
      </form>
    </SheetContent>
  );
}
