import SlotGroup from "@/components/Booking/StepSchedule/SlotGroup";
import {
  AFTERNOON_SLOTS,
  MORNING_SLOTS,
} from "@/components/Booking/StepSchedule/TimePicker/config";
import { useBookingStore } from "@/components/Booking/useBookingStore";
import { TimePickerSkeleton } from "@/components/StepScheduleSkeleton";
import { usePublicAppointment } from "@/hooks/public/usePublicAppointment";
import { formatDate, formatDateToApi } from "@/lib/utils";
import { CalendarDays, Clock } from "lucide-react";

function TimePicker() {
  const { store, setBookingState } = useBookingStore();

  const publicAppointment = usePublicAppointment({
    doctorProfileId: store?.doctor?.id,
    appointmentDate: store?.date ? formatDateToApi(store.date) : undefined,
  });

  const appointments = publicAppointment.data?.body?.data ?? [];

  const unavailableSlots: string[] = appointments.map((appt) =>
    appt.appointmentTime.substring(0, 5)
  );

  const handleSelectTime = (slotStart: string) => {
    const [hours, minutes] = slotStart.split(":").map(Number);
    const time = new Date();
    time.setHours(hours, minutes, 0, 0);
    setBookingState({ time });
  };

  if (publicAppointment.isLoading) {
    return <TimePickerSkeleton />;
  }

  if (!store?.date) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border py-12">
        <CalendarDays className="w-8 h-8 text-muted-foreground/30" />
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">Select a date first</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Available slots will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Available slots for{" "}
          <span className="font-semibold text-foreground">{formatDate(store.date)}</span>
        </span>
      </div>

      <SlotGroup
        label="Morning"
        slots={MORNING_SLOTS}
        unavailable={unavailableSlots}
        onSelect={handleSelectTime}
      />
      <SlotGroup
        label="Afternoon"
        slots={AFTERNOON_SLOTS}
        unavailable={unavailableSlots}
        onSelect={handleSelectTime}
      />

      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto pt-1">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded border-2 border-primary bg-primary inline-block" />
          Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded border-2 border-border inline-block" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded border-2 border-muted bg-muted/50 inline-block" />
          Booked
        </span>
      </div>
    </div>
  );
}

export default TimePicker;
