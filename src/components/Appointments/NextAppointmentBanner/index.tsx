import BookingTypeBadge from "@/components/Appointments/BookingTypeBadge";
import EmptyBanner from "@/components/Appointments/EmptyBanner";
import { TimeAgo } from "@/components/TimeAgo";
import { Button } from "@/components/ui/button";
import { usePatientNextAppointment } from "@/hooks/patient/usePatientAppointment";
import { formatDateTime, parseDate } from "@/lib/utils";
import { Calendar, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

const NextAppointmentBanner = () => {
  const patientNextAppointment = usePatientNextAppointment();
  const parsedDate = parseDate(
    patientNextAppointment?.data?.body?.appointmentDate,
    "HH:mm:ss dd/MM/yyyy"
  );

  const formattedDate = formatDateTime(parsedDate);

  if (!patientNextAppointment?.data?.body) {
    return <EmptyBanner />;
  }

  console.log("Check parsedDate", parsedDate);

  return (
    <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4 flex items-center justify-between gap-4 flex-wrap mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-primary/10">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Next Appointment
              </p>

              <TimeAgo date={parsedDate!} />
            </div>

            <div>
              <p className="text-base font-semibold leading-none">
                {patientNextAppointment?.data?.body?.doctorName}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {patientNextAppointment?.data?.body?.specialtyName || "Specialty not specified"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
                {formattedDate}
              </div>

              <BookingTypeBadge type={patientNextAppointment?.data?.body?.bookingType} />

              <div className="rounded-md border px-2 py-1 font-mono text-xs">
                {patientNextAppointment?.data?.body?.appointmentCode}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Button size="sm" variant="outline" asChild className="shrink-0">
        <Link href={`/patient/appointments/${patientNextAppointment?.data?.body?.appointmentCode}`}>
          View details <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </Button>
    </div>
  );
};

export default NextAppointmentBanner;
