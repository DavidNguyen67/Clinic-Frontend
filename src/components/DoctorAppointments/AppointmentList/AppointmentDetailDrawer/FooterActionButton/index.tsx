import { Action } from "@/components/DoctorAppointments/AppointmentList/config";
import { useForceRefreshAppointments } from "@/components/DoctorAppointments/hook";
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
import { Button } from "@/components/ui/button";
import { useDoctorAppointmentUpdate } from "@/hooks/doctor/useDoctorAppointment";

interface FooterActionButtonProps {
  action: Action;
  appointmentId: string;
  onSuccess?: () => void;
}

function FooterActionButton({ action, appointmentId, onSuccess }: FooterActionButtonProps) {
  const doctorAppointmentUpdate = useDoctorAppointmentUpdate(appointmentId);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={action.variant}
          className="flex-1 gap-1.5"
          disabled={doctorAppointmentUpdate.isMutating}
        >
          {action.icon}
          {action.label}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{action.confirmTitle}</AlertDialogTitle>
          <AlertDialogDescription>{action.confirmDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
          <AlertDialogAction
            disabled={doctorAppointmentUpdate.isMutating}
            onClick={() => {
              doctorAppointmentUpdate.trigger({ status: action.targetStatus });
              onSuccess?.();
            }}
          >
            {doctorAppointmentUpdate.isMutating ? "Đang xử lý..." : "Xác nhận"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default FooterActionButton;
