"use client";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  usePatientAppointmentDetail,
  usePatientAppointmentUpdate,
} from "@/hooks/patient/usePatientAppointment";
import { cn, formatDate, formatTime, parseDate } from "@/lib/utils";
import { Calendar, CalendarClock, Clock, Loader2 } from "lucide-react";

const SLOT_AVAILABLE = true;

interface ReactivateAppointmentDialogProps {
  appointmentId: string;
  onClose?: () => void;
  onReschedule?: () => void;
}

export function ReactivateAppointmentDialog({
  appointmentId,
  onClose,
  onReschedule,
}: ReactivateAppointmentDialogProps) {
  const patientAppointment = usePatientAppointmentDetail(appointmentId);
  const patientAppointmentUpdate = usePatientAppointmentUpdate(appointmentId);

  const apt = patientAppointment.data?.body;
  const isLoading = patientAppointment.isLoading;
  const isPending = patientAppointmentUpdate?.isMutating;

  const parsedDate = parseDate(apt?.appointmentDate, "HH:mm:ss dd/MM/yyyy");
  const strikethrough = !SLOT_AVAILABLE;

  const handleConfirm = async () => {
    // TODO: await patientAppointmentUpdate.trigger({ status: APPOINTMENT_STATUS.PENDING })
    onClose?.();
  };

  // ── Reusable schedule preview card ────────────────────────────────────────
  const schedulePreview = (
    <div
      className={cn(
        "rounded-lg border border-border bg-muted/30 px-4 py-3 flex flex-col gap-1.5",
        strikethrough && "opacity-50"
      )}
    >
      {isLoading ? (
        <>
          <Skeleton className="h-4 w-32" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </>
      ) : (
        <>
          <p className={cn("text-sm font-medium", strikethrough && "line-through")}>
            {apt?.doctorName}
          </p>
          <div
            className={cn(
              "flex items-center gap-3 text-xs text-muted-foreground",
              strikethrough && "line-through"
            )}
          >
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(parsedDate)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatTime(parsedDate)}
            </span>
          </div>
        </>
      )}
    </div>
  );

  // ── Slot available ────────────────────────────────────────────────────────
  if (SLOT_AVAILABLE) {
    return (
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Reactivate appointment?</AlertDialogTitle>
          <AlertDialogDescription>
            Your original schedule is still available.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {schedulePreview}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Keep cancelled</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={isPending || isLoading}
            className="gap-1.5"
          >
            {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isPending ? "Reactivating…" : "Confirm reactivate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    );
  }

  // ── Slot unavailable ──────────────────────────────────────────────────────
  return (
    <AlertDialogContent className="max-w-md">
      <AlertDialogHeader>
        <AlertDialogTitle>Slot no longer available</AlertDialogTitle>
        <AlertDialogDescription>
          Your previous time slot is no longer available. Please choose a new schedule to reactivate
          this appointment.
        </AlertDialogDescription>
      </AlertDialogHeader>

      {schedulePreview}

      <AlertDialogFooter>
        <AlertDialogCancel>Dismiss</AlertDialogCancel>
        <Button
          className="gap-1.5"
          disabled={isLoading}
          onClick={() => {
            onClose?.();
            onReschedule?.();
          }}
        >
          <CalendarClock className="h-3.5 w-3.5" />
          Choose new schedule
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
