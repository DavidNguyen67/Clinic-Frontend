"use client";

import { CalendarDayButton } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";
import { CalendarDay, Modifiers } from "react-day-picker";

export type DayStatus = "available" | "full" | "overtime" | "disabled" | "leave";

const DayButton = (
  props: {
    day: CalendarDay;
    modifiers: Modifiers;
    dayStatus?: DayStatus;
  } & ButtonHTMLAttributes<HTMLButtonElement>
) => {
  const { children, modifiers, day, dayStatus = "available", ...restProps } = props;

  const isDisabled = dayStatus === "disabled" || dayStatus === "full" || dayStatus === "leave";

  return (
    <CalendarDayButton
      day={day}
      modifiers={modifiers}
      {...restProps}
      disabled={isDisabled}
      className={cn(
        restProps.className,
        dayStatus === "disabled" && "opacity-40 cursor-not-allowed",
        dayStatus === "full" &&
          "border-2 border-red-400 text-red-500 opacity-70 cursor-not-allowed hover:bg-transparent",
        dayStatus === "overtime" &&
          "border-2 border-amber-400 text-amber-600 hover:border-amber-500 hover:bg-amber-50",
        dayStatus === "leave" &&
          "border-2 border-dashed border-slate-400 text-slate-400 opacity-60 cursor-not-allowed hover:bg-transparent"
      )}
    >
      {children}
    </CalendarDayButton>
  );
};

export default DayButton;
