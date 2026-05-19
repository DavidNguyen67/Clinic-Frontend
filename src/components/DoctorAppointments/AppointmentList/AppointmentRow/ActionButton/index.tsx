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

function ActionButton({ action, appointmentId }: { action: Action; appointmentId: string }) {
  const { data: currentProfileData } = useCurrentProfile();
  const invoice = useInvoiceDetailByAppointmentId(appointmentId!);

  const role = currentProfileData?.body?.role;
  const updateAppointment =
    role === ROLE_NAME.DOCTOR
      ? useDoctorAppointmentUpdate(appointmentId)
      : useStaffAppointmentUpdate(appointmentId);
  const { forceMutate } = useForceRefreshAppointments();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant={action.variant}
          className="h-7 text-xs gap-1"
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
                // invoiceId: invoice?.data?.body?.id,
                invoiceId: "70bc2773-7224-4227-89ab-9d9211af025e",
              });
              forceMutate();
            }}
          >
            {updateAppointment.isMutating ? "Đang xử lý..." : "Xác nhận"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ActionButton;
