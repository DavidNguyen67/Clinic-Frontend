import { APPOINTMENT_TAB } from "@/components/Appointments/config";
import { CalendarX, ClipboardCheck, Clock, SunMedium, XCircle } from "lucide-react";

export const EMPTY_CONFIG: Record<APPOINTMENT_TAB, any> = {
  [APPOINTMENT_TAB.UPCOMING]: {
    Icon: CalendarX,
    title: "No upcoming appointments",
    sub: "Book your first consultation with our doctors",
    showBook: true,
  },
  [APPOINTMENT_TAB.PENDING]: {
    Icon: Clock,
    title: "No pending appointments",
    sub: "Your pending appointments will appear here",
    showBook: false,
  },
  [APPOINTMENT_TAB.TODAY]: {
    Icon: SunMedium,
    title: "Nothing scheduled today",
    sub: "Your schedule is clear for today",
    showBook: false,
  },
  [APPOINTMENT_TAB.COMPLETED]: {
    Icon: ClipboardCheck,
    title: "No completed appointments",
    sub: "Your completed visits will appear here",
    showBook: false,
  },
  [APPOINTMENT_TAB.CANCELLED]: {
    Icon: XCircle,
    title: "No cancelled appointments",
    sub: "Cancelled appointments will appear here",
    showBook: false,
  },
};
