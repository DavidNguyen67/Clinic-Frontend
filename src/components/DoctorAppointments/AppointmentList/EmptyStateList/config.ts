import { APPOINTMENT_STATUS } from "@/common";
import { FILTER_ALL_VALUE, VALUE_OF_FILTER_ALL_VALUE } from "@/hooks/global";
import { CalendarX, Clock, Sun, ClipboardCheck, XCircle } from "lucide-react";

export const EMPTY_CONFIG: Record<APPOINTMENT_STATUS | VALUE_OF_FILTER_ALL_VALUE, any> = {
  [FILTER_ALL_VALUE]: {
    Icon: CalendarX,
    title: "No appointments",
    sub: "There are no appointments to display.",
    showBook: true,
  },
  [APPOINTMENT_STATUS.PENDING]: {
    Icon: Clock,
    title: "No pending appointments",
    sub: "Your pending appointments will appear here",
    showBook: false,
  },
  [APPOINTMENT_STATUS.CONFIRMED]: {
    Icon: CalendarX,
    title: "No upcoming appointments",
    sub: "There are no appointments to display.",
    showBook: true,
  },
  [APPOINTMENT_STATUS.CHECKED_IN]: {
    Icon: Sun,
    title: "Nothing scheduled today",
    sub: "Your schedule is clear for today",
    showBook: false,
  },
  [APPOINTMENT_STATUS.IN_PROGRESS]: {
    Icon: Clock,
    title: "No in-progress appointments",
    sub: "Active appointments will appear here",
    showBook: false,
  },
  [APPOINTMENT_STATUS.COMPLETED]: {
    Icon: ClipboardCheck,
    title: "No completed appointments",
    sub: "Your completed appointments will appear here",
    showBook: false,
  },
  [APPOINTMENT_STATUS.CANCELLED]: {
    Icon: XCircle,
    title: "No cancelled appointments",
    sub: "Cancelled appointments will appear here",
    showBook: false,
  },
  [APPOINTMENT_STATUS.NO_SHOW]: {
    Icon: XCircle,
    title: "No no-show appointments",
    sub: "No-show appointments will appear here",
    showBook: false,
  },
};
