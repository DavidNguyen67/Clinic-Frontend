import { ROLE_NAME } from "@/common";
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
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";
import { useDoctorAppointmentUpdate } from "@/hooks/doctor/useDoctorAppointment";
import { useStaffAppointmentUpdate } from "@/hooks/staff/useDoctorAppointment";
import { useInvoiceDetailByAppointmentId } from "@/hooks/staff/useStaffInvoice";

interface FooterActionButtonProps {
  action: Action;
  appointmentId: string;
  onSuccess?: () => void;
}

function FooterActionButton({ action, appointmentId, onSuccess }: FooterActionButtonProps) {
  const { data: currentProfileData } = useCurrentProfile();

  const invoice = useInvoiceDetailByAppointmentId(appointmentId!);

  const role = currentProfileData?.body?.role;
  const updateAppointment =
    role === ROLE_NAME.DOCTOR
      ? useDoctorAppointmentUpdate(appointmentId)
      : useStaffAppointmentUpdate(appointmentId);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={action.variant}
          className="flex-1 gap-1.5"
          disabled={updateAppointment.isMutating}
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
            disabled={updateAppointment.isMutating}
            onClick={() => {
              updateAppointment.trigger({
                status: action.targetStatus,
                invoiceId: invoice?.data?.body?.id,
              });
              onSuccess?.();
            }}
          >
            {updateAppointment.isMutating ? "Đang xử lý..." : "Xác nhận"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default FooterActionButton;
