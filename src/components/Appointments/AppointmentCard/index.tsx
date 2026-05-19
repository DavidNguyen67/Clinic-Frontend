"use client";
import { APPOINTMENT_STATUS } from "@/common";
import BookingTypeBadge from "@/components/Appointments/BookingTypeBadge";
import { CancelAppointmentDialog } from "@/components/Appointments/CancelAppointmentDialog";
import DetailDrawer from "@/components/Appointments/DetailDrawer";
import { ReactivateAppointmentDialog } from "@/components/Appointments/ReActiveDialog";
import { RescheduleSheet } from "@/components/Appointments/RescheduleSheet";
import StatusBadge from "@/components/Appointments/StatusBadge";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet } from "@/components/ui/sheet";
import usePopup from "@/hooks/useDialog";
import { AppointmentResponse } from "@/interface/response";
import { formatCurrency, formatDate, formatTime, getInitials, parseDate } from "@/lib/utils";
import {
  Calendar,
  CalendarClock,
  Clock,
  Eye,
  ListOrdered,
  Stethoscope,
  XCircle,
} from "lucide-react";

interface AppointmentCardProps {
  apt: AppointmentResponse;
}

function AppointmentCard({ apt }: AppointmentCardProps) {
  const parsedDate = parseDate(apt.appointmentDate, "HH:mm:ss dd/MM/yyyy");

  const canCancel = [
    APPOINTMENT_STATUS.PENDING,
    APPOINTMENT_STATUS.CONFIRMED,
    APPOINTMENT_STATUS.CHECKED_IN,
    APPOINTMENT_STATUS.IN_PROGRESS,
  ].includes(apt.status);

  const canReschedule = [APPOINTMENT_STATUS.PENDING].includes(apt.status);
  const canReactivate = apt.status === APPOINTMENT_STATUS.CANCELLED;

  const firstService = apt.clinicServices?.[0];

  const sheetDetail = usePopup<{ appointmentId: string }>();

  const sheetReschedule = usePopup<{ appointmentId: string }>();

  const dialogCancel = usePopup<{ appointmentId: string }>();

  const dialogReactivate = usePopup<{ appointmentId: string }>();

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
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-sm font-medium text-foreground">{apt.doctorName}</span>
              <span className="text-xs text-muted-foreground font-mono">{apt.appointmentCode}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{apt.specialtyName}</p>
            <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground mb-1">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> {formatDate(parsedDate)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {formatTime(parsedDate)}
              </span>
              {apt.queueNumber && (
                <span className="flex items-center gap-1">
                  <ListOrdered className="h-3.5 w-3.5" /> Queue #{apt.queueNumber}
                </span>
              )}
            </div>
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
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1"
                onClick={() => sheetDetail.openPopup({ appointmentId: apt.id })}
              >
                <Eye className="h-3.5 w-3.5" /> View details
              </Button>
              {(canCancel || canReschedule || canReactivate) && (
                <>
                  {canReschedule && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={() => sheetReschedule.openPopup({ appointmentId: apt.id })}
                    >
                      <CalendarClock className="h-4 w-4" /> Reschedule
                    </Button>
                  )}
                  {canCancel && (
                    <Button
                      variant="outline"
                      className="h-7 text-xs gap-1 text-destructive border-destructive/30 hover:bg-destructive/5"
                      onClick={() => dialogCancel.openPopup({ appointmentId: apt.id })}
                    >
                      <XCircle className="h-4 w-4" /> Cancel
                    </Button>
                  )}
                  {canReactivate && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={() => dialogReactivate.openPopup({ appointmentId: apt.id })}
                    >
                      <CalendarClock className="h-4 w-4" /> Reactivate
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <StatusBadge status={apt.status} />
            <BookingTypeBadge type={apt.bookingType} />
          </div>
        </div>
      </CardContent>
      <Sheet open={sheetDetail.open} onOpenChange={sheetDetail.onOpenChange}>
        <DetailDrawer
          appointmentId={sheetDetail.data?.appointmentId!}
          onClose={sheetDetail.closePopup}
          dialogCancel={dialogCancel}
          sheetReschedule={sheetReschedule}
          dialogReactivate={dialogReactivate}
        />
      </Sheet>

      <AlertDialog open={dialogCancel?.open} onOpenChange={dialogCancel?.onOpenChange}>
        <CancelAppointmentDialog
          appointmentId={dialogCancel?.data?.appointmentId!}
          onClose={dialogCancel?.closePopup}
        />
      </AlertDialog>

      <Sheet open={sheetReschedule.open} onOpenChange={sheetReschedule.onOpenChange}>
        <RescheduleSheet
          appointmentId={sheetReschedule.data?.appointmentId!}
          onClose={sheetReschedule.closePopup}
        />
      </Sheet>

      <AlertDialog open={dialogReactivate?.open} onOpenChange={dialogReactivate?.onOpenChange}>
        <ReactivateAppointmentDialog
          appointmentId={dialogReactivate?.data?.appointmentId!}
          onClose={dialogReactivate?.closePopup}
          onReschedule={() => {
            dialogReactivate?.closePopup();
            sheetReschedule.openPopup({ appointmentId: dialogReactivate?.data?.appointmentId! });
          }}
        />
      </AlertDialog>
    </Card>
  );
}

export default AppointmentCard;
