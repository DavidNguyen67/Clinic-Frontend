"use client";

import { EXCEPTION_TYPE } from "@/common";
import CalendarLegend from "@/components/Booking/StepSchedule/CalendarLegend";
import DayButton, { DayStatus } from "@/components/Booking/StepSchedule/DayButton";
import { useBookingStore } from "@/components/Booking/useBookingStore";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { usePublicDoctorScheduleExceptions } from "@/hooks/public/usePublicDoctorSchedule";
import { formatDateToApi, parseDate } from "@/lib/utils";
import { isSameDay, startOfDay } from "date-fns";
import { useState } from "react";

function StepSchedule() {
  const today = startOfDay(new Date());

  const [displayMonth, setDisplayMonth] = useState(today);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const startOfMonth = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), 1);
  const endOfMonth = new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 0);

  const { store, setBookingState } = useBookingStore();

  const publicDoctorScheduleExceptions = usePublicDoctorScheduleExceptions({
    doctorId: "40024a2e-8bd4-41cb-abbb-e46f08cc87b0",
    from: formatDateToApi(startOfMonth),
    to: formatDateToApi(endOfMonth),
  });

  const getDayStatus = (date: Date): DayStatus => {
    if (date < today) return "disabled";

    const exception = publicDoctorScheduleExceptions.data?.body?.data?.find((e) =>
      isSameDay(parseDate(e.exceptionDate, "dd/MM/yyyy")!, date)
    );

    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    if (isWeekend) {
      return exception?.type === EXCEPTION_TYPE.EXTRA ? "overtime" : "disabled";
    }

    return exception?.type === EXCEPTION_TYPE.LEAVE ? "leave" : "available";
  };

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    const status = getDayStatus(date);
    if (status === "disabled" || status === "full" || status === "leave") return;

    setSelectedDate(date);
  };

  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar
          mode="single"
          month={displayMonth}
          selected={selectedDate}
          onSelect={handleSelectDate}
          onMonthChange={setDisplayMonth}
          disabled={(date) => date < today}
          numberOfMonths={1}
          captionLayout="dropdown"
          className="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
          formatters={{
            formatMonthDropdown: (date) => date.toLocaleString("default", { month: "long" }),
          }}
          components={{
            DayButton: (props) => <DayButton {...props} dayStatus={getDayStatus(props.day.date)} />,
          }}
        />
        <div className="border-t border-border">
          <CalendarLegend />
        </div>
      </CardContent>
    </Card>
  );
}

export default StepSchedule;
