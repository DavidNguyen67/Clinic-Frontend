"use client";
import { APPOINTMENT_STATUS, INVOICE_STATUS, ROLE_NAME } from "@/common";
import BookingTypeBadge from "@/components/Appointments/BookingTypeBadge";
import { statusConfig } from "@/components/Appointments/DetailDrawer/config";
import StatusBadge from "@/components/Appointments/StatusBadge";
import DetailDrawerSkeleton from "@/components/DetailDrawerSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
import {
  useDoctorAppointmentDetail,
  useDoctorAppointmentUpdate,
} from "@/hooks/doctor/useDoctorAppointment";
import { formatCurrency, formatDate, formatTime, getInitials, parseDate } from "@/lib/utils";
import { Calendar, CalendarX, Clock, ListOrdered } from "lucide-react";
import Image from "next/image";
import {
  DOCTOR_ACTIONS,
  Action,
  STAFF_ACTIONS,
} from "@/components/DoctorAppointments/AppointmentList/config";
import FooterActionButton from "@/components/DoctorAppointments/AppointmentList/AppointmentDetailDrawer/FooterActionButton";
import { useForceRefreshAppointments } from "@/components/DoctorAppointments/hook";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";
import { useStaffAppointmentDetail } from "@/hooks/staff/useStaffAppointment";
import { useInvoiceDetailByAppointmentId } from "@/hooks/staff/useStaffInvoice";

interface AppointmentDetailDrawerProps {
  appointmentId: string | null;
  onClose: () => void;
}

function AppointmentDetailDrawer({ appointmentId, onClose }: AppointmentDetailDrawerProps) {
  const { data: currentProfileData } = useCurrentProfile();

  const role = currentProfileData?.body?.role;

  const doctorAppointment =
    role === ROLE_NAME.DOCTOR
      ? useDoctorAppointmentDetail(appointmentId)
      : useStaffAppointmentDetail(appointmentId);

  const apt = doctorAppointment.data?.body;

  const parsedDate = parseDate(apt?.appointmentDate, "HH:mm:ss dd/MM/yyyy");

  const actions =
    role === ROLE_NAME.DOCTOR
      ? (DOCTOR_ACTIONS[apt?.status!] ?? [])
      : (STAFF_ACTIONS[apt?.status!] ?? []);

  const { forceMutate } = useForceRefreshAppointments();

  if (doctorAppointment.isLoading) {
    return (
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 gap-0">
        <SheetHeader className="px-5 py-4 border-b">
          <SheetTitle className="text-base font-medium">Appointment Details</SheetTitle>
        </SheetHeader>

        <DetailDrawerSkeleton />
      </SheetContent>
    );
  }

  // ── Empty ────────────────────────────────────────────────────────────────────
  if (!apt) {
    return (
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 gap-0">
        <SheetHeader className="px-5 py-4 border-b">
          <SheetTitle className="text-base font-medium">Appointment Details</SheetTitle>
        </SheetHeader>

        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center px-5">
          <CalendarX className="h-8 w-8 text-muted-foreground/50" />

          <p className="text-sm font-medium text-muted-foreground">Appointment not found</p>

          <p className="text-xs text-muted-foreground/70">This appointment does not exist.</p>
        </div>
      </SheetContent>
    );
  }

  return (
    <SheetContent className="w-full sm:max-w-md flex flex-col p-0 gap-0">
      <SheetHeader className="px-5 py-4 border-b">
        <SheetTitle className="text-base font-medium">Appointment Details</SheetTitle>
      </SheetHeader>

      {/* ── Scrollable body ───────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {/* Badges + code */}
        <div className="flex items-center gap-2">
          <StatusBadge status={apt.status} />
          <BookingTypeBadge type={apt.bookingType} />

          <span className="ml-auto text-xs font-mono text-muted-foreground">
            {apt.appointmentCode}
          </span>
        </div>

        <Separator />

        {/* Appointment info */}
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Appointment Information
          </p>

          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Date
              </span>

              <span className="font-medium">{formatDate(parsedDate)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Time
              </span>

              <span className="font-medium">{formatTime(parsedDate)}</span>
            </div>

            {apt.queueNumber && (
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <ListOrdered className="h-3.5 w-3.5" />
                  Queue Number
                </span>

                <span className="font-medium">#{apt.queueNumber}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-muted-foreground">Consultation Fee</span>

              <span className="font-medium">{formatCurrency(apt.fee)}</span>
            </div>

            {/* Invoices */}
            {!!apt.invoices?.length && (
              <div className="space-y-2">
                {apt.invoices.map((invoice) => {
                  const config = statusConfig[invoice?.status];

                  if (invoice?.status === INVOICE_STATUS.DRAFT) {
                    return (
                      <div
                        key={invoice.id}
                        className="rounded-lg border border-dashed border-border bg-muted/20 p-3 text-xs text-muted-foreground text-center italic"
                      >
                        Invoice {invoice.invoiceCode} will be created after the appointment is
                        confirmed.
                      </div>
                    );
                  }

                  return (
                    <div
                      key={invoice.id}
                      className="rounded-lg border border-border bg-muted/30 p-3 space-y-2 text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">#{invoice.invoiceCode}</span>

                        <Badge
                          variant="outline"
                          className={`text-xs flex items-center gap-1 px-2 py-0.5 ${config?.className}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${config?.dot}`} />

                          {config?.label}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Subtotal</span>

                          <span className="text-foreground font-medium">
                            {formatCurrency(invoice.subtotal)}
                          </span>
                        </div>

                        {invoice.discountAmount > 0 && (
                          <div className="flex justify-between">
                            <span>Discount</span>

                            <span className="text-green-600 font-medium">
                              -{formatCurrency(invoice.discountAmount)}
                            </span>
                          </div>
                        )}

                        {invoice.insuranceCovered > 0 && (
                          <div className="flex justify-between">
                            <span>Insurance Coverage</span>

                            <span className="text-blue-600 font-medium">
                              -{formatCurrency(invoice.insuranceCovered)}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between border-t border-border/60 pt-1 mt-1">
                          <span className="font-semibold text-foreground">Total</span>

                          <span className="font-semibold text-foreground">
                            {formatCurrency(invoice.totalAmount)}
                          </span>
                        </div>

                        {invoice.balance > 0 && (
                          <div className="flex justify-between text-red-500">
                            <span>Remaining Balance</span>

                            <span className="font-medium">{formatCurrency(invoice.balance)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Patient */}
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Patient
          </p>

          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-emerald-50 text-emerald-700 text-xs font-medium">
                {getInitials(apt.patientName)}
              </AvatarFallback>
            </Avatar>

            <p className="text-sm font-medium">{apt.patientName}</p>
          </div>
        </div>

        <Separator />

        {/* Doctor */}
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Doctor
          </p>

          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={apt.doctorPathAvatar!} alt={apt.doctorName} />

              <AvatarFallback className="bg-blue-50 text-blue-700 text-xs font-medium">
                {getInitials(apt.doctorName)}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="text-sm font-medium">{apt.doctorName}</p>

              <p className="text-xs text-muted-foreground">{apt.specialtyName}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Clinical notes */}
        <div className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Clinical Notes
          </p>

          {apt.symptoms && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Symptoms</p>

              <div className="bg-muted rounded-md px-3 py-2 text-sm leading-relaxed">
                {apt.symptoms}
              </div>
            </div>
          )}

          {apt.reason && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Reason for Visit</p>

              <div className="bg-muted rounded-md px-3 py-2 text-sm leading-relaxed">
                {apt.reason}
              </div>
            </div>
          )}

          {apt.notes && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Notes</p>

              <div className="bg-muted rounded-md px-3 py-2 text-sm leading-relaxed">
                {apt.notes}
              </div>
            </div>
          )}
        </div>

        {/* Services */}
        {apt.clinicServices.length > 0 && (
          <>
            <Separator />

            <div className="space-y-2">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Services
              </p>

              {apt.clinicServices.map((svc) => (
                <div key={svc.id} className="flex gap-3 border rounded-lg p-3">
                  <Image
                    width={48}
                    height={48}
                    src={svc.image}
                    alt={svc.name}
                    className="h-12 w-12 rounded-md object-cover shrink-0"
                  />

                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{svc.name}</p>

                    <p className="text-xs text-muted-foreground mt-0.5">
                      {svc.promotionalPrice ? (
                        <>
                          <span className="text-red-600 font-medium mr-1.5">
                            {formatCurrency(svc.promotionalPrice)}
                          </span>

                          <s className="text-muted-foreground/60">{formatCurrency(svc.price)}</s>
                        </>
                      ) : (
                        formatCurrency(svc.price)
                      )}
                    </p>

                    <p className="text-xs text-muted-foreground mt-0.5">{svc.duration} min</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Footer actions ───────────────────────────────────────────────────── */}
      {actions.length > 0 && (
        <div className="border-t px-5 py-4 flex gap-2">
          {actions.map((action) => (
            <FooterActionButton
              key={action.targetStatus}
              action={action}
              appointmentId={apt.id}
              onSuccess={() => {
                forceMutate();
                onClose();
              }}
            />
          ))}
        </div>
      )}
    </SheetContent>
  );
}

export default AppointmentDetailDrawer;
