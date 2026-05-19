"use client";

import BookingTypeBadge from "@/components/Appointments/BookingTypeBadge";
import StatusBadge from "@/components/Appointments/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Sheet } from "@/components/ui/sheet";
import usePopup from "@/hooks/useDialog";
import { AppointmentResponse } from "@/interface/response";
import { formatCurrency, formatDate, formatTime, getInitials, parseDate } from "@/lib/utils";
import { Calendar, Clock, Eye, ListOrdered, Stethoscope } from "lucide-react";
import { useDoctorAppointmentUpdate } from "@/hooks/doctor/useDoctorAppointment";
import {
  DOCTOR_ACTIONS,
  Action,
  STAFF_ACTIONS,
} from "@/components/DoctorAppointments/AppointmentList/config";
import AppointmentDetailDrawer from "@/components/DoctorAppointments/AppointmentList/AppointmentDetailDrawer";
import ActionButton from "@/components/DoctorAppointments/AppointmentList/AppointmentRow/ActionButton";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";
import { ROLE_NAME } from "@/common";

interface AppointmentRowProps {
  apt: AppointmentResponse;
}

function AppointmentRow({ apt }: AppointmentRowProps) {
  const { data: currentProfileData } = useCurrentProfile();

  const role = currentProfileData?.body?.role;
  const parsedDate = parseDate(apt.appointmentDate, "HH:mm:ss dd/MM/yyyy");
  const firstService = apt.clinicServices?.[0];

  const actions =
    role === ROLE_NAME.DOCTOR
      ? (DOCTOR_ACTIONS[apt.status] ?? [])
      : (STAFF_ACTIONS[apt.status] ?? []);

  const sheetDetail = usePopup<{ appointmentId: string }>();

  return (
    <Card className="transition-colors hover:border-border/80">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <Avatar className="h-11 w-11 shrink-0">
            {apt.doctorPathAvatar && (
              <AvatarImage src={apt.doctorPathAvatar} alt={apt.doctorName} />
            )}
            <AvatarFallback className="bg-blue-50 text-blue-700 text-xs font-medium">
              {getInitials(apt.doctorName)}
            </AvatarFallback>
          </Avatar>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            {/* Name + code */}
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-sm font-medium text-foreground">{apt.patientName}</span>
              <span className="text-xs text-muted-foreground font-mono">{apt.appointmentCode}</span>
            </div>

            <p className="text-xs text-muted-foreground mb-2">{apt.specialtyName}</p>

            {/* Date / time / queue */}
            <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground mb-1">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(parsedDate)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatTime(parsedDate)}
              </span>
              {apt.queueNumber && (
                <span className="flex items-center gap-1">
                  <ListOrdered className="h-3.5 w-3.5" />
                  Queue #{apt.queueNumber}
                </span>
              )}
            </div>

            {/* First service */}
            {firstService && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                <Stethoscope className="h-3.5 w-3.5 shrink-0" />
                {firstService.name}
                {apt.clinicServices.length > 1 && ` +${apt.clinicServices.length - 1} more`}
              </p>
            )}

            <p className="text-xs font-medium text-foreground">{formatCurrency(apt.fee)}</p>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {/* View detail — luôn hiện */}
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1"
                onClick={() => sheetDetail.openPopup({ appointmentId: apt.id })}
              >
                <Eye className="h-3.5 w-3.5" />
                Xem chi tiết
              </Button>

              {/* Doctor actions theo transition */}
              {actions.map((action) => (
                <ActionButton key={action.targetStatus} action={action} appointmentId={apt.id} />
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <StatusBadge status={apt.status} />
            <BookingTypeBadge type={apt.bookingType} />
          </div>
        </div>
      </CardContent>

      {/* Detail sheet */}
      <Sheet open={sheetDetail.open} onOpenChange={sheetDetail.onOpenChange}>
        <AppointmentDetailDrawer
          appointmentId={sheetDetail.data?.appointmentId!}
          onClose={sheetDetail.closePopup}
        />
      </Sheet>
    </Card>
  );
}

export default AppointmentRow;
