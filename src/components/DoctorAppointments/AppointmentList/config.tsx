import { APPOINTMENT_STATUS } from "@/common";
import { CheckCircle2, Loader2, UserX, Ban, CalendarCheck2, UserCheck } from "lucide-react";

export type Action = {
  label: string;
  targetStatus: APPOINTMENT_STATUS;
  icon: React.ReactNode;
  variant: "default" | "outline" | "destructive";
  confirmTitle: string;
  confirmDescription: string;
};

export const DOCTOR_ACTIONS: Partial<Record<APPOINTMENT_STATUS, Action[]>> = {
  [APPOINTMENT_STATUS.CHECKED_IN]: [
    {
      label: "Bắt đầu khám",
      targetStatus: APPOINTMENT_STATUS.IN_PROGRESS,
      icon: <Loader2 className="h-3.5 w-3.5" />,
      variant: "default",
      confirmTitle: "Bắt đầu khám?",
      confirmDescription: "Xác nhận bắt đầu khám cho bệnh nhân này.",
    },
    {
      label: "Không đến",
      targetStatus: APPOINTMENT_STATUS.NO_SHOW,
      icon: <UserX className="h-3.5 w-3.5" />,
      variant: "destructive",
      confirmTitle: "Đánh dấu không đến?",
      confirmDescription: "Bệnh nhân sẽ được đánh dấu là không đến khám.",
    },
  ],
  [APPOINTMENT_STATUS.IN_PROGRESS]: [
    {
      label: "Hoàn thành",
      targetStatus: APPOINTMENT_STATUS.COMPLETED,
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
      variant: "default",
      confirmTitle: "Hoàn thành khám?",
      confirmDescription: "Xác nhận đã hoàn thành buổi khám cho bệnh nhân này.",
    },
  ],
};

export const STAFF_ACTIONS: Partial<Record<APPOINTMENT_STATUS, Action[]>> = {
  // PENDING → CONFIRMED | CANCELLED
  [APPOINTMENT_STATUS.PENDING]: [
    {
      label: "Xác nhận",
      targetStatus: APPOINTMENT_STATUS.CONFIRMED,
      icon: <CalendarCheck2 className="h-3.5 w-3.5" />,
      variant: "default",
      confirmTitle: "Xác nhận lịch hẹn?",
      confirmDescription: "Lịch hẹn sẽ được xác nhận và thông báo đến bệnh nhân.",
    },
    {
      label: "Hủy",
      targetStatus: APPOINTMENT_STATUS.CANCELLED,
      icon: <Ban className="h-3.5 w-3.5" />,
      variant: "destructive",
      confirmTitle: "Hủy lịch hẹn?",
      confirmDescription: "Lịch hẹn sẽ bị hủy. Hành động này có thể hoàn tác.",
    },
  ],

  // CONFIRMED → CHECKED_IN | CANCELLED
  [APPOINTMENT_STATUS.CONFIRMED]: [
    {
      label: "Check-in",
      targetStatus: APPOINTMENT_STATUS.CHECKED_IN,
      icon: <UserCheck className="h-3.5 w-3.5" />,
      variant: "default",
      confirmTitle: "Check-in bệnh nhân?",
      confirmDescription: "Xác nhận bệnh nhân đã đến và đang chờ khám.",
    },
    {
      label: "Hủy",
      targetStatus: APPOINTMENT_STATUS.CANCELLED,
      icon: <Ban className="h-3.5 w-3.5" />,
      variant: "destructive",
      confirmTitle: "Hủy lịch hẹn?",
      confirmDescription: "Lịch hẹn đã xác nhận sẽ bị hủy. Hành động này có thể hoàn tác.",
    },
  ],
};
