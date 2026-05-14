"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, formatDate } from "@/lib/utils";
import { Clock, CalendarIcon, Plus, Loader2 } from "lucide-react";
import type { DayButtonProps } from "react-day-picker";
import { useBookingStore } from "@/components/Booking/useBookingStore";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export enum EXCEPTION_TYPE {
  LEAVE = "LEAVE", // doctor on leave (weekday)
  EXTRA = "EXTRA", // extra work (weekend)
}

export type DoctorScheduleException = {
  id: string;
  doctorProfile: { id: string; name: string };
  exceptionDate: string; // "YYYY-MM-DD"
  type: EXCEPTION_TYPE;
  reason: string;
  createdAt: string;
  updatedAt: string;
};

export type SlotStatus = "available" | "booked" | "overtime";

export type TimeSlot = {
  time: string; // "HH:mm"
  status: SlotStatus;
};

export type DayAvailability = {
  date: string;
  hasAvailableSlot: boolean;
  isOvertime: boolean;
  slots: TimeSlot[];
};

export type MonthAvailability = Map<string, DayAvailability>;

const NORMAL_SLOTS: string[] = (() => {
  const slots: string[] = [];
  const p = (n: number) => String(n).padStart(2, "0");
  for (let h = 8; h < 12; h++) slots.push(`${p(h)}:00`, `${p(h)}:30`);
  for (let h = 14; h < 17; h++) slots.push(`${p(h)}:00`, `${p(h)}:30`);
  slots.push("17:00");
  return slots;
})();

const OVERTIME_SLOTS: string[] = ["17:30", "18:00", "18:30", "19:00"];
const OVERTIME_SET = new Set(OVERTIME_SLOTS);

const toDateStr = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(
    2,
    "0"
  )}`;

const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

async function fetchExceptionsForMonth(
  _doctorId: string,
  year: number,
  month: number
): Promise<DoctorScheduleException[]> {
  await new Promise((r) => setTimeout(r, 500));

  const today = new Date();
  if (year !== today.getFullYear() || month !== today.getMonth()) return [];

  const p = (n: number) => String(n).padStart(2, "0");
  const mk = (d: number) => `${year}-${p(month + 1)}-${p(d)}`;
  const dow = today.getDay();

  const wedDay = new Date(today);
  wedDay.setDate(today.getDate() + ((3 - dow + 7) % 7 || 7));
  const satDay = new Date(today);
  satDay.setDate(today.getDate() + ((6 - dow + 7) % 7 || 7));

  return [
    {
      id: "ex-1",
      doctorProfile: { id: "doc-1", name: "Dr. Smith" },
      exceptionDate: mk(wedDay.getDate()),
      type: EXCEPTION_TYPE.LEAVE,
      reason: "Personal leave",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "ex-2",
      doctorProfile: { id: "doc-1", name: "Dr. Smith" },
      exceptionDate: mk(satDay.getDate()),
      type: EXCEPTION_TYPE.EXTRA,
      reason: "Extended clinic hours",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

async function fetchBookedSlotsForDate(_doctorId: string, _date: string): Promise<string[]> {
  await new Promise((r) => setTimeout(r, 60));
  return [...NORMAL_SLOTS, ...OVERTIME_SLOTS].filter(() => Math.random() < 0.25);
}

export async function computeMonthAvailability(
  doctorId: string,
  year: number,
  month: number
): Promise<MonthAvailability> {
  const exceptions = await fetchExceptionsForMonth(doctorId, year, month);
  const exMap = new Map(exceptions.map((e) => [e.exceptionDate, e]));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const availability = new Map<string, DayAvailability>();
  const tasks: Promise<void>[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    dateObj.setHours(0, 0, 0, 0);
    if (dateObj < today) continue;

    const dateStr = toDateStr(dateObj);
    const weekend = isWeekend(dateObj);
    const exception = exMap.get(dateStr);

    let shouldFetch = false;
    let isOvertime = false;

    if (!weekend && !exception) {
      shouldFetch = true;
    } else if (!weekend && exception?.type === EXCEPTION_TYPE.LEAVE) {
      shouldFetch = false;
    } else if (weekend && exception?.type === EXCEPTION_TYPE.EXTRA) {
      shouldFetch = true;
      isOvertime = true;
    }

    if (!shouldFetch) continue;

    const _dateStr = dateStr;
    const _isOvertime = isOvertime;

    tasks.push(
      fetchBookedSlotsForDate(doctorId, _dateStr).then((booked) => {
        const bookedSet = new Set(booked);
        const normalSlots: TimeSlot[] = NORMAL_SLOTS.map((t) => ({
          time: t,
          status: bookedSet.has(t) ? "booked" : "available",
        }));
        const overtimeSlots: TimeSlot[] = _isOvertime
          ? OVERTIME_SLOTS.map((t) => ({
              time: t,
              status: bookedSet.has(t) ? "booked" : "overtime",
            }))
          : [];
        const allSlots = [...normalSlots, ...overtimeSlots];
        availability.set(_dateStr, {
          date: _dateStr,
          hasAvailableSlot: allSlots.some((s) => s.status !== "booked"),
          isOvertime: _isOvertime,
          slots: allSlots,
        });
      })
    );
  }

  await Promise.all(tasks);
  return availability;
}

// ─────────────────────────────────────────────────────────────────────────────
// CustomDayButton — react-day-picker v9/v10
//
// shadcn v9/v10 exposes `DayButton` component slot (not `Day`).
// We receive `day`, `modifiers`, `children` and all native <button> attrs.
// We delegate rendering to `CalendarDayButton` (shadcn wrapper) so the base
// layout / focus ring / aria attributes stay consistent.
// ─────────────────────────────────────────────────────────────────────────────

type CustomDayButtonProps = DayButtonProps & {
  availability: MonthAvailability;
  selectedDateStr: string; // "YYYY-MM-DD" | ""
};

function CustomDayButton({
  day,
  modifiers,
  children,
  availability,
  selectedDateStr,
  className: _className, // discard — we set our own
  ...rest
}: CustomDayButtonProps) {
  const dateStr = toDateStr(day.date);
  const avail = availability.get(dateStr);

  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);
  const dayMidnight = new Date(day.date);
  dayMidnight.setHours(0, 0, 0, 0);

  const isPast = dayMidnight < todayMidnight;
  const isOutside = modifiers.outside === true;
  const isAvailable = !isPast && !isOutside && (avail?.hasAvailableSlot ?? false);
  const isFullBooked = !isPast && !isOutside && !!avail && !avail.hasAvailableSlot;
  const isOvertime = avail?.isOvertime ?? false;
  const isSelected = dateStr === selectedDateStr;

  const btn = (
    <CalendarDayButton
      day={day}
      modifiers={modifiers}
      {...rest}
      disabled={isPast || isOutside || isFullBooked || !isAvailable}
      className={cn(
        // Reset shadcn defaults, set our own base
        "relative h-9 w-9 rounded-lg text-sm font-medium transition-all duration-150",
        "flex items-center justify-center select-none p-0",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
        // Outside current month
        isOutside && "opacity-0 pointer-events-none",
        // Past dates
        isPast && "text-gray-200 cursor-not-allowed",
        // Weekend / holiday — no data
        !isPast && !isOutside && !avail && "text-gray-300 cursor-not-allowed",
        // Fully booked
        isFullBooked && "bg-gray-50 text-gray-300 cursor-not-allowed line-through",
        // Available — normal weekday
        isAvailable &&
          !isOvertime &&
          !isSelected &&
          "bg-white text-gray-700 border border-gray-100 cursor-pointer hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200",
        // Available — overtime day
        isAvailable &&
          isOvertime &&
          !isSelected &&
          "bg-amber-50 text-amber-700 border-2 border-amber-300 cursor-pointer hover:bg-amber-100",
        // Selected — normal
        isSelected &&
          !isOvertime &&
          "bg-blue-600 text-white border border-blue-700 shadow-md shadow-blue-100",
        // Selected — overtime
        isSelected &&
          isOvertime &&
          "bg-amber-500 text-white border-2 border-amber-600 shadow-md shadow-amber-100"
      )}
    >
      {children}
    </CalendarDayButton>
  );

  if (isOvertime && isAvailable) {
    return (
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>{btn}</TooltipTrigger>
          <TooltipContent
            side="top"
            className="text-xs bg-amber-900 text-amber-50 border-amber-800"
          >
            Extended hours
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return btn;
}

// ─────────────────────────────────────────────────────────────────────────────
// TimeSlotSection
// ─────────────────────────────────────────────────────────────────────────────

function TimeSlotSection({
  label,
  slots,
  selectedTime,
  onSelect,
  isOvertime = false,
}: {
  label: string;
  slots: TimeSlot[];
  selectedTime: string;
  onSelect: (t: string) => void;
  isOvertime?: boolean;
}) {
  if (slots.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          {label}
        </span>
        {isOvertime && (
          <Badge
            variant="outline"
            className="text-[10px] h-4 px-1.5 border-amber-300 text-amber-600 bg-amber-50 gap-0.5"
          >
            <Plus className="w-2.5 h-2.5" />
            Overtime
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {slots.map(({ time, status }) => {
          const booked = status === "booked";
          const overtime = status === "overtime";
          const selected = time === selectedTime;

          return (
            <button
              key={time}
              disabled={booked}
              onClick={() => !booked && onSelect(time)}
              className={cn(
                "py-2 rounded-xl text-xs font-semibold border-2 transition-all duration-150",
                booked &&
                  "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through",
                !booked &&
                  !selected &&
                  !overtime &&
                  "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600",
                !booked &&
                  !selected &&
                  overtime &&
                  "border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-400 hover:bg-amber-100",
                selected &&
                  !overtime &&
                  "border-blue-500 bg-blue-600 text-white shadow-md shadow-blue-200",
                selected &&
                  overtime &&
                  "border-amber-500 bg-amber-500 text-white shadow-md shadow-amber-200"
              )}
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// StepSchedule — main export
// ─────────────────────────────────────────────────────────────────────────────

const StepSchedule = () => {
  const { store } = useBookingStore();

  const today = new Date();

  const [displayMonth, setDisplayMonth] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [availability, setAvailability] = useState<MonthAvailability>(new Map());
  const [isLoading, setIsLoading] = useState(false);

  const selectedDate = useMemo(
    () => (store?.date ? new Date(store.date + "T00:00:00") : undefined),
    [store?.date]
  );

  const selectedDayData = store?.date ? availability.get(store.date) : undefined;

  const normalSlots = useMemo(
    () => selectedDayData?.slots.filter((s) => !OVERTIME_SET.has(s.time)) ?? [],
    [selectedDayData]
  );
  const overtimeSlots = useMemo(
    () => selectedDayData?.slots.filter((s) => OVERTIME_SET.has(s.time)) ?? [],
    [selectedDayData]
  );

  const doctorId = store?.doctor?.id ?? "doc-1";

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setAvailability(new Map());

    computeMonthAvailability(doctorId, displayMonth.getFullYear(), displayMonth.getMonth()).then(
      (avail) => {
        if (cancelled) return;
        setAvailability(avail);
        setIsLoading(false);

        // Auto-select first available day
        const first = [...avail.values()]
          .filter((d) => d.hasAvailableSlot)
          .sort((a, b) => a.date.localeCompare(b.date))[0];

        // if (first) onDateChange(first.date);
      }
    );

    return () => {
      cancelled = true;
    };
  }, [doctorId, displayMonth]);

  const handleMonthChange = (m: Date) => {
    const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    if (m < minMonth) return;
    setDisplayMonth(m);
  };

  const handleDaySelect = (selected: Date | undefined) => {
    if (!selected) return;
    const ds = toDateStr(selected);
    if (!availability.get(ds)?.hasAvailableSlot) return;
  };

  const handleSubmit = () => {
    // TODO: wire to real API
  };

  const isDisabledDay = (day: Date): boolean => {
    const d = new Date(day);
    d.setHours(0, 0, 0, 0);
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    if (d < t) return true;
    return !(availability.get(toDateStr(day))?.hasAvailableSlot ?? false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Pick a Date &amp; Time</h2>
        <p className="text-sm text-gray-400 mt-1">Select your preferred appointment slot</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* ── Calendar panel ── */}
        <div className="border border-gray-100 shadow-sm rounded-2xl bg-white p-4 space-y-3">
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-blue-500 bg-blue-50 rounded-xl px-3 py-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Loading availability…
            </div>
          )}

          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDaySelect}
            month={displayMonth}
            onMonthChange={handleMonthChange}
            disabled={isDisabledDay}
            // ─ v9/v10: use DayButton slot, NOT Day ─
            components={{
              DayButton: ({ day, modifiers, children, ...rest }: DayButtonProps) => (
                <CustomDayButton
                  day={day}
                  modifiers={modifiers}
                  availability={availability}
                  selectedDateStr={formatDate(selectedDate)}
                  {...rest}
                >
                  {children}
                </CustomDayButton>
              ),
            }}
            classNames={{
              months: "flex flex-col",
              month: "space-y-3",
              month_caption: "flex justify-between items-center px-1 pb-1",
              caption_label: "text-sm font-semibold text-gray-800",
              nav: "flex items-center gap-1",
              button_previous:
                "w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-500",
              button_next:
                "w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-500",
              month_grid: "w-full border-collapse",
              weekdays: "grid grid-cols-7",
              weekday: "text-center text-[10px] font-semibold text-gray-400 py-1",
              week: "grid grid-cols-7 gap-y-1 mt-1",
              day: "flex items-center justify-center",
              day_button: "", // fully overridden by CustomDayButton
              selected: "",
              today: "",
              disabled: "",
              outside: "",
              hidden: "invisible",
            }}
          />

          {/* Legend */}
          <div className="flex flex-wrap gap-x-3 gap-y-2 border-t border-gray-50 pt-3">
            {[
              { label: "Available", cls: "bg-white border border-gray-200" },
              { label: "Selected", cls: "bg-blue-600" },
              { label: "Fully booked", cls: "bg-gray-50 border border-gray-100" },
              { label: "Extended hours", cls: "bg-amber-50 border-2 border-amber-300" },
            ].map(({ label, cls }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className={cn("w-4 h-4 rounded-md inline-block flex-shrink-0", cls)} />
                <span className="text-[10px] text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Time slots panel ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            <Clock className="w-4 h-4 flex-shrink-0" />
            {selectedDate ? (
              <>
                Available slots for{" "}
                <span className="font-semibold text-gray-800">{formatDate(selectedDate)}</span>
                {selectedDayData?.isOvertime && (
                  <Badge
                    variant="outline"
                    className="text-[10px] h-5 px-1.5 border-amber-300 text-amber-600 bg-amber-50 gap-0.5"
                  >
                    <Plus className="w-2.5 h-2.5" />
                    Extended hours
                  </Badge>
                )}
              </>
            ) : (
              <span>Select a date to see available slots</span>
            )}
          </div>

          {!selectedDate ? (
            <div className="h-52 flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-100">
              <div className="text-center space-y-2">
                <CalendarIcon className="w-8 h-8 text-gray-200 mx-auto" />
                <p className="text-xs text-gray-300">Select a date to see available times</p>
              </div>
            </div>
          ) : (
            // <div className="space-y-4">
            //   <TimeSlotSection
            //     label="Normal hours"
            //     slots={normalSlots}
            //     selectedTime={time}
            //     onSelect={onTimeChange}
            //     isOvertime={false}
            //   />

            //   {selectedDayData?.isOvertime && overtimeSlots.length > 0 && (
            //     <>
            //       <div className="border-t border-dashed border-amber-200" />
            //       <TimeSlotSection
            //         label="Overtime"
            //         slots={overtimeSlots}
            //         selectedTime={time}
            //         onSelect={onTimeChange}
            //         isOvertime={true}
            //       />
            //     </>
            //   )}

            //   <div className="flex items-center gap-3 text-[10px] text-gray-400 pt-1">
            //     <span className="flex items-center gap-1.5">
            //       <span className="w-3 h-3 rounded border-2 border-blue-500 bg-blue-600 inline-block" />
            //       Selected
            //     </span>
            //     <span className="flex items-center gap-1.5">
            //       <span className="w-3 h-3 rounded border-2 border-gray-200 bg-white inline-block" />
            //       Available
            //     </span>
            //     <span className="flex items-center gap-1.5">
            //       <span className="w-3 h-3 rounded border-2 border-gray-100 bg-gray-50 inline-block" />
            //       Fully booked
            //     </span>
            //   </div>
            // </div>
            <></>
          )}
        </div>
      </div>
      {/* 
      {date && time && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Appointment:{" "}
            <span className="font-semibold text-gray-900">
              {date} at {time}
            </span>
            {selectedDayData?.isOvertime && (
              <span className="ml-1.5 text-[11px] text-amber-600">(overtime)</span>
            )}
          </p>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 h-9 text-sm font-medium shadow-sm shadow-blue-200"
          >
            Confirm booking
          </Button>
        </div>
      )} */}
    </div>
  );
};

export default StepSchedule;
